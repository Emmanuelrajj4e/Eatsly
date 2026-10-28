"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { AppShell, Guard } from "@/components/app-shell";
import { DonationCard } from "@/components/donation-card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import { useAuth } from "@/lib/auth";
import { cancelDonation, fetchDonations, subscribeDonations } from "@/lib/data";
import type { Donation } from "@/types";

export default function DonorListingsPage() {
  return (
    <Guard allowed={["donor", "admin"]}>
      <AppShell>
        <DonorListings />
      </AppShell>
    </Guard>
  );
}

function DonorListings() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [all, setAll] = useState<Donation[] | null>(null);

  useEffect(() => {
    const load = () =>
      fetchDonations().then((list) => {
        setAll(list);
      });
    void load();
    return subscribeDonations(load);
  }, []);

  const mine = useMemo(
    () => all?.filter((d) => d.donorId === user?.id) ?? [],
    [all, user]
  );

  const active = mine.filter((d) =>
    ["available", "claimed", "picked_up"].includes(d.status)
  );
  const history = mine.filter(
    (d) => ["delivered", "expired", "cancelled"].includes(d.status)
  );

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">My listings</h1>
        <Link href="/donor/new">
          <Button size="sm">➕ Post food</Button>
        </Link>
      </div>

      {all === null ? (
        <div className="mt-6 space-y-3">
          <div className="h-32 animate-pulse rounded-2xl bg-surface-2" />
          <div className="h-32 animate-pulse rounded-2xl bg-surface-2" />
        </div>
      ) : mine.length === 0 ? (
        <EmptyState />
      ) : (
        <>
          <Section title={`Active (${active.length})`}>
            {active.map((d) => (
              <DonationCard
                key={d.id}
                d={d}
                href={`/donation/${d.id}`}
                action={
                  d.status === "available" ? (
                    <div className="flex justify-end">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          void cancelDonation(d.id).then(() =>
                            toast("Listing cancelled", "info")
                          );
                        }}
                      >
                        Cancel listing
                      </Button>
                    </div>
                  ) : undefined
                }
              />
            ))}
          </Section>
          {history.length > 0 && (
            <Section title={`History (${history.length})`}>
              {history.map((d) => (
                <DonationCard key={d.id} d={d} href={`/donation/${d.id}`} />
              ))}
            </Section>
          )}
        </>
      )}
    </div>
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

function EmptyState() {
  return (
    <div className="mt-8 rounded-2xl border border-dashed border-border bg-surface p-10 text-center">
      <span aria-hidden="true" className="text-4xl">🍱</span>
      <h2 className="mt-3 font-semibold">No listings yet</h2>
      <p className="mx-auto mt-1 max-w-sm text-sm text-muted-foreground">
        Surplus rice today can be someone&apos;s full dinner tonight. Post your
        first donation — it takes under a minute.
      </p>
      <Link href="/donor/new" className="mt-4 inline-block">
        <Button>Post your first donation</Button>
      </Link>
    </div>
  );
}
