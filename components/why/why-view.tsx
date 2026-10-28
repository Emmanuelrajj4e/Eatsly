"use client";

import Link from "next/link";
import data from "@/data/landing.json";
import { buttonStyles } from "@/components/ui/button";
import { ArrowRight, Check, Clock4, Radar, ShieldCheck, BookOpen, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

const GAP_ICONS = {
  timing: Clock4,
  matching: Radar,
  trust: ShieldCheck,
  awareness: BookOpen,
} as const;

const ROW_TONES = {
  red: "border-l-4 border-red",
  yellow: "border-l-4 border-yellow",
  blue: "border-l-4 border-blue",
  green: "border-l-4 border-green",
} as const;

const DOT_TONES = {
  red: "bg-red",
  yellow: "bg-yellow-shade",
  blue: "bg-blue",
  green: "bg-green",
} as const;

/**
 * Full "Why Eatsly" page (brief §6): opening statement, four gaps and the
 * fix for each, an interactive Without/With toggle, who feels the
 * difference, principles, a marked roadmap, and honest statistic
 * placeholders.
 */
export function WhyEatsly() {
  const [mode, setMode] = useState<"without" | "with">("without");
  const list = mode === "without" ? data.withoutWith.without : data.withoutWith.with;

  return (
    <div className="mx-auto max-w-6xl px-4">
      {/* four gaps × the fix */}
      <section aria-labelledby="gaps-heading" className="py-12">
        <h2 id="gaps-heading" className="font-display text-2xl font-bold">
          Four gaps — and what Eatsly puts in each one
        </h2>
        <ul className="mt-6 grid gap-3">
          {data.gaps.map((gap) => {
            const Icon = GAP_ICONS[gap.key as keyof typeof GAP_ICONS];
            return (
              <li
                key={gap.key}
                className={cn(
                  "grid gap-3 rounded-card border border-line bg-surface p-4 sm:p-5 md:grid-cols-[auto_1fr_1fr] md:items-center",
                  ROW_TONES[gap.tone as keyof typeof ROW_TONES],
                )}
              >
                <p className="flex items-center gap-2.5 font-display text-base font-bold">
                  <span
                    className={cn("h-3 w-3 shrink-0 rounded-full", DOT_TONES[gap.tone as keyof typeof DOT_TONES])}
                    aria-hidden="true"
                  />
                  {Icon && <Icon className="h-4 w-4" strokeWidth={2} />}
                  {gap.title}
                </p>
                <p className="text-sm leading-6 text-muted">{gap.problem}</p>
                <p className="text-sm font-semibold leading-6 text-ink">
                  <Check className="mr-1.5 inline h-4 w-4 text-green" strokeWidth={2.5} aria-hidden="true" />
                  {gap.fix}
                </p>
              </li>
            );
          })}
        </ul>
      </section>

      {/* without / with toggle */}
      <section aria-labelledby="toggle-heading" className="py-8">
        <h2 id="toggle-heading" className="font-display text-2xl font-bold">
          The same evening, two ways
        </h2>
        <div className="mt-5 inline-flex rounded-full border border-line bg-surface p-1" role="group" aria-label="Compare without and with Eatsly">
          <button
            type="button"
            aria-pressed={mode === "without"}
            onClick={() => setMode("without")}
            className={cn(
              "h-10 cursor-pointer rounded-full px-5 font-mono text-sm uppercase tracking-wide transition-colors",
              mode === "without" ? "bg-red text-white" : "text-muted hover:text-ink",
            )}
          >
            Without Eatsly
          </button>
          <button
            type="button"
            aria-pressed={mode === "with"}
            onClick={() => setMode("with")}
            className={cn(
              "h-10 cursor-pointer rounded-full px-5 font-mono text-sm uppercase tracking-wide transition-colors",
              mode === "with" ? "bg-green text-white" : "text-muted hover:text-ink",
            )}
          >
            With Eatsly
          </button>
        </div>

        <ul className="mt-5 grid gap-2 rounded-card border border-line bg-surface p-5" aria-live="polite">
          {list.map((item) => (
            <li key={item} className="flex items-start gap-2.5 text-sm leading-6">
              {mode === "with" ? (
                <Check className="mt-1 h-4 w-4 shrink-0 text-green" strokeWidth={2.5} aria-hidden="true" />
              ) : (
                <X className="mt-1 h-4 w-4 shrink-0 text-red" strokeWidth={2.5} aria-hidden="true" />
              )}
              {item}
            </li>
          ))}
        </ul>
      </section>

      {/* who feels the difference */}
      <section aria-labelledby="feels-heading" className="py-12">
        <h2 id="feels-heading" className="font-display text-2xl font-bold">
          Who feels the difference
        </h2>
        <ul className="mt-5 grid gap-3 md:grid-cols-2">
          {data.feels.map((f) => (
            <li key={f.who} className="rounded-card border border-line bg-surface p-4">
              <p className="font-display font-bold">{f.who}</p>
              <p className="mt-1.5 text-sm leading-6 text-muted">{f.sentence}</p>
            </li>
          ))}
        </ul>
      </section>

      {/* principles */}
      <section aria-labelledby="principles-heading" className="py-8">
        <h2 id="principles-heading" className="font-display text-2xl font-bold">
          Principles by design
        </h2>
        <ul className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {data.principles.map((p) => (
            <li
              key={p.title}
              className={cn("rounded-card border border-line bg-surface p-4 border-l-4", ROW_TONES[p.tone as keyof typeof ROW_TONES])}
            >
              <p className="flex items-center gap-2 font-display font-bold">
                <span className={cn("h-2.5 w-2.5 rounded-full", DOT_TONES[p.tone as keyof typeof DOT_TONES])} aria-hidden="true" />
                {p.title}
              </p>
              <p className="mt-2 text-sm leading-6 text-muted">{p.text}</p>
            </li>
          ))}
        </ul>
      </section>

      {/* roadmap — explicitly not shipped */}
      <section aria-labelledby="next-heading" className="py-8">
        <div className="rounded-card border border-dashed border-muted/60 bg-surface p-5">
          <p className="flex items-center justify-between gap-3 font-mono text-xs uppercase tracking-widest text-muted">
            What we are building next
            <span className="rounded-full bg-yellow-tint px-2 py-0.5 text-ink">Roadmap — not in this demo</span>
          </p>
          <ul className="mt-3 grid gap-2 text-sm leading-6 md:grid-cols-3">
            {data.roadmap.map((r) => (
              <li key={r} className="rounded-card bg-wash p-3">
                {r}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* honest statistic placeholders (brief: never invent figures) */}
      <section aria-labelledby="stats-heading" className="pb-14 pt-4">
        <h2 id="stats-heading" className="font-display text-2xl font-bold">
          Numbers we will only use when verified
        </h2>
        <p className="mt-2 max-w-xl text-sm text-muted">
          The landing page keeps only figures with a named source and year, e.g.{" "}
          <Link href="/#how" className="underline underline-offset-4">
            UNEP Food Waste Index Report 2024
          </Link>
          . The rest stay visible placeholders until they can be fact-checked:
        </p>
        <ul className="mt-4 grid gap-2 font-mono text-sm text-muted">
          <li>[add verified statistic and source]</li>
          <li>[add verified statistic and source]</li>
          <li>[add verified statistic and source]</li>
        </ul>
      </section>

      <section aria-label="Next step" className="pb-16">
        <div className="rounded-card border border-line bg-blue-tint/50 p-6 text-center">
          <p className="font-display text-xl font-bold">See it work on a live clock</p>
          <p className="mx-auto mt-2 max-w-lg text-sm text-muted">
            Open the board as an NGO or volunteer — countdowns, ETA-checked claims
            and live tracking are all running on sample data.
          </p>
          <Link href="/start" className={cn(buttonStyles("primary", "lg", "mt-4"))}>
            Choose your role
            <ArrowRight className="h-5 w-5" strokeWidth={2} aria-hidden="true" />
          </Link>
        </div>
      </section>
    </div>
  );
}
