"use client";

import { useEffect, useState } from "react";
import { ANNOUNCEMENTS } from "@/config/brand";

/**
 * Landing strip a: slim tint bar rotating sample messages.
 * Rotation is presentational (aria-hidden); a single sr-only sentence
 * carries all messages so screen readers hear them once, no churn.
 */
export function AnnouncementBar() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % ANNOUNCEMENTS.length);
    }, 4500);
    return () => window.clearInterval(id);
  }, []);

  return (
    <div className="bg-yellow-tint text-ink">
      <div className="mx-auto flex max-w-6xl items-center justify-center gap-2.5 px-4 py-2">
        <span className="h-2 w-2 shrink-0 rounded-full bg-green" aria-hidden="true" />
        <p className="hidden min-[400px]:flex flex-1 justify-center font-medium text-[13px] leading-snug sm:text-sm">
          {/* rotating sample message (static for AT) */}
          <span
            key={index}
            aria-hidden="true"
            className="fade-up inline-block whitespace-nowrap overflow-hidden text-ellipsis max-w-[70vw]"
          >
            {ANNOUNCEMENTS[index]}
          </span>
          <span aria-hidden="true"> </span>
          <span className="sr-only">
            Sample announcements: {ANNOUNCEMENTS.join(". ")}.
          </span>
          {/* visible sample label (colour alone never carries meaning) */}
          <span className="inline-flex shrink-0 items-center rounded-full bg-ink/10 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wide">
            Sample
          </span>
        </p>
        {/* tiny screens: fixed short message, same guarantee */}
        <p className="flex min-[400px]:hidden items-center gap-2 text-[13px] font-medium">
          <span className="sr-only">Sample announcements. </span>
          3 deliveries on the way in Hyderabad
          <span className="inline-flex shrink-0 items-center rounded-full bg-ink/10 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wide">
            Sample
          </span>
        </p>
      </div>
    </div>
  );
}
