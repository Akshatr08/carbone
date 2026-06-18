import { useEffect, useRef, useState } from "react";

type IdleCallback = (deadline: { didTimeout: boolean; timeRemaining: () => number }) => void;
type ScheduleHandle = number;

const schedule: (cb: IdleCallback) => ScheduleHandle =
  typeof window !== "undefined" && "requestIdleCallback" in window
    ? (cb) =>
        (
          window as unknown as { requestIdleCallback: (cb: IdleCallback) => number }
        ).requestIdleCallback(cb)
    : (cb) => window.setTimeout(() => cb({ didTimeout: false, timeRemaining: () => 0 }), 0);

const cancel: (id: ScheduleHandle) => void =
  typeof window !== "undefined" && "cancelIdleCallback" in window
    ? (id) =>
        (window as unknown as { cancelIdleCallback: (id: number) => void }).cancelIdleCallback(id)
    : (id) => window.clearTimeout(id);

/**
 * SSR-safe localStorage hook with idle-batched writes.
 * Coalesces rapid updates so we touch storage at most once per idle frame.
 */
export function useLocalStorage<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(initial);
  const [hydrated, setHydrated] = useState(false);
  const pending = useRef<ScheduleHandle | null>(null);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(key);
      if (raw != null) setValue(JSON.parse(raw) as T);
    } catch {
      /* ignore */
    }
    setHydrated(true);
  }, [key]);

  useEffect(() => {
    if (!hydrated) return;
    if (pending.current != null) cancel(pending.current);
    pending.current = schedule(() => {
      pending.current = null;
      try {
        window.localStorage.setItem(key, JSON.stringify(value));
      } catch {
        /* ignore quota */
      }
    });
    return () => {
      if (pending.current != null) {
        cancel(pending.current);
        pending.current = null;
      }
    };
  }, [key, value, hydrated]);

  return [value, setValue, hydrated] as const;
}
