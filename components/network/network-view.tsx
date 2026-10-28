"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useBoard } from "@/hooks/use-board";
import { useTicker } from "@/hooks/use-ticker";
import { getNgos, onboardNgo, subscribe as subscribeNgos } from "@/services/ngos";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { buttonStyles } from "@/components/ui/button";
import { DietMarker } from "@/components/ui/diet-marker";
import { CountdownBar } from "@/components/ui/countdown-bar";
import { Tracker } from "@/components/board/tracker";
import { useToast } from "@/components/ui/toast";
import type { Listing, NGO } from "@/types";

/** Left column: every run that is claimed or picked up, with live clocks. */
function ActiveRuns({ board, nowMs }: { board: Listing[]; nowMs: number }) {
  const runs = board
    .filter((l) => l.status === "claimed" || l.status === "picked_up")
    .sort((a, b) => (a.claimedAt ?? "").localeCompare(b.claimedAt ?? ""));

  if (runs.length === 0) {
    return (
      <Card className="text-center">
        <p className="font-display text-lg font-semibold">No active runs right now</p>
        <p className="mt-1 text-sm text-muted">
          Claim any food on the live board and the run appears here for volunteers to
          pick up and deliver.
        </p>
        <Link href="/board" className={buttonStyles("primary", "md", "mt-4")}>
          Open live board
        </Link>
      </Card>
    );
  }

  return (
    <ul className="space-y-4">
      {runs.map((l) => (
        <li key={l.id}>
          <Card>
            <div className="flex items-start justify-between gap-3">
              <h3 className="flex items-center gap-2 font-display text-lg font-semibold">
                <DietMarker veg={l.veg} withLabel={false} />
                {l.title}
              </h3>
              <span className="font-mono text-xs text-muted">{l.servings} servings</span>
            </div>
            <p className="mt-1 text-sm text-muted">
              NGO <span className="font-medium text-foreground">{ngoNameOf(l)}</span> ·
              from {l.donorName}, {l.area}
            </p>
            <CountdownBar listing={l} nowMs={nowMs} className="mt-3" compact />
            <div className="mt-3">
              <Tracker listing={l} />
            </div>
          </Card>
        </li>
      ))}
    </ul>
  );
}

function ngoNameOf(listing: Listing) {
  return (
    getNgos().find((n) => n.id === listing.ngoId)?.name ?? "The claiming NGO"
  );
}

/** Right column: onboarding card that really adds an NGO to the demo network. */
function OnboardCard({ onboarded }: { onboarded: NGO[] }) {
  const toast = useToast();
  const [name, setName] = useState("");
  const [area, setArea] = useState("Madhapur");
  const [vehicle, setVehicle] = useState("");
  const [contact, setContact] = useState("");
  const [error, setError] = useState<string | null>(null);
  const AREAS = ["Kukatpally", "Secunderabad", "Begumpet", "Ameerpet", "Madhapur", "Jubilee Hills", "Banjara Hills", "Gachibowli", "Charminar", "LB Nagar", "Uppal"];
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim().length < 3) {
      setError("Give the organisation a name (3+ characters).");
      return;
    }
    setError(null);
    const ngo = onboardNgo({ name, area, vehicle, contact });
    toast(`Welcome, ${ngo.name} — your diamond is on the map and you can claim food.`, "success");
    setName("");
    setVehicle("");
    setContact("");
  };

  return (
    <Card aria-label="New NGO onboarding">
      <h2 className="font-display text-lg font-semibold">Join the network</h2>
      <p className="mt-1 text-sm text-muted">
        New NGOs register in one short card and immediately appear on the map and in
        claim dialogs. Sample network: {getNgos().length} NGOs today.
      </p>
      <form onSubmit={submit} noValidate className="mt-3 grid gap-3">
        <label className="block">
          <span className="mb-1 block font-mono text-xs uppercase tracking-wide text-muted">
            Organisation name
          </span>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Madhapur Roti Bank"
            className="h-11 w-full rounded-btn border border-line bg-surface px-3 text-foreground"
            aria-invalid={!!error}
            aria-describedby={error ? "ngo-name-e" : undefined}
          />
          {error && (
            <span id="ngo-name-e" role="alert" className="mt-1 block text-xs font-medium text-chilli">
              {error}
            </span>
          )}
        </label>
        <label className="block">
          <span className="mb-1 block font-mono text-xs uppercase tracking-wide text-muted">Area</span>
          <select
            value={area}
            onChange={(e) => setArea(e.target.value)}
            className="h-11 w-full rounded-btn border border-line bg-surface px-3 text-foreground"
          >
            {AREAS.map((a) => (
              <option key={a} value={a}>
                {a}
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="mb-1 block font-mono text-xs uppercase tracking-wide text-muted">
            Vehicle (optional)
          </span>
          <input
            value={vehicle}
            onChange={(e) => setVehicle(e.target.value)}
            placeholder="e.g. Bicycle pickup"
            className="h-11 w-full rounded-btn border border-line bg-surface px-3 text-foreground"
          />
        </label>
        <label className="block">
          <span className="mb-1 block font-mono text-xs uppercase tracking-wide text-muted">
            Contact (optional)
          </span>
          <input
            value={contact}
            onChange={(e) => setContact(e.target.value)}
            placeholder="e.g. +91 …"
            className="h-11 w-full rounded-btn border border-line bg-surface px-3 text-foreground"
          />
        </label>
        <Button variant="primary" type="submit" className="w-full">
          Register NGO
        </Button>
      </form>
      {onboarded.length > 0 && (
        <div className="mt-3 border-t border-line pt-3">
          <p className="font-mono text-xs uppercase tracking-wide text-muted">
            Recently registered
          </p>
          <ul className="mt-1.5 space-y-1 text-sm">
            {onboarded.map((n) => (
              <li key={n.id} className="flex justify-between gap-2">
                <span className="font-medium text-foreground">{n.name}</span>
                <span className="font-mono text-xs text-muted">{n.area}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </Card>
  );
}

/** Full NGO + volunteer dashboard. */
export function NetworkView() {
  const board = useBoard();
  const nowMs = useTicker() * 1000;
  const [onboarded, setOnboarded] = useState<NGO[]>([]);

  useEffect(() => {
    const update = () => setOnboarded(getNgos().filter((n) => n.newlyAdded));
    const id = requestAnimationFrame(() => update());
    const unsub = subscribeNgos(() => update());
    return () => {
      cancelAnimationFrame(id);
      unsub();
    };
  }, []);

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_380px] lg:items-start">
      <section aria-label="Active runs">
        <h2 className="font-display text-2xl font-bold tracking-tight">Active runs</h2>
        <p className="mt-1 text-sm text-muted">
          Food that has been claimed and is waiting for pickup or delivery. Mark the
          steps as they happen — impact only counts when a delivery is marked.
        </p>
        <div className="mt-4">
          {board ? (
            <ActiveRuns board={board} nowMs={nowMs} />
          ) : (
            <Card aria-busy="true">
              <div className="h-6 w-40 animate-pulse rounded bg-foreground/10" />
              <div className="mt-3 h-4 w-full animate-pulse rounded bg-foreground/[0.06]" />
            </Card>
          )}
        </div>
      </section>

      <aside className="space-y-4" aria-label="NGO onboarding">
        <OnboardCard onboarded={onboarded} />
      </aside>
    </div>
  );
}
