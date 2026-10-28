/** Single place to rename or re-tune the product. Eatsly, strictly monochrome. */

export const APP_NAME = "Eatsly";
export const APP_TAGLINE = "Every plate, on time.";
/** Hero headline (set in Instrument Serif italic). Featured as a quote, not attributed. */
export const HERO_QUOTE = "No food should expire before it finds a plate.";
/** Alternate original lines for section headings. */
export const QUOTE_SURPLUS =
  "Surplus is only waste if nobody is watching the clock.";
export const QUOTE_NUTRITION = "Nutrition is not a luxury. It is the first lesson.";
export const APP_MISSION =
  "Eatsly gives every surplus meal a live safety clock in Hyderabad, so donors post it, NGOs claim it while it is still safe, and volunteers carry it to a plate.";
export const APP_HASHTAG = "#EveryPlateOnTime";
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

/** Known nutrition tags linking board listings to the Nutrition hub. */
export const NUTRITION_TAGS = [
  "Carb-rich",
  "Protein-rich",
  "Fibre",
  "Vitamin-rich",
] as const;

/* Sample ticker events (landing strip). */
export const TICKER_EVENTS = [
  "LIVE · 120 servings claimed, Banjara Hills",
  "LIVE · 40 servings claimed, Charminar",
  "LIVE · Delivered, Uppal",
  "LIVE · 30 servings claimed, Secunderabad",
  "LIVE · Volunteer assigned, Madhapur",
  "LIVE · Delivered, LB Nagar",
  "LIVE · 50 servings claimed, Gachibowli",
  "LIVE · Picked up, Begumpet",
];

/** Featured demo tracking ID (drives the tracking page + drawer demo). */
export const DEMO_TRACKING_ID = "ETS-2041";
