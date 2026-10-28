"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useBoard } from "@/hooks/use-board";
import { useTicker } from "@/hooks/use-ticker";
import { MapPanel } from "@/components/board/map-panel";
import { ListingCard } from "@/components/board/listing-card";
import { ClaimDialog } from "@/components/board/claim-dialog";
import { TrackDrawer } from "@/components/board/track-drawer";
import { Chip, Tag } from "@/components/ui/chip";
import { Card } from "@/components/ui/card";
import { buttonStyles } from "@/components/ui/button";
import { safeUntilMs } from "@/services/geo";
import { getNgos } from "@/services/ngos";
import { cn } from "@/lib/utils";
import type { BoardFilter, Listing } from "@/types";

const FILTER_LABEL: Record<BoardFilter, string> = {
  all: "All",
  under1hour: "Under 1 hour",
  veg: "Veg",
  packaged: "Packaged",
  protein: "High protein",
};

function under1Hour(nowMs: number) {
  return (l: Listing) => {
    const mins = (safeUntilMs(l.preparedAt, l.type) - nowMs) / 60000;
    return l.status === "open" && mins > 0 && mins <= 60;
  };
}

export function BoardView() {
  const board = useBoard();
  const nowMs = useTicker() * 1000;
  const [filter, setFilter] = useState<BoardFilter>("all");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [claimingId, setClaimingId] = useState<string | null>(null);
  const [trackId, setTrackId] = useState<string | null>(null);

  const rows = useMemo(() => {
    if (!board) return { lived: [] as Listing[], open: [] as Listing[], expired: [] as Listing[] };
    const active = board.filter((l) => l.status !== "delivered");
    const opens = active.filter((l) => l.status === "open");
    const open = opens
      .filter((l) => safeUntilMs(l.preparedAt, l.type) >= nowMs)
      .sort((a, b) => safeUntilMs(a.preparedAt, a.type) - safeUntilMs(b.preparedAt, b.type));
    const lived = active
      .filter((l) => l.status === "claimed" || l.status === "picked_up")
      .sort((a, b) => (a.claimedAt ?? "").localeCompare(b.claimedAt ?? ""));
    const expired = opens.filter((l) => safeUntilMs(l.preparedAt, l.type) < nowMs);
    return { lived, open, expired };
  }, [board, nowMs]);

  /* "All" keeps the run-on-clock order: soonest first, then live runs, then expired. */
  const visible: Listing[] = useMemo(() => {
    if (!board) return [];
    if (filter === "under1hour") return rows.open.filter(under1Hour(nowMs));
    if (filter === "veg") return rows.open.filter((l) => l.veg);
    if (filter === "packaged") return rows.open.filter((l) => l.type === "packaged");
    if (filter === "protein")
      return rows.open.filter((l) => l.nutritionTags?.includes("Protein-rich"));
    return [...rows.open, ...rows.lived, ...rows.expired];
  }, [board, filter, nowMs, rows]);

  const counts = useMemo(() => {
    if (!board) {
      return { all: 0, under1hour: 0, veg: 0, packaged: 0, protein: 0 } as Record<BoardFilter, number>;
    }
    const ops = board.filter((l) => l.status === "open");
    return {
      all: ops.filter((l) => safeUntilMs(l.preparedAt, l.type) >= nowMs).length,
      under1hour: ops.filter(under1Hour(nowMs)).length,
      veg: ops.filter((l) => l.veg).length,
      packaged: ops.filter((l) => l.type === "packaged").length,
      protein: ops.filter((l) => l.nutritionTags?.includes("Protein-rich")).length,
    } as Record<BoardFilter, number>;
  }, [board, nowMs]);

  const claiming = board?.find((l) => l.id === claimingId) ?? null;

  if (!board) return <BoardSkeleton />;

  return (
    <div className="mx-auto grid max-w-6xl gap-8 px-4 py-8 lg:grid-cols-[minmax(0,1fr)_420px] lg:items-start">
      <section aria-label="Live board listings" className="order-2 lg:order-1">
        <div className="flex flex-wrap items-end justify-between gap-3 border-b border-line pb-4">
          <div>
            <h1 className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
              Live board
            </h1>
            <p className="mt-1 max-w-lg text-sm text-muted">
              Every listing carries its own safe-time clock. Claim only what can truly be
              reached in time — the dialog shows you the margin before you commit.
            </p>
          </div>
          <Tag>sample data</Tag>
        </div>

        <div className="mt-5 flex flex-wrap gap-2" role="group" aria-label="Board filters">
          {(Object.keys(FILTER_LABEL) as BoardFilter[]).map((f) => (
            <Chip key={f} selected={filter === f} onClick={() => setFilter(f)}>
              {FILTER_LABEL[f]} ({counts[f]})
            </Chip>
          ))}
        </div>

        <p aria-live="polite" className="sr-only">
          {visible.length} listings shown
        </p>

        {visible.length === 0 ? (
          <Card className="mt-5 text-center">
            <p className="font-display text-lg font-semibold">Nothing matches this filter</p>
            <p className="mt-1 text-sm text-muted">
              Every clock has run out or the filter is too narrow. Post the next batch and
              the board starts hearing it again.
            </p>
            <Link href="/post" className={cn(buttonStyles("primary", "md", "mt-4"))}>
              Post surplus
            </Link>
          </Card>
        ) : (
          <ul className="mt-5 space-y-4">
            {visible.map((l) => (
              <li key={l.id}>
                <ListingCard
                  listing={l}
                  nowMs={nowMs}
                  selected={selectedId === l.id}
                  onSelect={setSelectedId}
                  onClaimOpen={setClaimingId}
                  onTrack={setTrackId}
                />
              </li>
            ))}
          </ul>
        )}
      </section>

      <aside aria-label="Map of listings and NGOs" className="order-1 lg:order-2 lg:sticky lg:top-20">
        <Card className="p-3">
          <MapPanel
            listings={board.filter((l) => l.status !== "delivered")}
            ngos={getNgos()}
            nowMs={nowMs}
            selectedId={selectedId}
            onSelect={setSelectedId}
          />
        </Card>
      </aside>

      <ClaimDialog listing={claiming} nowMs={nowMs} onClose={() => setClaimingId(null)} />
      <TrackDrawer trackId={trackId} onClose={() => setTrackId(null)} />
    </div>
  );
}

function BoardSkeleton() {
  return (
    <div
      className="mx-auto grid max-w-6xl gap-8 px-4 py-8 lg:grid-cols-[minmax(0,1fr)_420px] lg:items-start"
      aria-busy="true"
    >
      <div className="order-2 space-y-4 lg:order-1">
        <div className="h-9 w-44 animate-pulse bg-wash" />
        <div className="h-11 w-72 animate-pulse bg-wash" />
        {[0, 1, 2].map((i) => (
          <Card key={i} className="space-y-3">
            <div className="h-5 w-2/3 animate-pulse bg-wash" />
            <div className="h-4 w-1/3 animate-pulse bg-wash" />
            <div className="h-8 w-40 animate-pulse bg-wash" />
          </Card>
        ))}
      </div>
      <Card className="order-1 p-3 lg:order-2">
        <div className="h-72 animate-pulse bg-wash" />
      </Card>
    </div>
  );
}
