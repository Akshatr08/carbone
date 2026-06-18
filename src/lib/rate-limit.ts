/**
 * Tiny in-memory sliding-window rate limiter. Per-process — fine for a
 * single Worker instance; for multi-region scale, swap to KV/Upstash.
 */
type Bucket = { count: number; resetAt: number };
const BUCKETS = new Map<string, Bucket>();
const MAX_KEYS = 5000;

export interface RateLimitResult {
  ok: boolean;
  remaining: number;
  retryAfterSeconds: number;
}

export function checkRateLimit(key: string, limit = 20, windowMs = 60_000): RateLimitResult {
  const now = Date.now();
  let b = BUCKETS.get(key);
  if (!b || b.resetAt < now) {
    b = { count: 0, resetAt: now + windowMs };
    BUCKETS.set(key, b);
  }
  b.count += 1;

  // Cheap LRU-ish eviction to bound memory
  if (BUCKETS.size > MAX_KEYS) {
    const cutoff = now - windowMs;
    for (const [k, v] of BUCKETS) if (v.resetAt < cutoff) BUCKETS.delete(k);
  }

  if (b.count > limit) {
    return {
      ok: false,
      remaining: 0,
      retryAfterSeconds: Math.ceil((b.resetAt - now) / 1000),
    };
  }
  return { ok: true, remaining: limit - b.count, retryAfterSeconds: 0 };
}
