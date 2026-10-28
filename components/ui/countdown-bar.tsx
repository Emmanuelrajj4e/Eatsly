"use client";

import { fmtClock, fmtCountdown } from "@/lib/utils";
import { safeUntilMs, windowMinutes } from "@/services/geo";
import type { Listing } from "@/types";
import { cn } from "@/lib/utils";

/**
 * Live countdown numerals + progress bar. State = colour AND text label
 * (never colour alone):
 * Urgent <30 min: red + barber stripes → chip "Urgent"
 * Soon 30–90 min: yellow bar → chip "Soon"
 * Fresh >90 min: green bar → chip "Fresh"
 * Expired: dashed gray, 60% opacity → label "Window closed"
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
  const stateLabel = expired ? "Window closed" : urgent ? "Urgent" : soon ? "Soon" : "Fresh";

  return (
    <div className={className} aria-label={`Safe time left: ${fmtCountdown(left)} — ${stateLabel}`}>
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <p
          className={cn(
            "font-mono tabular-nums",
            compact ? "text-lg" : "text-3xl font-semibold",
            expired && "text-muted [opacity:0.6]",
          )}
        >
          {fmtCountdown(left)}
        </p>
        <p
          className={cn(
            " rounded-full px-2 py-0.5 font-mono text-[11px] uppercase tracking-wide",
            urgent && "bg-red text-white",
            soon && "bg-yellow text-ink",
            !expired && !urgent && !soon && "bg-green text-white",
            expired && "bg-line text-muted",
          )}
        >
          {stateLabel}
        </p>
      </div>
      <div
        className={cn(
          "mt-1.5 h-2 rounded-full border border-line bg-surface",
          expired && "border-dashed [opacity:0.6]",
        )}
        aria-hidden="true"
      >
        <div
          className={cn(
            "h-full rounded-full",
            !expired && urgent ? "bar-striped" : "",
            !expired && !soon && "bg-green",
            !expired && soon && "bg-yellow",
            expired && "bg-muted [opacity:0.5]",
          )}
          style={{
            width: `${share * 100}%`,
            transition: "width 1s linear",
          }}
        />
      </div>
      <p className={cn("mt-1 font-mono text-[11px] text-muted", expired && "[opacity:0.6]")}>
        {expired ? "Safe window closed" : `Safe until ${fmtClock(new Date(end).toISOString())}`}
      </p>
    </div>
  );
}
