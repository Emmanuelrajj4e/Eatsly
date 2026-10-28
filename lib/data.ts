import { CO2_KG_PER_KG_FOOD } from "@/lib/constants";
import { distanceKm, type GeoPoint } from "@/lib/geo";
import * as store from "@/lib/demo-store";
import { isSupabaseConfigured } from "@/lib/supabase";
import * as sb from "@/lib/supabase-data";
import { fileToDataUrl } from "@/lib/image";
import type {
  Donation,
  ImpactStats,
  Notification,
  Profile,
  Report,
} from "@/types";

/**
 * Unified data facade over two backends:
 *  - Supabase (when .env.local is configured) with RLS protecting every table
 *  - demo store (localStorage) so the app is demoable with zero setup
 */

/* ---------------- status helpers ---------------- */

export function isExpired(d: Donation, now = Date.now()): boolean {
  return (
    (d.status === "available" || d.status === "claimed") &&
    new Date(d.bestBefore).getTime() <= now
  );
}

/** Stored status + wall-clock expiry = the status actually shown. */
export function effectiveStatus(d: Donation, now = Date.now()) {
  return isExpired(d, now) ? ("expired" as const) : d.status;
}

/** Auto-hide expired food from receivers; owners/admins still see their own. */
export function visibleFor(d: Donation, viewer: Profile | null): boolean {
  if (!isExpired(d)) return true;
  if (!viewer) return false;
  return (
    viewer.role === "admin" ||
    viewer.id === d.donorId ||
    viewer.id === d.ngoId ||
    viewer.id === d.volunteerId
  );
}

export interface DonationFilter {
  center?: GeoPoint | null;
  radiusKm?: number; // undefined = no distance filter
  category?: string | null;
  isVeg?: boolean | null;
  maxHoursLeft?: number | null;
  minServings?: number | null;
  search?: string | null;
}

export function applyFilter(
  donations: Donation[],
  f: DonationFilter
): Donation[] {
  const now = Date.now();
  return donations.filter((d) => {
    if (isExpired(d, now)) return false;
    if (f.category && d.category !== f.category) return false;
    if (f.isVeg !== null && f.isVeg !== undefined && d.isVeg !== f.isVeg) return false;
    if (f.minServings && d.servings < f.minServings) return false;
    if (f.maxHoursLeft) {
      const leftH = (new Date(d.bestBefore).getTime() - now) / 3600000;
      if (leftH > f.maxHoursLeft) return false;
    }
    if (f.search) {
      const q = f.search.trim().toLowerCase();
      if (
        q &&
        !`${d.title} ${d.description} ${d.donorName}`.toLowerCase().includes(q)
      )
        return false;
    }
    if (f.center && f.radiusKm) {
      const km = distanceKm(f.center, d);
      if (km > f.radiusKm) return false;
    }
    return true;
  });
}

export function distanceFromViewer(center: GeoPoint | null | undefined, d: Donation): number | null {
  return center ? distanceKm(center, d) : null;
}

/* ---------------- donations ---------------- */

export async function fetchDonations(): Promise<Donation[]> {
  if (isSupabaseConfigured()) return sb.pullDonations();
  return store.listDonations().slice(); // copy: reads must be live-ish
}

export async function getDonation(id: string): Promise<Donation | null> {
  if (isSupabaseConfigured()) {
    const d = await sb.getDonationById(id);
    return d ?? null;
  }
  return store.getDonation(id) ?? null;
}

export interface NewDonation {
  title: string;
  description: string;
  category: string;
  isVeg: boolean;
  servings: number;
  kg: number;
  packedAt: string;
  bestBefore: string;
  address: string;
  lat: number;
  lng: number;
  photoUrl?: string | null;
}

export async function createDonation(
  input: NewDonation,
  donor: Profile
): Promise<Donation> {
  const donation: Omit<Donation, "id"> = {
    ...input,
    donorId: donor.id,
    donorName: donor.orgName || donor.name,
    status: "available",
    ngoId: null,
    ngoName: null,
    volunteerId: null,
    volunteerName: null,
    createdAt: new Date().toISOString(),
  };

  if (isSupabaseConfigured()) {
    const created = await sb.insertDonation(donation as Donation);
    await notifyNearbyNgos(created);
    return created;
  }

  const created = store.addDonation(donation);
  notifyNearbyNgos(created);
  return created;
}

function distWithin(a: { lat?: number | null; lng?: number | null }, b: GeoPoint, maxKm: number): boolean {
  if (a.lat == null || a.lng == null) return true;
  return distanceKm(a as GeoPoint, b) <= maxKm;
}

