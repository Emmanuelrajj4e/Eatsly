"use client";

import { useEffect, useState } from "react";
import { fmtTimeLeft } from "@/lib/utils";
import { cn } from "@/lib/utils";

/** Ticking "time left" chip. Renders a placeholder until mounted (SSR-safe). */
export function Countdown({
  target,
  className,
}: {
  target: string;
  className?: string;
}) {
  const [left, setLeft] = useState<number | null>(null);

  useEffect(() => {
    const update = () => setLeft(new Date(target).getTime() - Date.now());
    update();
    const id = window.setInterval(update, 1000);
    return () => window.clearInterval(id);
  }, [target]);

  if (left === null) {
    return <span className={cn("opacity-0", className)} aria-hidden="true">--</span>;
  }

  const expired = left <= 0;
  const urgent = !expired && left < 60 * 60 * 1000; // < 1h
  const soon = !urgent && left < 4 * 60 * 60 * 1000; // < 4h

  return (
    <span
      role="timer"
      aria-label={expired ? "Expired" : `Time left ${fmtTimeLeft(left)}`}
      className={cn(
        "font-semibold",
        expired
          ? "text-rose-600 dark:text-rose-400"
          : urgent
            ? "text-rose-600 dark:text-rose-400"
            : soon
              ? "text-amber-600 dark:text-amber-400"
              : "text-muted-foreground",
        urgent && "animate-pulse",
        className
      )}
    >
      {expired ? "⏰ expired" : `⏳ ${fmtTimeLeft(left)} left`}
    </span>
  );
}
