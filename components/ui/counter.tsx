"use client";

import { useCountUp } from "@/hooks/use-count-up";
import { cn } from "@/lib/utils";

/**
 * Animated numeral in IBM Plex Mono with tabular figures.
 * The final value is mirrored in an sr-only sibling for screen readers.
 */
export function Counter({
  target,
  suffix,
  className,
}: {
  target: number;
  suffix?: string;
  className?: string;
}) {
  const v = useCountUp(target);
  return (
    <p
      className={cn(
        "font-mono font-semibold tabular-nums tracking-tight",
        className ?? "text-4xl sm:text-5xl",
      )}
    >
      <span aria-hidden="true">
        {v.toLocaleString("en-IN")}
        {suffix ?? ""}
      </span>
      <span className="sr-only">
        {target.toLocaleString("en-IN")}
        {suffix ?? ""}
      </span>
    </p>
  );
}
