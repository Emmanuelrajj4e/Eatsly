import { distanceKm } from "@/lib/utils";
import { etaMinutes, safeUntilMs } from "@/services/geo";
import { advance, getBoard, subscribe as subscribeBoard } from "@/services/listings";
import { getNgoById } from "@/services/ngos";
import { DEMO_TRACKING_ID, SPEED_KMPH } from "@/config/brand";
import type { Listing, NGO, StageKey, TrackStage, TrackState } from "@/types";

/**
 * TrackingService: a subscription feed of delivery state. The demo is driven
 * by a simulation engine (stage schedule + route progress + speed multiplier).
 * A real websocket/API can replace the engine later without touching
 * components — everything reads through `get(id)`.
 */

export type Unsubscribe = () => void;
export type TrackListener = (state: TrackState) => void;

/* sim schedule (minutes at 1x) */
const ASSIGNED_AT = 2;
const PICKED_AT = 6;
const TRANSIT_AT = 8;

const ORDER: StageKey[] = ["posted", "claimed", "assigned", "picked_up", "in_transit", "delivered"];
const VOLUNTEERS = ["Imran", "Sana", "Ravi", "Meera", "Farhan", "Divya"];

interface Run {
  startedAt: number;
  speed: 1 | 5 | 20;
  doneAt: number;
  deliveredWritten: boolean;
}

const runs = new Map<string, Run>();
const listeners = new Map<string, Set<TrackListener>>();
let globalSpeed: 1 | 5 | 20 = 1;
const speedListeners = new Set<() => void>();

function volunteerFor(listing: Listing, ngo: NGO | null) {
  const h = [...listing.id].reduce((a, c) => a + c.charCodeAt(0), 0);
  return {
    name: VOLUNTEERS[h % VOLUNTEERS.length],
    vehicle: ngo?.vehicle || "Scooter pickup",
    phone: `+91 ····· ${((h * 7) % 9000) + 1000}`,
  };
}

/** Stage edge times; posted/claimed use real listing timestamps instead. */
function edgeFor(key: StageKey, doneAt: number): number | null {
  switch (key) {
    case "assigned":
      return ASSIGNED_AT;
    case "picked_up":
      return PICKED_AT;
    case "in_transit":
      return TRANSIT_AT;
    case "delivered":
      return doneAt;
    default:
      return null;
  }
}

function runFor(id: string, nowMs: number): Run {
  let run = runs.get(id);
  if (!run) {
    run = { startedAt: nowMs, speed: globalSpeed, doneAt: 14, deliveredWritten: false };
    runs.set(id, run);
  }
  run.speed = globalSpeed;
  return run;
}

export function setSpeed(speed: 1 | 5 | 20) {
  /* carry elapsed across the switch so progress never jumps */
  for (const run of runs.values()) {
    const simElapsed = ((Date.now() - run.startedAt) / 60000) * run.speed;
    run.startedAt = Date.now() - (simElapsed / speed) * 60000;
    run.speed = speed;
  }
  globalSpeed = speed;
  speedListeners.forEach((fn) => fn());
  emitAll();
}

export function getSpeed(): 1 | 5 | 20 {
  return globalSpeed;
}

export function subscribeSpeed(fn: () => void): Unsubscribe {
  speedListeners.add(fn);
  return () => {
    speedListeners.delete(fn);
  };
}

/** Restart the demo clock for one run (stages replay from zero). */
export function resetRun(id: string) {
  runs.delete(id);
  emitAll();
}

function buildStages(
  listing: Listing,
  run: Run | null,
  nowMs: number,
  simMin: number,
  doneAt: number,
): TrackStage[] {
  const ngo = listing.ngoId ? getNgoById(listing.ngoId) : undefined;
  const ngoName = ngo?.name ?? "the NGO";
  const v = volunteerFor(listing, ngo ?? null);
  const realFloor = listing.status === "picked_up" ? 3 : listing.status === "claimed" ? 1 : 0;
  const simIdx = simMin >= doneAt ? 5 : simMin >= TRANSIT_AT ? 4 : simMin >= PICKED_AT ? 3 : simMin >= ASSIGNED_AT ? 2 : 1;
  const currentIdx = Math.max(realFloor, simIdx);

  return ORDER.map((key, i) => {
    /* real timestamps win wherever they exist */
    const real =
      key === "posted"
        ? isoBack(listing, 2)
        : key === "claimed"
          ? listing.claimedAt
          : key === "picked_up"
            ? listing.pickedUpAt
            : key === "delivered"
              ? listing.deliveredAt
              : undefined;
    const edge = edgeFor(key, doneAt);
    const reached = i <= currentIdx;
    const at = real ?? (reached && edge !== null && run
      ? new Date(run.startedAt + (edge * 60000) / run.speed).toISOString()
      : null);

    const sentences: Record<StageKey, string> = {
      posted: `${listing.donorName} posted "${listing.title}" from ${listing.area}.`,
      claimed: `${ngoName} claimed ${listing.servings} servings.`,
      assigned: `${v.name} is assigned to carry this run.`,
      picked_up: `${v.name} picked up ${listing.servings} servings from ${listing.donorName}.`,
      in_transit: `${v.name} is riding the food to ${ngoName}.`,
      delivered: `${listing.servings} servings delivered to ${ngoName} — proof below.`,
    };

    return {
      key,
      label: key === "assigned" ? "Volunteer assigned" : key === "in_transit" ? "In transit" : key.replace("_", " ").replace(/^\w/, (c) => c.toUpperCase()),
      at,
      sentence: sentences[key],
    };
  });
}

