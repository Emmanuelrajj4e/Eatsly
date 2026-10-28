/** Domain models shared by services, hooks and components. */

/** Food categories, each with its own safe-window length. */
export type FoodType = "hot" | "sweets" | "packaged" | "produce";

/** Lifecycle of a listing on the board. `expired` is derived at read time. */
export type ListingStatus = "open" | "claimed" | "picked_up" | "delivered";

/** Pin marker on the board — food listing is a pin, NGO is a diamond. */
export type MapMarker = "pin" | "diamond";

export interface Listing {
  id: string;
  /** Dish name, e.g. "Vegetable pulao". */
  title: string;
  type: FoodType;
  veg: boolean;
  servings: number;
  /** Last-cooked timestamp (ISO). Safe window runs from here. */
  preparedAt: string;
  donorName: string;
  /** Area key, one of AREAS in config/brand data. */
  area: string;
  lat: number;
  lng: number;
  status: ListingStatus;
  /** NGO that claimed this listing (id), set when status != open. */
  ngoId?: string;
  claimedAt?: string;
  pickedUpAt?: string;
  deliveredAt?: string;
  /** Seed-only: minutes before app load when food was prepared. */
  minutesAgo?: number;
  /** Nutrition profile linking the card to the Nutrition hub anchors. */
  nutritionTags?: string[];
}

export interface NGO {
  id: string;
  name: string;
  area: string;
  lat: number;
  lng: number;
  /** Placeholder contact string, e.g. "+91 [contact]". */
  contact: string;
  /** Free text, e.g. "Bicycle pickup". */
  vehicle: string;
  /** true when added via the onboarding form. */
  newlyAdded?: boolean;
}

/** Filters on the Live Board. */
export type BoardFilter = "all" | "under1hour" | "veg" | "packaged" | "protein";

/** City area summary for the home page breakdown. */
export interface CityAreaStat {
  area: string;
  donors: number;
  ngos: number;
}

/** Impact dashboard numbers (all sample-data derived). */
export interface ImpactStats {
  mealsRescuedToday: number;
  servingsWaitingNow: number;
  kgSaved: number;
  last7Days: number[];
}

/** Payload accepted by postSurplus() after form validation. */
export interface PostListingInput {
  title: string;
  type: FoodType;
  veg: boolean;
  servings: number;
  preparedAt: string;
  donorName: string;
  /** One of data/areas.json names; coordinates resolve from it. */
  area: string;
  /** Nutrition profile, e.g. ["Carb-rich", "Protein-rich"]. */
  tags?: string[];
}

export type PostResult =
  | { ok: true; listing: Listing }
  | { ok: false; error: string };

/* --- live tracking --- */

/** Stages on the tracking timeline, in strict order. */
export type StageKey =
  | "posted"
  | "claimed"
  | "assigned"
  | "picked_up"
  | "in_transit"
  | "delivered";

export interface TrackStage {
  key: StageKey;
  label: string;
  /** Simulation timestamp (ISO) or null when the stage has not happened. */
  at: string | null;
  /** Plain sentence shown once the stage is current or past. */
  sentence: string;
}

export interface TrackVolunteer {
  name: string;
  vehicle: string;
  /** Masked phone, e.g. "+91 ····· 8342". */
  phone: string;
}

export interface TrackState {
  id: string;
  listing: Listing | null;
  ngo: NGO | null;
  stages: TrackStage[];
  /** 0..1 along the NGO route once in transit. */
  progress: number;
  distanceKmLeft: number;
  etaMinutesLeft: number;
  volunteer: TrackVolunteer | null;
  done: boolean;
}
