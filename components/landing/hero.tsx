"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { DEMO_TRACKING_ID, HERO_QUOTE, APP_MISSION } from "@/config/brand";
import { soonestOpen } from "@/services/listings";
import { fmtClock, fmtCountdown } from "@/lib/utils";
import { safeUntilMs, windowMinutes } from "@/services/geo";
import { useTicker } from "@/hooks/use-ticker";
import { DietMarker } from "@/components/ui/diet-marker";
import { Tag } from "@/components/ui/chip";
import { buttonStyles } from "@/components/ui/button";
import { ArrowRight, Link2, Plus } from "lucide-react";
import { PatternImage } from "@/components/landing/pattern-image";
import type { Listing } from "@/types";

const RADIUS = 30;
const CIRC = 2 * Math.PI * RADIUS;

/** Hero's live card: "next to spoil" ring + a mini run preview. */
function HeroLiveCard() {
  const [listing, setListing] = useState<Listing | null>(null);
  const [loaded, setLoaded] = useState(false);
  const now = useTicker() * 1000;

  useEffect(() => {
    const id = window.requestAnimationFrame(() => {
      setListing(soonestOpen());
      setLoaded(true);
    });
    return () => window.cancelAnimationFrame(id);
  }, []);

  if (!loaded) {
    return (
      <div className="border border-line p-5" aria-hidden="true">
        <div className="h-4 w-40 animate-pulse bg-wash" />
        <div className="mt-4 h-8 w-28 animate-pulse bg-wash" />
        <div className="mt-3 h-3 w-48 animate-pulse bg-wash" />
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="border border-line p-5">
        <p className="font-mono text-[11px] uppercase tracking-widest text-muted">Next to spoil · live</p>
        <p className="mt-3 text-sm text-muted">
          The board is clear right now. Post the first batch and a clock starts here.
        </p>
        <Link href="/post" className={buttonStyles("secondary", "md", "mt-4 w-full justify-between")}>
          Post surplus
          <ArrowRight className="h-4 w-4" strokeWidth={1.5} />
        </Link>
      </div>
    );
  }

  const end = safeUntilMs(listing.preparedAt, listing.type);
  const left = Math.max(0, end - now);
  const share = Math.max(0, Math.min(1, left / (windowMinutes(listing.type) * 60000)));
  const mins = left / 60000;

  return (
    <div className="border-2 border-line-strong bg-surface p-5">
      <p className="font-mono text-[11px] uppercase tracking-widest text-muted">
        Next to spoil · live
      </p>
      <div className="mt-4 flex items-center gap-4">
        <svg width="76" height="76" viewBox="0 0 76 76" aria-hidden="true">
          <circle cx="38" cy="38" r={RADIUS} fill="none" stroke="var(--line)" strokeWidth="3" />
          <circle
            cx="38"
            cy="38"
            r={RADIUS}
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeDasharray={CIRC}
            strokeDashoffset={CIRC * (1 - share)}
            transform="rotate(-90 38 38)"
            style={{ transition: "stroke-dashoffset 1s linear" }}
          />
          <text x="38" y="42" textAnchor="middle" fontSize="12" fontFamily="var(--font-mono)" fill="currentColor">
            {Math.ceil(mins)}m
          </text>
        </svg>
        <div className="min-w-0">
          <h2 className="truncate font-display text-lg font-bold">{listing.title}</h2>
          <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1">
            <DietMarker veg={listing.veg} withLabel={false} />
            <Tag>{listing.area}</Tag>
          </p>
          <p className="mt-1 font-mono text-xl tabular-nums">{fmtCountdown(left)}</p>
        </div>
      </div>
      <p className="font-mono text-[11px] text-muted">
        Safe until {fmtClock(new Date(end).toISOString())}
      </p>

      <div className="mt-4 border-t border-line pt-3">
        <p className="font-mono text-[11px] uppercase tracking-widest text-muted">Latest run</p>
        <p className="mt-1 flex items-baseline justify-between gap-2 text-sm">
          <span className="font-mono">{DEMO_TRACKING_ID}</span>
          <span className="text-muted">Claimed · volunteer assigned</span>
        </p>
        <Link href={`/track/${DEMO_TRACKING_ID}`} className={buttonStyles("secondary", "md", "mt-3 w-full justify-between")}>
          <span className="inline-flex items-center gap-2">
            Track delivery
            <Link2 className="h-4 w-4" strokeWidth={1.5} />
          </span>
          <ArrowRight className="h-4 w-4" strokeWidth={1.5} />
        </Link>
      </div>
    </div>
  );
}

/** Hero: quote headline, mission, CTAs, photo, live card. */
export function Hero() {
  return (
    <section className="mx-auto max-w-6xl px-4 pb-14 pt-10 md:pt-16">
      <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_380px] lg:items-start">
        <div className="fade-up">
          <p className="font-mono text-xs uppercase tracking-widest text-muted">
            One live clock on every surplus meal
          </p>
          <h1 className="mt-4 max-w-4xl font-quote text-5xl italic leading-[1.05] sm:text-6xl md:text-7xl">
            {HERO_QUOTE}
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted">{APP_MISSION}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/post" className={buttonStyles("primary", "lg")}>
              <Plus className="h-5 w-5" strokeWidth={1.5} />
              Post surplus
            </Link>
            <Link href="/board" className={buttonStyles("secondary", "lg")}>
              Claim food
              <ArrowRight className="h-5 w-5" strokeWidth={1.5} />
            </Link>
          </div>
        </div>

        <div className="space-y-4 fade-up">
          <PatternImage
            subject="Image: hands sharing a plate of food"
            caption="Photo placeholder: hero-hands-sharing-meal.jpg"
            ratio="4 / 3"
          />
          <HeroLiveCard />
        </div>
      </div>
    </section>
  );
}
