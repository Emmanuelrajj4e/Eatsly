"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { APP_HASHTAG, APP_MISSION, APP_TAGLINE } from "@/config/brand";
import { fmtClock, fmtCountdown } from "@/lib/utils";
import { safeUntilMs, windowMinutes } from "@/services/geo";
import { soonestOpen } from "@/services/listings";
import { useTicker } from "@/hooks/use-ticker";
import { DietMarker } from "@/components/ui/diet-marker";
import { Tag } from "@/components/ui/chip";
import { ArrowRightIcon, ClockIcon, PlusIcon } from "@/components/icons";
import { buttonStyles } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Listing } from "@/types";

const RADIUS = 34;
const CIRC = 2 * Math.PI * RADIUS;

/** Hero's live "next to spoil" card: ring countdown of the soonest listing. */
export function HeroSoonest() {
  const [listing, setListing] = useState<Listing | null>(null);
  const [loaded, setLoaded] = useState(false);
  const now = useTicker() * 1000;

  // derive only after mount: seed offsets use Date.now(), not allowed at prerender
  useEffect(() => {
    const id = window.requestAnimationFrame(() => {
      setListing(soonestOpen());
      setLoaded(true);
    });
    return () => window.cancelAnimationFrame(id);
  }, []);

  if (!loaded) {
    return (
      <div className="rounded-card border border-line bg-surface p-5" aria-hidden="true">
        <div className="h-4 w-40 animate-pulse rounded bg-foreground/10" />
        <div className="mt-4 h-8 w-28 animate-pulse rounded bg-foreground/[0.06]" />
        <div className="mt-3 h-3 w-48 animate-pulse rounded bg-foreground/[0.04]" />
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="rounded-card border border-line bg-surface p-5">
        <p className="font-mono text-[11px] uppercase tracking-widest text-muted">
          Next to spoil · live
        </p>
        <p className="mt-3 text-sm text-muted">
          Nothing is waiting on the board right now. Post the first batch and this
          clock starts running.
        </p>
        <Link
          href="/post"
          className={cn(buttonStyles("secondary", "md", "mt-4 w-full justify-between"))}
        >
          Post surplus
          <ArrowRightIcon className="h-4 w-4" />
        </Link>
      </div>
    );
  }

  const end = safeUntilMs(listing.preparedAt, listing.type);
  const left = Math.max(0, end - now);
  const total = windowMinutes(listing.type) * 60000;
  const share = Math.max(0, Math.min(1, left / total));
  const mins = left / 60000;
  const stroke = mins < 30 ? "var(--chilli)" : mins < 90 ? "var(--amber)" : "var(--leaf)";

  return (
    <div className="rounded-card border border-line bg-surface p-5">
      <p className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-widest text-muted">
        <ClockIcon className="h-4 w-4 text-chilli" />
        Next to spoil · live
      </p>

      <div className="mt-4 flex items-center gap-4">
        <svg width="84" height="84" viewBox="0 0 84 84" aria-hidden="true">
          <circle cx="42" cy="42" r={RADIUS} fill="none" stroke="var(--line)" strokeWidth="7" />
          <circle
            cx="42"
            cy="42"
            r={RADIUS}
            fill="none"
            stroke={stroke}
            strokeWidth="7"
            strokeLinecap="round"
            strokeDasharray={CIRC}
            strokeDashoffset={CIRC * (1 - share)}
            transform="rotate(-90 42 42)"
            style={{ transition: "stroke-dashoffset 1s linear, stroke 0.4s" }}
          />
          <text
            x="42"
            y="47"
            textAnchor="middle"
            fontSize="13"
            fontFamily="var(--font-mono)"
            fill="currentColor"
          >
            {Math.ceil(mins)}m
          </text>
        </svg>

        <div className="min-w-0">
          <h2 className="truncate font-display text-lg font-semibold">{listing.title}</h2>
          <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1">
            <DietMarker veg={listing.veg} withLabel={false} />
            <Tag>{listing.area}</Tag>
          </p>
          <p className="mt-2 font-mono text-2xl tabular-nums text-foreground">
            {fmtCountdown(left)}
          </p>
          <p className="mt-0.5 font-mono text-xs text-muted">
            Safe until {fmtClock(new Date(end).toISOString())}
          </p>
        </div>
      </div>

      <Link
        href="/board"
        className={cn(buttonStyles("secondary", "md", "mt-4 w-full justify-between"))}
      >
        Claim this food
        <ArrowRightIcon className="h-4 w-4" />
      </Link>
    </div>
  );
}

/** Full hero: headline + mission + CTAs on the left, live card on the right. */
export function Hero() {
  return (
    <section className="mx-auto grid max-w-6xl gap-10 px-4 pb-14 pt-12 md:grid-cols-[1fr_360px] md:items-start md:pt-16">
      <div className="fade-up">
        <p className="font-mono text-sm font-medium uppercase tracking-widest text-leaf">
          Live food-safety countdowns
        </p>
        <h1 className="mt-3 max-w-2xl font-display text-5xl font-extrabold leading-[1.02] tracking-tight sm:text-6xl md:text-7xl">
          {APP_TAGLINE}
        </h1>
        <p className="mt-4 max-w-xl text-lg text-muted">{APP_MISSION}</p>
        <p className="mt-2 font-mono text-sm text-muted">{APP_HASHTAG}</p>
        <div className="mt-7 flex flex-wrap gap-3">
          <Link href="/post" className={buttonStyles("primary", "lg")}>
            <PlusIcon className="h-5 w-5" />
            Post surplus
          </Link>
          <Link href="/board" className={buttonStyles("secondary", "lg")}>
            Claim food
            <ArrowRightIcon className="h-5 w-5" />
          </Link>
        </div>
      </div>

      <aside aria-label="Food closest to expiry" className="fade-up md:pt-6">
        <HeroSoonest />
      </aside>
    </section>
  );
}
