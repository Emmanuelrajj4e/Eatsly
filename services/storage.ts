export function readJson<T>(key: string): T | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

export function writeJson(key: string, value: unknown) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* private mode: demo state won't persist */
  }
}

/**
 * Tab sync for a demo store: connects a BroadcastChannel that re-runs
 * onRefresh in every other tab, and returns a broadcast() sender.
 */
export function connectSync(
  name: string,
  onRefresh: () => void,
): () => void {
  let ch: BroadcastChannel | null = null;
  try {
    ch = new BroadcastChannel(name);
    ch.onmessage = () => onRefresh();
  } catch {
    /* no channel support: current tab still updates */
  }
  return () => {
    try {
      if (!ch) ch = new BroadcastChannel(name);
      ch.postMessage("changed");
    } catch {
      /* ignore */
    }
  };
}
