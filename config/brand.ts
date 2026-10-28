/** Single place to rename or re-tune the product. */

export const APP_NAME = "Annadaan";
/** Hero tagline. */
export const APP_TAGLINE = "Good food has a clock.";
export const APP_HASHTAG = "#AnnadaanClock";
export const APP_MISSION =
  "Annadaan puts a live safety clock on every surplus meal, so donors, NGOs and volunteers in Hyderabad can save food before it spoils.";

export const CITY = "Hyderabad";

/** Weight estimate per serving, kg. */
export const KG_PER_SERVING = 0.38;

/** An NGO claim must land at least this many minutes before the window ends. */
export const SAFETY_BUFFER_MIN = 10;

/** Posting is blocked when less time than this remains. */
export const MIN_POST_MINUTES = 20;

/** Assumed volunteer speed for ETA, km/h, plus fixed handling minutes. */
export const SPEED_KMPH = 18;
export const HANDLING_MIN = 7;

/** Safe-window rules: hot cooked 4h, sweets/dry 12h, packaged 24h, produce 48h. */
export const SAFE_WINDOWS: Record<
  string,
  { label: string; minutes: number }
> = {
  hot: { label: "Hot cooked", minutes: 4 * 60 },
  sweets: { label: "Sweets & dry", minutes: 12 * 60 },
  packaged: { label: "Packaged", minutes: 24 * 60 },
  produce: { label: "Fresh produce", minutes: 48 * 60 },
};

export type SafeWindowKey = keyof typeof SAFE_WINDOWS;
