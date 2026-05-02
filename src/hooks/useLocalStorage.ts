"use client";

/**
 * Persistent local storage hook.
 *
 * Provides a `useState`-like API backed by `localStorage`. Values are
 * automatically serialized/deserialized as JSON and synced on change.
 *
 * @module hooks/useLocalStorage
 */

import { useState, useEffect } from "react";
import { safeLocalStorageGet, safeLocalStorageSet } from "@/lib/utils";

/**
 * Manages a state value that is persisted to `localStorage` under the given key.
 *
 * @param key - The localStorage key to read from and write to.
 * @param initialValue - The default value used when the key is not found.
 * @returns A `[value, setter]` tuple matching the `useState` contract.
 *
 * @example
 * ```tsx
 * const [theme, setTheme] = useLocalStorage("app_theme", "light");
 * ```
 */
export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((val: T) => T)) => void] {
  const [storedValue, setStoredValue] = useState<T>(() =>
    safeLocalStorageGet(key, initialValue)
  );

  useEffect(() => {
    safeLocalStorageSet(key, storedValue);
  }, [key, storedValue]);

  const setValue = (value: T | ((val: T) => T)) => {
    setStoredValue((prev) => {
      const next = value instanceof Function ? value(prev) : value;
      safeLocalStorageSet(key, next);
      return next;
    });
  };

  return [storedValue, setValue] as const;
}
