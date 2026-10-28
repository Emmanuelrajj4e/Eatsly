"use client";

import { useEffect, useState } from "react";
import { getSpeed, resetRun, setSpeed, subscribeSpeed } from "@/services/tracking";
import { cn } from "@/lib/utils";
import { buttonStyles } from "@/components/ui/button";
import { RotateCcw } from "lucide-react";

const SPEEDS = [1, 5, 20] as const;

/**
 * Sim controls: speed switch (1x / 5x / 20x) and a reset. Hidden behind a
 * small "Demo controls" disclosure so the page stays clean.
 */
export function DemoControls({ id }: { id: string }) {
  const [speed, setSpeedState] = useState<number>(getSpeed);

  useEffect(
    () => subscribeSpeed(() => setSpeedState(getSpeed())),
    [],
  );

  return (
    <details className="mt-3 border border-line">
      <summary className="cursor-pointer select-none px-3 py-2 font-mono text-[11px] uppercase tracking-widest text-muted hover:text-foreground">
        Demo controls
      </summary>
      <div className="flex flex-wrap items-center gap-2 border-t border-line px-3 py-3">
        <div role="group" aria-label="Demo speed" className="flex">
          {SPEEDS.map((s) => (
            <button
              key={s}
              type="button"
              aria-pressed={speed === s}
              onClick={() => {
                setSpeed(s);
                setSpeedState(s);
              }}
              className={cn(
                "h-9 w-11 cursor-pointer border border-line font-mono text-xs",
                speed === s
                  ? "bg-foreground font-semibold text-background"
                  : "bg-surface text-foreground hover:bg-wash",
              )}
            >
              {s}x
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={() => resetRun(id)}
          className={buttonStyles("secondary", "md")}
        >
          <RotateCcw className="h-4 w-4" strokeWidth={1.5} />
          Reset demo
        </button>
        <p className="w-full font-mono text-[11px] text-muted">
          Speeding up simulates the ride without waiting; the clock returns to 1x on reload.
        </p>
      </div>
    </details>
  );
}
