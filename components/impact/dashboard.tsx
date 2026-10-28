"use client";

import { useEffect, useState } from "react";
import { useCountUp } from "@/hooks/use-count-up";
import { getImpact, subscribeImpact } from "@/services/impact";
import { Card } from "@/components/ui/card";
import { Tag } from "@/components/ui/chip";
import { KG_PER_SERVING } from "@/config/brand";
import { cn } from "@/lib/utils";
import type { ImpactStats } from "@/types";

/** One animated stat card (final value kept for screen readers). */
function Stat({ label, target, note }: { label: string; target: number; note?: string }) {
  const v = useCountUp(target);
  return (
    <Card>
      <p className="font-mono text-4xl font-semibold tabular-nums sm:text-5xl">
        <span aria-hidden="true">{Math.round(v).toLocaleString("en-IN")}</span>
        <span className="sr-only">{target.toLocaleString("en-IN")}</span>
      </p>
      <p className="mt-1 text-sm text-muted">{label}</p>
      {note && <p className="mt-1 font-mono text-[11px] text-muted">{note}</p>}
    </Card>
  );
}

/** Pure-SVG 7-day bar chart; today's bar highlighted in marigold. */
function WeekChart({ stats }: { stats: ImpactStats }) {
  const max = Math.max(...stats.last7Days, 1);
  const todayLabel = new Date().toLocaleDateString("en-IN", { weekday: "short" });
  return (
    <Card aria-label="Meals rescued over the last 7 days">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-lg font-semibold">Meals rescued · last 7 days</h2>
        <Tag>by day</Tag>
      </div>
      <svg
        viewBox="0 0 480 170"
        className="mt-4 h-auto w-full"
        role="img"
        aria-label={`Bar chart of meals per day; today ${todayLabel} sits at ${Math.max(
          ...stats.last7Days,
        )} at its best bar`}
      >
        {stats.last7Days.map((meals, i) => {
          const w = 52;
          const gap = 12;
          const x = 10 + i * (w + gap);
          const h = Math.round((meals / max) * 120);
          const y = 145 - h;
          return (
            <g key={i}>
              <rect x={x} y={y} width={w} height={h} rx="4" fill={i === 6 ? "var(--marigold)" : "var(--leaf)"} opacity={i === 6 ? 1 : 0.85} />
              <text
                x={x + w / 2}
                y={y - 6}
                textAnchor="middle"
                fontSize="12"
                fontFamily="var(--font-mono)"
                fill="var(--muted)"
              >
                {meals}
              </text>
              <text
                x={x + w / 2}
                y="162"
                textAnchor="middle"
                fontSize="11"
                fontFamily="var(--font-mono)"
                fill="var(--muted)"
              >
                {i === 6 ? todayLabel : ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][i]}
              </text>
            </g>
          );
        })}
      </svg>
    </Card>
  );
}

/** Live dashboard: counters and chart move as claims and deliveries happen. */
export function ImpactDashboard() {
  const [stats, setStats] = useState<ImpactStats | null>(null);

  useEffect(() => {
    const id = requestAnimationFrame(() => setStats(getImpact()));
    const unsub = subscribeImpact((next) => setStats(next));
    return () => {
      cancelAnimationFrame(id);
      unsub();
    };
  }, []);

  if (!stats) {
    return (
      <div className="grid gap-4 sm:grid-cols-3" aria-busy="true">
        {[0, 1, 2].map((i) => (
          <Card key={i}>
            <div className="h-10 w-32 animate-pulse rounded bg-foreground/10" />
            <div className="mt-3 h-4 w-40 animate-pulse rounded bg-foreground/[0.06]" />
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className={cn("space-y-4")}>
      <div className="grid gap-4 sm:grid-cols-3">
        <Stat label="meals rescued today" target={stats.mealsRescuedToday} />
        <Stat label="servings waiting now" target={stats.servingsWaitingNow} note="open on the board" />
        <Stat label="kg saved from the bin" target={stats.kgSaved} note={`≈ 0.38 kg per meal served`} />
      </div>
      <WeekChart stats={stats} />
      <Card className="text-sm text-muted">
        <h2 className="font-display text-base font-semibold text-foreground">
          How the numbers move
        </h2>
        <ul className="mt-2 list-inside list-disc space-y-1">
          <li>
            Claiming moves servings from <em>w Waiting now</em> into a volunteer run —
            no food is counted rescued until it is delivered.
          </li>
          <li>
            Each delivery adds servings × {KG_PER_SERVING} kg to <em>kg saved</em> and
            lifts today&apos;s bar.
          </li>
          <li>
            Everything except the seed baseline is computed live from the board, so this
            dashboard and the counters on the home page always agree.
          </li>
        </ul>
      </Card>
    </div>
  );
}
