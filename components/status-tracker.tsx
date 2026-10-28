import { cn } from "@/lib/utils";
import { effectiveStatus } from "@/lib/data";
import type { Donation } from "@/types";

const steps = ["available", "claimed", "picked_up", "delivered"] as const;

export function StatusTracker({ d }: { d: Donation }) {
  const status = effectiveStatus(d);
  const idx = steps.indexOf(status as (typeof steps)[number]);

  return (
    <div>
      <ol className="flex items-center gap-1" aria-label="Delivery status">
        {steps.map((s, i) => {
          const done = idx >= i && idx > -1;
          return (
            <li key={s} className="flex flex-1 items-center gap-1">
              <span
                aria-current={idx === i ? "step" : undefined}
                className={
                  cn(
                    "flex flex-1 flex-col items-center gap-1",
                  )
                }
              >
                <span
                  aria-hidden="true"
                  className={cn(
                    "grid size-7 place-items-center rounded-full border-2 text-xs font-bold transition-colors",
                    done
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-surface text-muted-foreground"
                  )}
                >
                  {done ? "✓" : i + 1}
                </span>
                <span
                  className={cn(
                    "text-center text-[10px] font-medium capitalize",
                    done ? "text-foreground" : "text-muted-foreground"
                  )}
                >
                  {s === "picked_up" ? "picked up" : s}
                </span>
              </span>
              {i < steps.length - 1 && (
                <span
                  aria-hidden="true"
                  className={cn(
                    "mb-4 h-0.5 flex-1 rounded",
                    idx > i ? "bg-primary" : "bg-border"
                  )}
                />
              )}
            </li>
          );
        })}
      </ol>
      {(status === "expired" || status === "cancelled") && (
        <p
          className={cn(
            "mt-3 rounded-lg px-3 py-2 text-center text-sm font-medium",
            status === "expired"
              ? "bg-stone-500/10 text-stone-500 dark:text-stone-400"
              : "bg-rose-500/10 text-rose-600 dark:text-rose-400"
          )}
        >
          {status === "expired"
            ? "⏰ This listing expired before it could be delivered."
            : "❌ The donor cancelled this listing."}
        </p>
      )}
    </div>
  );
}
