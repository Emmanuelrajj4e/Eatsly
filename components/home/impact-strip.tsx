"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import data from "@/data/impact.json";
import { useCountUp } from "@/hooks/use-count-up";
import { getListings } from "@/services/listings";
import { KG_PER_SERVING } from "@/config/brand";
import { ArrowRightIcon } from "@/components/icons";

interface Counter {
  label: string;
  target: () => number;
  suffix?: string;
}

/** Counters recompute from the live board: claims and deliveries move them. */
const counters: Counter[] = [
  { label: "meals rescued today", target: () => data.mealsTodayBase },
  {
    label: "servings waiting now",
    target: () =>
      getListings().reduce((sum, l) => sum + (l.status === "open" ? l.servings : 0), 0),
  },
  {
    label: "kg saved from the bin",
    target: () => data.kgSavedBase,
  },
  { label: "partner NGOs on the board", target: () => 7 },
];

function CounterCell({ counter }: { counter: Counter }) {
  const target = useMountedTarget(counter.target);
  const v = useCountUp(target);
  return (
    <div className="rounded-card border border-line bg-surface p-5">
      <p className="font-mono text-4xl font-semibold tabular-nums text-foreground sm:text-[2.6rem]">
        <span aria-hidden="true">{v.toLocaleString("en-IN")}{counter.suffix ?? ""}</span>
        <span className="sr-only">{target.toLocaleString("en-IN")}{counter.suffix ?? ""}</span>
      </p>
      <p className="mt-1 text-sm text-muted">{counter.label}</p>
    </div>
  );
}

function useMountedTarget(fn: () => number) {
  const [t, setT] = useState(0);
  useEffect(() => {
    // rAF-deferred: seed offsets depend on Date.now(), not allowed during prerender
    const id = requestAnimationFrame(() => setT(fn()));
    return () => cancelAnimationFrame(id);
  }, [fn]);
  return t;
}

/** Animated impact counters; numbers update as claims and deliveries happen. */
export function ImpactStrip() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-6" aria-label="Impact counters">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {counters.map((c) => (
          <CounterCell key={c.label} counter={c} />
        ))}
      </div>
      <p className="mt-3 flex flex-wrap items-center gap-2 text-xs text-muted">
        Sample data · updated as the board changes
        <Link
          href="/impact"
          className="inline-flex items-center gap-1 font-medium text-foreground underline-offset-4 hover:underline"
        >
          Full impact dashboard
          <ArrowRightIcon className="h-3.5 w-3.5" />
        </Link>
        <span className="sr-only">Weight estimated at {KG_PER_SERVING} kg per serving.</span>
      </p>
    </section>
  );
}
