import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { webhookLogs, webhookConfigs } from '@/lib/db/schema';
import { eq, and, lte, isNotNull } from 'drizzle-orm';
import { createSupabaseAdminClient } from '@/lib/supabase/admin';

export async function GET() {
  const adminClient = createSupabaseAdminClient();

  const pending = await db
    .select({
      id: webhookLogs.id,
      webhookConfigId: webhookLogs.webhookConfigId,
      event: webhookLogs.event,
      payload: webhookLogs.payload,
    })
    .from(webhookLogs)
    .where(
      and(
        eq(webhookLogs.status, 'failed'),
        lte(webhookLogs.nextRetryAt, new Date()),
        isNotNull(webhookLogs.nextRetryAt),
      ),
    )
    .limit(20);

  let retried = 0;

  for (const log of pending) {
    const { data: config } = await adminClient
      .from('webhook_configs')
      .select('url, secret, active')
      .eq('id', log.webhookConfigId)
      .single();

    if (!config || !config.active) continue;

    try {
      const res = await fetch(config.url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(config.secret ? { 'X-Veriflow-Signature': config.secret } : {}),
        },
        body: JSON.stringify({
          event: log.event,
          data: log.payload as Record<string, unknown>,
          timestamp: new Date().toISOString(),
        }),
        signal: AbortSignal.timeout(10000),
      });

      await db
        .update(webhookLogs)
        .set({
          status: res.ok ? 'delivered' : 'failed',
          statusCode: res.status,
          responseBody: await res.text().catch(() => null),
          nextRetryAt: null,
          deliveredAt: res.ok ? new Date() : null,
        })
        .where(eq(webhookLogs.id, log.id));

      if (res.ok) {
        await db
          .update(webhookConfigs)
          .set({ lastDeliveryAt: new Date() })
          .where(eq(webhookConfigs.id, log.webhookConfigId));
      }

      retried++;
    } catch {
      await db
        .update(webhookLogs)
        .set({
          nextRetryAt: null,
          statusCode: null,
          responseBody: 'Retry attempt failed — endpoint unreachable',
        })
        .where(eq(webhookLogs.id, log.id));
    }
  }

  return NextResponse.json({ retried, remaining: pending.length - retried });
}
