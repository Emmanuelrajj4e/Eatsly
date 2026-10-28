"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { AppShell, Guard } from "@/components/app-shell";
import { DonationCard } from "@/components/donation-card";
import { MapView, type MapPoint } from "@/components/map";
import { Button } from "@/components/ui/button";
import { buttonClasses } from "@/components/ui/button-styles";
import { Input, Label, Select } from "@/components/ui/input";
import { useToast } from "@/components/ui/toast";
import { useAuth } from "@/lib/auth";
import {
  applyFilter,
  claimDonation,
  distanceFromViewer,
  fetchDonations,
  isDemoMode,
  subscribeDonations,
} from "@/lib/data";
import { DEFAULT_CENTER, FOOD_CATEGORIES, CATEGORY_META } from "@/lib/constants";
import { cn } from "@/lib/utils";
import type { Donation } from "@/types";

export default function BrowsePage() {
  return (
    <Guard>
      <AppShell>
        <Browser />
      </AppShell>
    </Guard>
  );
}

function Browser() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [donations, setDonations] = useState<Donation[] | null>(null);
  const [view, setView] = useState<"list" | "map">("list");
  // filters
  const [radius, setRadius] = useState(10);
  const [category, setCategory] = useState("");
  const [veg, setVeg] = useState<"any" | "veg" | "nonveg">("any");
  const [minServings, setMinServings] = useState(0);
  const [maxHours, setMaxHours] = useState(0);
  const [search, setSearch] = useState("");
  const center = useMemo(
    () =>
      user?.lat && user?.lng ? { lat: user.lat, lng: user.lng } : DEFAULT_CENTER,
    [user]
  );

  useEffect(() => {
    const load = () =>
      fetchDonations().then((list) => {
        setDonations(list);
      });
    void load();
    return subscribeDonations(load);
  }, []);

  const visible = useMemo(() => {
    if (!donations) return [];
    return applyFilter(donations, {
      center,
      radiusKm: radius,
      category: category || null,
      isVeg: veg === "any" ? null : veg === "veg",
      minServings: minServings || null,
      maxHoursLeft: maxHours || null,
      search: search || null,
    }).filter((d) => d.status || isDemoMode());
  }, [donations, center, radius, category, veg, minServings, maxHours, search]);

  const sorted = useMemo(
    () =>
      visible
        .filter((d) => d.status === "available" || d.status === "claimed")
        .slice()
        .sort((a, b) => {
          const da = distanceFromViewer(center, a) ?? 999;
          const db = distanceFromViewer(center, b) ?? 999;
          return da - db;
        }),
    [visible, center]
  );

  const points: MapPoint[] = sorted.map((d) => ({
    id: d.id,
    lat: d.lat,
    lng: d.lng,
    label: `${d.title} · ${d.donorName}`,
    tone: d.status === "available" ? "primary" : "accent",
  }));

  async function onClaim(d: Donation) {
    try {
      if (!user) throw new Error("Sign in first");
      await claimDonation(d.id, user);
      toast("Claimed! Pick up at the donor's address 🤝");
    } catch (e) {
      toast(e instanceof Error ? e.message : "Could not claim", "error");
    }
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Browse surplus food</h1>
          <p className="text-sm text-muted-foreground">
            {donations
              ? `${sorted.length} listings within ${radius} km of you`
              : "Loading live listings…"}
          </p>
        </div>
        <div className="flex rounded-xl border border-border bg-surface p-1" role="tablist" aria-label="View mode">
          {(["list", "map"] as const).map((v) => (
            <button
              key={v}
              role="tab"
              aria-selected={view === v}
              onClick={() => setView(v)}
              className={cn(
                "rounded-lg px-3 py-1.5 text-sm font-medium capitalize transition-colors",
                view === v ? "bg-primary/10 text-primary" : "text-muted-foreground"
              )}
            >
              {v === "list" ? "📋 List" : "🗺️ Map"}
            </button>
          ))}
        </div>
      </div>

      {/* Filters */}
      <div className="mt-5 grid gap-3 rounded-2xl border border-border bg-surface p-4 shadow-card sm:grid-cols-2 lg:grid-cols-5">
        <div className="sm:col-span-2 lg:col-span-2">
          <Label htmlFor="q">Search</Label>
          <Input
            id="q"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="biryani, bakery, mess…"
            className="h-9"
          />
        </div>
        <div>
          <Label htmlFor="radius">Radius</Label>
          <Select id="radius" value={radius} onChange={(e) => setRadius(Number(e.target.value))} className="h-9">
            <option value={2}>2 km</option>
            <option value={5}>5 km</option>
            <option value={10}>10 km</option>
            <option value={25}>25 km</option>
          </Select>
        </div>
        <div>
          <Label htmlFor="cat">Type</Label>
          <Select id="cat" value={category} onChange={(e) => setCategory(e.target.value)} className="h-9">
            <option value="">All food</option>
            {FOOD_CATEGORIES.map((c) => (
              <option key={c} value={c}>{CATEGORY_META[c].label}</option>
            ))}
          </Select>
        </div>
        <div className="grid grid-cols-3 gap-2">
          <Select value={veg} onChange={(e) => setVeg(e.target.value as typeof veg)} aria-label="Veg filter" className="h-9">
            <option value="any">Veg+Non</option>
            <option value="veg">Veg only</option>
            <option value="nonveg">Non-veg</option>
          </Select>
          <Select value={maxHours} onChange={(e) => setMaxHours(Number(e.target.value))} aria-label="Expiry filter" className="h-9">
            <option value={0}>Any time</option>
            <option value={2}>≤ 2 h left</option>
            <option value={6}>≤ 6 h left</option>
          </Select>
          <Select value={minServings} onChange={(e) => setMinServings(Number(e.target.value))} aria-label="Min quantity filter" className="h-9">
            <option value={0}>Any size</option>
            <option value={20}>≥ 20 serv.</option>
            <option value={40}>≥ 40 serv.</option>
          </Select>
        </div>
      </div>

      {donations === null ? (
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <div className="h-36 animate-pulse rounded-2xl bg-surface-2" />
          <div className="h-36 animate-pulse rounded-2xl bg-surface-2" />
          <div className="h-36 animate-pulse rounded-2xl bg-surface-2" />
          <div className="h-36 animate-pulse rounded-2xl bg-surface-2" />
        </div>
      ) : sorted.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-dashed border-border bg-surface p-10 text-center">
          <span aria-hidden="true" className="text-4xl">🧭</span>
          <h2 className="mt-3 font-semibold">Nothing found in this radius</h2>
          <p className="mx-auto mt-1 max-w-sm text-sm text-muted-foreground">
            Try wider distance, more food types, or check back soon — new
            donations ping every approved NGO nearby.
          </p>
        </div>
      ) : view === "map" ? (
        <div className="mt-6 space-y-3">
          <MapView center={center} points={points} />
          <div className="grid gap-3 sm:grid-cols-2">
            {sorted.slice(0, 6).map((d) => (
              <DonationCard
                key={d.id}
                d={d}
                distanceKm={distanceFromViewer(center, d)}
                href={`/donation/${d.id}`}
                action={claimAction(d, user, onClaim)}
              />
            ))}
          </div>
        </div>
      ) : (
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          {sorted.map((d) => (
            <DonationCard
              key={d.id}
              d={d}
              distanceKm={distanceFromViewer(center, d)}
              href={`/donation/${d.id}`}
              action={claimAction(d, user, onClaim)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function claimAction(
  d: Donation,
  user: ReturnType<typeof useAuth>["user"],
  onClaim: (d: Donation) => Promise<void>
) {
  if (d.status !== "available") return undefined;
  if (!user) {
    return (
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground">Sign in to claim</span>
        <Link href="/login?next=%2Fbrowse" className={buttonClasses("primary", "sm")}>
          Claim
        </Link>
      </div>
    );
  }
  if (user.role === "ngo") {
    return user.approved ? (
      <Button size="sm" className="w-full" onClick={() => onClaim(d)}>
        🤝 Claim this
      </Button>
    ) : (
      <p className="text-center text-xs text-amber-600 dark:text-amber-400">
        ⏳ Your NGO is awaiting admin approval
      </p>
    );
  }
  if (user.role === "volunteer") {
    return (
      <Link href={`/donation/${d.id}`} className={buttonClasses("outline", "sm", "w-full")}>
        View & follow
      </Link>
    );
  }
  return undefined;
}
