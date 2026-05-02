/**
 * In-memory sliding-window rate limiter.
 *
 * Provides per-key request throttling with configurable limits and windows.
 * Includes periodic cleanup to prevent memory leaks in long-running processes.
 * Used by all API routes to enforce request quotas.
 *
 * @module lib/rate-limiter
 */

import { RATE_LIMIT_REQUESTS, RATE_LIMIT_WINDOW_MS } from "@/constants";

// ─── In-Memory Rate Limiter ───────────────────────────────────────────────────

/** Tracks the request count and window expiry for a single rate-limit key. */
interface RateLimitEntry {
  count: number;
  resetAt: number;
}

/** Result returned by {@link checkRateLimit}. */
export interface RateLimitResult {
  /** Whether the request is allowed under the current limit. */
  allowed: boolean;
  /** Number of remaining requests in the current window. */
  remaining: number;
  /** Unix timestamp (ms) when the current window resets. */
  resetAt: number;
}

const store = new Map<string, RateLimitEntry>();

/** Interval (ms) between periodic store cleanup sweeps. */
const CLEANUP_INTERVAL_MS = 5 * 60 * 1000; // 5 minutes
let cleanupTimer: ReturnType<typeof setInterval> | null = null;

/** Starts a periodic cleanup timer that evicts expired entries to prevent memory leaks. */
function startCleanup(): void {
  if (cleanupTimer) return;
  cleanupTimer = setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of store) {
      if (now > entry.resetAt) store.delete(key);
    }
  }, CLEANUP_INTERVAL_MS);
  // Allow Node.js to exit even if the timer is still running
  if (cleanupTimer && typeof cleanupTimer === "object" && "unref" in cleanupTimer) {
    cleanupTimer.unref();
  }
}

/**
 * Checks whether a request identified by `key` is allowed under the rate limit.
 *
 * @param key - Unique identifier for the rate-limit bucket (e.g., `"chat-<ip>"`).
 * @param maxRequests - Maximum requests allowed per window (defaults to {@link RATE_LIMIT_REQUESTS}).
 * @param windowMs - Window duration in milliseconds (defaults to {@link RATE_LIMIT_WINDOW_MS}).
 * @returns An object indicating whether the request is allowed, remaining quota, and reset time.
 */
export function checkRateLimit(
  key: string,
  maxRequests = RATE_LIMIT_REQUESTS,
  windowMs = RATE_LIMIT_WINDOW_MS
): RateLimitResult {
  startCleanup();
  const now = Date.now();
  const entry = store.get(key);

  if (!entry || now > entry.resetAt) {
    const resetAt = now + windowMs;
    store.set(key, { count: 1, resetAt });
    return { allowed: true, remaining: maxRequests - 1, resetAt };
  }

  if (entry.count >= maxRequests) {
    return { allowed: false, remaining: 0, resetAt: entry.resetAt };
  }

  entry.count++;
  return { allowed: true, remaining: maxRequests - entry.count, resetAt: entry.resetAt };
}

/**
 * Resets the rate limit for a specific key, removing it from the store.
 *
 * @param key - The rate-limit bucket key to reset.
 */
export function resetRateLimit(key: string): void {
  store.delete(key);
}

/** Clears all rate-limit entries. Useful in testing. */
export function resetAllRateLimits(): void {
  store.clear();
}

/**
 * Returns the current rate-limit entry for a key, if it exists.
 *
 * @param key - The rate-limit bucket key to inspect.
 */
export function getRateLimitInfo(key: string): RateLimitEntry | undefined {
  return store.get(key);
}
