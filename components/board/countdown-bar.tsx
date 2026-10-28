"use client";

import { fmtClock, fmtCountdown } from "@/lib/utils";
import { safeUntilMs, windowMinutes } from "@/services/geo";
import type { Listing } from "@/types";
import { cn } from "@/lib/utils";

/**
 * Live countdown: HH:MM:SS numerals in mono + a bar that degrades
 * amber under 90 minutes and chilli under 30. Grey once expired.
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

  const barColor = expired
    ? "var(--line)"
    : mins < 30
      ? "var(--chilli)"
      : mins < 90
        ? "var(--amber)"
        : "var(--leaf)";
  const textColor = expired ? "text-muted" : mins < 30 ? "text-chilli" : "text-foreground";

  return (
    <div className={className} aria-label={`Safe time left: ${fmtCountdown(left)}`}>
      <p
        className={cn(
          "font-mono tabular-nums",
          compact ? "text-lg" : "text-3xl font-semibold",
          textColor,
        )}
      >
        {fmtCountdown(left)}
      </p>
      <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-line" aria-hidden="true">
        <div
          className="h-full rounded-full"
          style={{
            width: `${share * 100}%`,
            background: barColor,
            transition: "width 1s linear, background-color 0.4s",
          }}
        />
      </div>
      <p className="mt-1 font-mono text-[11px] text-muted">
        {expired ? "Safe window closed" : `Safe until ${fmtClock(new Date(end).toISOString())}`}
      </p>
    </div>
  );
}
