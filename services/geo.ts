import { SAFE_WINDOWS, SPEED_KMPH, HANDLING_MIN } from "@/config/brand";
import { distanceKm } from "@/lib/utils";
import type { FoodType } from "@/types";

/** Safe-window length in minutes for a food type. */
export function windowMinutes(type: FoodType) {
  return SAFE_WINDOWS[type].minutes;
}

/** Absolute safe-until timestamp in ms since epoch. */
export function safeUntilMs(preparedAt: string, type: FoodType) {
  return new Date(preparedAt).getTime() + windowMinutes(type) * 60000;
}

/** Volunteer ETA in minutes (urban bike speed + handover buffer). */
export function etaMinutes(
  from: { lat: number; lng: number },
  to: { lat: number; lng: number },
) {
  const km = distanceKm(from, to);
  return Math.max(5, Math.round((km / SPEED_KMPH) * 60 + HANDLING_MIN));
}

/* --- stylised SVG map projection (real area positions, abstracted geography) --- */

export const MAP_BOUNDS = {
  minLat: 17.31,
  maxLat: 17.51,
  minLng: 78.32,
  maxLng: 78.59,
} as const;

export const MAP_SIZE = { width: 640, height: 520 } as const;

/** Linear lat/lng -> map viewBox projection. */
export function project(lat: number, lng: number) {
  const x =
    10 + ((lng - MAP_BOUNDS.minLng) / (MAP_BOUNDS.maxLng - MAP_BOUNDS.minLng)) * (MAP_SIZE.width - 20);
  const y =
    10 + ((MAP_BOUNDS.maxLat - lat) / (MAP_BOUNDS.maxLat - MAP_BOUNDS.minLat)) * (MAP_SIZE.height - 20);
  return { x: Math.round(x), y: Math.round(y) };
}
