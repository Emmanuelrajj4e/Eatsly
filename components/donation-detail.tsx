"use client";

import { useEffect, use, useState, useCallback } from "react";
import Link from "next/link";
import { DetailActions } from "@/components/detail-actions";
import { Countdown } from "@/components/countdown";
import { StatusTracker } from "@/components/status-tracker";
import { useTheme } from "@/components/theme-provider";
import {
  distanceFromViewer,
  effectiveStatus,
  getDonation,
  subscribeDonations,
} from "@/lib/data";
import { STATUS_META } from "@/lib/constants";
import { fmtDateTime, fmtDistance, fmtRelative, cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth";
import type { Donation } from "@/types";

export function DonationDetail({ id }: { id: Promise<string> }) {
  const donationId = use(id);
  const { user } = useAuth();
  const { theme } = useTheme();
  const [d, setD] = useState<Donation | null>(null);
  const [notFound, setNotFound] = useState(false);

  const mutate = useCallback(() => {
    void getDonation(donationId).then((fresh) => {
      setD(fresh);
      if (!fresh) setNotFound(true);
    });
  }, [donationId]);

  useEffect(() => {
    mutate();
    const unsub = subscribeDonations(mutate);
    return () => {
      unsub();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [donationId]);

  // Distances are computed relative to the viewer's saved location.
  const center = user?.lat && user?.lng ? { lat: user.lat, lng: user.lng } : null;
  const distance = d && center ? distanceFromViewer(center, d) : null;

  if (notFound) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center">
        <p className="text-4xl" aria-hidden="true">🥀</p>
        <h1 className="mt-3 text-xl font-bold">Listing not found</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          It may have been cancelled or removed.
        </p>
        <Link href="/browse" className="mt-4 inline-block text-sm font-medium text-primary hover:underline">
          ← Back to browse
        </Link>
      </div>
    );
  }

  if (!d) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-10">
        <div className="h-80 w-full animate-pulse rounded-2xl bg-surface-2" />
      </div>
    );
  }

  const status = effectiveStatus(d);
  const st = STATUS_META[status];

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <Link href="/browse" className="text-sm text-muted-foreground hover:text-foreground">
        ← Back to browse
      </Link>

      <div className="mt-4 grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="space-y-5">
          {d.photoUrl && (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={d.photoUrl}
              alt={`Photo of ${d.title}`}
              className={cn("h-64 w-full rounded-2xl object-cover shadow-card sm:h-80", theme === "dark" && "brightness-90")}
            />
          )}

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl font-bold">{d.title}</h1>
              <span className={cn("rounded-full px-2.5 py-0.5 text-xs font-medium", st.badge)}>
                {st.label}
              </span>
              <span
                className={cn(
                  "rounded-full px-2.5 py-0.5 text-xs font-bold",
                  d.isVeg
                    ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                    : "bg-rose-500/10 text-rose-600 dark:text-rose-400"
                )}
              >
                {d.isVeg ? "🟢 VEG" : "🔴 NON-VEG"}
              </span>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              shared by <span className="font-medium text-foreground">{d.donorName}</span>
              {distance != null && <> · 📍 {fmtDistance(distance)} from you</>}
            </p>
          </div>

          <div className="rounded-2xl border border-border bg-surface p-5 shadow-card">
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Live status
            </h2>
            <StatusTracker d={d} />
          </div>

          {d.description && (
            <div className="rounded-2xl border border-border bg-surface p-5 shadow-card">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                Notes from the donor
              </h2>
              <p className="mt-2 text-sm leading-relaxed">{d.description}</p>
            </div>
          )}
        </div>

        {/* Side rail */}
        <aside className="space-y-5">
          <div className="rounded-2xl border border-border bg-surface p-5 shadow-card">
            <dl className="space-y-3 text-sm">
              <Row label="🍛 Servings">{d.servings} meals</Row>
              <Row label="⚖️ Weight">{d.kg} kg</Row>
              <Row label="⏰ Safe consume-by">
                <Countdown target={d.bestBefore} />
              </Row>
              <Row label="📦 Packed">{fmtDateTime(d.packedAt)}</Row>
              <Row label="🕘 Posted">{fmtRelative(d.createdAt)}</Row>
              <Row label="📍 Pickup">
                {d.address}
                <a
                  className="block text-xs font-medium text-primary hover:underline"
                  href={`https://www.openstreetmap.org/?mlat=${d.lat}&mlon=${d.lng}#map=17/${d.lat}/${d.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Open in OpenStreetMap ↗
                </a>
              </Row>
            </dl>
          </div>

          <div className="rounded-2xl border border-border bg-surface p-5 shadow-card">
            <DetailActions d={d} distanceKm={distance} mutate={mutate} />
          </div>
        </aside>
      </div>
    </div>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-3">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="text-right font-medium">{children}</dd>
    </div>
  );
}
