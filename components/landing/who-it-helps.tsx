import Link from "next/link";
import data from "@/data/landing.json";
import { ArrowRight, Bike, Check, HeartHandshake, UtensilsCrossed } from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonStyles } from "@/components/ui/button";

/**
 * f. Who it helps: three role cards in orange, green and blue, each with
 * three plain benefits and a button that preselects that role in /start.
 */
const ROLE_ICONS = {
  donor: UtensilsCrossed,
  ngo: HeartHandshake,
  volunteer: Bike,
} as const;

const CARD_TONES = {
  orange: "border-orange/40 border-t-4",
  green: "border-green/40 border-t-4",
  blue: "border-blue/40 border-t-4",
} as const;

const BADGE_TONES = {
  orange: "bg-orange text-ink",
  green: "bg-green text-white",
  blue: "bg-blue text-white",
} as const;

const BTN_TONES = {
  donor: "primary",
  ngo: "green",
  volunteer: "blue",
} as const;

const ROLE_CTAS = {
  donor: "Donate food",
  ngo: "Join as an NGO",
  volunteer: "Start volunteering",
} as const;

export function WhoItHelps() {
  return (
    <section aria-labelledby="helps-title" className="mx-auto max-w-6xl px-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 id="helps-title" className="font-display text-3xl font-bold text-ink">
            Who it helps
          </h2>
          <p className="mt-2 max-w-xl text-muted">
            One run, three roles — each with a job that fits.
          </p>
        </div>
        <p className="font-mono text-xs uppercase tracking-widest text-muted">
          Pick a role to begin
        </p>
      </div>

      <ul className="mt-8 grid gap-4 md:grid-cols-3">
        {data.roles.map((role) => {
          const Icon = ROLE_ICONS[role.id as keyof typeof ROLE_ICONS];
          return (
            <li
              key={role.id}
              className={cn(
                "flex flex-col rounded-card border border-line bg-surface p-5",
                CARD_TONES[role.tone as keyof typeof CARD_TONES],
              )}
            >
              <div className="flex items-center gap-3">
                <span
                  className={cn(
                    "grid h-11 w-11 shrink-0 place-items-center rounded-xl",
                    BADGE_TONES[role.tone as keyof typeof BADGE_TONES],
                  )}
                  aria-hidden="true"
                >
                  {Icon && <Icon className="h-5 w-5" strokeWidth={2} />}
                </span>
                <h3 className="font-display text-lg font-bold">{role.name}</h3>
              </div>
              <p className="mt-3 font-quote text-lg italic leading-snug text-ink">{role.promise}</p>
              <ul className="mt-4 space-y-2 text-sm leading-6 text-muted">
                {role.benefits.map((b) => (
                  <li key={b} className="flex items-start gap-2">
                    <Check className="mt-1 h-4 w-4 shrink-0 text-green" strokeWidth={2.5} aria-hidden="true" />
                    {b}
                  </li>
                ))}
              </ul>
              <Link
                href={`/start?role=${role.id}`}
                className={cn(
                  buttonStyles(BTN_TONES[role.id as keyof typeof BTN_TONES], "md", "mt-5 w-full"),
                )}
              >
                {ROLE_CTAS[role.id as keyof typeof ROLE_CTAS]}
                <ArrowRight className="h-4 w-4" strokeWidth={2} />
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
