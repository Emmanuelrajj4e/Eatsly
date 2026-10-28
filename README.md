# Eatsly — every plate, on time

**Eatsly** is a live food-rescue platform, built monochrome. Donors post surplus with a
started safe-time clock; NGOs claim a run only when a volunteer can reach it **at least
10 minutes before** the window ends; tracking shows every stage (posted → claimed →
volunteer assigned → picked up → in transit → delivered) with a moving marker, an ETA
countdown and proof of delivery. A nutrition hub explains what the rescued plate should
do for the person eating it.

> Everything on the site is **sample data** for a hackathon demo. Bracketed items
> (`[Registration number]`, address, contact) are deliberate placeholders for legal
> details. No registrations, certifications or tax claims are implied. Track quotes,
> stories and statistics carry their own source notes on the page.

## Run it

```bash
npm install
npm run dev      # http://localhost:3000
```

Production check:

```bash
npm run build    # TypeScript + prerender (all routes static; /track/[id] partial-prerender)
npm run start    # serve the production build
npm run lint     # eslint (0 problems expected)
```

No API keys, no backend, no database. Demo state persists in `localStorage` and syncs
across browser tabs via `BroadcastChannel`.

## Design system — strictly black and white

- Achromatic only: `#000`, `#fff`, and ink at opacities (hairlines 12%, muted 60%).
  State is encoded by **form**, never hue: URGENT = inverted black card + striped bar;
  SOON = 2px border; claimed = ring + check label; expired = dotted border + 50% opacity.
- Typography (installed offline via `@fontsource`): **Syne** (display), **Instrument
  Serif** (quotes), **Hanken Grotesk** (body), **IBM Plex Mono** (labels, countdowns,
  IDs — tabular numerals).
- Radius: cards/buttons 0–2px. No gradients, no drop shadows, no emoji. Icons are
  `lucide-react` or inline SVG at 1.5px stroke, monochrome.
- Full-black sections create rhythm; one orchestrated hero sequence on load; marquee
  ticker on the home strip; `prefers-reduced-motion` collapses animation.
- Map: Leaflet + OpenStreetMap tiles rendered grayscale by CSS, black/white custom
  markers; if tiles fail it swaps to the stylised **SVG Hyderabad fallback map**. The
  fallback and all markers are keyboard-operable.

## The demo lap

1. **Home `/`** — live ticker strip; hero quote with an orchestrated sequence; live
   “Next to spoil” ring + mini run preview; who it serves; full-black mission; animated
   sample impact counters; Post→Claim→Track→Serve; **embedded live tracking preview**
   (speed it up / reset); nutrition teaser; sourced “why it matters” editorial; city
   table; sample voices; FAQ; final CTA.
2. **Live board `/board`** — filters (All / Under 1 hour / Veg / Packaged / High
   protein), cards sorted by time left with countdown bars, diet markers, kg estimate,
   nutrition tags deep-linking into `/nutrition#nut-*`. Claim dialog lists NGOs by
   distance — **too-late NGOs are disabled with the reason shown**. Claimed cards carry
   the tracker + **Track live** drawer.
3. **Live tracking `/track/[id]`** — the signature page: stages, moving route marker
   (dashed→solid), LIVE pulsing, ETA + distance left, volunteer card with masked phone,
   proof of delivery, copy-link, and **demo controls (1x / 5x / 20x + reset)** in a
   small panel. Featured run: **ETS-2041**.
4. **Post surplus `/post`** — Zod-validated form (dish, donor, area, type, servings,
   last-cooked, veg/non-veg, nutrition tags) with live preview: safe-until clock,
   countdown bar, estimated kg, nearest NGO + ETA. **Blocked under 20 minutes** of safe
   window left, with the reason on screen.
5. **Nutrition `/nutrition`** — nutrient explorer (macro/micro tabs, ICMR-NIN cited,
   “general information, not medical advice”), the **Plate Builder** (16 Indian foods on
   a thali, live bars, plain-language notes — never a score), and the why-timing-matters
   explainer.
6. **Impact `/impact`** — animated counters + 7-day monochrome chart (hatched today
   bar) that move live as runs are claimed and delivered.
7. **NGOs & volunteers `/ngo`** — active runs with clocks, pickup/delivery marking,
   onboarding card that really joins the network (new diamond appears on map + dialogs),
   and its own tracking drawer.

## Architecture

- `services/` — the only state layer (swap for an API without touching components):
  `listings.ts` (seed derivation + localStorage overrides + claims/progress/posts),
  `tracking.ts` (TrackingService: `get/subscribe(id, cb)` + simulation engine with
  speed multiplier and reset), `impact.ts`, `ngos.ts`, `geo.ts` (windows, ETA, map
  projection), `storage.ts` (localStorage + BroadcastChannel helpers).
- `data/` — seed JSON: listings (with `minutesAgo` offsets so countdowns are always
  fresh on load), areas, ngos, impact baselines, nutrition, city.
- `hooks/` — `use-ticker` (ONE shared 1 Hz clock via `useSyncExternalStore`), `use-board`
  (rAF-deferred first read: `Date.now()` is not allowed during prerender), `use-count-up`.
- `components/` — `ui/` kit (Button, Card, Dialog, Toast, Tabs, Accordion, DietMarker,
  CountdownBar, Counter, Chip), `board/` (view, cards, claim dialog, Leaflet map +
  SVG fallback, tracker, drawer), `track/` (panel, timeline, map, demo controls),
  `nutrition/`, `post/`, `impact/`, `ngo/`, `landing/`.
- Fonts ship from `@fontsource/*` (offline, no runtime Google Fonts).

## Demo keys

Demo state lives in `localStorage` (`eatsly:overrides:v1`, `eatsly:posts:v1`,
`eatsly:ngos:v1`) with channels `eatsly` / `eatsly-ngos`; theme key `eatsly-theme`.
Clear those to reseed the demo.

## Images

All photography ships as monochrome pattern placeholder blocks so the layout works
today. To drop real photos in, see **IMAGES_NEEDED.md** (filenames, subjects,
orientations, search terms, licensing notes for credits).

## Quality bar

Mobile-first (360px, no horizontal scroll), ≥44px touch targets, visible 2px focus
rings with a white gap, labels on every input, `aria-live` on toasts/board/tracking
announcements, keyboard-operable tabs/accordions/dialogs/map pins, ≥4.5:1 contrast in
both themes, every screen opens with sample data, and a strict no-colour audit across
CSS, SVG, chart code and meta theme-color.
