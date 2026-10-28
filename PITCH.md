# Annadaan — 3-minute pitch

**Tagline: “Good food has a clock.” · Sample product for a hackathon demo · #AnnadaanClock**

## The problem (30 s)

In any Indian city, hotels, wedding halls, hostels and canteens throw away tons of safe,
edible food every day — not because nobody wants it, but because **no one can tell if it
is still safe by the time it reaches a serving line**. Every rescue call is a guess about
time, and volunteers stop guessing after being late once.

## The idea (30 s)

Annadaan puts a **transparent, honest clock on every meal**:

- Hot cooked food **4 h**, sweets & dry **12 h**, packaged **24 h**, produce **48 h**.
- NGOs can claim only if their pickup **ETA lands ≥ 10 minutes** before the window ends —
  the UI disables NGO options that cannot make it and says exactly why.
- The whole city sees the same live board: countdowns, routes, one tracker per meal.

## Why platforms with drivers didn’t do this (30 s)

Food rescue fails on *promise* mismatch, not on logistics. Rigid delivery networks
promise timings that cooked food cannot keep. Annadaan flips the contract: **the clock
selects who may claim what**, so no rescue run is doomed from the minute it starts.
Volunteers in the demo claim runs that arrive in time, and impact counts only when a
delivery is actually marked.

## Live demo beats (90 s)

1. **Home** — the “Next to spoil” ring ticking down, counters animating in, city grid.
2. **Live board** — sort by time left; show the amber→red countdown bar; open a claim
   dialog, watch an NGO get disabled (“arrives 9 min after cutoff”); claim one.
3. **Tracker** — “Mark picked up” on the board (or the For-NGOs page) and watch the
   impact dashboard’s *servings waiting* and *kg saved* move live.
4. **Post surplus** — post a batch with a really-late cook time and show the honest
   **“too late to post under 20 minutes”** block, then post a fresh batch that lands on
   the board instantly.
5. **For NGOs** — onboard “Madhapur Roti Bank” in 20 seconds; its diamond appears on the
   map and in claim dialogs.

## What the demo is honest about

- All listings, NGOs, names and impact numbers are **sample data**, clearly labelled.
- Bracketed footer items (`[Registration number]`, address, contacts) are placeholders —
  no invented certifications.
- The store is a service-layer demo (`services/*` + localStorage); swapping in a real
  backend touches only that folder.

## Ask

A pilot city grant of three months: seed 50 donor kitchens, 10 NGOs, 20 volunteer rides
per week in Hyderabad — measured by the same three numbers the site already computes live:
**meals rescued, servings waiting, kg saved from the bin.**
