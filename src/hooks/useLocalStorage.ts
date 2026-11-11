"use client";

import { useCallback, useSyncExternalStore } from "react";

const EVENT = "focusflow:storage";

function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener(EVENT, callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(EVENT, callback);
  };
}

function read(key: string): string | null {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

/**
 * Persists a number in localStorage. Built on useSyncExternalStore so the
 * server render uses `fallback` and the client hydrates without mismatches.
 */
export function useLocalStorageNumber(key: string, fallback: number) {
  const raw = useSyncExternalStore(subscribe, () => read(key), () => null);
  const parsed = raw === null ? Number.NaN : Number(raw);
  const value = Number.isFinite(parsed) ? parsed : fallback;

  const setValue = useCallback(
    (next: number) => {
      try {
        window.localStorage.setItem(key, String(next));
      } catch {
        // Storage may be unavailable (private mode); the value just won't persist.
      }
      window.dispatchEvent(new Event(EVENT));
    },
    [key],
  );

  return [value, setValue] as const;
}
