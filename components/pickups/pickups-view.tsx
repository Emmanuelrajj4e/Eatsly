"use client";

import { useBoard } from "@/hooks/use-board";
import { useTicker } from "@/hooks/use-ticker";
import { ListingCard } from "@/components/board/listing-card";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import type { Listing } from "@/types";

/**
 * /pickups (Volunteer + NGO): the claimed runs waiting for pickup or
 * delivery. ETA + stage buttons live on the card's tracker (brief §9);
 * the volunteer onboarding card arrives in Phase 6.
 */
export function PickupsView() {
  const board = useBoard();
  const nowMs = useTicker() * 1000;
  const auth = useAuth();

  const pickups: Listing[] =
    board?.filter((l) => l.status === "claimed" || l.status === "picked_up").sort(
      (a, b) => (b.claimedAt ?? "").localeCompare(a.claimedAt ?? ""),
    ) ?? [];

  const postCount = board?.filter((l) => l.status === "open").length ?? 0;

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

      {pickups.length === 0 ? (
        <Card className="mt-6 text-center">
          <p className="font-display text-lg font-semibold">No active pickups yet</p>
          <p className="mt-1 text-sm text-muted">
            {postCount > 0
              ? "Claim a listing on the board and it appears here with its full timeline."
              : "The board is clear right now — when a donor posts, claim it and the run starts."}
          </p>
          <a
            href="/board"
            className="mt-4 inline-flex min-h-11 items-center rounded-btn bg-blue px-4 font-semibold text-white hover:bg-blue-shade"
          >
            Open the live board
          </a>
        </Card>
      ) : (
        <ul className="mt-6 space-y-4" aria-label="Claimed pickups">
          {pickups.map((l) => (
            <li key={l.id}>
              <ListingCard listing={l} nowMs={nowMs} selected={false} onSelect={() => {}} onClaimOpen={() => {}} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
