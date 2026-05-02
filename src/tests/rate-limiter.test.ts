import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";
import {
  checkRateLimit,
  resetRateLimit,
  resetAllRateLimits,
  getRateLimitInfo,
} from "@/lib/rate-limiter";

describe("Rate Limiter", () => {
  beforeEach(() => {
    resetAllRateLimits();
  });

  it("should allow initial requests", () => {
    const result = checkRateLimit("user-1");
    expect(result.allowed).toBe(true);
    expect(result.remaining).toBe(9); // 10 max - 1 used
  });

  it("should track request count", () => {
    checkRateLimit("user-2");
    checkRateLimit("user-2");
    const result = checkRateLimit("user-2");
    expect(result.allowed).toBe(true);
    expect(result.remaining).toBe(7); // 10 - 3
  });

  it("should block after limit is reached", () => {
    const key = "user-flood";
    // Use up all 10 requests
    for (let i = 0; i < 10; i++) {
      checkRateLimit(key);
    }
    const result = checkRateLimit(key);
    expect(result.allowed).toBe(false);
    expect(result.remaining).toBe(0);
  });

  it("should support custom limits", () => {
    const key = "custom-limit";
    checkRateLimit(key, 2, 60000);
    checkRateLimit(key, 2, 60000);
    const result = checkRateLimit(key, 2, 60000);
    expect(result.allowed).toBe(false);
  });

  it("should isolate different keys", () => {
    for (let i = 0; i < 10; i++) {
      checkRateLimit("blocked-user");
    }
    const blocked = checkRateLimit("blocked-user");
    expect(blocked.allowed).toBe(false);

    const fresh = checkRateLimit("fresh-user");
    expect(fresh.allowed).toBe(true);
  });

  it("should reset a specific key", () => {
    for (let i = 0; i < 10; i++) {
      checkRateLimit("reset-me");
    }
    expect(checkRateLimit("reset-me").allowed).toBe(false);

    resetRateLimit("reset-me");
    expect(checkRateLimit("reset-me").allowed).toBe(true);
  });

  it("should reset all keys", () => {
    checkRateLimit("a");
    checkRateLimit("b");
    resetAllRateLimits();
    expect(getRateLimitInfo("a")).toBeUndefined();
    expect(getRateLimitInfo("b")).toBeUndefined();
  });

  it("should return resetAt timestamp", () => {
    const before = Date.now();
    const result = checkRateLimit("timestamped");
    expect(result.resetAt).toBeGreaterThanOrEqual(before);
  });

  it("should allow requests after window expires", async () => {
    const key = "expiry-test";
    // Use custom 50ms window
    for (let i = 0; i < 3; i++) {
      checkRateLimit(key, 3, 50);
    }
    expect(checkRateLimit(key, 3, 50).allowed).toBe(false);

    // Wait for window to expire
    await new Promise((r) => setTimeout(r, 80));
    expect(checkRateLimit(key, 3, 50).allowed).toBe(true);
  });

  it("should clean up expired entries periodically", async () => {
    vi.resetModules();
    vi.useFakeTimers();
    const { checkRateLimit, getRateLimitInfo } = await import("@/lib/rate-limiter");
    
    checkRateLimit("cleanup-test", 10, 1000); // Reset at now + 1000
    
    // Fast forward past the 5-minute cleanup interval
    vi.advanceTimersByTime(5 * 60 * 1000 + 100); 
    
    // The entry should be removed from the internal store by the cleanup timer
    expect(getRateLimitInfo("cleanup-test")).toBeUndefined();
    
    vi.useRealTimers();
  });
});
