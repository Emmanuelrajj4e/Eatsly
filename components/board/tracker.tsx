"use client";

import { advance } from "@/services/listings";
import { useToast } from "@/components/ui/toast";
import { CheckIcon } from "@/components/icons";
import { cn } from "@/lib/utils";
import type { Listing } from "@/types";

const STEPS = ["Claimed", "Picked up", "Delivered"] as const;

/** Horizontal three-step tracker; volunteers advance the run on the card itself. */
export function Tracker({ listing }: { listing: Listing }) {
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
      <ol className="flex items-center gap-1" aria-label="Delivery progress">
        {STEPS.map((label, i) => {
          const done = i < idx;
          const current = i === idx;
          return (
            <li key={label} className="flex flex-1 items-center gap-1">
              <span
                className={cn(
                  "grid h-5 w-5 shrink-0 place-items-center rounded-full border font-mono text-[10px]",
                  done && "border-transparent bg-leaf text-white",
                  current && "border-marigold bg-marigold text-marigold-ink",
                  !done && !current && "border-line text-muted",
                )}
              >
                {done ? <CheckIcon className="h-3 w-3" /> : i + 1}
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
                  className={cn("mx-1 h-px flex-1", i < idx ? "bg-leaf" : "bg-line")}
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
          className="mt-3 h-11 w-full cursor-pointer rounded-btn bg-foreground text-sm font-medium text-background transition hover:opacity-90"
        >
          Mark picked up
        </button>
      )}
      {listing.status === "picked_up" && (
        <button
          type="button"
          onClick={stepForward}
          className="mt-3 h-11 w-full cursor-pointer rounded-btn bg-foreground text-sm font-medium text-background transition hover:opacity-90"
        >
          Mark delivered
        </button>
      )}
      {listing.status === "delivered" && (
        <p className="mt-3 rounded-card bg-leaf/10 px-3 py-2 text-sm text-foreground">
          Food delivered and served. {listing.title} is a meal rescued.
        </p>
      )}
    </div>
  );
}
