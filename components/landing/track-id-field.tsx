"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { DEMO_TRACKING_ID } from "@/config/brand";
import { ArrowRight } from "lucide-react";
import { buttonStyles } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/**
 * Landing demo field: type any tracking ID and jump to /track/<ID>.
 * Empty input jumps to the featured sample run.
 */
export function TrackIdField() {
  const router = useRouter();
  const [id, setId] = useState("");

  const go = (value: string) => {
    const clean = value.trim().toUpperCase().replace(/\s+/g, "");
    router.push(`/track/${clean.length > 0 ? clean : DEMO_TRACKING_ID}`);
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        go(id);
      }}
      className="mt-4 flex flex-wrap items-center gap-2"
    >
      <label htmlFor="track-id-field" className="sr-only">
        Enter a tracking ID
      </label>
      <input
        id="track-id-field"
        value={id}
        onChange={(e) => setId(e.target.value)}
        placeholder={`Tracking ID e.g. ${DEMO_TRACKING_ID}`}
        className="h-11 min-w-0 flex-1 basis-56 rounded-btn border border-line bg-surface px-3 font-mono text-sm uppercase outline-none focus:border-blue"
      />
      <button
        type="submit"
        className={cn(buttonStyles("blue", "md"))}
      >
        Track this ID
        <ArrowRight className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
      </button>
      <Link
        href={`/track/${DEMO_TRACKING_ID}`}
        className="text-sm font-semibold text-blue underline underline-offset-4"
      >
        Or open the sample run
      </Link>
    </form>
  );
}
