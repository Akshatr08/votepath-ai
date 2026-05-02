"use client";

/**
 * Debounced callback hook.
 *
 * Returns a stable, memoized function that delays invoking `fn` until
 * `delay` milliseconds have elapsed since the last call. The timer is
 * stored in a ref to survive re-renders without resetting.
 *
 * @module hooks/useDebounce
 */

import { useCallback, useRef } from "react";

/**
 * Creates a debounced version of the provided callback.
 *
 * @param fn - The function to debounce.
 * @param delay - Debounce delay in milliseconds.
 * @returns A stable debounced function that can be called from event handlers.
 *
 * @example
 * ```tsx
 * const debouncedSearch = useDebounce((query: string) => fetchResults(query), 300);
 * ```
 */
export function useDebounce<T extends (...args: unknown[]) => unknown>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  return useCallback(
    (...args: Parameters<T>) => {
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => fn(...args), delay);
    },
    [fn, delay]
  );
}
