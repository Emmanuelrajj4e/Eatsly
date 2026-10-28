"use client";

import { useMemo } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tag, TAG_TONES } from "@/components/ui/chip";
import { DietMarker } from "@/components/ui/diet-marker";
import { CountdownBar } from "@/components/ui/countdown-bar";
import { Tracker } from "@/components/board/tracker";
import { Cookie, Package, Flame, Carrot, Check, TriangleAlert } from "lucide-react";
import { cn, fmtDistance, distanceKm } from "@/lib/utils";
import { etaMinutes } from "@/services/geo";
import { getNgos } from "@/services/ngos";
import { safeUntilMs } from "@/services/geo";
import { KG_PER_SERVING, TAG_ANCHORS } from "@/config/brand";
import type { Listing } from "@/types";

const TYPE_ICON = {
  hot: Flame,
  sweets: Cookie,
  packaged: Package,
  produce: Carrot,
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
  onTrack?: (id: string) => void;
}

/**
 * One row of the live board. State = colour AND label (never colour alone):
 * Urgent <30 min: red-tint card + striped bar. Soon <90: yellow border.
 * Claimed: blue chip + check. Expired: dashed border, dimmed.
 * Nutrition tag chips use the shared nutrient-group tones.
 */
export function ListingCard({
  listing,
  nowMs,
  selected,
  onSelect,
  onClaimOpen,
  onTrack,
}: ListingCardProps) {
  const Icon = TYPE_ICON[listing.type];
  const near = useMemo(() => pickNearest(listing, getNgos()), [listing]);

  const expired =
    listing.status === "open" && safeUntilMs(listing.preparedAt, listing.type) < nowMs;
  const claimed = listing.status !== "open";
  const mins = (safeUntilMs(listing.preparedAt, listing.type) - nowMs) / 60000;
  const urgent = !expired && !claimed && mins < 30;
  const soon = !expired && !claimed && !urgent && mins < 90;

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onSelect(selected ? null : listing.id);
    }
  };

  return (
    <Card
      role="button"
      tabIndex={0}
      aria-pressed={selected}
      data-selected={selected || undefined}
      onClick={() => onSelect(selected ? null : listing.id)}
      onKeyDown={onKeyDown}
      className={cn(
        "cursor-pointer",
        urgent && "border-red/50 bg-red-tint",
        soon && "border-2 border-yellow",
        !urgent && !soon && "border-line",
        selected && "border-2 border-blue",
        expired && "[opacity:0.6]",
      )}
    >
      {(expired || claimed) && (
        <span
          className={cn(
            "absolute right-4 top-4 inline-flex h-7 items-center gap-1.5 rounded-full px-2.5",
            "font-mono text-[10px] uppercase tracking-widest",
            claimed && "border border-blue bg-blue text-white",
            expired && "border border-dashed border-muted text-muted",
          )}
        >
          {claimed ? (
            <>
              <Check className="h-3.5 w-3.5" strokeWidth={2.5} /> Claimed
            </>
          ) : (
            "Expired"
          )}
        </span>
      )}
      <div className="flex items-start justify-between gap-3">
        <h3 className="flex items-center gap-2 font-display text-lg font-semibold leading-snug">
          <DietMarker veg={listing.veg} withLabel={false} />
          <span className="min-w-0">{listing.title}</span>
        </h3>
        <span className="flex shrink-0 items-center gap-1.5 font-mono text-[11px] uppercase tracking-wide text-muted">
          <Icon className="h-4 w-4" strokeWidth={1.5} />
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

      {listing.nutritionTags && listing.nutritionTags.length > 0 && !expired && (
        <p className="mt-2 flex flex-wrap items-center gap-1.5">
          <span className="font-mono text-[10px] uppercase tracking-widest text-muted">
            Nutrition:
          </span>
          {listing.nutritionTags.map((t) => (
            <Link
              key={t}
              href={`/nutrition#${TAG_ANCHORS[t] ?? ""}`}
              onClick={(e) => e.stopPropagation()}
              className={cn(
                "inline-flex items-center gap-1 rounded-full border px-2.5 py-1",
                "font-mono text-[11px] font-medium underline-offset-4 hover:underline",
                TAG_TONES[t] ?? "border-line bg-surface",
              )}
            >
              {t}
            </Link>
          ))}
        </p>
      )}

      {listing.status !== "delivered" && (
        <CountdownBar
          listing={listing}
          nowMs={nowMs}
          className="mt-3"
          compact={claimed || expired}
        />
      )}

      {/* state labels live here so form, not hue, carries urgency */}
      {urgent && (
        <p className="sr-only">Urgent: the safe window closes within 30 minutes.</p>
      )}
      {soon && (
        <p className="sr-only">Closing soon: the safe window closes within 90 minutes.</p>
      )}

      {listing.status === "open" && !expired && (
        <Button
          variant={urgent ? "secondary" : "primary"}
          className="mt-4 w-full"
          onClick={(e) => {
            e.stopPropagation();
            onClaimOpen(listing.id);
          }}
        >
          Claim food
        </Button>
      )}
      {claimed && (
        <div className="mt-4" onClick={(e) => e.stopPropagation()}>
          <Tracker listing={listing} onTrack={onTrack} />
        </div>
      )}
      {expired && (
        <Button variant="ghost" disabled className="mt-3 w-full">
          Safe window closed
        </Button>
      )}
      {expired && (
        <p className="mt-2 flex items-center gap-1.5 text-xs text-muted">
          <TriangleAlert className="h-3.5 w-3.5" strokeWidth={1.5} aria-hidden="true" />
          Expired food never reaches the board — it leaves the clock when the window ends.
        </p>
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
