"use client";

import { useEffect, useState } from "react";
import { fetchImpact, subscribeDonations } from "@/lib/data";
import type { ImpactStats } from "@/types";

function n(x: number) {
  return x.toLocaleString();
}

const items: Array<{ key: keyof ImpactStats; label: string; emoji: string; suffix?: string }> = [
  { key: "meals", label: "Meals served", emoji: "🍛" },
  { key: "kg", label: "Food saved", emoji: "⚖️", suffix: "kg" },
  { key: "co2", label: "CO₂ avoided", emoji: "🌍", suffix: "kg" },
  { key: "activeListings", label: "Open listings", emoji: "📍" },
];

export function LandingCounters() {
  const [stats, setStats] = useState<ImpactStats | null>(null);

  useEffect(() => {
    let alive = true;
    const load = () =>
      fetchImpact().then((s) => {
        if (alive) setStats(s);
      });
    void load();
    const unsub = subscribeDonations(load);
    return () => {
      alive = false;
      unsub();
    };
  }, []);

  return (
    <dl className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {items.map((it) => (
        <div
          key={it.key}
          className="rounded-2xl border border-border bg-surface p-4 text-center shadow-card"
        >
          <dt className="order-2 mt-1 text-xs font-medium text-muted-foreground">
            <span aria-hidden="true" className="mr-1">{it.emoji}</span>
            {it.label}
          </dt>
          <dd className="order-1 text-2xl font-bold tracking-tight">
            {stats ? (
              <>
                {n(stats[it.key])}
                {it.suffix && <span className="ml-1 text-sm font-medium text-muted-foreground">{it.suffix}</span>}
              </>
            ) : (
              <span className="inline-block h-7 w-16 animate-pulse rounded bg-surface-2" />
            )}
          </dd>
        </div>
      ))}
    </dl>
  );
}
