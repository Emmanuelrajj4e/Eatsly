import Link from "next/link";
import data from "@/data/landing.json";
import {
  Bike,
  Building2,
  Croissant,
  HeartHandshake,
  Landmark,
  UtensilsCrossed,
} from "lucide-react";
import { cn } from "@/lib/utils";

/** d. "Built for" row of coloured round chips (icon + label, tint fill). */
const ICONS = {
  utensils: UtensilsCrossed,
  landmark: Landmark,
  building: Building2,
  croissant: Croissant,
  heart: HeartHandshake,
  bike: Bike,
} as const;

const CHIP_TONES = {
  orange: "bg-orange-tint text-ink",
  green: "bg-green-tint text-ink",
  blue: "bg-blue-tint text-ink",
  yellow: "bg-yellow-tint text-ink",
  red: "bg-red-tint text-ink",
} as const;

const ICON_TONES = {
  orange: "text-orange",
  green: "text-green",
  blue: "text-blue",
  yellow: "text-yellow-shade",
  red: "text-red",
} as const;

export function BuiltFor() {
  return (
    <section aria-label="Who Eatsly is built for" className="mx-auto max-w-6xl px-4">
      <h2 className="font-mono text-xs uppercase tracking-widest text-muted">Built for</h2>
      <ul className="mt-4 flex flex-wrap gap-2.5">
        {data.builtFor.map((chip) => {
          const Icon = ICONS[chip.icon as keyof typeof ICONS];
          return (
            <li key={chip.label}>
              <Link
                href="/start"
                className={cn(
                  "inline-flex min-h-11 items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-transform hover:-translate-y-0.5",
                  CHIP_TONES[chip.tone as keyof typeof CHIP_TONES],
                )}
              >
                {Icon && <Icon className={cn("h-4 w-4", ICON_TONES[chip.tone as keyof typeof ICON_TONES])} strokeWidth={2} />}
                {chip.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
