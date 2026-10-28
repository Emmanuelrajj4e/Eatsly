import Link from "next/link";
import data from "@/data/landing.json";
import { ArrowRight, BookOpen, Clock4, Radar, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * e. Why Eatsly, condensed (full version lives at /why):
 * opening statement + four gaps as colour-coded cards + link.
 */
const GAP_ICONS = {
  timing: Clock4,
  matching: Radar,
  trust: ShieldCheck,
  awareness: BookOpen,
} as const;

const CARD_TONES = {
  red: "border-red/30 bg-red-tint",
  yellow: "border-yellow/50 bg-yellow-tint",
  blue: "border-blue/30 bg-blue-tint",
  green: "border-green/30 bg-green-tint",
} as const;

const DOT_TONES = {
  red: "bg-red",
  yellow: "bg-yellow-shade",
  blue: "bg-blue",
  green: "bg-green",
} as const;

export function WhyCondensed() {
  return (
    <section aria-labelledby="why-title" className="mx-auto max-w-6xl px-4">
      <div className="grid gap-8 lg:grid-cols-[280px_minmax(0,1fr)]">
        <div>
          <h2 id="why-title" className="font-display text-3xl font-bold text-ink">
            Why Eatsly
          </h2>
          <p className="mt-3 font-quote text-xl italic leading-snug text-ink">
            The food exists. What is missing is time, trust and coordination.
          </p>
          <Link
            href="/why"
            className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-btn text-sm font-semibold text-orange hover:underline hover:underline-offset-4"
          >
            See the full breakdown
            <ArrowRight className="h-4 w-4" strokeWidth={2} />
          </Link>
        </div>

        <ul className="grid gap-3 sm:grid-cols-2">
          {data.gaps.map((gap) => {
            const Icon = GAP_ICONS[gap.key as keyof typeof GAP_ICONS];
            return (
              <li
                key={gap.key}
                className={cn("rounded-card border p-4", CARD_TONES[gap.tone as keyof typeof CARD_TONES])}
              >
                <p className="flex items-center gap-2 font-display text-base font-bold text-ink">
                  {Icon && <Icon className="h-4 w-4 shrink-0" strokeWidth={2} />}
                  <span
                    className={cn("h-2.5 w-2.5 rounded-full", DOT_TONES[gap.tone as keyof typeof DOT_TONES])}
                    aria-hidden="true"
                  />
                  {gap.title}
                </p>
                <p className="mt-2 text-sm leading-6 text-muted">{gap.problem}</p>
                <p className="mt-2 text-sm font-semibold leading-6 text-ink">
                  <ArrowRight className="mr-1 inline h-3.5 w-3.5" strokeWidth={2.5} aria-hidden="true" />
                  {gap.fix}
                </p>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
