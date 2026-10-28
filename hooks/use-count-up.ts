"use client";

import { useEffect, useRef, useState } from "react";

const P = "(prefers-reduced-motion: reduce)";

/**
 * Count 0 -> target with an ease-out curve on load.
 * Skips straight to the final number for reduced-motion users.
 */
export function useCountUp(target: number, duration = 1100) {
  const [value, setValue] = useState(0);
  const raf = useRef<number>(0);

  useEffect(() => {
    if (window.matchMedia(P).matches) {
      const id = requestAnimationFrame(() => setValue(target));
      return () => cancelAnimationFrame(id);
    }
    const t0 = performance.now();
    const step = (t: number) => {
      const p = Math.min(1, (t - t0) / duration);
      setValue(Math.round(target * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf.current = requestAnimationFrame(step);
    };
    raf.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf.current);
  }, [target, duration]);

  return value;
}
