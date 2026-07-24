import { createHash } from 'crypto';
import { NextRequest, NextResponse } from 'next/server';
import { verify } from '@/lib/engine';
import { db } from '@/lib/db';
import { apiKeys, userProfiles, verificationLog, creditTransactions } from '@/lib/db/schema';
import { eq, and, sql } from 'drizzle-orm';
import { getRatelimiter, getAnonymousRatelimiter } from '@/lib/rate-limit';
import { deliverWebhook } from '@/lib/webhook';

async function authenticateApiKey(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }

  const key = authHeader.slice(7).trim();
  if (!key.startsWith('veriflow_')) {
    return null;
  }

  const hash = createHash('sha256').update(key).digest('hex');

  const [found] = await db
    .select({
      userId: apiKeys.userId,
      keyId: apiKeys.id,
      tier: userProfiles.subscriptionTier,
      creditsRemaining: userProfiles.creditsRemaining,
    })
    .from(apiKeys)
    .innerJoin(userProfiles, eq(apiKeys.userId, userProfiles.id))
    .where(and(eq(apiKeys.keyHash, hash), eq(apiKeys.active, true)))
    .limit(1);

  return found ?? null;
}

export async function POST(request: NextRequest) {
  try {
    const auth = await authenticateApiKey(request);

    let identifier: string;
    let tier: string | undefined;
    let ipLimiter = false;

    if (auth) {
      identifier = auth.userId;
      tier = auth.tier;
    } else {
      identifier = request.headers.get('x-forwarded-for')
        ?? request.headers.get('x-real-ip')
        ?? 'anonymous';
      ipLimiter = true;
    }

    const limiter = ipLimiter ? getAnonymousRatelimiter() : getRatelimiter(tier as any);
    const { success: withinLimit, remaining, reset } = await limiter.limit(identifier);

    if (!withinLimit) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Try again shortly.' },
        { status: 429, headers: { 'X-RateLimit-Reset': String(reset) } },
      );
    }

    const body = await request.json();
    const { email } = body;

    if (!email || typeof email !== 'string') {
      return NextResponse.json(
        { error: 'Email is required and must be a string' },
        { status: 400 },
      );
    }

    if (auth && auth.creditsRemaining < 1) {
      return NextResponse.json(
        { error: 'Insufficient credits. Purchase more from your dashboard.' },
        { status: 403 },
      );
    }

    const startTime = performance.now();
    const result = await verify(email);
    const latencyMs = Math.round(performance.now() - startTime);

    if (auth) {
      await db.transaction(async (tx) => {
        const [profile] = await tx
          .select({ creditsRemaining: userProfiles.creditsRemaining })
          .from(userProfiles)
          .where(eq(userProfiles.id, auth.userId))
          .limit(1)
          .for('update');

        if (!profile || profile.creditsRemaining < 1) {
          throw new Error('Insufficient credits');
        }

        await tx
          .update(userProfiles)
          .set({
            creditsRemaining: sql`credits_remaining - 1`,
            totalProcessed: sql`total_processed + 1`,
          })
          .where(eq(userProfiles.id, auth.userId));

        await tx.insert(creditTransactions).values({
          userId: auth.userId,
          type: 'verification_usage',
          amount: -1,
          balanceBefore: profile.creditsRemaining,
          balanceAfter: profile.creditsRemaining - 1,
          description: `API verification: ${email}`,
        });

        await tx.insert(verificationLog).values({
          userId: auth.userId,
          apiKeyId: auth.keyId,
          email,
          state: result.state,
          stages: result.stages as any,
          latencyMs,
          source: 'api',
          creditsConsumed: 1,
        });
      });
    }

    if (auth) {
      deliverWebhook(auth.userId, 'verification.completed', {
        email: result.email,
        state: result.state,
        latencyMs: result.latencyMs,
        stages: result.stages,
        didYouMean: result.didYouMean,
      });
    }

    const response = NextResponse.json(
      { ...result, latencyMs },
      { status: 200, headers: { 'X-RateLimit-Remaining': String(remaining - 1) } },
    );

    return response;
  } catch (error) {
    if (error instanceof Error && error.message === 'Insufficient credits') {
      return NextResponse.json(
        { error: 'Insufficient credits. Purchase more from your dashboard.' },
        { status: 403 },
      );
    }
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}

export async function GET(request: NextRequest) {
  const email = request.nextUrl.searchParams.get('email');

  if (!email) {
    return NextResponse.json(
      { error: 'Email query parameter is required' },
      { status: 400 },
    );
  }

  const identifier = request.headers.get('x-forwarded-for')
    ?? request.headers.get('x-real-ip')
    ?? 'anonymous';
  const limiter = getAnonymousRatelimiter();
  const { success: withinLimit, reset } = await limiter.limit(identifier);

  if (!withinLimit) {
    return NextResponse.json(
      { error: 'Rate limit exceeded. Try again shortly.' },
      { status: 429, headers: { 'X-RateLimit-Reset': String(reset) } },
    );
  }

  try {
    const startTime = performance.now();
    const result = await verify(email);
    const latencyMs = Math.round(performance.now() - startTime);

    return NextResponse.json(
      { ...result, latencyMs },
      { status: 200 },
    );
  } catch {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}
