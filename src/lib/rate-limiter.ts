import { RATE_LIMIT_REQUESTS, RATE_LIMIT_WINDOW_MS } from "@/constants";

// ─── In-Memory Rate Limiter ───────────────────────────────────────────────────

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const store = new Map<string, RateLimitEntry>();

// Periodic cleanup to prevent memory leaks in long-running processes
const CLEANUP_INTERVAL_MS = 5 * 60 * 1000; // 5 minutes
let cleanupTimer: ReturnType<typeof setInterval> | null = null;

function startCleanup() {
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

export function checkRateLimit(
  key: string,
  maxRequests = RATE_LIMIT_REQUESTS,
  windowMs = RATE_LIMIT_WINDOW_MS
): { allowed: boolean; remaining: number; resetAt: number } {
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

export function resetRateLimit(key: string): void {
  store.delete(key);
}

export function resetAllRateLimits(): void {
  store.clear();
}

export function getRateLimitInfo(key: string): RateLimitEntry | undefined {
  return store.get(key);
}
