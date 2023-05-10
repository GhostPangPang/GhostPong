import { useCallback, useEffect, useRef } from 'react';
import ResizeObserver from 'resize-observer-polyfill';

type ResizeHandler = (entry: ResizeObserverEntry, observer: ResizeObserver) => void;

export const useResizeObserver = (onResize: ResizeHandler) => {
  const ref = useRef<HTMLDivElement>(null);
  const callback = useCallback(
    (entries: ResizeObserverEntry[], observer: ResizeObserver) => {
      entries.forEach((entry) => {
        onResize(entry, observer);
      });
    },
    [onResize],
  );

  useEffect(() => {
    if (!ref.current) return;
    const observer = new ResizeObserver(callback);
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [ref, callback]);

  return ref;
};
