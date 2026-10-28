"use client";

import { fmtClock, fmtCountdown } from "@/lib/utils";
import { safeUntilMs, windowMinutes } from "@/services/geo";
import type { Listing } from "@/types";
import { cn } from "@/lib/utils";

/**
 * Live countdown numerals + progress bar, form encodes state:
 * URGENT (<30 min): striped diagonal bar. SOON (<90): 2px ink border around
 * the block. Normal: hairline + solid bar. Expired: dotted, 50% opacity.
 */
export function CountdownBar({
  listing,
  nowMs,
  className,
  compact = false,
}: {
  listing: Listing;
  nowMs: number;
  className?: string;
  compact?: boolean;
}) {
  const end = safeUntilMs(listing.preparedAt, listing.type);
  const left = Math.max(0, end - nowMs);
  const total = windowMinutes(listing.type) * 60000;
  const share = Math.max(0, Math.min(1, left / total));
  const mins = left / 60000;
  const expired = left <= 0;
  const urgent = !expired && mins < 30;
  const soon = !expired && !urgent && mins < 90;

  return (
    <div className={className} aria-label={`Safe time left: ${fmtCountdown(left)}`}>
      <p
        className={cn(
          "font-mono tabular-nums",
          compact ? "text-lg" : "text-3xl font-semibold",
          expired && "text-muted [opacity:0.6]",
        )}
      >
        {fmtCountdown(left)}
      </p>
      <div
        className={cn(
          "mt-1.5 h-2 border",
          soon && "border-line-strong",
          expired && "border-dotted border-line [opacity:0.6]",
        )}
        aria-hidden="true"
      >
        <div
          className={cn(
            "h-full",
            urgent ? "bar-striped" : "bg-foreground",
            expired && "[opacity:0.35]",
          )}
          style={{
            width: `${share * 100}%`,
            transition: "width 1s linear",
          }}
        />
      </div>
      <p className="mt-1 font-mono text-[11px] text-muted">
        {expired ? "Safe window closed" : `Safe until ${fmtClock(new Date(end).toISOString())}`}
      </p>
    </div>
  );
}
