"use client";

import { advance } from "@/services/listings";
import { useToast } from "@/components/ui/toast";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonStyles } from "@/components/ui/button";
import { Route } from "lucide-react";
import type { Listing } from "@/types";

const STEPS = ["Claimed", "Picked up", "Delivered"] as const;

/**
 * Horizontal three-step tracker; NGO/volunteer advance the run on the card
 * itself. Done = solid green, current = blue ring; label text rides along.
 */
export function Tracker({
  listing,
  onTrack,
}: {
  listing: Listing;
  onTrack?: (id: string) => void;
}) {
  const toast = useToast();
  const idx = listing.status === "claimed" ? 0 : listing.status === "picked_up" ? 1 : 2;

  const stepForward = () => {
    const to = listing.status === "claimed" ? "picked_up" : "delivered";
    const res = advance(listing.id, to);
    if (res.ok) {
      toast(
        to === "picked_up"
          ? "Marked picked up — food is on its way."
          : "Delivered — measurable impact added to the dashboard.",
      );
    } else {
      toast(res.reason ?? "Something went wrong.", "error");
    }
  };

  return (
    <div>
      <ol className="flex items-center gap-1" aria-label={`Delivery progress: ${listing.status.replace("_", " ")}`}>
        {STEPS.map((label, i) => {
          const done = i < idx;
          const current = i === idx;
          return (
            <li key={label} className="flex flex-1 items-center gap-1">
              <span
                className={cn(
                  "grid h-5 w-5 shrink-0 place-items-center rounded-full border font-mono text-[10px]",
                  done && "border-transparent bg-green text-white",
                  current && "border-blue border-2 text-blue",
                  !done && !current && "border-line text-muted",
                )}
                aria-current={current ? "step" : undefined}
              >
                {done ? <Check className="h-3 w-3" strokeWidth={2.5} /> : i + 1}
              </span>
              <span
                className={cn(
                  "font-mono text-[10px] uppercase tracking-wide whitespace-nowrap",
                  current || done ? "text-foreground" : "text-muted",
                )}
              >
                {label}
              </span>
              {i < STEPS.length - 1 && (
                <span
                  aria-hidden="true"
                  className={cn("mx-1 h-0.5 flex-1 rounded-full", i < idx ? "bg-green" : "bg-line")}
                />
              )}
            </li>
          );
        })}
      </ol>

      {listing.status === "claimed" && (
        <button
          type="button"
          onClick={stepForward}
          className={cn(buttonStyles("green", "md", "mt-3 w-full"))}
        >
          Mark picked up
        </button>
      )}
      {listing.status === "picked_up" && (
        <button
          type="button"
          onClick={stepForward}
          className={cn(buttonStyles("green", "md", "mt-3 w-full"))}
        >
          Mark delivered
        </button>
      )}
      {listing.status === "delivered" && (
        <p className="mt-3 rounded-btn border border-green bg-green-tint px-3 py-2 text-sm text-ink">
          <Check className="mr-1.5 inline h-4 w-4 text-green" strokeWidth={2.5} aria-hidden="true" />
          Food delivered and served. {listing.title} is a meal rescued.
        </p>
      )}
      {listing.status !== "delivered" && onTrack && (
        <button
          type="button"
          onClick={() => onTrack(listing.id)}
          className={cn(buttonStyles("outline-blue", "md", "mt-2 w-full"))}
        >
          <Route className="h-4 w-4" strokeWidth={2} />
          Track live
        </button>
      )}
    </div>
  );
}
