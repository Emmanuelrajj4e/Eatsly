"use client";

import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import { fmtClock } from "@/lib/utils";
import type { TrackStage } from "@/types";

/**
 * Vertical timeline with timestamps and plain sentences. The current stage is
 * announced to screen readers via aria-live; done steps fill solid.
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
              <span
                className={cn(
                  "my-1 grid h-6 w-6 place-items-center rounded-full border font-mono text-[10px]",
                  reached && i < currentIdx && "border-transparent bg-foreground text-background",
                  (isCurrent || (reached && done)) && "border-line-strong border-2 text-foreground",
                  !reached && "border-line text-muted",
                )}
              >
                {reached && (i < currentIdx || done) ? <Check className="h-3.5 w-3.5" strokeWidth={2} /> : i + 1}
              </span>
              {i < stages.length - 1 && (
                <span aria-hidden="true" className={cn("w-px flex-1", reached && i < currentIdx ? "bg-foreground" : "bg-line")} />
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
