# Annadaan — good food has a clock

**Annadaan** is a live food-rescue board for Hyderabad: donors post surplus food, NGOs
claim it against a hard food-safety countdown, and volunteers move each run from
*Claimed → Picked up → Delivered*. A listing can be claimed only while an NGO can still
reach it — pickup ETA must land **at least 10 minutes** before the safe window closes.

> Everything on the site is **sample data** for a hackathon demo. Bracketed items
> (`[Registration number]`, address, contact) are deliberate placeholders for legal
> details. No registrations, certifications or tax claims are implied.

## Run it

```bash
npm install
npm run dev      # http://localhost:3000
```

Production check:

```bash
npm run build    # verifies TypeScript + prerenders all routes
npm run start    # serves the production build
npm run lint     # eslint (0 problems expected)
```

No API keys, no backend, no database. Demo state persists in `localStorage` and syncs
across browser tabs via `BroadcastChannel`.

## The demo, in one lap

1. **Home `/`** — hero with a live “Next to spoil” countdown ring, three-step how-it-works, animated impact counters, city breakdown, sample stories, trust-heavy footer (placeholders bracketed).
2. **Live board `/board`** (*the signature feature*) — filters (All / Under 1 hour / Veg only / Packaged), cards sorted by time left with mono `HH:MM:SS` countdowns (bar degrades amber < 90 min, red < 30), nearest NGO + ETA per card, stylised Hyderabad map with pulsing pins and dashed routes. Tap **Claim food** → the dialog lists NGOs by distance; NGOs that would arrive too late are **disabled with the reason**. After claiming, the card shows the tracker; **Mark picked up / Mark delivered** advance it. Expired listings grey out with “Safe window closed”.
3. **Post surplus `/post`** — Zod-validated form with a **live preview** (safe-until clock, ticking countdown, estimated kg, nearest NGO + ETA). Posting is **blocked under 20 minutes** of safe window, with the explanation on screen.
4. **Impact `/impact`** — counters (meals rescued today, servings waiting now, kg saved) and a 7-day bar chart that **move the moment** a claim or delivery happens.
5. **For NGOs & volunteers `/network`** — active runs with clocks and the pickup/delivery flow, plus a one-card NGO onboarding (name, area, vehicle, contact) that really joins the network: the new diamond shows up on the map and in claim dialogs.

## Safe-window rules

| Food type | Window | Applied from |
| --- | --- | --- |
| Hot cooked | 4 h | last-cooked time |
| Sweets & dry | 12 h | last-cooked time |
| Packaged | 24 h | last-cooked time |
| Fresh produce | 48 h | last-cooked time |

Claim gate: `ETA ≤ (time left − 10 min)`. ETA assumes ~18 km/h city riding plus a
7-minute handover buffer. Weight is estimated at **0.38 kg per serving**.

## Architecture

- **Next.js 16 (App Router, `cacheComponents`/PPR)** + TypeScript + Tailwind CSS v4 + **zod**. Fonts via `next/font`: Bricolage Grotesque (display), Schibsted Grotesk (body), JetBrains Mono (numbers/labels).
- **Service layer is the API seam**: `services/listings.ts`, `services/ngos.ts`, `services/impact.ts`, `services/geo.ts` read seed JSON and persist mutations, so a real backend can replace the store without touching components.
- Demo state keys: `annadaan:overrides:v1` (claims/trackers), `annadaan:posts:v1` (posted listings), `annadaan:ngos:v1` (onboarded NGOs). Theme: `annadaan-theme`.
- Seed listings carry **relative offsets** (`minutesAgo`), so every session opens with freshly dramatic countdowns; user mutations persist.
- One shared **1 Hz ticker** (`hooks/use-ticker.ts`, `useSyncExternalStore`) drives every countdown — no per-card timers.

```
app/            routes (/ , /board , /post , /impact , /network , not-found)
components/
  ui/           Button, Chip, Card, Dialog, Toast, DietMarker
  home/         hero (live ring), how-it-works, impact strip, city, stories
  board/        board view, listing card, countdown bar, claim dialog, tracker, SVG map
  post/         form + live preview + safe-window rules
  impact/       dashboard (stat cards + 7-day SVG chart)
  network/      active runs + NGO onboarding
  icons.tsx     inline SVG icon set (no emoji icons anywhere)
config/brand.ts single place to rename the product + window/speed/buffer constants
data/           seed JSON (listings, NGOs, areas, city stats, impact baseline)
services/       listings, ngos, impact, geo, storage (localStorage + tab sync)
hooks/          use-ticker (shared clock), use-board, use-count-up
types/          domain models
```

## Accessibility & quality notes

- Mobile-first; every interactive target ≥ 44 px; no horizontal scroll at 360 px.
- Visible focus ring on every control, labels on every input, `role=dialog` trap with Escape, keyboard-operable map pins (Tab + Enter), `aria-live` regions for toasts and board counts, `prefers-reduced-motion` respected (counters land instantly, pulses stop).
- All interactive areas remain within 4.5:1 contrast in light **and** dark themes.
- Production build prerenders all routes; runtime reads (`Date.now()`, `localStorage`) are deferred behind mount effects so the static shell never disagrees with the client.
