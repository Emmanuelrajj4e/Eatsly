# Eatsly — pitch script (~3 min)

**Tagline: “Every plate, on time.” · Sample product for a hackathon demo · #EveryPlateOnTime**

## 0:00 — The problem (30 s)

Every evening, hotels, wedding halls, hostels and canteens in Hyderabad have safe,
edible food left over. The same evening, a community kitchen a few kilometres away
worries about its second serving line. Nothing is wrong with the food — the problem is
that **no one can tell whether it is still safe by the time it arrives**. Rescue becomes
a guess about time, and NGOs stop guessing after being late once.

## 0:30 — The one rule that fixes it (20 s)

Every surplus batch gets a **started safe-time clock** the moment it is posted:
hot cooked 4 h, sweets 12 h, packaged 24 h, produce 48 h. Claims are accepted only when
the NGO pickup ETA lands **at least 10 minutes before** the window ends — and with under
20 minutes left, posting is blocked entirely. Safety is enforced by arithmetic, not trust.

## 0:50 — Demo beat 1: quote, cards, board (35 s)

Open the landing: “No food should expire before it finds a plate.” — the yellow highlight
is the product promise. Below it, role cards in orange, green and blue. Then the live
board: countdown cards in green/yellow/red **always with a text label**, filters, and the
claim dialog that **disables NGOs that would arrive too late — with the reason shown**.
Claim one: the card flips to Claimed with a live tracker. The map is a real city map —
orange food pins, green NGO diamonds, blue claimed markers.

## 1:25 — Demo beat 2: the signature page (45 s)

Open **Track ETS-2041**. The ride is simulated but behaves like a delivery app:
stages with timestamps (Posted → Claimed → Volunteer assigned → Picked up → In transit →
Delivered), a LIVE badge, and a colourful map where the **green travelled line grows under
a pulsing blue volunteer marker**, the dashed blue remainder shrinking before it. A
volunteer card with a **masked phone**, then a proof-of-delivery card with the green
**Delivered** stamp. Demo controls: **5x or 20x** speed — the board, drawer and impact
numbers all move with it. Donors get the same page linked from
**“Track this donation”** right after posting.

## 2:10 — Demo beat 3: nutrition (25 s)

Switch to the **Plate Builder**: a colourful thali, live bars in the nutrient-group
colours, and a **plain-language note — never a score** — “Nutrition is not a luxury.
It is the first lesson.” Board cards carry nutrient tags (carb yellow, protein orange,
fibre green, vitamins blue) that deep-link into real nutrient cards; ICMR-NIN is cited,
“general information, not medical advice” on the page.

## 2:35 — Close (25 s)

The colour is deliberate — **the system, not decoration**: roles have colours, food
states have colours, and every colour rides with a label so nothing depends on hue.
Everything runs on sample data with place-holder brackets exactly where real facts
belong. **Surplus is only waste if nobody is watching the clock.**

## What a real build adds

Push notifications to regional volunteers, actual volunteer GPS (the
`TrackingService.subscribe(id, cb)` interface exists precisely so the simulation can be
swapped out), NGO verification against `[Registration number]`, and photo credits where
IMAGES_NEEDED.md lists them.
