import rawListings from "@/data/listings.json";
import type {
  FoodType,
  Listing,
  ListingStatus,
  PostListingInput,
  PostResult,
} from "@/types";
import { etaMinutes, safeUntilMs } from "@/services/geo";
import { getNgoById } from "@/services/ngos";
import { connectSync, readJson, writeJson } from "@/services/storage";
import { MIN_POST_MINUTES, SAFETY_BUFFER_MIN, SAFE_WINDOWS } from "@/config/brand";
import rawAreas from "@/data/areas.json";

/**
 * Demo data model.
 * - Seed listings (data/listings.json) are re-derived from relative offsets on
 *   every load, so the board is always freshly dramatic.
 * - Real user mutations (claim / pickup / deliver / new posts) persist to
 *   localStorage and sync across browser tabs through a BroadcastChannel.
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
  tags?: string[];
}

const KEYS = {
  overrides: "eatsly:overrides:v1",
  posts: "eatsly:posts:v1",
} as const;

export interface ListingOverride {
  status: ListingStatus;
  ngoId?: string;
  claimedAt?: string;
  pickedUpAt?: string;
  deliveredAt?: string;
}

/** Cross-tab pipe: refresh this store when another tab mutates it. */
const sync = connectSync("eatsly", () => emit());

type Listener = (listings: Listing[]) => void;

const listeners = new Set<Listener>();

/** Notify every mounted board/strip; also tell other tabs. */
function emit() {
  listeners.forEach((fn) => fn(getBoard()));
  sync();
}

export function subscribe(fn: Listener): () => void {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
}

function isoMinutesAgo(mins: number) {
  return new Date(Date.now() - mins * 60000).toISOString();
}

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
    nutritionTags: r.tags,
  }));
}

/** The single read API: seed + user posts + overrides, expired open drops. */
export function getBoard(nowMs = Date.now()): Listing[] {
  const overrides = readJson<Record<string, ListingOverride>>(KEYS.overrides) ?? {};
  const posts = readJson<Listing[]>(KEYS.posts) ?? [];

  const merged: Listing[] = [
    ...getSeed().map((l) => (overrides[l.id] ? { ...l, ...overrides[l.id] } : l)),
    ...posts,
  ];
  return merged.filter((l) => l.status !== "open" || safeUntilMs(l.preparedAt, l.type) >= nowMs);
}

/** A listing that survived to expired (shows greyed when status != open). */
export function isExpired(listing: Listing, nowMs: number) {
  return safeUntilMs(listing.preparedAt, listing.type) < nowMs;
}

export interface ClaimResult {
  ok: boolean;
  reason?: string;
}

/** NGO claim gate: ETA must land SAFETY_BUFFER_MIN before the window ends. */
export function claim(listingId: string, ngoId: string, nowMs = Date.now()): ClaimResult {
  const listing = getBoard(nowMs).find((l) => l.id === listingId);
  if (!listing) return { ok: false, reason: "Listing not found." };
  if (listing.status !== "open") return { ok: false, reason: "Already claimed or delivered." };
  if (isExpired(listing, nowMs)) return { ok: false, reason: "Time window closed." };
  const ngo = getNgoById(ngoId);
  if (!ngo) return { ok: false, reason: "Unknown NGO." };

  const left = safeUntilMs(listing.preparedAt, listing.type) - nowMs;
  const eta = etaMinutes(ngo, listing);
  const cutoff = SAFETY_BUFFER_MIN;
  if (left <= cutoff * 60000) {
    return {
      ok: false,
      reason: `No margin left — window closes in ${Math.floor(left / 60000)} min and we keep a ${cutoff}-min buffer.`,
    };
  }
  const maxEta = Math.floor(left / 60000) - cutoff;
  if (eta > maxEta) {
    return {
      ok: false,
      reason: `Too far — pickup would land ${eta - maxEta} min after the cutoff (needs ETA ≤ ${maxEta} min, is ${eta}).`,
    };
  }

  const now = new Date(nowMs).toISOString();
  const ov: ListingOverride = {
    status: "claimed",
    ngoId,
    claimedAt: now,
  };
  writeJson(KEYS.overrides, { ...(readJson(KEYS.overrides) ?? {}), [listingId]: ov });
  emit();
  return { ok: true };
}

/** Volunteer progress: claimed -> picked_up -> delivered. */
export function advance(
  listingId: string,
  to: "picked_up" | "delivered",
  nowMs = Date.now(),
): ClaimResult {
  const board = getBoard(nowMs);
  const listing = board.find((l) => l.id === listingId);
  if (!listing) return { ok: false, reason: "Listing not found." };
  if (to === "picked_up" && listing.status !== "claimed") {
    return { ok: false, reason: "Only claimed food can be picked up." };
  }
  if (to === "delivered" && listing.status !== "picked_up") {
    return { ok: false, reason: "Pick up first, then deliver." };
  }
  const overrides = readJson<Record<string, ListingOverride>>(KEYS.overrides) ?? {};
  const now = new Date(nowMs).toISOString();
  const ov: ListingOverride = {
    ...(overrides[listingId] ?? {
      status: listing.status,
      ngoId: listing.ngoId,
      claimedAt: listing.claimedAt ?? now,
    }),
    status: to,
    pickedUpAt: to === "picked_up" ? now : (overrides[listingId]?.pickedUpAt ?? listing.pickedUpAt),
    deliveredAt: to === "delivered" ? now : (overrides[listingId]?.deliveredAt ?? listing.deliveredAt),
  };
  writeJson(KEYS.overrides, { ...overrides, [listingId]: ov });
  emit();
  return { ok: true };
}

/** Donor post: validated input from the form becomes a listing. */
export function postListing(input: PostListingInput): PostResult {
  const area = rawAreas.find((a) => a.name === input.area);
  if (!area) {
    return { ok: false, error: "Pick an area from the list so we can place it on the map." };
  }
  const windowMs = SAFE_WINDOWS[input.type].minutes * 60000;
  const left = new Date(input.preparedAt).getTime() + windowMs - Date.now();
  if (left < MIN_POST_MINUTES * 60000) {
    return {
      ok: false,
      error: `This food has under ${MIN_POST_MINUTES} minutes of safe time left, so it can't go on the board. Serve it fresh or post your next batch earlier.`,
    };
  }
  const listing: Listing = {
    id: `p${Date.now().toString(36)}`,
    title: input.title,
    type: input.type,
    veg: input.veg,
    servings: input.servings,
    preparedAt: input.preparedAt,
    donorName: input.donorName,
    area: input.area,
    lat: area.lat,
    lng: area.lng,
    status: "open",
    nutritionTags: input.tags?.filter(Boolean),
  };
  const posts = readJson<Listing[]>(KEYS.posts) ?? [];
  posts.push(listing);
  writeJson(KEYS.posts, posts);
  emit();
  return { ok: true, listing };
}

/** Soonest-expiring open listing (hero "Next to spoil"). */
export function soonestOpen(nowMs = Date.now()): Listing | null {
  const open = getBoard(nowMs).filter((l) => l.status === "open");
  if (open.length === 0) return null;
  return open.sort(
    (a, b) => safeUntilMs(a.preparedAt, a.type) - safeUntilMs(b.preparedAt, b.type),
  )[0];
}
