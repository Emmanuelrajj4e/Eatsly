"use client";

import { useSyncExternalStore } from "react";

/**
 * ONE shared 1 Hz ticker for every countdown on the page.
 * useSyncExternalStore keeps subscriptions cheap and hydration safe
 * (server snapshot is a constant, so prerendered HTML never disagrees).
 */
const seconds = () => Math.floor(Date.now() / 1000);

function subscribe(cb: () => void) {
  const id = window.setInterval(cb, 1000);
  return () => window.clearInterval(id);
}

/** Returns a number that changes once per second (monotonic-not-important). */
export function useTicker() {
  return useSyncExternalStore(subscribe, seconds, () => 0);
}

/** Subscribe to the shared 1 Hz store directly (setState inside callbacks). */
export function onTick(cb: () => void): () => void {
  return subscribe(cb);
}
