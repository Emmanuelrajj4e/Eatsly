"use client";

import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import { fmtClock } from "@/lib/utils";
import type { TrackStage } from "@/types";

/**
 * Vertical timeline with timestamps and plain sentences. Done = solid green
 * with a check, current = blue ring + pulse, upcoming = gray. The current
 * stage is announced to screen readers via aria-live.
 */
export function TrackTimeline({
  stages,
  done,
}: {
  stages: TrackStage[];
  done: boolean;
}) {
  const currentIdx = done
    ? stages.length - 1
    : stages.reduce((last, s, i) => (s.at ? i : last), 0);

  return (
    <ol aria-label="Delivery stages" aria-live="polite">
      {stages.map((s, i) => {
        const isCurrent = i === currentIdx && s.at && !done ? i === currentIdx : false;
        const reached = Boolean(s.at);
        return (
          <li key={s.key} className="flex gap-3">
            <div className="flex flex-col items-center">
              <span className="relative my-1 grid place-items-center">
                {isCurrent && (
                  <span
                    className="absolute h-6 w-6 animate-pulse-ring rounded-full bg-blue opacity-50"
                    style={{ transformBox: "fill-box" }}
                    aria-hidden="true"
                  />
                )}
                <span
                  className={cn(
                    "relative grid h-6 w-6 place-items-center rounded-full border font-mono text-[10px]",
                    reached && i < currentIdx && "border-transparent bg-green text-white",
                    (isCurrent || (reached && done)) && "border-blue bg-surface border-2 text-blue",
                    !reached && "border-line bg-surface text-muted",
                  )}
                >
                  {reached && (i < currentIdx || done) ? (
                    <Check className="h-3.5 w-3.5" strokeWidth={2.5} />
                  ) : (
                    i + 1
                  )}
                </span>
              </span>
              {i < stages.length - 1 && (
                <span aria-hidden="true" className={cn("w-0.5 flex-1 rounded-full", reached && i < currentIdx ? "bg-green" : "bg-line")} />
              )}
            </div>
            <div className={cn("pb-5", !reached && "opacity-60")}>
              <p className="flex flex-wrap items-baseline gap-x-3">
                <span className={cn("font-medium", reached ? "text-foreground" : "text-muted")}>
                  {s.label}
                </span>
                <span className="font-mono text-[11px] text-muted tabular-nums">
                  {s.at ? fmtClock(s.at) : "—"}
                </span>
              </p>
              {(reached || i === currentIdx + 1) && (
                <p className="mt-0.5 max-w-prose text-sm leading-6 text-muted">{s.sentence}</p>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
