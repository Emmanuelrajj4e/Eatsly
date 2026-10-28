# 🥗 FoodBridge — good food finds people, not the bin

Connects surplus-food donors (restaurants, hostels, caterers, event hosts,
individuals) with NGOs and volunteers, so extra food reaches someone's plate
instead of the landfill.

> **Demo-ready in 30 seconds** — run the app below and click
> *Enter as Donor / NGO / Volunteer / Admin*. No signup, no keys.

---

## Problem
Every event, hostel and restaurant produces untouched surplus food — most of
it is thrown away within hours. Meanwhile, NGOs serve people with less.
**The gap is logistics, not generosity**: matching is last-minute, who takes
what is unclear, and nothing is tracked.

## Solution — a three-tap rescue loop
1. **Donor posts** surplus in 60 s (photo, servings, veg/non-veg, packed time,
   safe-consume-by, pickup spot).
2. **Nearby NGOs get notified** and claim it from a live, distance-filtered
   feed with a map — one tap.
3. **A volunteer accepts the pickup**, delivers, and FoodBridge records the
   impact: **meals served, kg saved, CO₂ avoided**, plus a donor leaderboard.

Expired food auto-hides with a live countdown on every card, so nobody wastes
a trip. Admins approve NGOs and clear community reports.

## Try the full flow (90 seconds)
1. `npm run dev` → open [localhost:3000](http://localhost:3000)
2. `Enter as NGO` → **Browse** → claim a listing.
3. Log out → `Enter as Volunteer` → **My tasks** → accept pickup → open the
   listing → *I picked it up* → *Mark delivered*.
4. Log out → `Enter as Admin` → **Impact** (stats + leaderboard) and **Admin**
   (approve Care Seeds NGO, close the open report).

## Features
| | |
| --- | --- |
| Auth with roles | email/password + role select, admin approval gate for NGOs |
| Donation posting | Zod-validated, image upload, packed/expiry datetime |
| Live listing | filters: distance, food type, expiry window, quantity, search |
| Map view | Leaflet + OpenStreetMap tiles, colored pins, auto-fit — no API keys |
| Status tracker | available → claimed → picked up → delivered timeline |
| Expiry safety | countdown chips (amber < 4 h, red < 1 h), auto-hidden expired items |
| Impact dashboard | meals, kg, CO₂, deliveries, open listings, partner NGOs |
| Leaderboard | top donors with medals, trips and kg |
| Notifications | in-app bell: new-donations, claims, assignments, deliveries |
| Admin console | platform stats, NGO approve/block, reports queue |
| Design | warm green/orange theme, mobile-first, dark mode, subtle motion |

## Tech stack
- **Next.js 16** (App Router, Cache Components/PPR) + **TypeScript** + **Tailwind CSS v4**
- **Supabase** (Postgres + Auth + Storage + Realtime) — free tier, optional
- **Zod** for validation · **Leaflet** + OSM for maps · Vercel-ready

### Demo mode vs. Supabase (both first-class)
```
UI  ──▶ lib/data.ts ──┬── lib/supabase-data.ts   (set .env.local)
 (client)             └── lib/demo-store.ts ──▶ localStorage
                          (zero-setup demo, cross-tab realtime)
```
Every feature is written once against the `lib/data.ts` facade, so the app runs
with `lib/demo-store` when no keys exist, or Supabase when they do.

## Setup
```bash
npm install
npm run dev            # demo mode — no config needed
```

**Supabase mode** (free tier):
1. Create a project → copy URL + anon key from *Settings → API*.
2. `cp .env.example .env.local` and fill in
   `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   (+ `SUPABASE_SERVICE_ROLE_KEY` for seeding).
3. Run `supabase/migrations/0001_init.sql` in the SQL editor
   (schema + RLS on every table + storage bucket policies).
4. `npm run seed:supabase` — creates the four demo accounts, 9 seed users and
   20 donations.
5. Restart `npm run dev`; the app now talks to Supabase.

## Architecture
```
app/            routes (login, browse, donor/*, ngo/*, volunteer/*, admin, impact, donation/[id])
components/     UI kit (button/card/input/badge/toast), map, cards, tracker, shell, guards
lib/            data facade, demo store + seed, Supabase client, auth, schemas, geo, constants
types/          shared domain types (Profile, Donation, Notification, Report, ImpactStats)
supabase/       SQL migration with explicit RLS + storage policies
scripts/        seed.mjs (service-role seeder for a real backend)
```

### Row Level Security (summary)
- **profiles** — read own + admin, else only *approved* NGOs (needed for matching); insert/update own; admin approves NGOs.
- **donations** — selectable only if live (auto-hides expired), or you're the
  donor/claimed NGO/assigned volunteer, or admin; donors post; updates are
  role-scoped; donors delete own available listings.
- **notifications** — read own; inserts allowed for any authenticated user
  (system fan-out); admin cleanup.
- **reports** — reporters see their own, admins see all and resolve.
- **storage** — public read of `donation-photos`; writes confined to the
  uploader's own folder.

## Impact story
At demo time you'll see seeded totals from the demo dataset:
**235 meals served from 39.5 kg of food (≈ 99 kg CO₂ avoided)** — from just
five deliveries. Real deployments report the same per-city counters on the
landing page, live from the data layer. One rescued wedding tray is
20–40 meals; ten weddings a weekend is a neighborhood of dinners.

## Known TODOs (marked in code)
- **Address → map pin geocoding** (OpenStreetMap Nominatim) so post-form pins
  are automatic — currently demo center + jitter. (`components/donation-form.tsx`)
- **pg_cron** hourly job to flip expired listings in Supabase mode (client
  already auto-hides). (`supabase/migrations/0001_init.sql` footer)
- **Email notifications** (free tier via Resend/Supabase Edge) — in-app only now.
- **Google auth**, multilingual UI (EN/HI/TE), AI serving estimator, PWA — stretch items, intentionally not started.

## Scripts
| | |
| --- | --- |
| `npm run dev` | develop (demo mode unless env configured) |
| `npm run build` | production build (Cache Components + PPR) |
| `npm run seed:supabase` | seed demo accounts + 20 donations to Supabase |

Maps © [OpenStreetMap](https://www.openstreetmap.org/copyright) contributors
(dark tiles © CARTO). Built for a hackathon MVP — fork it and feed someone.
