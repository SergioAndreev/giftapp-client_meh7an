import { useCallback, useState } from "react";

export const useDebounce = <T extends (...args: string[]) => void>(
  callback: T,
  delay: number
) => {
  const [timeoutRef, setTimeoutRef] = useState<NodeJS.Timeout | null>(null);

  return useCallback(
    (...args: Parameters<T>) => {
      if (timeoutRef) clearTimeout(timeoutRef);

      const timeout = setTimeout(() => {
        callback(...args);
      }, delay);

      if (timeoutRef) setTimeoutRef(timeout);
    },
    [callback, delay, timeoutRef]
  );
};
