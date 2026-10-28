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
function Stat({
  label,
  target,
  note,
  tone,
}: {
  label: string;
  target: number;
  note?: string;
  tone: "orange" | "green" | "blue" | "yellow";
}) {
  const v = useCountUp(target);
  const tones = {
    orange: "border-t-4 border-orange text-orange",
    green: "border-t-4 border-green text-green",
    blue: "border-t-4 border-blue text-blue",
    yellow: "border-t-4 border-yellow text-ink",
  } as const;
  return (
    <Card className="border-t-4">
      <p className={cn("font-mono text-4xl font-semibold tabular-nums sm:text-5xl", tones[tone])}>
        <span aria-hidden="true">{Math.round(v).toLocaleString("en-IN")}</span>
        <span className="sr-only">{target.toLocaleString("en-IN")}</span>
      </p>
      <p className="mt-1 text-sm text-muted">{label}</p>
      {note && <p className="mt-1 font-mono text-[11px] text-muted">{note}</p>}
    </Card>
  );
}

/** Pure-SVG 7-day chart in brand colours: green solid days, orange hatched today. */
function WeekChart({
  stats,
  labels,
}: {
  stats: ImpactStats;
  labels: string[];
}) {
  const max = Math.max(...stats.last7Days, 1);
  return (
    <Card aria-label="Meals rescued over the last 7 days">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-lg font-semibold">Meals rescued · last 7 days</h2>
        <Tag>by day</Tag>
      </div>
      <svg viewBox="0 0 480 170" className="mt-4 h-auto w-full" role="img" aria-label={`Bar chart of meals per day. ${labels[6]}: ${stats.last7Days[6]} meals, highest of the week`}>
        <defs>
          <pattern id="hatch" patternUnits="userSpaceOnUse" width="6" height="6" patternTransform="rotate(45)">
            <rect width="6" height="6" fill="var(--orange-tint)" />
            <line x1="0" y1="0" x2="0" y2="6" stroke="var(--orange)" strokeWidth="2" />
          </pattern>
        </defs>
        {stats.last7Days.map((meals, i) => {
          const w = 52;
          const gap = 12;
          const x = 10 + i * (w + gap);
          const h = Math.max(2, Math.round((meals / max) * 120));
          const y = 145 - h;
          const today = i === 6;
          return (
            <g key={i}>
              <rect
                x={x}
                y={y}
                width={w}
                height={h}
                rx="6"
                fill={today ? "url(#hatch)" : "var(--green)"}
                stroke={today ? "var(--orange)" : "var(--green)"}
                strokeWidth={today ? 1.5 : 0}
              />
              <text x={x + w / 2} y={y - 6} textAnchor="middle" fontSize="12" fontFamily="var(--font-mono)" fill="var(--foreground)">
                {meals}
              </text>
              <text x={x + w / 2} y="162" textAnchor="middle" fontSize="11" fontFamily="var(--font-mono)" fill="var(--muted)">
                {labels[i]}
              </text>
            </g>
          );
        })}
      </svg>
      <p className="mt-1 font-mono text-[11px] text-muted">
        <span className="inline-block h-2.5 w-2.5 translate-y-0.5 rounded-sm bg-green" aria-hidden="true" /> solid
        bars = the six previous days ·{" "}
        <span className="inline-block h-2.5 w-2.5 translate-y-0.5 rounded-sm border border-orange bg-orange-tint" aria-hidden="true" />{" "}
        hatched = today.
      </p>
    </Card>
  );
}

/** Weekday labels computed on the client: first six days back, today last. */
function todayLabels() {
  const names = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const today = new Date().getDay();
  return [6, 5, 4, 3, 2, 1, 0].map((back) => names[(today - back + 7) % 7]);
}

/** Live dashboard: counters and chart move as claims and deliveries happen. */
export function ImpactDashboard() {
  const [data, setData] = useState<{ stats: ImpactStats; labels: string[] } | null>(null);

  useEffect(() => {
    const id = requestAnimationFrame(() =>
      setData({ stats: getImpact(), labels: todayLabels() }),
    );
    const unsub = subscribeImpact((next) =>
      setData((prev) => ({ stats: next, labels: prev?.labels ?? todayLabels() })),
    );
    return () => {
      cancelAnimationFrame(id);
      unsub();
    };
  }, []);

  if (!data) {
    return (
      <div className="grid gap-4 sm:grid-cols-3" aria-busy="true">
        {[0, 1, 2].map((i) => (
          <Card key={i}>
            <div className="h-10 w-32 animate-pulse bg-wash" />
            <div className="mt-3 h-4 w-40 animate-pulse bg-wash" />
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className={cn("space-y-4")}>
      <div className="grid gap-4 sm:grid-cols-3">
        <Stat tone="green" label="meals rescued today" target={data.stats.mealsRescuedToday} />
        <Stat tone="blue" label="servings waiting now" target={data.stats.servingsWaitingNow} note="open on the board" />
        <Stat tone="orange" label="kg saved from the bin" target={data.stats.kgSaved} note={`≈ ${KG_PER_SERVING} kg per meal served`} />
      </div>
      <WeekChart stats={data.stats} labels={data.labels} />
      <Card className="text-sm text-muted">
        <h2 className="font-display text-base font-semibold text-foreground">
          How the numbers move
        </h2>
        <ul className="mt-2 list-inside list-disc space-y-1">
          <li>
            Claiming moves servings out of <em>Waiting now</em> into a volunteer run —
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
