"use client";

import { useEffect, useMemo, useState } from "react";
import { AppShell, Guard } from "@/components/app-shell";
import { fetchDonations, fetchImpact, fetchLeaderboard, subscribeDonations, type LeaderRow } from "@/lib/data";
import type { Donation, ImpactStats } from "@/types";

export default function ImpactPage() {
  return (
    <Guard>
      <AppShell>
        <ImpactBoard />
      </AppShell>
    </Guard>
  );
}

const MEDALS = ["🥇", "🥈", "🥉"];

function ImpactBoard() {
  const [stats, setStats] = useState<ImpactStats | null>(null);
  const [leaders, setLeaders] = useState<LeaderRow[]>([]);
  const [donations, setDonations] = useState<Donation[]>([]);

  useEffect(() => {
    const load = () =>
      Promise.all([fetchImpact(), fetchLeaderboard(), fetchDonations()]).then(
        ([s, lb, ds]) => {
          setStats(s);
          setLeaders(lb);
          setDonations(ds);
        }
      );
    void load();
    return subscribeDonations(load);
  }, []);

  const weekly = useMemo(() => last7Days(donations), [donations]);
  const maxDay = Math.max(1, ...weekly.map((d) => d.meals));

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <h1 className="text-2xl font-bold">Impact 🌍</h1>
      <p className="text-sm text-muted-foreground">
        Every delivered pickup is recorded here — meals, kilos and CO₂ avoided.
      </p>

      {/* Stat cards */}
      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {stats
          ? (
              [
                { label: "Meals served", value: stats.meals.toLocaleString(), emoji: "🍛" },
                { label: "Food saved", value: `${stats.kg.toLocaleString()} kg`, emoji: "⚖️" },
                { label: "CO₂ avoided", value: `${stats.co2.toLocaleString(undefined, { maximumFractionDigits: 1 })} kg`, emoji: "🌍" },
                { label: "Deliveries", value: stats.deliveries.toLocaleString(), emoji: "🛵" },
                { label: "Open listings", value: stats.activeListings.toLocaleString(), emoji: "📍" },
                { label: "Partner NGOs", value: stats.partnerNgos.toLocaleString(), emoji: "🤝" },
              ] as const
            ).map((s) => (
              <div key={s.label} className="rounded-2xl border border-border bg-surface p-4 shadow-card">
                <span aria-hidden="true" className="text-xl">{s.emoji}</span>
                <p className="mt-1 text-xl font-bold tracking-tight">{s.value}</p>
                <p className="text-xs text-muted-foreground">{s.label}</p>
              </div>
            ))
          : Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-24 animate-pulse rounded-2xl bg-surface-2" />
            ))}
      </div>
      <p className="mt-2 text-xs text-muted-foreground">
        CO₂ estimated at 2.5 kg CO₂e per kg food rescued (EPA-style food-waste factor).
      </p>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        {/* Weekly activity */}
        <section className="rounded-2xl border border-border bg-surface p-5 shadow-card">
          <h2 className="font-semibold">Meals delivered · last 7 days</h2>
          <div className="mt-4 flex h-40 items-end gap-2" role="img" aria-label="Bar chart of meals delivered per day">
            {weekly.map((d) => (
              <div key={d.day} className="flex flex-1 flex-col items-center gap-1">
                <span className="text-[10px] font-medium text-muted-foreground">{d.meals || ""}</span>
                <div
                  className="w-full rounded-t-md bg-primary/80 transition-all"
                  style={{ height: `${Math.max(4, (d.meals / maxDay) * 100)}%` }}
                  title={`${d.day}: ${d.meals} meals`}
                />
                <span className="text-[10px] text-muted-foreground">{d.day}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Leaderboard */}
        <section className="rounded-2xl border border-border bg-surface p-5 shadow-card">
          <h2 className="font-semibold">Top donors 🏆</h2>
          {leaders.length === 0 ? (
            <p className="mt-6 text-center text-sm text-muted-foreground">
              No deliveries yet — the first one starts the leaderboard.
            </p>
          ) : (
            <ol className="mt-3 divide-y divide-border">
              {leaders.slice(0, 8).map((r, i) => (
                <li key={r.donorId} className="flex items-center gap-3 py-2.5">
                  <span aria-hidden="true" className="w-7 text-center text-lg">
                    {MEDALS[i] ?? <span className="text-sm text-muted-foreground">{i + 1}</span>}
                  </span>
                  <span className="flex-1 truncate font-medium">{r.donorName}</span>
                  <span className="text-right text-xs text-muted-foreground">
                    {r.donations} trips
                    <br />
                    {r.kg.toFixed(1)} kg
                  </span>
                  <span className="w-20 text-right font-semibold text-primary">
                    {r.meals.toLocaleString()} 🍽️
                  </span>
                </li>
              ))}
            </ol>
          )}
        </section>
      </div>
    </div>
  );
}

/** Meals grouped per day for the last 7 days (day label + totals). */
function last7Days(donations: Donation[]) {
  const out: Array<{ day: string; meals: number }> = [];
  const now = new Date();
  for (let i = 6; i >= 0; i--) {
    const dayDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i);
    const key = dayDate.toDateString();
    const meals = donations
      .filter(
        (d) =>
          d.status === "delivered" &&
          new Date(d.createdAt).toDateString() === key
      )
      .reduce((s, d) => s + d.servings, 0);
    out.push({
      day: dayDate.toLocaleDateString([], { weekday: "short" }),
      meals,
    });
  }
  return out;
}
