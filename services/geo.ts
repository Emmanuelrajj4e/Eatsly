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
