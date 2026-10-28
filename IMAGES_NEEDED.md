# Images needed

All photography currently renders as a monochrome pattern placeholder block
(`components/landing/pattern-image.tsx`) with a caption, so the layout never looks
broken. Drop the real files into `public/images/` using the exact names below, keep
them grayscale (the site also applies a grayscale CSS treatment), and add a credit line
in the footer for any licence that requires attribution.

Suggested licence sources: Unsplash (Unsplash Licence), Pexels (Pexels Licence). Verify
the licence on each photo page yourself before committing — do not hotlink files.

| # | File name | Subject | Orientation | Suggested search terms |
|---|-----------|---------|-------------|------------------------|
| 1 | `hero-hands-sharing-meal.jpg` | Two hands passing a steel plate of food | Landscape 4:3 | "hands giving food plate charity" |
| 2 | `community-kitchen.jpg` | Community kitchen with large pots and volunteers | Landscape 3:2 | "community kitchen serving volunteers" |
| 3 | `volunteer-delivery-scooter.jpg` | Volunteer carrying food bag on a scooter | Landscape 3:2 | "scooter delivery food bag street india" |
| 4 | `market-fresh-produce.jpg` | Fresh vegetables at a wholesale market | Landscape 4:3 | "indian wholesale vegetable market" |
| 5 | `thali-closeup.jpg` | Indian thali plate, top-down | Square or 4:3 | "indian thali top view" |
| 6 | `ngo-serving-line.jpg` | Serving line where plates are filled | Landscape 3:2 | "food distribution serving line ngo" |
| 7 | `bakery-surplus-bread.jpg` | Trays of bread and buns | Landscape 4:3 | "bakery bread trays unsold" |
| 8 | `wedding-hall-buffet.jpg` | Wedding/buffet trays after an event | Landscape 3:2 | "wedding banquet buffet trays leftover" |

Placement notes:

- `hero-hands-sharing-meal.jpg` — landing hero (right column, `4 / 3`).
- `community-kitchen.jpg` — reserved for the stories section band.
- `volunteer-delivery-scooter.jpg` — How it works → “Track” step.
- `market-fresh-produce.jpg` — How it works → “Claim” step.
- `thali-closeup.jpg` — Nutrition hub, above the Plate Builder.
- `ngo-serving-line.jpg` — How it works → “Serve” step.
- `bakery-surplus-bread.jpg` — Post surplus page side note.
- `wedding-hall-buffet.jpg` — How it works → “Post” step.

When a file lands: swap the matching `PatternImage` for an `<img>` with
`loading="lazy"` (eager only for the hero), fixed aspect ratio, `object-fit: cover`,
meaningful alt text, the `.photo` class, and a footer credit line if needed.
