/**
 * FoodBridge — Supabase seed script
 * Creates the demo accounts (all 4 roles) and 20 realistic donations so a
 * Supabase-backed deployment looks exactly like demo mode.
 *
 * Usage:
 *   1. Copy .env.example → .env.local and fill NEXT_PUBLIC_SUPABASE_URL,
 *      NEXT_PUBLIC_SUPABASE_ANON_KEY and SUPABASE_SERVICE_ROLE_KEY.
 *   2. Run supabase/migrations/0001_init.sql in the SQL editor.
 *   3. node scripts/seed.mjs   (or: npm run seed:supabase)
 */
import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceKey) {
  console.error(
    "✋ Missing env. Add to .env.local:\n" +
      "  NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY\n" +
      "then re-run:  npm run seed:supabase"
  );
  process.exit(1);
}

const sb = createClient(url, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const PASS = "demo1234";
const CENTER = { lat: 17.385, lng: 78.4867 }; // demo centre: Hyderabad
const H = 60 * 60 * 1000;
const now = Date.now();
const t = (hAgo) => new Date(now - hAgo * H).toISOString();

function jitter(i) {
  const r = ((i * 137.508) % 100) / 100;
  const angle = i * 2.399;
  const radius = 0.005 + r * 0.05;
  return {
    lat: +(CENTER.lat + Math.sin(angle) * radius).toFixed(6),
    lng: +(CENTER.lng + Math.cos(angle) * radius).toFixed(6),
  };
}

const USERS = [
  { key: "u_donor_demo", email: "donor@demo.foodbridge", name: "Annapurna Mess", role: "donor", approved: true, address: "Kukatpally, Hyderabad" },
  { key: "u_d1", email: "sunrise@cafe.demo", name: "Sunrise Cafe & Bakes", role: "donor", approved: true, address: "Jubilee Hills, Hyderabad" },
  { key: "u_d2", email: "greenleaf@mess.demo", name: "Green Leaf Hostel Mess", role: "donor", approved: true, address: "Gachibowli, Hyderabad" },
  { key: "u_d3", email: "nandi@caterers.demo", name: "Nandi Caterers", role: "donor", approved: true, address: "Banjara Hills, Hyderabad" },
  { key: "u_d4", email: "priya@individual.demo", name: "Priya Sharma", role: "donor", approved: true, address: "Madhapur, Hyderabad" },
  { key: "u_ngo_demo", email: "ngo@demo.foodbridge", name: "Akshaya Foundation", role: "ngo", approved: true, address: "Begumpet, Hyderabad" },
  { key: "u_ngo2", email: "hope@foodbank.demo", name: "Hope Food Bank", role: "ngo", approved: true, address: "Ameerpet, Hyderabad" },
  { key: "u_ngo3", email: "sneha@trust.demo", name: "Sneha Welfare Trust", role: "ngo", approved: true, address: "LB Nagar, Hyderabad" },
  { key: "u_ngo4", email: "careseeds@ngo.demo", name: "Care Seeds NGO", role: "ngo", approved: false, address: "Kondapur, Hyderabad" },
  { key: "u_vol_demo", email: "volunteer@demo.foodbridge", name: "Ravi Kumar", role: "volunteer", approved: true, address: "Panjagutta, Hyderabad" },
  { key: "u_admin_demo", email: "admin@demo.foodbridge", name: "FoodBridge Admin", role: "admin", approved: true, address: "JNTU, Hyderabad" },
];

const D = [
  ["Veg biryani — 3 trays", "Freshly packed extra trays from lunch rush. Sealed, untouched.", "cooked-meals", true, 45, 11.2, 3, 4, "available", 0, null, null, 3],
  ["Evening thali surplus (rice, sambar, curd)", "Unserved thalis from dinner service, packed hot.", "cooked-meals", true, 30, 7.5, 1, 6, "available", 0, null, null, 1],
  ["Closing stock: pav buns & breads", "Day-end stock, packed this morning, still soft.", "breads-bakery", true, 26, 4.0, 5, 14, "available", 1, null, null, 5],
  ["Wedding buffet leftovers — chicken curry + rice", "Sealed buffet backups, never placed on serving counters.", "cooked-meals", false, 80, 20.5, 2, 5, "available", 3, null, null, 2],
  ["Mess dinner surplus: rajma rice", "Hostel mess overestimate. Warm, sealed containers.", "cooked-meals", true, 120, 28, 1, 7, "available", 2, null, null, 1],
  ["Tomato & cucumber crates", "Grade-B produce, perfectly edible, market surplus.", "fruits-veggies", true, 20, 18, 6, 24, "available", 4, null, null, 6],
  ["Uncut black forest cake", "Cancelled birthday order, refrigerated, uncut.", "dairy-sweets", true, 12, 2.4, 4, 16, "available", 1, null, null, 4],
  ["Lassi & chaach cups", "Sealed tetra cups from the dairy distribution.", "dairy-sweets", true, 35, 9, 2, 8, "available", 1, null, null, 2],
  ["Instant meal kits — 1 carton", "Ready-to-cook packs, unopened carton. Long shelf life.", "packaged", true, 30, 6.5, 10, 24, "available", 4, null, null, 10],
  ["Chicken biryani trays (festival night)", "Non-veg, clearly labelled. Sealed aluminium trays.", "cooked-meals", false, 40, 10, 2, 5, "claimed", 3, 5, null, 2],
  ["Fresh tomato crates surplus", "20 kg clean crates, cold-room stored.", "fruits-veggies", true, 20, 16, 4, 20, "claimed", 4, 6, null, 4],
  ["Milk pouches, unopened", "12 L total, dairy-direct, needs cold pickup soon.", "dairy-sweets", true, 24, 12, 3, 12, "claimed", 2, 7, null, 3],
  ["Evening juice batch", "Fresh-pressed juices, bottled, kept chilled.", "beverages", true, 28, 7, 5, 9, "picked_up", 1, 5, 10, 5],
  ["Excess ciabatta & focaccia", "Cafe closing stock, packed 5 hours ago.", "breads-bakery", true, 18, 3.5, 5, 14, "picked_up", 1, 6, 10, 5],
  ["Rajma-chawal dinner share", "Delivered to the community kitchen. Thank you!", "cooked-meals", true, 60, 14, 30, 8, "delivered", 2, 5, 10, 32],
  ["Iftaar packs (khichdi + dates)", "50 sealed packs, mosque-community kitchen, delivered.", "cooked-meals", true, 50, 8, 55, 6, "delivered", 3, 6, 10, 56],
  ["Birthday cake slices", "Individuals' party — 15 slices, delivered same evening.", "dairy-sweets", true, 15, 2, 28, 10, "delivered", 4, 5, 10, 30],
  ["Chapati + dry curry packets", "100 rotis packed with dry sabzi, delivered to shelter.", "cooked-meals", true, 70, 9.5, 76, 8, "delivered", 3, 7, 10, 78],
  ["Festival laddoo boxes", "Sealed sweets from function hall, delivered quickly.", "dairy-sweets", true, 40, 6, 100, 48, "delivered", 4, 6, 10, 101],
  ["Chicken sausage breakfast packs", "Sorry — refrigeration failed on route, auto-expired.", "packaged", false, 30, 12, 9, 4, "available", 2, null, null, 9],
];

const idOf = Object.create(null);

async function upsertUsers() {
  for (const u of USERS) {
    const { data } = await sb.auth.admin.listUsers();
    const found = data?.users?.find((x) => x.email?.toLowerCase() === u.email);
    let uid = found?.id;
    if (!uid) {
      const created = await sb.auth.admin.createUser({
        email: u.email,
        password: PASS,
        email_confirm: true,
        user_metadata: { name: u.name, role: u.role },
      });
      if (created.error) throw new Error(`createUser ${u.email}: ${created.error.message}`);
      uid = created.data.user.id;
    }
    idOf[u.key] = uid;

    const coords = jitter(USERS.indexOf(u) + 1);
    const row = {
      id: uid,
      email: u.email,
      name: u.name,
      role: u.role,
      approved: u.approved,
      address: u.address,
      lat: coords.lat,
      lng: coords.lng,
    };
    const { error: pErr } = await sb.from("profiles").upsert(row);
    if (pErr) throw new Error(`profiles ${u.email}: ${pErr.message}`);
    console.log(`✔ ${u.email.padEnd(30)} ${u.role}`);
  }
}

async function seedDonations() {
  const { count, error } = await sb.from("donations").select("id", { count: "exact" });
  if (error) throw error;
  if ((count ?? 0) > 0 && !process.env.FORCE_SEED) {
    console.log(`• donations already present (${count}) — skip (FORCE_SEED=1 to force)`);
    return;
  }
  const rows = D.map(
    ([
      title, description, category, isVeg, servings, kg,
      packedH, shelfH, status, donorIdx, ngoIdx, volIdx, createdH,
    ], i) => {
      const donor = USERS[donorIdx];
      const ngo = ngoIdx != null ? USERS[ngoIdx] : null;
      const vol = volIdx != null ? USERS[volIdx] : null;
      return {
        title,
        description,
        category,
        isVeg,
        servings,
        kg,
        packedAt: t(packedH),
        bestBefore: new Date(new Date(t(packedH)).getTime() + shelfH * H).toISOString(),
        address: donor.address,
        ...jitter(i + 11),
        photoUrl: null,
        donorId: idOf[donor.key],
        donorName: donor.name,
        ngoId: ngo ? idOf[ngo.key] : null,
        ngoName: ngo ? ngo.name : null,
        volunteerId: vol ? idOf[vol.key] : null,
        volunteerName: vol ? vol.name : null,
        status,
        createdAt: t(createdH),
      };
    }
  );
  const { error: dErr } = await sb.from("donations").insert(rows);
  if (dErr) throw new Error(`donations: ${dErr.message}`);
  console.log(`✔ ${rows.length} donations`);
}

async function seedNotifications() {
  const rows = [
    { userId: idOf.u_ngo_demo, title: "New donation nearby", body: "Annapurna Mess posted “Veg biryani — 3 trays” (45 servings).", createdAt: t(3) },
    { userId: idOf.u_ngo_demo, title: "New donation nearby", body: "Nandi Caterers posted “Wedding buffet leftovers” (80 servings).", createdAt: t(2) },
    { userId: idOf.u_vol_demo, title: "New pickup task", body: "Evening juice batch claimed by Akshaya Foundation — accept pickup.", createdAt: t(4) },
    { userId: idOf.u_donor_demo, title: "🏆 100 meals saved", body: "Your kitchen has now saved 100+ meals via FoodBridge.", read: true, createdAt: t(26) },
  ];
  const { error } = await sb.from("notifications").insert(rows);
  if (error) throw new Error(`notifications: ${error.message}`);
  console.log("✔ notifications");
}

async function ensureBucketAlready() {
  const { error } = await sb.storage.createBucket("donation-photos", { public: true });
  if (error && !`${error.message}`.includes("exists")) console.log(`• storage: ${error.message}`);
  else console.log("✔ storage bucket donation-photos");
}

try {
  console.log("FoodBridge → seeding Supabase…");
  await ensureBucketAlready();
  await upsertUsers();
  await seedDonations();
  await seedNotifications();
  console.log("\n🎉 Done. Log in with:");
  console.log("  donor@demo.foodbridge / demo1234   (donor)");
  console.log("  ngo@demo.foodbridge / demo1234     (NGO)");
  console.log("  volunteer@demo.foodbridge / demo1234 (volunteer)");
  console.log("  admin@demo.foodbridge / demo1234   (admin)");
} catch (e) {
  console.error("✖ Seed failed:", e.message);
  process.exit(1);
}
