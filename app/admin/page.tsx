"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AppShell, Guard, ROLE_LABEL } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import { fetchImpact, fetchNgos, fetchReports, resolveReport, setNgoApproved, subscribeDonations, isDemoMode } from "@/lib/data";
import { resetDemoData } from "@/lib/demo-store";
import { fmtRelative } from "@/lib/utils";
import type { ImpactStats, Profile, Report } from "@/types";

export default function AdminPage() {
  return (
    <Guard allowed={["admin"]}>
      <AppShell>
        <AdminBoard />
      </AppShell>
    </Guard>
  );
}

function AdminBoard() {
  const { toast } = useToast();
  const [stats, setStats] = useState<ImpactStats | null>(null);
  const [ngos, setNgos] = useState<Profile[]>([]);
  const [reports, setReports] = useState<Report[]>([]);
  const [busyId, setBusyId] = useState<string | null>(null);

  const load = () =>
    Promise.all([fetchImpact(), fetchNgos(), fetchReports()]).then(([s, n, r]) => {
      setStats(s);
      setNgos(n);
      setReports(r);
    });

  useEffect(() => {
    void load();
    return subscribeDonations(load);
  }, []);

  async function toggleNgo(ngo: Profile) {
    setBusyId(ngo.id);
    try {
      await setNgoApproved(ngo.id, !ngo.approved);
      toast(ngo.approved ? `${ngo.name} blocked` : `${ngo.name} approved ✅`);
      await load();
    } catch (e) {
      toast(e instanceof Error ? e.message : "Update failed", "error");
    } finally {
      setBusyId(null);
    }
  }

  async function resolve(r: Report) {
    setBusyId(r.id);
    try {
      await resolveReport(r.id);
      toast("Report closed 🛡️");
      await load();
    } catch (e) {
      toast(e instanceof Error ? e.message : "Update failed", "error");
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <h1 className="text-2xl font-bold">Admin 🛡️</h1>
      <p className="text-sm text-muted-foreground">
        Platform health, partner NGOs and community reports.
      </p>

      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {stats
          ? (
              [
                { label: "Meals served", value: stats.meals.toLocaleString(), emoji: "🍛" },
                { label: "Food saved", value: `${stats.kg.toFixed(0)} kg`, emoji: "⚖️" },
                { label: "CO₂ avoided", value: `${stats.co2.toFixed(0)} kg`, emoji: "🌍" },
                { label: "Deliveries", value: String(stats.deliveries), emoji: "🛵" },
                { label: "Open listings", value: String(stats.activeListings), emoji: "📍" },
                { label: "Partner NGOs", value: String(stats.partnerNgos), emoji: "🤝" },
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

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        {/* NGOs */}
        <section className="rounded-2xl border border-border bg-surface p-5 shadow-card">
          <h2 className="font-semibold">Partner NGOs</h2>
          <p className="text-xs text-muted-foreground">Approved NGOs can claim donations.</p>
          <ul className="mt-3 divide-y divide-border">
            {ngos.map((n) => (
              <li key={n.id} className="flex items-center gap-3 py-3">
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium">{n.orgName ?? n.name}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    {n.email} · {ROLE_LABEL[n.role]}
                  </p>
                </div>
                <span
                  className={
                    "rounded-full px-2 py-0.5 text-xs font-medium " +
                    (n.approved
                      ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                      : "bg-amber-500/10 text-amber-600 dark:text-amber-400")
                  }
                >
                  {n.approved ? "approved" : "pending"}
                </span>
                <Button
                  size="sm"
                  variant={n.approved ? "outline" : "primary"}
                  loading={busyId === n.id}
                  onClick={() => toggleNgo(n)}
                >
                  {n.approved ? "Block" : "Approve"}
                </Button>
              </li>
            ))}
            {ngos.length === 0 && (
              <li className="py-6 text-center text-sm text-muted-foreground">No NGOs signed up yet.</li>
            )}
          </ul>
        </section>

        {/* Reports */}
        <section className="rounded-2xl border border-border bg-surface p-5 shadow-card">
          <h2 className="font-semibold">Reports queue</h2>
          <p className="text-xs text-muted-foreground">Community flags on listings.</p>
          <ul className="mt-3 divide-y divide-border">
            {reports.map((r) => (
              <li key={r.id} className="flex items-start gap-3 py-3">
                <span aria-hidden="true">{r.status === "open" ? "🚩" : "✅"}</span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium">
                    {r.donationTitle}
                    {r.status === "open" && (
                      <span className="ml-2 rounded-full bg-rose-500/10 px-1.5 py-0.5 text-[10px] font-bold uppercase text-rose-600">
                        open
                      </span>
                    )}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {r.reason} — {r.reporterName}, {fmtRelative(r.createdAt)}
                  </p>
                </div>
                {r.status === "open" && (
                  <Button size="sm" variant="outline" loading={busyId === r.id} onClick={() => resolve(r)}>
                    Close
                  </Button>
                )}
                <Link
                  href={`/donation/${r.donationId}`}
                  className="self-center text-xs font-medium text-primary hover:underline"
                >
                  view
                </Link>
              </li>
            ))}
            {reports.length === 0 && (
              <li className="py-6 text-center text-sm text-muted-foreground">
                No reports — the feed is clean ✨
              </li>
            )}
          </ul>
        </section>
      </div>

      {isDemoMode() && (
        <div className="mt-8 rounded-2xl border border-dashed border-border bg-surface p-5 text-center">
          <h2 className="text-sm font-semibold">Demo utilities</h2>
          <p className="mt-1 text-xs text-muted-foreground">
            Reset the demo dataset (20 listings, claims, reports) to seed state.
          </p>
          <Button
            variant="outline"
            size="sm"
            className="mt-3"
            onClick={() => {
              resetDemoData();
              toast("Demo data reset — showing seed state again");
            }}
          >
            🔄 Reset demo data
          </Button>
        </div>
      )}
    </div>
  );
}
