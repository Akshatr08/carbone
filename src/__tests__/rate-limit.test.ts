import { describe, it, expect, beforeEach } from "vitest";
import { checkRateLimit } from "@/lib/rate-limit";

describe("checkRateLimit", () => {
  beforeEach(() => {
    // unique key per test = isolated bucket
  });

  it("allows the first N requests", () => {
    const key = `t-${Math.random()}`;
    for (let i = 0; i < 5; i++) {
      expect(checkRateLimit(key, 5, 60_000).ok).toBe(true);
    }
  });

  it("blocks once the limit is exceeded", () => {
    const key = `t-${Math.random()}`;
    for (let i = 0; i < 3; i++) checkRateLimit(key, 3, 60_000);
    const r = checkRateLimit(key, 3, 60_000);
    expect(r.ok).toBe(false);
    expect(r.retryAfterSeconds).toBeGreaterThan(0);
  });

  it("isolates by key", () => {
    const k1 = `a-${Math.random()}`;
    const k2 = `b-${Math.random()}`;
    checkRateLimit(k1, 1, 60_000);
    expect(checkRateLimit(k1, 1, 60_000).ok).toBe(false);
    expect(checkRateLimit(k2, 1, 60_000).ok).toBe(true);
  });
});
