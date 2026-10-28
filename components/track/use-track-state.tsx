"use client";

import { useEffect, useState } from "react";
import { get, subscribe } from "@/services/tracking";
import { onTick } from "@/hooks/use-ticker";
import type { TrackState } from "@/types";

/**
 * Live tracking state on the ONE shared 1 Hz clock: the initial read is
 * rAF-deferred (engine reads Date.now(), not allowed during prerender),
 * the ticker re-derives once per second, and board mutations arrive
 * instantly through the service subscription. setState only runs inside
 * external callbacks.
 */
export function useTrackState(id: string): TrackState | null {
  const [state, setState] = useState<TrackState | null>(null);

  useEffect(() => {
    const read = () => setState(get(id));
    const raf = requestAnimationFrame(read);
    const offSub = subscribe(id, read);
    const offTick = onTick(read);
    return () => {
      cancelAnimationFrame(raf);
      offSub();
      offTick();
    };
  }, [id]);

  return state;
}
