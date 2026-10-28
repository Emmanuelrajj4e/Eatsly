import type { Metadata } from "next";
import { QUOTE_NUTRITION } from "@/config/brand";
import { NutrientExplorer } from "@/components/nutrition/explorer";
import { PlateBuilder } from "@/components/nutrition/plate-builder";
import { Card } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Nutrition hub",
};

/**
 * Nutrition hub: hero line, nutrient explorer, Plate Builder, and the
 * "why timing matters" explainer. Board tags deep-link into the explorer
 * cards by anchor.
 */
export default function NutritionPage() {
  return (
    <>
      <section className="mx-auto max-w-6xl px-4 pb-10 pt-12">
        <p className="font-mono text-xs uppercase tracking-widest text-muted">Nutrition hub</p>
        <h1 className="mt-3 max-w-3xl font-quote text-4xl italic leading-tight md:text-6xl">
          {QUOTE_NUTRITION}
        </h1>
        <p className="mt-4 max-w-xl text-lg text-muted">
          What a plate should do for the person eating it — and why the safe window
          decides which plates qualify.
        </p>
      </section>

      <section aria-labelledby="explore-heading" className="mx-auto max-w-6xl px-4 pb-14">
        <div className="border-b border-line pb-4">
          <h2 id="explore-heading" className="font-mono text-xs uppercase tracking-widest text-muted">
            Nutrient explorer
          </h2>
          <p className="mt-2 max-w-xl text-sm text-muted">
            Tap a group, open a card. Every board listing’s nutrition tag links straight
            to the matching card here.
          </p>
        </div>
        <div className="mt-6">
          <NutrientExplorer />
        </div>
      </section>

      <section aria-labelledby="plate-heading" className="border-y border-line bg-surface py-14">
        <div className="mx-auto max-w-6xl px-4">
          <div className="border-b border-line pb-4">
            <h2 id="plate-heading" className="font-display text-3xl font-extrabold tracking-tight">
              Build a plate
            </h2>
            <p className="mt-2 max-w-xl text-sm text-muted">
              Tap foods onto a thali and watch the bars respond. You get a plain-language
              note, never a score — nutrition is a practice, not a leaderboard.
            </p>
          </div>
          <div className="mt-6">
            <PlateBuilder />
          </div>
        </div>
      </section>

      <section aria-labelledby="timing-heading" className="mx-auto max-w-6xl px-4 pb-16 pt-14">
        <div className="border-b border-line pb-4">
          <h2 id="timing-heading" className="font-display text-3xl font-extrabold tracking-tight">
            Why timing matters
          </h2>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <Card>
            <h3 className="font-display text-lg font-semibold">Food loses value with the clock</h3>
            <p className="mt-2 text-sm leading-7 text-muted">
              Cooked food is safest within hours of going cold. The board treats every
              listing like a battery: a hot batch gets a 4-hour safe window, sweets and
              packaged food get longer, fresh produce gets the longest.
            </p>
          </Card>
          <Card>
            <h3 className="font-display text-lg font-semibold">Distance eats the margin</h3>
            <p className="mt-2 text-sm leading-7 text-muted">
              An NGO 9 km away is not the same as one 2 km from the donor. Claims are
              allowed only when the volunteer’s ETA lands at least 10 minutes before the
              window ends — so the food arrives with room to spare.
            </p>
          </Card>
          <Card>
            <h3 className="font-display text-lg font-semibold">Nutrition needs time to count</h3>
            <p className="mt-2 text-sm leading-7 text-muted">
              Food served within its window keeps the nutrients the plate above: iron
              from greens, protein from dal, calcium from milk and curd. When a window
              closes, the listing leaves the board — the plate goes to waste, not to a
              risk.
            </p>
          </Card>
        </div>
      </section>
    </>
  );
}
