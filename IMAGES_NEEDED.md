# Images needed (Eatsly, colour edition)

Image licences **cannot be verified programmatically** in this environment, so no
photo has been downloaded or hotlinked. Until verified free-licence files
(Unsplash / Pexels licences) are placed here, every photo slot renders as a
**flat brand-tint placeholder block** (`components/landing/pattern-image.tsx`)
with a text label — never an invented URL.

## Files to add under `public/images/` (colour, no grayscale filters)

| Filename | Subject | Orientation / aspect | Search terms |
| --- | --- | --- | --- |
| `hero-hands-sharing-meal.jpg` | Hands passing a plate/plastic-wrapped meal | portrait-lean, 4:3.4 | "hands sharing meal", "akash patel food bank", "charity meal hands" |
| `community-kitchen.jpg` | Community kitchen or mess line, steam visible | landscape, 3:2 | "community kitchen India", "langar kitchen", "m ess cooking" |
| `volunteer-delivery-scooter.jpg` | Volunteer rider on a scooter with a carry box | landscape, 3:2 | "delivery scooter box", "food delivery volunteer India" |
| `market-fresh-produce.jpg` | Baskets of fresh vegetables at an Indian market | landscape, 3:2 | "india vegetable market baskets", "mandi produce" |
| `thali-closeup.jpg` | Indian thali plate close-up | landscape, 3:2 | "thali closeup", "indian meal plate top view" |
| `ngo-serving-line.jpg` | NGO kitchen serving bowls down a table | landscape, 3:2 | "ngo food serving line India", "soup kitchen serving" |
| `bakery-surplus-bread.jpg` | Trays of surplus bread and pastries | landscape, 3:2 | "electric bakery trays bread", "bakery unsold bread" |
| `wedding-hall-buffet.jpg` | Buffet trays in a wedding/function hall | landscape, 3:2 | "wedding buffet trays", "function hall catering India" |

## Where each is used

- Hero (c): hero-hands-sharing-meal
- How it works (g): wedding-hall-buffet → market-fresh-produce → volunteer-delivery-scooter → ngo-serving-line
- FAQ / nutrition sections currently use tint placeholders only.

## Rules when adding them

1. Only verified free-licence images; record author + licence URL in the footer
   credit line (placeholder already reserved there).
2. Real colour photography, never grayscale.
3. `object-fit: cover` with the aspect ratios above; lazy-load everything except
   the hero (preload hero only).
4. Prefer hands, plates, kitchens, streets; avoid identifiable close-ups of
   children.
5. Alt text should describe the action, not the brand.

Placeholders are intentional and visible until then — the UI never fakes URLs.
