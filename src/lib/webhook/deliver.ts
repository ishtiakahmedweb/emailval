import { db } from '@/lib/db';
import { webhookConfigs, webhookLogs } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';

const RETRY_DELAYS = [10_000, 30_000, 90_000];
const MAX_ATTEMPTS = 3;

interface WebhookPayload {
  event: string;
  data: Record<string, unknown>;
  timestamp: string;
}

async function sendWebhook(
  url: string,
  payload: WebhookPayload,
  secret?: string,
): Promise<{ statusCode: number; responseBody: string }> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'User-Agent': 'Veriflow-Webhook/1.0',
  };

  if (secret) {
    headers['X-Veriflow-Signature'] = secret;
  }

  const response = await fetch(url, {
    method: 'POST',
    headers,
    body: JSON.stringify(payload),
    signal: AbortSignal.timeout(10000),
  });

  const responseBody = await response.text();
  return { statusCode: response.status, responseBody };
}

export async function deliverWebhook(
  userId: string,
  event: string,
  data: Record<string, unknown>,
): Promise<void> {
  const configs = await db
    .select()
    .from(webhookConfigs)
    .where(
      and(
        eq(webhookConfigs.userId, userId),
        eq(webhookConfigs.active, true),
      ),
    );

  if (configs.length === 0) return;

  const payload: WebhookPayload = {
    event,
    data,
    timestamp: new Date().toISOString(),
  };

  for (const config of configs) {
    const events = config.events as string[];
    if (!events.includes(event)) continue;

    let lastStatusCode: number | null = null;
    let lastResponseBody: string | null = null;
    let success = false;
    let attempt = 0;

    for (const delay of RETRY_DELAYS) {
      attempt++;

      try {
        const result = await sendWebhook(config.url, payload, config.secret ?? undefined);
        lastStatusCode = result.statusCode;
        lastResponseBody = result.responseBody;

        if (result.statusCode >= 200 && result.statusCode < 300) {
          success = true;
          break;
        }

        await db.insert(webhookLogs).values({
          webhookConfigId: config.id,
          event,
          payload: payload as unknown as Record<string, unknown>,
          status: 'failed',
          statusCode: result.statusCode,
          responseBody: result.responseBody,
          attempt,
          maxAttempts: MAX_ATTEMPTS,
          nextRetryAt: attempt < MAX_ATTEMPTS
            ? new Date(Date.now() + delay + (attempt * 5000))
            : null,
        });

        if (attempt < MAX_ATTEMPTS) {
          await new Promise((r) => setTimeout(r, delay));
        }
      } catch (err) {
        lastStatusCode = null;
        lastResponseBody = err instanceof Error ? err.message : 'Unknown error';

        await db.insert(webhookLogs).values({
          webhookConfigId: config.id,
          event,
          payload: payload as unknown as Record<string, unknown>,
          status: 'failed',
          statusCode: null,
          responseBody: lastResponseBody,
          attempt,
          maxAttempts: MAX_ATTEMPTS,
          nextRetryAt: attempt < MAX_ATTEMPTS
            ? new Date(Date.now() + delay + (attempt * 5000))
            : null,
        });

        if (attempt < MAX_ATTEMPTS) {
          await new Promise((r) => setTimeout(r, delay));
        }
      }
    }

    if (success) {
      await db.insert(webhookLogs).values({
        webhookConfigId: config.id,
        event,
        payload: payload as unknown as Record<string, unknown>,
        status: 'delivered',
        statusCode: lastStatusCode,
        responseBody: lastResponseBody,
        attempt,
        maxAttempts: MAX_ATTEMPTS,
        deliveredAt: new Date(),
      });

      await db
        .update(webhookConfigs)
        .set({ lastDeliveryAt: new Date() })
        .where(eq(webhookConfigs.id, config.id));
    }
  }
}
