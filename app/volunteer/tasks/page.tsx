"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { AppShell, Guard } from "@/components/app-shell";
import { DonationCard } from "@/components/donation-card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import { useAuth } from "@/lib/auth";
import {
  acceptPickupTask,
  distanceFromViewer,
  effectiveStatus,
  fetchDonations,
  subscribeDonations,
} from "@/lib/data";
import type { Donation } from "@/types";

export default function VolunteerTasksPage() {
  return (
    <Guard allowed={["volunteer"]}>
      <AppShell>
        <VolunteerTasks />
      </AppShell>
    </Guard>
  );
}

function VolunteerTasks() {
  const { user } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [all, setAll] = useState<Donation[] | null>(null);
  const center = useMemo(
    () => (user?.lat && user?.lng ? { lat: user.lat, lng: user.lng } : null),
    [user]
  );

  useEffect(() => {
    const load = () =>
      fetchDonations().then((list) => setAll(list));
    void load();
    return subscribeDonations(load);
  }, []);

  const openTasks = useMemo(
    () =>
      (all ?? [])
        .filter(
          (d) =>
            effectiveStatus(d) === "claimed" &&
            d.ngoId != null &&
            d.volunteerId == null
        )
        .sort((a, b) => (distanceFromViewer(center, a) ?? 999) - (distanceFromViewer(center, b) ?? 999)),
    [all, center]
  );

  const myTasks = useMemo(
    () =>
      (all ?? [])
        .filter((d) => d.volunteerId === user?.id)
        .filter((d) => ["claimed", "picked_up"].includes(d.status)),
    [all, user]
  );

  async function accept(d: Donation) {
    if (!user) return;
    try {
      await acceptPickupTask(d.id, user);
      toast("Task accepted — donor & NGO were notified 🛵");
      router.push(`/donation/${d.id}`);
    } catch (e) {
      toast(e instanceof Error ? e.message : "Could not accept", "error");
    }
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <h1 className="text-2xl font-bold">My tasks 🛵</h1>
      <p className="text-sm text-muted-foreground">
        Every accepted pickup notifies donor + NGO, and delivery records the impact.
      </p>

      {all === null ? (
        <div className="mt-6 h-32 animate-pulse rounded-2xl bg-surface-2" />
      ) : (
        <>
          {myTasks.length > 0 && (
            <section className="mt-6">
              <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                Assigned to me ({myTasks.length})
              </h2>
              <div className="grid gap-3 sm:grid-cols-2">
                {myTasks.map((d) => (
                  <DonationCard key={d.id} d={d} href={`/donation/${d.id}`} />
                ))}
              </div>
            </section>
          )}

          <section className="mt-8">
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Open pickup tasks nearby ({openTasks.length})
            </h2>
            {openTasks.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-border bg-surface p-10 text-center">
                <span aria-hidden="true" className="text-4xl">🕊️</span>
                <h3 className="mt-3 font-semibold">No open tasks right now</h3>
                <p className="mx-auto mt-1 max-w-sm text-sm text-muted-foreground">
                  When an NGO claims a donation you&apos;ll have a window to
                  accept the pickup. You&apos;ll see it here.
                </p>
              </div>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2">
                {openTasks.map((d) => (
                  <DonationCard
                    key={d.id}
                    d={d}
                    distanceKm={distanceFromViewer(center, d)}
                    href={`/donation/${d.id}`}
                    action={
                      <Button size="sm" className="w-full" onClick={() => accept(d)}>
                        🛵 Accept pickup ({distanceFromViewer(center, d) == null ? "→" : `${(distanceFromViewer(center, d) as number).toFixed(1)} km`})
                      </Button>
                    }
                  />
                ))}
              </div>
            )}
          </section>
        </>
      )}
    </div>
  );
}