async function notifyNearbyNgos(donation: Donation): Promise<void> {
  const km = 10;
  if (isSupabaseConfigured()) {
    const ngos = await sb.fetchNgos();
    for (const n of ngos) {
      if (!n.approved || !distWithin(n, donation, km)) continue;
      await sb.pushNotification({
        userId: n.id,
        title: "New donation nearby",
        body: `${donation.donorName} posted “${donation.title}” (${donation.servings} servings).`,
        donationId: donation.id,
        read: false,
        createdAt: new Date().toISOString(),
      });
    }
    return;
  }
  for (const n of store.listUsers()) {
    if (n.role !== "ngo" || !n.approved || !distWithin(n, donation, km)) continue;
    store.addNotification({
      userId: n.id,
      title: `New donation ${distanceKm(n as GeoPoint, donation).toFixed(1)} km away`,
      body: `${donation.donorName} posted “${donation.title}” (${donation.servings} servings).`,
      donationId: donation.id,
      read: false,
      createdAt: new Date().toISOString(),
    });
  }
}

export async function claimDonation(
  id: string,
  ngo: Profile
): Promise<void> {
  const d = await getDonation(id);
  if (!d) throw new Error("Donation not found");
  if (effectiveStatus(d) !== "available")
    throw new Error("This listing is no longer available");
  if (ngo.role !== "ngo" || !ngo.approved)
    throw new Error("Only approved NGOs can claim donations");

  const patch = { status: "claimed" as const, ngoId: ngo.id, ngoName: ngo.orgName || ngo.name };

  if (isSupabaseConfigured()) {
    await sb.patchDonationRow(id, patch);
    await sb.pushNotification({
      userId: d.donorId,
      title: "Your donation was claimed 🎉",
      body: `${patch.ngoName} claimed “${d.title}” (${d.servings} servings).`,
      donationId: d.id,
      read: false,
      createdAt: new Date().toISOString(),
    });
    return;
  }
  store.patchDonation(id, patch);
  store.addNotification({
    userId: d.donorId,
    title: "Your donation was claimed 🎉",
    body: `${patch.ngoName} claimed “${d.title}” (${d.servings} servings).`,
    donationId: d.id,
    read: false,
    createdAt: new Date().toISOString(),
  });
}

/** Volunteer accepts an unassigned pickup task. */
export async function acceptPickupTask(
  id: string,
  volunteer: Profile
): Promise<void> {
  const d = await getDonation(id);
  if (!d) throw new Error("Donation not found");
  if (!d.ngoId || d.volunteerId) throw new Error("Task already assigned or claim missing");
  if (effectiveStatus(d) !== "claimed") throw new Error("Task is not active");
  if (volunteer.role !== "volunteer") throw new Error("Only volunteers can accept pickups");

  const patch = { volunteerId: volunteer.id, volunteerName: volunteer.name };

  if (isSupabaseConfigured()) {
    await sb.patchDonationRow(id, patch);
    await Promise.all([
      sb.pushNotification({
        userId: d.ngoId,
        title: "Volunteer assigned",
        body: `${volunteer.name} will pick up “${d.title}”.`,
        donationId: d.id,
        read: false,
        createdAt: new Date().toISOString(),
      }),
      sb.pushNotification({
        userId: d.donorId,
        title: "Volunteer on the way",
        body: `${volunteer.name} accepted the pickup for “${d.title}”.`,
        donationId: d.id,
        read: false,
        createdAt: new Date().toISOString(),
      }),
    ]);
    return;
  }

  store.patchDonation(id, patch);
  for (const uid of [d.ngoId, d.donorId]) {
    store.addNotification({
      userId: uid,
      title: uid === d.donorId ? "Volunteer on the way" : "Volunteer assigned",
      body: `${volunteer.name} accepted the pickup for “${d.title}”.`,
      donationId: d.id,
      read: false,
      createdAt: new Date().toISOString(),
    });
  }
}

export async function markPickedUp(id: string): Promise<void> {
  const d = await getDonation(id);
  if (!d) throw new Error("Donation not found");
  const patch = { status: "picked_up" as const };
  if (isSupabaseConfigured()) {
    await sb.patchDonationRow(id, patch);
    await sb.pushNotification({
      userId: d.donorId,
      title: "Picked up 📦",
      body: `“${d.title}” was collected by ${d.volunteerName ?? "your volunteer"}.`,
      donationId: d.id,
      read: false,
      createdAt: new Date().toISOString(),
    });
    return;
  }
  store.patchDonation(id, patch);
  store.addNotification({
    userId: d.donorId,
    title: "Picked up 📦",
    body: `“${d.title}” was collected by ${d.volunteerName ?? "your volunteer"}.`,
    donationId: d.id,
    read: false,
    createdAt: new Date().toISOString(),
  });
}

