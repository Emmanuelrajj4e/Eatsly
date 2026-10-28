import { buildSeed, type DemoStoreData, type DemoUser } from "@/lib/demo-seed";
import type { Donation, Notification, Report } from "@/types";

const KEY = "foodbridge-demo-v2";
const SHIFT_THRESHOLD_MS = 15 * 60 * 1000;

/**
 * Tiny in-browser database for demo mode (used when Supabase is not
 * configured). Persists to localStorage and syncs across tabs.
 * All access is client-side — call from effects / event handlers only.
 */

let cache: DemoStoreData | null = null;
let channel: BroadcastChannel | null = null;
const listeners = new Set<() => void>();

function broadcast() {
  try {
    if (!channel) channel = new BroadcastChannel("foodbridge");
    channel.postMessage({ type: "store" });
  } catch {
    /* BroadcastChannel unsupported: same-tab updates still work */
  }
}

function shiftAll(store: DemoStoreData, deltaMs: number) {
  const shift = (iso: string) => new Date(new Date(iso).getTime() + deltaMs).toISOString();
  for (const d of store.donations) {
    d.packedAt = shift(d.packedAt);
    d.bestBefore = shift(d.bestBefore);
    d.createdAt = shift(d.createdAt);
  }
  for (const n of store.notifications) n.createdAt = shift(n.createdAt);
  for (const r of store.reports) r.createdAt = shift(r.createdAt);
  for (const p of store.profiles) p.createdAt = shift(p.createdAt);
  store.anchor = Date.now();
}

function persist(store: DemoStoreData) {
  try {
    localStorage.setItem(KEY, JSON.stringify(store));
  } catch {
    /* quota errors should not crash the demo */
  }
}

function load(): DemoStoreData {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const store = JSON.parse(raw) as DemoStoreData;
      const delta = Date.now() - store.anchor;
      if (delta > SHIFT_THRESHOLD_MS) {
        // Keep relative demo times fresh even days after seeding.
        shiftAll(store, delta);
        persist(store);
      }
      return store;
    }
  } catch {
    /* fall through to fresh seed */
  }
  const seeded = buildSeed();
  persist(seeded);
  return seeded;
}

function ensure(): DemoStoreData {
  if (!cache) cache = load();
  return cache;
}

function commit(mutate: (store: DemoStoreData) => void) {
  const store = ensure();
  mutate(store);
  persist(store);
  broadcast();
  listeners.forEach((fn) => fn());
}

/* -------------------- reads -------------------- */

export function getAll(): DemoStoreData {
  return ensure();
}

export function listDonations(): Donation[] {
  return ensure().donations;
}

export function getDonation(id: string): Donation | undefined {
  return ensure().donations.find((d) => d.id === id);
}

export function listUsers(): DemoUser[] {
  return ensure().profiles;
}

export function findUserByEmail(email: string): DemoUser | undefined {
  return ensure().profiles.find(
    (p) => p.email.toLowerCase() === email.trim().toLowerCase()
  );
}

export function listNotifications(userId: string): Notification[] {
  return ensure().notifications
    .filter((n) => n.userId === userId)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function listReports(): Report[] {
  return ensure().reports
    .slice()
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

/* -------------------- writes -------------------- */

export function addDonation(input: Omit<Donation, "id">): Donation {
  const id = `d${Date.now().toString(36)}${Math.floor(Math.random() * 1e4)}`;
  const donation: Donation = { ...input, id };
  commit((s) => s.donations.push(donation));
  return donation;
}

export function patchDonation(id: string, patch: Partial<Donation>): Donation | undefined {
  let updated: Donation | undefined;
  commit((s) => {
    const i = s.donations.findIndex((d) => d.id === id);
    if (i >= 0) {
      s.donations[i] = { ...s.donations[i], ...patch };
      updated = s.donations[i];
    }
  });
  return updated;
}

export function addUser(user: DemoUser): DemoUser {
  commit((s) => s.profiles.push(user));
  return user;
}

export function patchUser(id: string, patch: Partial<DemoUser>): DemoUser | undefined {
  let updated: DemoUser | undefined;
  commit((s) => {
    const i = s.profiles.findIndex((p) => p.id === id);
    if (i >= 0) {
      s.profiles[i] = { ...s.profiles[i], ...patch };
      updated = s.profiles[i];
    }
  });
  return updated;
}

export function addNotification(n: Omit<Notification, "id">) {
  const notification: Notification = { ...n, id: `n${Date.now().toString(36)}${Math.floor(Math.random() * 1e4)}` };
  commit((s) => s.notifications.push(notification));
  return notification;
}

export function markAllNotificationsRead(userId: string) {
  commit((s) => {
    for (const n of s.notifications) if (n.userId === userId) n.read = true;
  });
}

export function addReport(r: Omit<Report, "id">) {
  const report: Report = { ...r, id: `r${Date.now().toString(36)}${Math.floor(Math.random() * 1e4)}` };
  commit((s) => s.reports.push(report));
  return report;
}

export function patchReport(id: string, patch: Partial<Report>) {
  commit((s) => {
    const r = s.reports.find((x) => x.id === id);
    if (r) Object.assign(r, patch);
  });
}

export function resetDemoData() {
  cache = null;
  try {
    localStorage.removeItem(KEY);
  } catch {
    /* ignore */
  }
  commit(() => {}); // re-seeds and notifies listeners
}

/** Subscribe to any store change; also fires for cross-tab updates. */
export function subscribe(fn: () => void): () => void {
  listeners.add(fn);
  try {
    if (!channel) channel = new BroadcastChannel("foodbridge");
    const onMsg = () => fn();
    channel.addEventListener("message", onMsg);
    const onStorage = (e: StorageEvent) => {
      if (e.key === KEY) fn();
    };
    window.addEventListener("storage", onStorage);
    return () => {
      listeners.delete(fn);
      channel?.removeEventListener("message", onMsg);
      window.removeEventListener("storage", onStorage);
    };
  } catch {
    return () => listeners.delete(fn);
  }
}
