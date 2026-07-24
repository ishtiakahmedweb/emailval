import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

type Tier = 'free' | 'starter' | 'growth' | 'enterprise';

const TIER_LIMITS: Record<Tier, { tokens: number; window: number }> = {
  free:       { tokens: 30,  window: 10 },
  starter:    { tokens: 100, window: 10 },
  growth:     { tokens: 300, window: 10 },
  enterprise: { tokens: 1000, window: 10 },
};

const UPSTASH_URL = process.env.UPSTASH_REDIS_REST_URL;
const UPSTASH_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;

function createRatelimit(tokens: number, window: number) {
  if (UPSTASH_URL && UPSTASH_TOKEN) {
    const redis = new Redis({ url: UPSTASH_URL, token: UPSTASH_TOKEN });
    return new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(tokens, `${window}s`),
      analytics: true,
    });
  }
  return createFallbackLimiter(tokens, window);
}

function createFallbackLimiter(tokens: number, windowSec: number) {
  const map = new Map<string, { count: number; resetAt: number }>();
  return {
    limit: async (id: string) => {
      const now = Date.now();
      const entry = map.get(id);
      if (!entry || now > entry.resetAt) {
        map.set(id, { count: 1, resetAt: now + windowSec * 1000 });
        return { success: true, remaining: tokens - 1, reset: now + windowSec * 1000 };
      }
      entry.count++;
      if (entry.count > tokens) {
        return { success: false, remaining: 0, reset: entry.resetAt };
      }
      return { success: true, remaining: tokens - entry.count, reset: entry.resetAt };
    },
  };
}

export function getRatelimiter(tier?: Tier) {
  const config = TIER_LIMITS[tier ?? 'free'];
  return createRatelimit(config.tokens, config.window);
}

export function getAnonymousRatelimiter() {
  return createRatelimit(10, 10);
}
