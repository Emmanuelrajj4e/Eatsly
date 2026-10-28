import { BowlIcon, BuildingIcon, PinIcon } from "@/components/icons";
import { Tag } from "@/components/ui/chip";

const STEPS = [
  {
    n: "01",
    title: "Post surplus",
    icon: BowlIcon,
    body: "Wedding halls, canteens, bakeries and households list what's left with servings and a diet marker. Annadaan sets the safe window automatically — hot food 4 h, sweets 12 h, packaged 24 h, produce 48 h.",
  },
  {
    n: "02",
    title: "Claim in time",
    icon: BuildingIcon,
    body: "NGOs see every listing with a live countdown and can claim only if their pickup route lands at least 10 minutes before the window closes. No promises that food can't keep.",
  },
  {
    n: "03",
    title: "Collect & mark",
    icon: PinIcon,
    body: "A volunteer rides over with the route drawn, picks up, marks each step and the meal is served while it's still safe. Everyone sees the tracker move in real time.",
  },
];

/** The three-step sequence, numbered because it is an actual order. */
export function HowItWorks() {
  return (
    <section id="how" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-14">
      <div className="max-w-xl">
        <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
          How it works
        </h2>
        <p className="mt-2 text-muted">
          One board, one clock, three roles. The countdown decides who can claim what —
          nobody gambles with the cold chain.
        </p>
      </div>

      <ol className="mt-8 grid gap-4 md:grid-cols-3">
        {STEPS.map((s) => (
          <li key={s.n}>
            <div className="flex h-full flex-col rounded-card border border-line bg-surface p-5">
              <div className="flex items-center justify-between">
                <span className="font-mono text-sm font-semibold text-leaf">{s.n}</span>
                <s.icon className="h-6 w-6 text-muted" />
              </div>
              <h3 className="mt-3 font-display text-xl font-semibold">{s.title}</h3>
              <p className="mt-2 text-sm leading-6 text-muted">{s.body}</p>
            </div>
          </li>
        ))}
      </ol>

      <p className="mt-4 flex flex-wrap items-center gap-2 text-xs text-muted">
        <Tag>hot · 4 h</Tag>
        <Tag>sweets & dry · 12 h</Tag>
        <Tag>packaged · 24 h</Tag>
        <Tag>produce · 48 h</Tag>
        <span className="ml-1">Safe-window rules, applied automatically to every post.</span>
      </p>
    </section>
  );
}
