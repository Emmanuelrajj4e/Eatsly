import { DEFAULT_CENTER } from "@/lib/constants";
import { jitter } from "@/lib/geo";
import type { Donation, Notification, Profile, Report } from "@/types";

/** Demo users extend Profile with a plaintext password (demo mode only). */
export interface DemoUser extends Profile {
  password: string;
}

export interface DemoStoreData {
  profiles: DemoUser[];
  donations: Donation[];
  notifications: Notification[];
  reports: Report[];
  /** ms timestamp when the store was seeded; used to keep demo times fresh */
  anchor: number;
}

const H = 60 * 60 * 1000;

const img = (seed: string) => `https://picsum.photos/seed/${seed}/640/480`;

/** Builds a full realistic demo dataset at "now". Client-side only. */
export function buildSeed(now = Date.now()): DemoStoreData {
  const t = (hAgo: number) => new Date(now - hAgo * H).toISOString();

  const demoPass = "demo1234";
  const mk = (
    id: string,
    email: string,
    name: string,
    role: Profile["role"],
    extra: Partial<Profile> = {}
  ): DemoUser => ({
    id,
    email,
    name,
    role,
    approved: true,
    password: demoPass,
    createdAt: t(24 * 30),
    ...extra,
  });

  const profiles: DemoUser[] = [
    mk("u_donor_demo", "donor@demo.foodbridge", "Annapurna Mess", "donor", {
      address: "Kukatpally, Hyderabad",
      ...jitter(DEFAULT_CENTER, 1),
    }),
    mk("u_d1", "sunrise@cafe.demo", "Sunrise Cafe & Bakes", "donor", {
      address: "Jubilee Hills, Hyderabad",
      ...jitter(DEFAULT_CENTER, 2),
    }),
    mk("u_d2", "greenleaf@mess.demo", "Green Leaf Hostel Mess", "donor", {
      address: "Gachibowli, Hyderabad",
      ...jitter(DEFAULT_CENTER, 3),
    }),
    mk("u_d3", "nandi@caterers.demo", "Nandi Caterers", "donor", {
      address: "Banjara Hills, Hyderabad",
      ...jitter(DEFAULT_CENTER, 4),
    }),
    mk("u_d4", "priya@individual.demo", "Priya Sharma", "donor", {
      address: "Madhapur, Hyderabad",
      ...jitter(DEFAULT_CENTER, 5),
    }),
    mk("u_ngo_demo", "ngo@demo.foodbridge", "Akshaya Foundation", "ngo", {
      orgName: "Akshaya Foundation",
      address: "Begumpet, Hyderabad",
      ...jitter(DEFAULT_CENTER, 6),
    }),
    mk("u_ngo2", "hope@foodbank.demo", "Hope Food Bank", "ngo", {
      orgName: "Hope Food Bank",
      address: "Ameerpet, Hyderabad",
      ...jitter(DEFAULT_CENTER, 7),
    }),
    mk("u_ngo3", "sneha@trust.demo", "Sneha Welfare Trust", "ngo", {
      orgName: "Sneha Welfare Trust",
      address: "LB Nagar, Hyderabad",
      ...jitter(DEFAULT_CENTER, 8),
    }),
    mk("u_ngo4", "careseeds@ngo.demo", "Care Seeds NGO", "ngo", {
      orgName: "Care Seeds NGO",
      approved: false, // awaiting admin approval — demo for the admin role
      address: "Kondapur, Hyderabad",
      ...jitter(DEFAULT_CENTER, 9),
    }),
    mk(
      "u_vol_demo",
      "volunteer@demo.foodbridge",
      "Ravi Kumar",
      "volunteer",
      { ...jitter(DEFAULT_CENTER, 10), address: "Panjagutta, Hyderabad" }
    ),
    mk(
      "u_admin_demo",
      "admin@demo.foodbridge",
      "FoodBridge Admin",
      "admin",
      { ...jitter(DEFAULT_CENTER, 0) }
    ),
  ];

  interface Spec {
    title: string;
    description: string;
    category: string;
    isVeg: boolean;
    servings: number;
    kg: number;
    donor: string;
    packedH: number;
    shelfH: number;
    status: Donation["status"];
    ngo?: string;
    vol?: string;
    createdH: number;
    photo: string;
  }

  const specs: Spec[] = [
    { title: "Veg biryani — 3 trays", description: "Freshly packed extra trays from lunch rush. Sealed, untouched.", category: "cooked-meals", isVeg: true, servings: 45, kg: 11.2, donor: "u_donor_demo", packedH: 3, shelfH: 4, status: "available", createdH: 3, photo: "biryani" },
    { title: "Evening thali surplus (rice, sambar, curd)", description: "Unserved thalis from dinner service, packed hot.", category: "cooked-meals", isVeg: true, servings: 30, kg: 7.5, donor: "u_donor_demo", packedH: 1, shelfH: 6, status: "available", createdH: 1, photo: "thali" },
    { title: "Closing stock: pav buns & breads", description: "Day-end stock, packed this morning, still soft.", category: "breads-bakery", isVeg: true, servings: 26, kg: 4, donor: "u_d1", packedH: 5, shelfH: 14, status: "available", createdH: 5, photo: "bakery" },
    { title: "Wedding buffet leftovers — chicken curry + rice", description: "Sealed buffet backups, never placed on serving counters.", category: "cooked-meals", isVeg: false, servings: 80, kg: 20.5, donor: "u_d3", packedH: 2, shelfH: 5, status: "available", createdH: 2, photo: "buffet" },
    { title: "Mess dinner surplus: rajma rice", description: "Hostel mess overestimate. Warm, sealed containers.", category: "cooked-meals", isVeg: true, servings: 120, kg: 28, donor: "u_d2", packedH: 1, shelfH: 7, status: "available", createdH: 1, photo: "mess" },
    { title: "Tomato & cucumber crates", description: "Grade-B produce, perfectly edible, market surplus.", category: "fruits-veggies", isVeg: true, servings: 20, kg: 18, donor: "u_d4", packedH: 6, shelfH: 24, status: "available", createdH: 6, photo: "veggies" },
    { title: "Uncut black forest cake", description: "Cancelled birthday order, refrigerated, uncut.", category: "dairy-sweets", isVeg: true, servings: 12, kg: 2.4, donor: "u_d1", packedH: 4, shelfH: 16, status: "available", createdH: 4, photo: "cake" },
    { title: "Lassi & chaach cups", description: "Sealed tetra cups from the dairy distribution.", category: "dairy-sweets", isVeg: true, servings: 35, kg: 9, donor: "u_d1", packedH: 2, shelfH: 8, status: "available", createdH: 2, photo: "lassi" },
    { title: "Instant meal kits — 1 carton", description: "Ready-to-cook packs, unopened carton. Long shelf life.", category: "packaged", isVeg: true, servings: 30, kg: 6.5, donor: "u_d4", packedH: 10, shelfH: 24, status: "available", createdH: 10, photo: "kits" },
    { title: "Chicken biryani trays (festival night)", description: "Non-veg, clearly labelled. Sealed aluminium trays.", category: "cooked-meals", isVeg: false, servings: 40, kg: 10, donor: "u_d3", packedH: 2, shelfH: 5, status: "claimed", ngo: "u_ngo_demo", createdH: 2, photo: "chicken" },
    { title: "Fresh tomato crates surplus", description: "20 kg clean crates, cold-room stored.", category: "fruits-veggies", isVeg: true, servings: 20, kg: 16, donor: "u_d4", packedH: 4, shelfH: 20, status: "claimed", ngo: "u_ngo2", createdH: 4, photo: "tomato" },
    { title: "Milk pouches, unopened", description: "12 L total, dairy-direct, needs cold pickup soon.", category: "dairy-sweets", isVeg: true, servings: 24, kg: 12, donor: "u_d2", packedH: 3, shelfH: 12, status: "claimed", ngo: "u_ngo3", createdH: 3, photo: "milk" },
    { title: "Evening juice batch", description: "Fresh-pressed juices, bottled, kept chilled.", category: "beverages", isVeg: true, servings: 28, kg: 7, donor: "u_d1", packedH: 5, shelfH: 9, status: "picked_up", ngo: "u_ngo_demo", vol: "u_vol_demo", createdH: 5, photo: "juice" },
    { title: "Excess ciabatta & focaccia", description: "Cafe closing stock, packed 5 hours ago.", category: "breads-bakery", isVeg: true, servings: 18, kg: 3.5, donor: "u_d1", packedH: 5, shelfH: 14, status: "picked_up", ngo: "u_ngo2", vol: "u_vol_demo", createdH: 5, photo: "ciabatta" },
    { title: "Rajma-chawal dinner share", description: "Delivered to the community kitchen. Thank you!", category: "cooked-meals", isVeg: true, servings: 60, kg: 14, donor: "u_d2", packedH: 30, shelfH: 8, status: "delivered", ngo: "u_ngo_demo", vol: "u_vol_demo", createdH: 32, photo: "rajma" },
    { title: "Iftaar packs (khichdi + dates)", description: "50 sealed packs, muslim-community kitchen, delivered.", category: "cooked-meals", isVeg: true, servings: 50, kg: 8, donor: "u_d3", packedH: 55, shelfH: 6, status: "delivered", ngo: "u_ngo2", vol: "u_vol_demo", createdH: 56, photo: "iftaar" },
    { title: "Birthday cake slices", description: "Individuals' party — 15 slices, delivered same evening.", category: "dairy-sweets", isVeg: true, servings: 15, kg: 2, donor: "u_d4", packedH: 28, shelfH: 10, status: "delivered", ngo: "u_ngo_demo", vol: "u_vol_demo", createdH: 30, photo: "slices" },
    { title: "Chapati + dry curry packets", description: "100 rotis packed with dry sabzi, delivered to shelter.", category: "cooked-meals", isVeg: true, servings: 70, kg: 9.5, donor: "u_d3", packedH: 76, shelfH: 8, status: "delivered", ngo: "u_ngo3", vol: "u_vol_demo", createdH: 78, photo: "chapati" },
    { title: "Festival laddoo boxes", description: "Sealed sweets from function hall, delivered quickly.", category: "dairy-sweets", isVeg: true, servings: 40, kg: 6, donor: "u_d4", packedH: 100, shelfH: 48, status: "delivered", ngo: "u_ngo2", vol: "u_vol_demo", createdH: 101, photo: "laddoo" },
    { title: "Chicken sausage breakfast packs", description: "Sorry — refrigeration failed on route, auto-expired.", category: "packaged", isVeg: false, servings: 30, kg: 12, donor: "u_d2", packedH: 9, shelfH: 4, status: "available", createdH: 9, photo: "sausage" },
  ];

  const donations: Donation[] = specs.map((s, i) => {
    const packedAt = t(s.packedH);
    const donor = profiles.find((p) => p.id === s.donor)!;
    const ngo = s.ngo ? profiles.find((p) => p.id === s.ngo)! : null;
    const vol = s.vol
      ? profiles.find((p) => p.id === s.vol)!
      : null;
    return {
      id: `d${String(i + 1).padStart(3, "0")}`,
      title: s.title,
      description: s.description,
      category: s.category,
      isVeg: s.isVeg,
      servings: s.servings,
      kg: s.kg,
      packedAt,
      bestBefore: new Date(
        new Date(packedAt).getTime() + s.shelfH * H
      ).toISOString(),
      address: donor.address ?? "Hyderabad",
      ...jitter(DEFAULT_CENTER, i + 11),
      photoUrl: img(s.photo),
      donorId: donor.id,
      donorName: donor.name,
      ngoId: ngo?.id ?? null,
      ngoName: ngo?.name ?? null,
      volunteerId: vol?.id ?? null,
      volunteerName: vol?.name ?? null,
      status: s.status,
      createdAt: t(s.createdH),
    };
  });

  const notifications: Notification[] = [
    {
      id: "n1",
      userId: "u_ngo_demo",
      title: "New donation 2.1 km away",
      body: "Annapurna Mess posted “Veg biryani — 3 trays” (45 servings).",
      donationId: "d001",
      read: false,
      createdAt: t(3),
    },
    {
      id: "n2",
      userId: "u_ngo_demo",
      title: "New donation 4.3 km away",
      body: "Nandi Caterers posted “Wedding buffet leftovers” (80 servings).",
      donationId: "d004",
      read: false,
      createdAt: t(2),
    },
    {
      id: "n3",
      userId: "u_vol_demo",
      title: "New pickup task",
      body: "Evening juice batch claimed by Akshaya Foundation — accept pickup.",
      donationId: "d013",
      read: false,
      createdAt: t(4),
    },
    {
      id: "n4",
      userId: "u_donor_demo",
      title: "🏆 100 meals saved",
      body: "Your kitchen has now saved 100+ meals via FoodBridge.",
      read: true,
      createdAt: t(26),
    },
  ];

  const reports: Report[] = [
    {
      id: "r1",
      donationId: "d020",
      donationTitle: "Chicken sausage breakfast packs",
      reporterId: "u_ngo2",
      reporterName: "Hope Food Bank",
      reason: "Tagged available but looks expired — please check.",
      status: "open",
      createdAt: t(1),
    },
    {
      id: "r2",
      donationId: "d003",
      donationTitle: "Closing stock: pav buns & breads",
      reporterId: "u_ngo3",
      reporterName: "Sneha Welfare Trust",
      reason: "Address pin was slightly off, now fixed.",
      status: "resolved",
      createdAt: t(20),
    },
  ];

  return { profiles, donations, notifications, reports, anchor: now };
}

