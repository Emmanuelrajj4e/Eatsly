"use client";

import { useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tag } from "@/components/ui/chip";
import { DietMarker } from "@/components/ui/diet-marker";
import { CountdownBar } from "@/components/board/countdown-bar";
import { Tracker } from "@/components/board/tracker";
import {
  CarrotIcon,
  CookieIcon,
  FlameIcon,
  PackageIcon,
} from "@/components/icons";
import { fmtDistance, distanceKm } from "@/lib/utils";
import { etaMinutes } from "@/services/geo";
import { getNgos } from "@/services/ngos";
import { safeUntilMs } from "@/services/geo";
import { KG_PER_SERVING } from "@/config/brand";
import { cn } from "@/lib/utils";
import type { Listing } from "@/types";

const TYPE_ICON = {
  hot: FlameIcon,
  sweets: CookieIcon,
  packaged: PackageIcon,
  produce: CarrotIcon,
} as const;

const TYPE_LABEL = {
  hot: "Hot cooked",
  sweets: "Sweets & dry",
  packaged: "Packaged",
  produce: "Fresh produce",
} as const;

export interface ListingCardProps {
  listing: Listing;
  nowMs: number;
  selected: boolean;
  onSelect: (id: string | null) => void;
  onClaimOpen: (id: string) => void;
}

/** One row of the live board: markers, nearest NGO, countdown, claim/tracker. */
export function ListingCard({
  listing,
  nowMs,
  selected,
  onSelect,
  onClaimOpen,
}: ListingCardProps) {
  const Icon = TYPE_ICON[listing.type];
  const near = useMemo(() => pickNearest(listing, getNgos()), [listing]);

  const expired =
    listing.status === "open" && safeUntilMs(listing.preparedAt, listing.type) < nowMs;
  const claimed = listing.status !== "open";
  const dim = expired && !claimed;

  return (
    <Card
      data-selected={selected || undefined}
      className={cn(
        "cursor-pointer transition-colors",
        selected && "border-foreground/45",
        dim && "opacity-55",
      )}
      onClick={() => onSelect(selected ? null : listing.id)}
    >
      <div className="flex items-start justify-between gap-3">
        <h3 className="flex items-center gap-2 font-display text-lg font-semibold leading-snug">
          <DietMarker veg={listing.veg} withLabel={false} />
          <span className="min-w-0">{listing.title}</span>
        </h3>
        <span className="flex shrink-0 items-center gap-1.5 font-mono text-[11px] uppercase tracking-wide text-muted">
          <Icon className="h-4 w-4" />
          {TYPE_LABEL[listing.type]}
        </span>
      </div>

      <p className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-muted">
        <Tag>{listing.area}</Tag>
        <span>{listing.donorName}</span>
        <span aria-hidden="true">·</span>
        <span className="font-mono text-xs">
          {listing.servings} servings ≈ {(listing.servings * KG_PER_SERVING).toFixed(1)} kg
        </span>
      </p>

      {near && (
        <p className="mt-1 text-sm text-muted">
          Nearest NGO <span className="font-medium text-foreground">{near.ngo.name}</span>{" "}
          <span className="font-mono text-xs">
            {fmtDistance(near.km)} · ETA {etaMinutes(near.ngo, listing)} min
          </span>
        </p>
      )}

      {listing.status !== "delivered" && <CountdownBar listing={listing} nowMs={nowMs} className="mt-3" />}

      {listing.status === "open" && !expired && (
        <Button
          variant="primary"
          className="mt-4 w-full"
          onClick={(e) => {
            e.stopPropagation();
            onClaimOpen(listing.id);
          }}
        >
          Claim food
        </Button>
      )}
      {listing.status === "open" && expired && (
        <Button variant="secondary" disabled className="mt-4 w-full">
          Safe window closed
        </Button>
      )}
      {claimed && (
        <div className="mt-4" onClick={(e) => e.stopPropagation()}>
          <Tracker listing={listing} />
        </div>
      )}
    </Card>
  );
}

/** Nearest NGO + its straight km, memoised per card. */
function pickNearest(listing: Listing, ngos: ReturnType<typeof getNgos>) {
  if (listing.ngoId) {
    const claimed = ngos.find((n) => n.id === listing.ngoId);
    if (claimed) return { ngo: claimed, km: distanceKm(listing, claimed) };
  }
  const sorted = ngos.map((n) => ({ ngo: n, km: distanceKm(listing, n) })).sort((a, b) => a.km - b.km);
  return sorted[0];
}
