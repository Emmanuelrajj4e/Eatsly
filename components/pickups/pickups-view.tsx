"use client";

import { useEffect, useState } from "react";
import { useBoard } from "@/hooks/use-board";
import { useTicker } from "@/hooks/use-ticker";
import { ListingCard } from "@/components/board/listing-card";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";
import { Bike, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Listing } from "@/types";

const PROFILE_KEY = "eatsly:volunteer-profile:v1";
const VEHICLES = ["Scooter", "Motorbike", "Car", "On foot", "Auto"] as const;

type Profile = { name: string; area: string; vehicle: string; contact: string };

/** Brief §9: short onboarding card (name, area, vehicle, contact) — demo only. */
function VolunteerOnboarding() {
  const auth = useAuth();
  const toast = useToast();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [draft, setDraft] = useState<Profile>({
    name: auth?.name ?? "",
    area: "Ameerpet",
    vehicle: "Scooter",
    contact: "+91-xxxxx-xxxx0",
  });

  useEffect(() => {
    const id = requestAnimationFrame(() => {
      try {
        const raw = window.localStorage.getItem(PROFILE_KEY);
        if (raw) setProfile(JSON.parse(raw) as Profile);
      } catch {
        /* ignore */
      }
    });
    return () => cancelAnimationFrame(id);
  }, []);

  const save = () => {
    try {
      window.localStorage.setItem(PROFILE_KEY, JSON.stringify(draft));
      setProfile({ ...draft });
      toast("Run preferences saved for this browser.", "success");
    } catch {
      toast("Storage unavailable — preferences kept for this session only.", "info");
    }
  };

  if (profile) {
    return (
      <Card className="border-green bg-green-tint">
        <p className="flex items-center gap-2 font-display font-bold text-green">
          <Check className="h-5 w-5" strokeWidth={2.5} aria-hidden="true" />
          Ready to run, {profile.name}
        </p>
        <p className="mt-1 text-sm text-ink">
          {profile.area} · {profile.vehicle} · {profile.contact}
        </p>
        <button
          type="button"
          onClick={() => setProfile(null)}
          className="mt-2 cursor-pointer font-mono text-xs text-green underline underline-offset-4"
        >
          Edit rider profile
        </button>
      </Card>
    );
  }

  return (
    <Card aria-label="Volunteer onboarding">
      <p className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-muted">
        <Bike className="h-4 w-4 text-blue" strokeWidth={2} aria-hidden="true" />
        Onboard as a rider (sample)
      </p>
      <form
        className="mt-3 grid gap-3 sm:grid-cols-2"
        onSubmit={(e) => {
          e.preventDefault();
          save();
        }}
      >
        <label className="block text-sm">
          <span className="mb-1 block font-mono text-[11px] uppercase tracking-wide text-muted">Name</span>
          <input
            required
            minLength={2}
            value={draft.name}
            onChange={(e) => setDraft({ ...draft, name: e.target.value })}
            className="h-11 w-full rounded-btn border border-line bg-surface px-3"
          />
        </label>
        <label className="block text-sm">
          <span className="mb-1 block font-mono text-[11px] uppercase tracking-wide text-muted">Area</span>
          <input
            required
            value={draft.area}
            onChange={(e) => setDraft({ ...draft, area: e.target.value })}
            className="h-11 w-full rounded-btn border border-line bg-surface px-3"
          />
        </label>
        <label className="block text-sm">
          <span className="mb-1 block font-mono text-[11px] uppercase tracking-wide text-muted">Vehicle</span>
          <select
            value={draft.vehicle}
            onChange={(e) => setDraft({ ...draft, vehicle: e.target.value })}
            className="h-11 w-full rounded-btn border border-line bg-surface px-3"
          >
            {VEHICLES.map((v) => (
              <option key={v} value={v}>
                {v}
              </option>
            ))}
          </select>
        </label>
        <label className="block text-sm">
          <span className="mb-1 block font-mono text-[11px] uppercase tracking-wide text-muted">Contact</span>
          <input
            required
            value={draft.contact}
            onChange={(e) => setDraft({ ...draft, contact: e.target.value })}
            className="h-11 w-full rounded-btn border border-line bg-surface px-3 font-mono"
          />
        </label>
        <p className="text-xs text-muted sm:col-span-2">
          Kept in this browser only (--eatsly-volunteer-profile). No backend, no real dispatch.
        </p>
        <Button type="submit" variant="blue" className="sm:col-span-2">
          Save rider profile
        </Button>
      </form>
    </Card>
  );
}

/**
 * /pickups (Volunteer + NGO): claimed runs with ETA + stage buttons, and a
 * short onboarding card. Runs reuse the board's ListingCard (it already
 * renders countdown, tracker actions and "Track live" with stage steps).
 */
export function PickupsView() {
  const board = useBoard();
  const nowMs = useTicker() * 1000;
  const auth = useAuth();

  const pickups: Listing[] =
    board
      ?.filter((l) => l.status === "claimed" || l.status === "picked_up")
      .sort((a, b) => (b.claimedAt ?? "").localeCompare(a.claimedAt ?? "")) ?? [];

  const openCount = board?.filter((l) => l.status === "open").length ?? 0;

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <header className="border-b border-line pb-4">
        <p className="font-mono text-xs uppercase tracking-widest text-muted">
          {auth?.role === "volunteer" ? "Volunteer run desk" : "NGO run desk"}
        </p>
        <h1 className="mt-1 font-display text-3xl font-bold sm:text-4xl">Your pickups</h1>
        <p className="mt-2 max-w-xl text-sm text-muted">
          Claims in motion for this browser. ETA, stage updates and tracking live on
          each run card.
        </p>
      </header>

      <div className="mt-6 space-y-4">
        <VolunteerOnboarding />

        {pickups.length === 0 ? (
          <Card className="text-center">
            <p className="font-display text-lg font-semibold">No active pickups yet</p>
            <p className="mt-1 text-sm text-muted">
              {openCount > 0
                ? "Claim a listing on the board and it appears here with its full timeline."
                : "The board is clear right now — when a donor posts, claim it and the run starts."}
            </p>
            <a
              href="/board"
              className={cn("mt-4 inline-flex min-h-11 items-center rounded-btn bg-blue px-4 font-semibold text-white hover:bg-blue-shade")}
            >
              Open the live board
            </a>
          </Card>
        ) : (
          <ul className="space-y-4" aria-label="Claimed pickups">
            {pickups.map((l) => (
              <li key={l.id}>
                <ListingCard listing={l} nowMs={nowMs} selected={false} onSelect={() => {}} onClaimOpen={() => {}} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
