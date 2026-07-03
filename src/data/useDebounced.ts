import { useEffect, useState } from 'react';

/**
 * Returns `value` delayed by `delayMs`, resetting the timer on each change. Used to hold the
 * visible-row set steady while the user is actively scrolling, so avatar/live fetches fire only
 * once scrolling settles rather than on every frame.
 */
export const useDebounced = <T>(value: T, delayMs: number): T => {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delayMs);
    return () => clearTimeout(timer);
  }, [value, delayMs]);

  return debounced;
};
