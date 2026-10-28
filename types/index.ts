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
export type BoardFilter = "all" | "urgent" | "veg" | "packaged";

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
  area: string;
}

export type PostResult =
  | { ok: true; listing: Listing }
  | { ok: false; error: string };
