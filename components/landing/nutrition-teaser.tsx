"use client";

import Link from "next/link";
import data from "@/data/nutrition.json";
import { Card } from "@/components/ui/card";
import { buttonStyles } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

type Food = { name: string; kcal: number; protein: number; carbs: number; fat: number; fibre: number; iron: number; calcium: number };

const PRES = ["Rice", "Roti", "Dal", "Spinach", "Curd", "Milk"];
const FOODS = data.foods as Food[];
const BARS: Array<{ key: keyof Food; label: string; unit: string; target: number }> = [
  { key: "kcal", label: "Energy", unit: "kcal", target: 700 },
  { key: "protein", label: "Protein", unit: "g", target: 25 },
  { key: "fibre", label: "Fibre", unit: "g", target: 10 },
];

/** i. Nutrition teaser: the Plate Builder in compact form + link to the hub. */
export function NutritionTeaser() {
  const plate = FOODS.filter((f) => PRES.includes(f.name));
  const totals = Object.fromEntries(
    BARS.map((b) => [b.key, plate.reduce((s, f) => s + Number(f[b.key] ?? 0), 0)]),
  ) as Record<string, number>;

  return (
    <section aria-label="Plate builder preview" className="mx-auto max-w-6xl px-4 py-16">
      <div className="flex flex-wrap items-end justify-between gap-3 border-b border-line pb-4">
        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-muted">Sample plate</p>
          <h2 className="mt-2 font-display text-3xl font-extrabold tracking-tight">
            What did today&apos;s plate do for you?
          </h2>
        </div>
        <Link href="/nutrition" className={buttonStyles("secondary", "md")}>
          Open the full Plate Builder
          <ArrowRight className="h-4 w-4" strokeWidth={1.5} />
        </Link>
      </div>

      <Card className="mt-6 grid items-center gap-6 sm:grid-cols-[minmax(0,200px)_1fr]">
        <svg role="img" aria-label={`Sample thali with ${plate.map((f) => f.name).join(", ")}`} viewBox="0 0 220 220" className="mx-auto h-auto w-full max-w-[200px]">
          <circle cx="110" cy="110" r="100" fill="var(--surface)" stroke="var(--line-strong)" strokeWidth="2.5" />
          {plate.map((f, i) => {
            const angle = (i / plate.length) * Math.PI * 2 - Math.PI / 2;
            const cx = 110 + Math.cos(angle) * 62;
            const cy = 110 + Math.sin(angle) * 62;
            return (
              <g key={f.name}>
                <circle cx={cx} cy={cy} r="20" fill="var(--background)" stroke="var(--foreground)" strokeWidth="1.8" />
                <text x={cx} y={cy + 4} textAnchor="middle" fontSize="11" fontFamily="var(--font-mono)">
                  {f.name.slice(0, 2).toUpperCase()}
                </text>
              </g>
            );
          })}
        </svg>

        <div>
          <ul className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {BARS.map((b) => {
              const share = Math.min(1, (totals[b.key] ?? 0) / b.target);
              return (
                <li key={b.key}>
                  <p className="flex items-baseline justify-between gap-2 text-sm">
                    <span className="font-mono text-[11px] uppercase tracking-widest text-muted">{b.label}</span>
                    <span className="font-mono tabular-nums">
                      {Math.round(totals[b.key] ?? 0)}
                      <span className="text-muted"> {b.unit}</span>
                    </span>
                  </p>
                  <div className="mt-1 h-2 border border-line" aria-hidden="true">
                    <div className={cn("h-full bg-foreground")} style={{ width: `${share * 100}%` }} />
                  </div>
                </li>
              );
            })}
          </ul>
          <p className="mt-4 max-w-prose text-sm leading-7 text-muted">
            This thali starts balanced, but the full builder tests your order: tap foods
            yourself and read the plain-language note it gives you — never a score.
          </p>
          <p className="mt-2 text-xs text-muted">
            Values approximate per typical serving; reference: Indian Food Composition
            Tables (ICMR-NIN).
          </p>
        </div>
      </Card>
    </section>
  );
}
