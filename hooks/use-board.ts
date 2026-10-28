"use client";

import { useEffect, useState } from "react";
import { getBoard, subscribe } from "@/services/listings";
import type { Listing } from "@/types";

/**
 * Live board snapshot. Re-reads on service events (claims, pickups, posts)
 * and on updates from other tabs via the BroadcastChannel inside the service.
 */
export function useBoard() {
  const [board, setBoard] = useState<Listing[] | null>(null);

  useEffect(() => {
    // rAF-deferred first read: derived seeds use Date.now(), not allowed prerender
    const id = requestAnimationFrame(() => setBoard(getBoard()));
    const unsub = subscribe((next) => setBoard(next));
    return () => {
      cancelAnimationFrame(id);
      unsub();
    };
  }, []);

  return board;
}
