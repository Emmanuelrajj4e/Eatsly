"use client";

import { useEffect, useState } from "react";
import { KG_PER_SERVING, CITY } from "@/config/brand";
import { getImpact, subscribeImpact } from "@/services/impact";
import { getNgos } from "@/services/ngos";
import type { ImpactStats } from "@/types";
import { Counter } from "@/components/ui/counter";

interface Stats extends ImpactStats {
  ngos: number;
}

/**

 * f. Impact counters in a hairline grid — mono numerals, every figure animated.
 * Marked as sample data because the seed dataset is illustrative.
 */
export function ImpactGrid() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    const id = window.requestAnimationFrame(() => {
      setStats({ ...getImpact(), ngos: getNgos().length });
    });
    const off = subscribeImpact((next) => {
      setStats({ ...next, ngos: getNgos().length });
    });
    return () => {
      window.cancelAnimationFrame(id);
      off();
    };
  }, []);

  const cells: Array<{ label: string; value: number; suffix?: string; note: string }> = stats
    ? [
        { label: "Meals rescued today", value: stats.mealsRescuedToday, suffix: " meals", note: "Sample: seed number plus this board's deliveries." },
        { label: "Servings waiting now", value: stats.servingsWaitingNow, suffix: " servings", note: "Every open listing on the live board." },
        { label: "Food weight saved", value: Math.round(stats.kgSaved), suffix: " kg", note: `Servings × ${KG_PER_SERVING} kg estimate.` },
        { label: "Active NGOs", value: stats.ngos, suffix: " NGOs", note: "Verified partners in the seed network." },
        { label: "Cities covered", value: 1, suffix: " city", note: `${CITY} — the first city Eatsly is built for.` },
      ]
    : [];

  return (
    <section aria-label="Live impact numbers" className="mx-auto max-w-6xl px-4 py-16">
      <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-line pb-4">
        <h2 className="font-display text-3xl font-extrabold tracking-tight">
          The clock that keeps counting
        </h2>
        <p className="font-mono text-[11px] uppercase tracking-widest text-muted">Sample data</p>
      </div>

      {/* today's numbers, live from this browser's board (sample data) */}
      <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {stats === null
          ? Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="rounded-card border border-line bg-surface p-5" aria-hidden="true">
                <div className="h-9 w-24 animate-pulse bg-wash" />
                <div className="mt-3 h-3 w-28 animate-pulse bg-wash" />
              </div>
            ))
          : cells.map((c, i) => (
              <div
                key={c.label}
                className="rounded-card border border-line bg-surface p-5 border-t-4"
                style={{ borderTopColor: CELL_TONES[i] }}
              >
                <Counter target={c.value} suffix={c.suffix} className="text-3xl sm:text-4xl" />
                <dt className="mt-2 font-mono text-[11px] uppercase tracking-widest text-muted">{c.label}</dt>
                <p className="mt-1 text-xs leading-5 text-muted">{c.note}</p>
              </div>
            ))}
      </dl>
    </section>
  );
}

const CELL_TONES = [
  "var(--green)",
  "var(--blue)",
  "var(--orange)",
  "var(--yellow)",
  "var(--ink)",
];
