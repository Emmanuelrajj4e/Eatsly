import { Tag } from "@/components/ui/chip";

const STORIES = [
  {
    quote:
      "Fifty trays of pulao were ready for the bin after our event. Someone claimed them in eight minutes from the board — the serving lines were still going.",
    name: "Isha",
    role: "donor, function hall kitchen",
  },
  {
    quote:
      "The clock tells me which pickup I can actually make. Before Annadaan I refused half the calls because I couldn't tell if the food would survive the ride.",
    name: "Farhat",
    role: "NGO coordinator",
  },
  {
    quote:
      "Route drawn on the map, pickup to NGO in twenty-two minutes. I know exactly when I'm the reason a meal saved instead of spoiled.",
    name: "Venkatesh",
    role: "volunteer, bicycle pickup",
  },
];

/** Short, first-name-only quotes. Clearly marked as sample stories. */
export function Stories() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-14" aria-label="Stories">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
          People on the clock
        </h2>
        <Tag>sample stories</Tag>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {STORIES.map((s) => (
          <figure
            key={s.name}
            className="flex h-full flex-col rounded-card border border-line bg-surface p-5"
          >
            <blockquote className="flex-1 text-[15px] leading-7 text-foreground">
              “{s.quote}”
            </blockquote>
            <figcaption className="mt-4 font-mono text-xs uppercase tracking-wide text-muted">
              {s.name} — {s.role}
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
