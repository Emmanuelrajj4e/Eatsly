# Eatsly — pitch script (~3 min)

**Tagline: “Every plate, on time.” · Sample product for a hackathon demo · #EveryPlateOnTime**

## 0:00 — The problem (30 s)

Every evening, hotels, wedding halls, hostels and canteens in Hyderabad have safe,
edible food left over. The same evening, a community kitchen a few kilometres away
worries about the second serving line. Nothing is wrong with the food — the problem is
that **no one can tell whether it is still safe by the time it arrives**. Rescue becomes
a guess about time, and NGOs stop guessing after being late once.

## 0:30 — The one rule that fixes it (20 s)

Every surplus batch gets a **started safe-time clock** the moment it is posted:
hot cooked 4 h, sweets 12 h, packaged 24 h, produce 48 h. Claims are accepted only when
the volunteer’s ETA lands **at least 10 minutes before** the window ends — and under 20
minutes left, posting is blocked entirely. Safety is enforced by arithmetic, not trust.

## 0:50 — Demo beat 1: the board (30 s)

First the landing hero — “No food should expire before it finds a plate” — with a live
**Next to spoil** ring. Then the live board: filters, nearest NGO + ETA on every card,
and the claim dialog that **disables NGOs that would arrive too late, with the reason
shown**. Claim one: the card flips to Claimed with a live tracker.

## 1:20 — Demo beat 2: the signature page (45 s)

Open **Track ETS-2041**. The ride is simulated but behaves like a delivery app:
stages with timestamps (Posted → Claimed → Volunteer assigned → Picked up → In transit
→ Delivered), a map where the dashed route turns solid under a moving volunteer marker,
an ETA countdown, a volunteer card with a **masked phone**, and **proof of delivery** at
the end. Press the demo controls: **5x or 20x** speed to fast-forward the ride — the
boards, drawers and impact numbers all move with it. Click **Copy tracking link** —
the point for donors: “watch your food actually reach someone.”

## 2:05 — Demo beat 3: nutrition (30 s)

Switch to the **Plate Builder**. Nutrition is not an afterthought node on this app —
the brief is that **“Nutrition is not a luxury. It is the first lesson.”** Board cards
carry nutrition tags that deep-link into real nutrient cards; the builder turns a thali
into bars and a **plain-language note — never a score** — with ICMR-NIN cited,
“general information, not medical advice” on the page.

## 2:35 — Close (20 s)

The monochrome design is deliberate: **a clock, not a colour scheme** — urgency is a
striped inverting card, safety is arithmetic, and everything is auditable in black and
white. Every screen carries sample data, bracketed placeholders are the only things we
do not claim. **Surplus is only waste if nobody is watching the clock.**

## What a real build adds

Push notifications to regional volunteers, actual volunteer GPS (the TrackingService
interface exists precisely so the simulation can be swapped out), NGO verification, and
photo credits where IMAGES_NEEDED.md lists them.
