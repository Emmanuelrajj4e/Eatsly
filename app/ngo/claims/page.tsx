"use client";

import { useEffect, useMemo, useState } from "react";
import { AppShell, Guard } from "@/components/app-shell";
import { DonationCard } from "@/components/donation-card";
import { useAuth } from "@/lib/auth";
import { fetchDonations, subscribeDonations } from "@/lib/data";
import type { Donation } from "@/types";

export default function NgoClaimsPage() {
  return (
    <Guard allowed={["ngo", "admin"]}>
      <AppShell>
        <NgoClaims />
      </AppShell>
    </Guard>
  );
}

function NgoClaims() {
  const { user } = useAuth();
  const [all, setAll] = useState<Donation[] | null>(null);

  useEffect(() => {
    const load = () =>
      fetchDonations().then((list) => setAll(list));
    void load();
    return subscribeDonations(load);
  }, []);

  const mine = useMemo(
    () => all?.filter((d) => d.ngoId === user?.id) ?? [],
    [all, user]
  );
  const inProgress = mine.filter((d) =>
    ["claimed", "picked_up"].includes(d.status)
  );
  const done = mine.filter(
    (d) => ["delivered", "expired", "cancelled"].includes(d.status)
  );

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <h1 className="text-2xl font-bold">My claims 🤝</h1>
      <p className="text-sm text-muted-foreground">
        Coordinate a volunteer for pickup, then confirm delivery to record impact.
      </p>

      {all === null ? (
        <div className="mt-6 h-32 animate-pulse rounded-2xl bg-surface-2" />
      ) : mine.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-dashed border-border bg-surface p-10 text-center">
          <span aria-hidden="true" className="text-4xl">🤝</span>
          <h2 className="mt-3 font-semibold">No claims yet</h2>
          <p className="mx-auto mt-1 max-w-sm text-sm text-muted-foreground">
            New donations near you ping this page&apos;s notifications. Claim one
            from Browse when it fits your kitchen capacity.
          </p>
          <a href="/browse" className="mt-4 inline-block text-sm font-medium text-primary hover:underline">
            Browse nearby food →
          </a>
        </div>
      ) : (
        <>
          <Section title={`In progress (${inProgress.length})`}>
            {inProgress.map((d) => (
              <DonationCard
                key={d.id}
                d={d}
                href={`/donation/${d.id}`}
                action={<NextStepHint d={d} />}
              />
            ))}
          </Section>
          <Section title={`Completed / closed (${done.length})`}>
            {done.map((d) => (
              <DonationCard key={d.id} d={d} href={`/donation/${d.id}`} />
            ))}
          </Section>
        </>
      )}
    </div>
  );
}

function NextStepHint({ d }: { d: Donation }) {
  if (!d.volunteerId)
    return (
      <p className="text-center text-xs text-muted-foreground">
        Waiting for a volunteer — ask your group chat to accept the task 🛵
      </p>
    );
  if (d.status === "claimed")
    return (
      <p className="text-center text-xs text-muted-foreground">
        {d.volunteerName} will pick up soon — confirm on the detail page.
      </p>
    );
  return (
    <p className="text-center text-xs text-muted-foreground">
      Picked up — delivery confirmation pending.
    </p>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-6">
      <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
        {title}
      </h2>
      <div className="grid gap-3 sm:grid-cols-2">{children}</div>
    </section>
  );
}
