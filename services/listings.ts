import rawListings from "@/data/listings.json";
import type { FoodType, Listing, ListingStatus } from "@/types";
import { safeUntilMs } from "@/services/geo";

/**
 * Demo data model. Seed listings are re-derived from relative offsets on every
 * load so countdowns are always freshly dramatic; only real user mutations
 * (claims, pickups, deliveries, new posts) persist via overrides.
 */

interface RawListing {
  id: string;
  title: string;
  type: FoodType;
  veg: boolean;
  servings: number;
  minutesAgo: number;
  donorName: string;
  area: string;
  lat: number;
  lng: number;
  status?: ListingStatus;
  ngoId?: string;
  claimedAgo?: number;
  pickedUpAgo?: number;
  deliveredAgo?: number;
}

function isoMinutesAgo(mins: number) {
  return new Date(Date.now() - mins * 60000).toISOString();
}

/** Seed with freshness offsets applied; overrides merged on top. */
function getSeed(): Listing[] {
  return (rawListings as RawListing[]).map((r) => ({
    id: r.id,
    title: r.title,
    type: r.type,
    veg: r.veg,
    servings: r.servings,
    preparedAt: isoMinutesAgo(r.minutesAgo),
    donorName: r.donorName,
    area: r.area,
    lat: r.lat,
    lng: r.lng,
    status: r.status ?? "open",
    ngoId: r.ngoId,
    claimedAt: r.claimedAgo ? isoMinutesAgo(r.claimedAgo) : undefined,
    pickedUpAt: r.pickedUpAgo ? isoMinutesAgo(r.pickedUpAgo) : undefined,
    deliveredAt: r.deliveredAgo ? isoMinutesAgo(r.deliveredAgo) : undefined,
  }));
}

/** A listing its safe window has closed. */
export function isExpired(l: Listing, nowMs: number) {
  return safeUntilMs(l.preparedAt, l.type) < nowMs;
}

/** Full current board (seed + derivatives). Expired items stay listed; views gate. */
export function getListings(nowMs = Date.now()): Listing[] {
  return getSeed().filter((l) => !isExpired(l, nowMs) || l.status !== "open");
}

/** Soonest-expiring open listing (hero "Next to spoil"). */
export function soonestOpen(nowMs = Date.now()): Listing | null {
  const open = getSeed().filter((l) => l.status === "open" && !isExpired(l, nowMs));
  if (open.length === 0) return null;
  return open.sort(
    (a, b) => safeUntilMs(a.preparedAt, a.type) - safeUntilMs(b.preparedAt, b.type),
  )[0];
}
