"use client";

import { useState } from "react";
import { TrackTimeline } from "@/components/track/track-timeline";
import { DemoControls } from "@/components/track/demo-controls";
import { useTrackState } from "@/components/track/use-track-state";
import { fmtDistance } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tag } from "@/components/ui/chip";
import { Copy, Check, Phone, UserRound, Bike } from "lucide-react";
import dynamic from "next/dynamic";

const TrackMap = dynamic(() => import("@/components/track/track-map"), {
  ssr: false,
  loading: () => <div className="h-64 w-full animate-pulse bg-wash sm:h-72" aria-hidden="true" />,
});

/**
 * The complete live tracking experience (page + drawer share it):
 * LIVE badge, ETA, distance left, stage timeline, volunteer card,
 * proof of delivery, copy-link, demo controls.
 */
export function TrackPanel({ id, compact = false }: { id: string; compact?: boolean }) {
  const state = useTrackState(id);
  const [copied, setCopied] = useState(false);

  if (!state) {
    return (
      <div aria-busy="true" className="space-y-3">
        <div className="h-16 animate-pulse bg-wash" />
        <div className="h-64 animate-pulse bg-wash" />
        <div className="h-24 animate-pulse bg-wash" />
      </div>
    );
  }

  if (!state.listing) {
    return (
      <Card>
        <p className="font-mono text-[11px] uppercase tracking-widest text-muted">
          Tracking ID {id}
        </p>
        <p className="mt-2 font-display text-lg font-semibold">No run with this ID</p>
        <p className="mt-1 text-sm text-muted">
          Tracking IDs appear on claimed listings. The featured demo run lives at
          {" "}
          <span className="font-mono">ETS-2041</span>.
        </p>
      </Card>
    );
  }

  const live = !state.done;

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2500);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-line pb-3">
        <div>
          <p className="flex items-center gap-2">
            {live ? (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-green px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest text-white">
                <span className="live-dot h-2 w-2 rounded-full" aria-hidden="true" />
                Live
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-line px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest text-muted">
                <Check className="h-3 w-3" strokeWidth={3} aria-hidden="true" />
                Complete
              </span>
            )}
            <span className="font-mono text-sm font-semibold tracking-widest uppercase text-blue">
              #{id.replace(/^ETS-/i, "ETS-")}
            </span>
          </p>
          <h2 className="mt-1 font-display text-xl font-bold tracking-tight">
            {state.listing.title} · {state.listing.servings} servings
          </h2>
        </div>
        <Tag>{state.listing.area}</Tag>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="space-y-4">
          <div>
            <TrackMap id={id} progress={state.progress} />
            <p className="mt-2 flex flex-wrap items-baseline justify-between gap-2 font-mono text-sm tabular-nums">
              <span aria-live="polite">
                {live ? (
                  <>
                    <span className="rounded-full bg-blue px-2 py-0.5 text-xs font-semibold text-white">
                      ETA {state.etaMinutesLeft} min
                    </span>{" "}
                    · {fmtDistance(state.distanceKmLeft)} left
                  </>
                ) : (
                  "Delivered"
                )}
              </span>
              {live && <span className="text-muted">Food stays safe the whole ride.</span>}
            </p>
          </div>

          {state.volunteer && !state.done && (
            <Card className="border-blue/30 bg-blue-tint/50">
              <h3 className="font-mono text-[11px] uppercase tracking-widest text-muted">Volunteer</h3>
              <p className="mt-2 flex items-center gap-2 font-medium">
                <UserRound className="h-4 w-4 text-blue" strokeWidth={1.5} aria-hidden="true" />
                {state.volunteer.name}
              </p>
              <p className="mt-1 flex items-center gap-2 text-sm text-muted">
                <Bike className="h-4 w-4 text-blue" strokeWidth={1.5} aria-hidden="true" />
                {state.volunteer.vehicle}
              </p>
              <p className="mt-1 flex items-center gap-2 text-sm text-muted">
                <Phone className="h-4 w-4 text-blue" strokeWidth={1.5} aria-hidden="true" />
                <span className="font-mono">{state.volunteer.phone}</span>
                <span className="text-[11px]">masked for privacy</span>
              </p>
            </Card>
          )}

          {state.done && state.ngo && (
            <Card className="border-green bg-green-tint">
              <div className="flex items-center justify-between gap-3">
                <h3 className="font-mono text-[11px] uppercase tracking-widest text-ink">
                  Proof of delivery
                </h3>
                <span className="inline-flex items-center gap-1.5 rounded-md border-2 border-green bg-surface px-2 py-1 font-mono text-[10px] font-bold uppercase tracking-widest text-green">
                  <Check className="h-3.5 w-3.5" strokeWidth={3} aria-hidden="true" />
                  Delivered
                </span>
              </div>
              <dl className="mt-2 space-y-1 text-sm">
                <div className="flex justify-between gap-3">
                  <dt className="text-muted">Servings delivered</dt>
                  <dd className="font-mono">{state.listing.servings}</dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="text-muted">Delivered at</dt>
                  <dd className="font-mono">
                    {state.listing.deliveredAt
                      ? new Date(state.listing.deliveredAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: false,
                        })
                      : "—"}
                  </dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="text-muted">Receiving NGO</dt>
                  <dd>{state.ngo.name}</dd>
                </div>
              </dl>
            </Card>
          )}
        </div>

        <TrackTimeline stages={state.stages} done={state.done} />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-line pt-3">
        <Button variant="secondary" onClick={copyLink}>
          {copied ? (
            <Check className="h-4 w-4" strokeWidth={2.5} />
          ) : (
            <Copy className="h-4 w-4" strokeWidth={1.5} />
          )}
          {copied ? "Link copied" : "Copy tracking link"}
        </Button>
        {!compact && <span className="font-mono text-[11px] uppercase tracking-widest text-muted">Sample run</span>}
      </div>
      <DemoControls id={state.id} />
    </div>
  );
}
