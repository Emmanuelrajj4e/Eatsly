/**
 * Demo persistence keys, single source of truth.
 * "Reset demo data" clears all three so the seed sample state returns.
 */
const KEYS = ["eatsly:overrides:v1", "eatsly:posts:v1", "eatsly:ngos:v1"] as const;

export function resetDemoData() {
  for (const key of KEYS) {
    try {
      window.localStorage.removeItem(key);
    } catch {
      /* storage unavailable (private mode): nothing to reset */
    }
  }
}
