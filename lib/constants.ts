import type { DonationStatus } from "@/types";

export const CO2_KG_PER_KG_FOOD = 2.5; // EPA-style estimate: kg CO2e avoided per kg food rescued
export const DEFAULT_CENTER = { lat: 17.385, lng: 78.4867 }; // demo centre: Hyderabad
export const DEFAULT_RADIUS_KM = 8;

export const FOOD_CATEGORIES = [
  "cooked-meals",
  "breads-bakery",
  "fruits-veggies",
  "packaged",
  "dairy-sweets",
  "beverages",
] as const;
export type FoodCategory = (typeof FOOD_CATEGORIES)[number];

export const CATEGORY_META: Record<FoodCategory, { label: string; emoji: string }> = {
  "cooked-meals": { label: "Cooked meals", emoji: "🍛" },
  "breads-bakery": { label: "Breads & bakery", emoji: "🥖" },
  "fruits-veggies": { label: "Fruits & veggies", emoji: "🥦" },
  packaged: { label: "Packaged food", emoji: "🥫" },
  "dairy-sweets": { label: "Dairy & sweets", emoji: "🥛" },
  beverages: { label: "Beverages", emoji: "🧃" },
};

export const STATUS_ORDER: DonationStatus[] = [
  "available",
  "claimed",
  "picked_up",
  "delivered",
  "expired",
  "cancelled",
];

export const STATUS_META: Record<
  DonationStatus,
  { label: string; badge: string; dot: string }
> = {
  available: { label: "Available", badge: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400", dot: "bg-emerald-500" },
  claimed: { label: "Claimed", badge: "bg-amber-500/10 text-amber-600 dark:text-amber-400", dot: "bg-amber-500" },
  picked_up: { label: "Picked up", badge: "bg-sky-500/10 text-sky-600 dark:text-sky-400", dot: "bg-sky-500" },
  delivered: { label: "Delivered", badge: "bg-green-600/10 text-green-700 dark:text-green-400", dot: "bg-green-600" },
  expired: { label: "Expired", badge: "bg-stone-500/10 text-stone-500 dark:text-stone-400", dot: "bg-stone-400" },
  cancelled: { label: "Cancelled", badge: "bg-rose-500/10 text-rose-600 dark:text-rose-400", dot: "bg-rose-500" },
};

/** Demo logins so judges can try every role in seconds (demo mode only). */
export const DEMO_ACCOUNTS: Record<"donor" | "ngo" | "volunteer" | "admin", { email: string; password: string }> = {
  donor: { email: "donor@demo.foodbridge", password: "demo1234" },
  ngo: { email: "ngo@demo.foodbridge", password: "demo1234" },
  volunteer: { email: "volunteer@demo.foodbridge", password: "demo1234" },
  admin: { email: "admin@demo.foodbridge", password: "demo1234" },
};