/** Delivery is the impact moment: meals + kg + CO2 get recorded here. */
export async function markDelivered(id: string): Promise<void> {
  const d = await getDonation(id);
  if (!d) throw new Error("Donation not found");
  const patch = { status: "delivered" as const };
  const impact = {
    title: "Delivered — impact recorded 🌱",
    body: `${d.servings} meals served from “${d.title}” · ${d.kg} kg saved · ${(d.kg * CO2_KG_PER_KG_FOOD).toFixed(1)} kg CO₂ avoided.`,
    donationId: d.id,
    read: false,
    createdAt: new Date().toISOString(),
  };

  if (isSupabaseConfigured()) {
    await sb.patchDonationRow(id, patch);
    await Promise.all([
      sb.pushNotification({ ...impact, userId: d.donorId }),
      d.ngoId
        ? sb.pushNotification({ ...impact, userId: d.ngoId })
        : Promise.resolve(),
    ]);
    return;
  }

  store.patchDonation(id, patch);
  for (const uid of d.ngoId ? [d.donorId, d.ngoId] : [d.donorId]) {
    store.addNotification({ ...impact, userId: uid });
  }
}

export async function cancelDonation(id: string): Promise<void> {
  await patchWhere(id, { status: "cancelled" });
}

export async function patchWhere(
  id: string,
  patch: Partial<Donation>
): Promise<void> {
  if (isSupabaseConfigured()) {
    await sb.patchDonationRow(id, patch);
    return;
  }
  store.patchDonation(id, patch);
}

/* ---------------- photos ---------------- */

export async function uploadDonationPhoto(file: File, donorId: string): Promise<string> {
  if (isSupabaseConfigured()) return sb.uploadDonationPhoto(file, donorId);
  return fileToDataUrl(file);
}

/* ---------------- notifications ---------------- */

export async function fetchNotifications(userId: string): Promise<Notification[]> {
  if (isSupabaseConfigured()) return sb.fetchNotificationsFor(userId);
  return store.listNotifications(userId);
}

export async function markNotificationsRead(userId: string): Promise<void> {
  if (isSupabaseConfigured()) return sb.markNotificationsRead(userId);
  store.markAllNotificationsRead(userId);
}

/* ---------------- reports ---------------- */

export async function reportDonation(
  d: Donation,
  reporter: Profile,
  reason: string
): Promise<void> {
  const row: Omit<Report, "id"> = {
    donationId: d.id,
    donationTitle: d.title,
    reporterId: reporter.id,
    reporterName: reporter.name,
    reason,
    status: "open",
    createdAt: new Date().toISOString(),
  };
  if (isSupabaseConfigured()) return sb.createReport(row);
  store.addReport(row);
}

export async function fetchReports(): Promise<Report[]> {
  if (isSupabaseConfigured()) return sb.fetchReports();
  return store.listReports();
}

export async function resolveReport(id: string): Promise<void> {
  if (isSupabaseConfigured()) return sb.setReportStatus(id, "resolved");
  store.patchReport(id, { status: "resolved" });
}

/* ---------------- profiles (admin) ---------------- */

export async function fetchNgos(): Promise<Profile[]> {
  if (isSupabaseConfigured()) return sb.fetchNgos();
  return store
    .listUsers()
    .filter((u) => u.role === "ngo")
    .slice();
}

export async function setNgoApproved(ngoId: string, approved: boolean): Promise<void> {
  if (isSupabaseConfigured()) {
    await sb.updateProfile(ngoId, { approved });
    return;
  }
  store.patchUser(ngoId, { approved });
}

/* ---------------- impact ---------------- */

export async function fetchImpact(): Promise<ImpactStats> {
  if (isSupabaseConfigured()) return sb.computeImpact();
  const donations = store.listDonations();
  const ngoRows = store
    .listUsers()
    .filter((u) => u.role === "ngo")
    .map((u) => {
      const p = { ...u } as Record<string, unknown>;
      delete p.password;
      return p as unknown as Profile;
    });
  return sb.summarize(donations, ngoRows);
}

export interface LeaderRow {
  donorId: string;
  donorName: string;
  donations: number;
  meals: number;
  kg: number;
}

export async function fetchLeaderboard(): Promise<LeaderRow[]> {
  const donations = await fetchDonations();
  const delivered = donations.filter((d) => d.status === "delivered");
  const byDonor = new Map<string, LeaderRow>();
  for (const d of delivered) {
    const row =
      byDonor.get(d.donorId) ?? {
        donorId: d.donorId,
        donorName: d.donorName,
        donations: 0,
        meals: 0,
        kg: 0,
      };
    row.donations += 1;
    row.meals += d.servings;
    row.kg += d.kg;
    byDonor.set(d.donorId, row);
  }
  return [...byDonor.values()].sort((a, b) => b.meals - a.meals);
}

/* ---------------- realtime ---------------- */

export function subscribeDonations(cb: () => void): () => void {
  if (isSupabaseConfigured()) return sb.onDonationsChanged(cb);
  return store.subscribe(cb);
}

/** True when running without Supabase so UI can show a demo-mode banner. */
export function isDemoMode(): boolean {
  return !isSupabaseConfigured();
}
