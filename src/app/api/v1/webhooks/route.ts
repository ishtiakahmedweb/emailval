import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { db } from '@/lib/db';
import { webhookConfigs, webhookLogs } from '@/lib/db/schema';
import { eq, and, desc } from 'drizzle-orm';

export async function GET() {
  const supabase = await createSupabaseServerClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const configs = await db
    .select()
    .from(webhookConfigs)
    .where(eq(webhookConfigs.userId, user.id))
    .orderBy(desc(webhookConfigs.createdAt));

  const recentLogs = await db
    .select()
    .from(webhookLogs)
    .innerJoin(webhookConfigs, eq(webhookLogs.webhookConfigId, webhookConfigs.id))
    .where(eq(webhookConfigs.userId, user.id))
    .orderBy(desc(webhookLogs.createdAt))
    .limit(20);

  return NextResponse.json({ configs, recentLogs });
}

export async function POST(request: NextRequest) {
  const supabase = await createSupabaseServerClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const { url, secret, events } = body;

  if (!url || typeof url !== 'string') {
    return NextResponse.json({ error: 'url is required' }, { status: 400 });
  }

  try {
    new URL(url);
  } catch {
    return NextResponse.json({ error: 'Invalid URL' }, { status: 400 });
  }

  const [config] = await db
    .insert(webhookConfigs)
    .values({
      userId: user.id,
      url,
      secret: secret || null,
      events: events || ['verification.completed'],
    })
    .returning();

  return NextResponse.json(config, { status: 201 });
}

export async function DELETE(request: NextRequest) {
  const supabase = await createSupabaseServerClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const id = request.nextUrl.searchParams.get('id');
  if (!id) {
    return NextResponse.json({ error: 'id is required' }, { status: 400 });
  }

  await db
    .delete(webhookConfigs)
    .where(
      and(eq(webhookConfigs.id, id), eq(webhookConfigs.userId, user.id)),
    );

  return NextResponse.json({ success: true });
}
