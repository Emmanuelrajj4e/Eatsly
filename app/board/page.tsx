"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useBoard } from "@/hooks/use-board";
import { useTicker } from "@/hooks/use-ticker";
import { SvgMap } from "@/components/board/svg-map";
import { ListingCard } from "@/components/board/listing-card";
import { ClaimDialog } from "@/components/board/claim-dialog";
import { Chip, Tag } from "@/components/ui/chip";
import { Card } from "@/components/ui/card";
import { buttonStyles } from "@/components/ui/button";
import { safeUntilMs } from "@/services/geo";
import { getNgos } from "@/services/ngos";
import { cn } from "@/lib/utils";
import type { BoardFilter, Listing } from "@/types";

const FILTER_LABEL: Record<BoardFilter, string> = {
  all: "All",
  urgent: "Under 1 hour",
  veg: "Veg only",
  packaged: "Packaged",
};

function oneHour(nowMs: number) {
  return (l: Listing) => {
    const mins = (safeUntilMs(l.preparedAt, l.type) - nowMs) / 60000;
    return l.status === "open" && mins > 0 && mins <= 60;
  };
}

export default function BoardPage() {
  const board = useBoard();
  const nowMs = useTicker() * 1000;
  const [filter, setFilter] = useState<BoardFilter>("all");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [claimingId, setClaimingId] = useState<string | null>(null);

  const rows = useMemo(() => {
    if (!board) return { open: [] as Listing[], lived: [] as Listing[], expired: [] as Listing[] };
    const active = board.filter((l) => l.status !== "delivered");
    const open = active
      .filter((l) => l.status === "open")
      .sort((a, b) => safeUntilMs(a.preparedAt, a.type) - safeUntilMs(b.preparedAt, b.type));
    const lived = active
      .filter((l) => l.status === "claimed" || l.status === "picked_up")
      .sort((a, b) => (a.claimedAt ?? "").localeCompare(b.claimedAt ?? ""));
    const expired = open.filter((l) => safeUntilMs(l.preparedAt, l.type) < nowMs);
    return { open, lived, expired };
  }, [board, nowMs]);

  const visible: Listing[] = useMemo(() => {
    if (!board) return [];
    if (filter === "urgent") return rows.open.filter(oneHour(nowMs));
    if (filter === "veg") return rows.open.filter((l) => l.veg);
    if (filter === "packaged") return rows.open.filter((l) => l.type === "packaged");
    return [...rows.open, ...rows.lived, ...rows.expired];
  }, [board, filter, nowMs, rows]);

  const counts = useMemo(() => {
    if (!board) return { all: 0, urgent: 0, veg: 0, packaged: 0 };
    const act = board.filter((l) => l.status !== "delivered");
    const ops = act.filter((l) => l.status === "open");
    return {
      all: act.length,
      urgent: ops.filter(oneHour(nowMs)).length,
      veg: ops.filter((l) => l.veg).length,
      packaged: ops.filter((l) => l.type === "packaged").length,
    };
  }, [board, nowMs]);

  const claiming = board?.find((l) => l.id === claimingId) ?? null;

  if (!board) {
    return (
      <BoardSkeleton />
    );
  }

  return (
    <div className="mx-auto grid max-w-6xl gap-8 px-4 py-8 lg:grid-cols-[minmax(0,1fr)_400px] lg:items-start">
      <section aria-label="Live board listings" className="order-2 lg:order-1">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
              Live board
            </h1>
            <p className="mt-1 max-w-lg text-sm text-muted">
              Sorted by time left. Tap <em>Claim food</em>, pick an NGO that can really arrive,
              and the tracker moves as volunteers ride.
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
              Try another filter, or post the next batch so it lands here for NGOs to claim.
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
                />
              </li>
            ))}
          </ul>
        )}
      </section>

      <aside
        aria-label="Map of listings and NGOs"
        className="order-1 lg:order-2 lg:sticky lg:top-20"
      >
        <Card className="p-3">
          <SvgMap
            listings={board.filter((l) => l.status !== "delivered")}
            ngos={getNgos()}
            nowMs={nowMs}
            selectedId={selectedId}
            onSelect={setSelectedId}
          />
        </Card>
      </aside>

      <ClaimDialog listing={claiming} nowMs={nowMs} onClose={() => setClaimingId(null)} />
    </div>
  );
}

function BoardSkeleton() {
  return (
    <div className="mx-auto grid max-w-6xl gap-8 px-4 py-8 lg:grid-cols-[minmax(0,1fr)_400px] lg:items-start" aria-busy="true">
      <div className="order-2 space-y-4 lg:order-1">
        <div className="h-9 w-44 animate-pulse rounded bg-foreground/10" />
        <div className="h-11 w-72 animate-pulse rounded-full bg-foreground/[0.06]" />
        {[0, 1, 2].map((i) => (
          <Card key={i} className="space-y-3">
            <div className="h-5 w-2/3 animate-pulse rounded bg-foreground/10" />
            <div className="h-4 w-1/3 animate-pulse rounded bg-foreground/[0.06]" />
            <div className="h-8 w-40 animate-pulse rounded bg-foreground/[0.06]" />
          </Card>
        ))}
      </div>
      <Card className="order-1 p-3 lg:order-2">
        <div className="h-72 animate-pulse rounded bg-foreground/[0.05]" />
      </Card>
    </div>
  );
}