/** Claimed minus two sim-minutes: a plausible "posted" timestamp. */
function isoBack(listing: Listing, simMin: number): string | undefined {
  if (!listing.claimedAt) return undefined;
  return new Date(new Date(listing.claimedAt).getTime() - simMin * 60000).toISOString();
}

function emitted(listing: Listing, runRef: Run | null, nowMs: number): TrackState {
  const ngo = listing.ngoId ? getNgoById(listing.ngoId) ?? null : null;
  const volunteer = volunteerFor(listing, ngo);

  if (listing.status === "delivered") {
    return {
      id: listing.id,
      listing,
      ngo,
      stages: buildStages(listing, runRef, nowMs, Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY),
      progress: 1,
      distanceKmLeft: 0,
      etaMinutesLeft: 0,
      volunteer,
      done: true,
    };
  }

  const km = ngo ? distanceKm(listing, ngo) : 0;

  if (listing.status !== "claimed" && listing.status !== "picked_up") {
    return {
      id: listing.id,
      listing,
      ngo,
      stages: buildStages(listing, null, nowMs, 0, TRANSIT_AT),
      progress: 0,
      distanceKmLeft: km,
      etaMinutesLeft: ngo ? etaMinutes(ngo, listing) : 0,
      volunteer,
      done: false,
    };
  }

  const run = runRef ?? runFor(listing.id, nowMs);
  const simMin = ((nowMs - run.startedAt) / 60000) * run.speed;
  const eta = ngo ? etaMinutes(ngo, listing) : 20;
  run.doneAt = TRANSIT_AT + Math.max(4, Math.round(eta * 0.45));

  /* sim completion writes the delivery — one source of truth in overrides */
  if (simMin >= run.doneAt && !run.deliveredWritten) {
    run.deliveredWritten = true;
    advance(listing.id, "delivered", nowMs);
  }

  const progress = simMin <= TRANSIT_AT ? 0 : Math.min(1, (simMin - TRANSIT_AT) / (run.doneAt - TRANSIT_AT));
  const distanceKmLeft = Math.max(0, km * (1 - progress));

  return {
    id: listing.id,
    listing,
    ngo,
    stages: buildStages(listing, run, nowMs, simMin, run.doneAt),
    progress,
    distanceKmLeft,
    etaMinutesLeft: Math.max(0, Math.round(distanceKmLeft / (SPEED_KMPH / 60) + 2)),
    volunteer,
    done: simMin >= run.doneAt,
  };
}

/* --- public read/subscribe API --- */

export function get(id: string, nowMs = Date.now()): TrackState {
  /* the featured demo id maps to our seeded claimed run */
  const resolvedId = id === DEMO_TRACKING_ID ? "l015" : id;
  const listing = getBoard(nowMs).find((l) => l.id === resolvedId);
  if (!listing) {
    return {
      id,
      listing: null,
      ngo: null,
      stages: [],
      progress: 0,
      distanceKmLeft: 0,
      etaMinutesLeft: 0,
      volunteer: null,
      done: false,
    };
  }
  const active = listing.status === "claimed" || listing.status === "picked_up";
  return emitted(listing, active ? runFor(listing.id, nowMs) : null, nowMs);
}

function emitAll() {
  const now = new Date().getTime();
  for (const [id, set] of listeners) {
    const state = get(id, now);
    set.forEach((fn) => fn(state));
  }
}

/** subscribe(id, cb) — the contract a real feed replaces unchanged. */
export function subscribe(id: string, fn: TrackListener): Unsubscribe {
  let set = listeners.get(id);
  if (!set) {
    set = new Set<TrackListener>();
    listeners.set(id, set);
  }
  set.add(fn);
  const off = subscribeBoard(() => {
    fn(get(id));
  });
  fn(get(id));
  return () => {
    set?.delete(fn);
    off();
  };
}

/** Route geometry + window for the tracking map (or null when unclaimable). */
export function routeFor(id: string, nowMs = Date.now()) {
  const resolvedId = id === DEMO_TRACKING_ID ? "l015" : id;
  const l = getBoard(nowMs).find((x) => x.id === resolvedId);
  const ngo = l?.ngoId ? getNgoById(l.ngoId) : undefined;
  if (!l || !ngo) return null;
  return {
    from: { lat: l.lat, lng: l.lng },
    to: { lat: ngo.lat, lng: ngo.lng },
    km: distanceKm(l, ngo),
    windowEnd: safeUntilMs(l.preparedAt, l.type),
  };
}
