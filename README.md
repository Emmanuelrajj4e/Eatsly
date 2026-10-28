# Eatsly — every plate, on time

A professional, simple, **colourful**, interactive food-rescue demo for a
hackathon. Surplus food is posted with a **live food-safety clock**, claimed by an
NGO whose ETA is checked against that clock, carried by a volunteer, and tracked
live until it is served. Built to run with **zero backend** on realistic sample
data, and structured so an API can drop in behind the service layer.

> All data is sample data. No section invented statistics, users, registrations
> or photo URLs; placeholders are marked in brackets or labelled *sample*.

---

## Run it

```bash
npm install
npm run dev      # http://localhost:3000
```

Production build (what CI runs):

```bash
npm run build && npm run lint && npm run start
```

Stack: **Next.js 16 (App Router) · TypeScript · Tailwind CSS v4 · lucide-react ·
Leaflet · zod**. Fonts are bundled offline via `@fontsource` — **Sora** (headings),
**Instrument Serif italic** (quotes), **Figtree** (body), **JetBrains Mono**
(numbers, countdowns, IDs). If Sora fails to load for the two static
`public/logo*.svg` files, they fall back to the nearest system sans; the React
`<Logo/>` always renders the bundled Sora.

---

## The demo lap (2 minutes)

1. **Landing `/`** — rotating announcement bar, quote hero with the yellow
   highlight, built-for chips, the four gaps, role cards, how-it-works,
   embedded **live tracking demo** (speed 1x/5x/20x or enter any ID), nutrition
   teaser, animated impact counters, three voices, FAQ, final CTA.
2. **`/start`** — pick Donor / NGO / Volunteer, type a first name. *Demo sign-in,
   no real accounts* (`eatsly-auth` in localStorage).
3. **`/post`** (donor) — the live preview shows safe-until time, time left, est.
   weight (0.38 kg per serving) and the nearest NGO; posting inside the last
   20 minutes is **blocked with a reason**; after posting you get a
   **Track this donation** button with the new tracking ID.
4. **`/board`** (NGO/volunteer) — countdown cards colour-coded green/yellow/red
   **with text labels too** (Fresh / Soon / Urgent), filter chips, the
   Leaflet map with orange pins / green NGO diamonds / blue claimed markers and
   the keyboard-operable focus. Click a card or pin → route + distance.
   **Claim dialog** disables any NGO whose ETA lands inside the 10-minute
   safety buffer, and says why.
5. **`/track/ETS-2041`** — vertical stage timeline (green done, blue pulsing
   current), moving blue volunteer marker over the colourful map (green
   travelled path, dashed blue remaining), masked phone, proof-of-delivery card
   with green **Delivered** stamp, copy-link. Board rows open the same view in a
   drawer.
6. **`/pickups`** (volunteer + NGO) — claimed runs with stage buttons plus the
   rider onboarding card.
7. **`/nutrition`** — tabs, colour-coded nutrient cards, Plate Builder with the
   16-Indian-food thali and plain-language notes (ICMR-NIN cited as reference).
8. **`/why`** — four gaps, the interactive **Without / With** toggle, principles,
   roadmap (marked *not shipped*), visible `[add verified statistic and source]`
   placeholders.
9. **`/impact`** — counters move as you claim/deliver; the 7-day chart's today
   bar is orange-hatched, previous days green.

Reset anytime with **Reset demo data** in the footer (clears
`eatsly:overrides:v1`, `eatsly:posts:v1`, `eatsly:ngos:v1`; keep your role), or
sign out by switching role in the header.

---

## Palette rules (the audit is enforced)

```
ink #12213F   muted #4A5873   page #F6F8F7   surface #ffffff   line #E3E8E5
orange #FF7A1A (tint #FFF0E3)   green #0B7A55 (tint #E6F6EF)
blue   #1F66E0 (tint #E8F1FF)   yellow #FFC531 (tint #FFF6D8)
red    #D13438 (tint #FDE9EA)
```

- Meaning is **never colour alone**: Urgent = red + label + striped bar,
  Claimed = blue + check label, diet = green/red symbol plus the word
  Veg/Non-veg, roles = orange/green/blue + icons + name.
- Text-on-solid contract: white on green/blue/red (≥4.5:1), **ink on orange**.
- Light theme only. Radius 14 px cards / 10 px buttons / fully-round chips.
  No gradients, heavy shadows or emoji; one soft shadow allowed for floating
  cards. Icons are lucide-react or inline SVG (no image hosts).

## Architecture notes

- **Services (`services/`)** read seed JSON and persist to localStorage:
  `listings`, `ngos`, `impact`, `tracking` (sim engine behind
  `TrackingService.subscribe(id, cb)` — a websocket/API can replace it),
  `auth` (role sign-in), `demo-reset`.
- **One shared ticking hook** (`hooks/use-ticker.ts`) drives every countdown;
  cards never run their own timers. Derived seed state begins inside
  `requestAnimationFrame` / subscriptions only, so prerendering stays honest.
- **Guards**: `/board` and `/pickups` are NGO+Volunteer only; `/post`'s
  dashboard is donor-friendly either way; the header shows Board/Pickups/Post
  links per role — the Board never appears for signed-out users or donors.
- Next 16 notes: dynamic `params` are consumed with `use()` inside
  `<Suspense>` (`/track/[id]` is a Partial-Prerender route); `Date.now()` and
  localStorage are never read during render.
- Maps: Leaflet + standard OpenStreetMap tiles (colour preserved — *no*
  grayscale filter) with brand `divIcon` markers; if tiles fail, a colour SVG
  fallback map of Hyderabad loads automatically.

## Files

- `README.md` — this file.
- `PITCH.md` — the 3-minute stage script.
- `IMAGES_NEEDED.md` — every missing photo (file, subject, aspect, search
  terms); until licence-verified files exist, photo slots show tint
  placeholders with a caption.

## Routes

| Route | Who | What |
| --- | --- | --- |
| `/` | everyone | landing (no board content) |
| `/start` | everyone | role chooser (demo sign-in) |
| `/post` | donor | validated post form + live preview |
| `/board` | ngo + volunteer | live board, map, claim flow, tracking drawer |
| `/track/[id]` | everyone | live tracking page |
| `/pickups` | ngo + volunteer | run desk + onboarding |
| `/nutrition` | everyone | explorer + Plate Builder + why-timing-matters |
| `/why` | everyone | four gaps, toggle, principles, roadmap |
| `/impact` | everyone | live counters + 7-day chart |

## Folders

```
app/            routes (layout = announcement bar, header, footer)
components/     board · track · nutrition · post · impact · pickups ·
                start · why · landing · ui (buttons, chips, dialog, toast…)
config/brand.ts one place for names, quotes, windows, ETA constants
services/       listings · tracking · auth · impact · ngos · geo · demo-reset
hooks/          use-ticker · use-auth · use-count-up
data/           listings + NGOs + nutrition + landing copy (seed JSON)
public/         logo-mark.svg · logo.svg · favicon.svg (+ photos later)
```
