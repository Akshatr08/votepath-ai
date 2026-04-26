"use client";

import { useState, useEffect } from "react";
import { safeLocalStorageGet, safeLocalStorageSet } from "@/lib/utils";

export function useLocalStorage<T>(key: string, initialValue: T) {
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
