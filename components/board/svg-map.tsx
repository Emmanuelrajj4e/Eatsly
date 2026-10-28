"use client";

import areasJson from "@/data/areas.json";
import { MAP_SIZE, project, safeUntilMs } from "@/services/geo";
import { distanceKm, fmtDistance } from "@/lib/utils";
import type { Listing, NGO } from "@/types";

const AREAS = areasJson as Array<{ name: string; lat: number; lng: number }>;

function minutesLeft(listing: Listing, nowMs: number) {
  return Math.max(0, Math.round((safeUntilMs(listing.preparedAt, listing.type) - nowMs) / 60000));
}

export interface MapProps {
  listings: Listing[];
  ngos: NGO[];
  nowMs: number;
  selectedId: string | null;
  onSelect: (id: string | null) => void;
}

/**
 * Stylised Hyderabad SVG map — the offline fallback for the Leaflet map.
 * Real area positions, abstracted geography. Form encodes state (no hue):
 * solid pin = open, pulse ring = urgent, thick hollow ring = claimed,
 * dashed = expired. Keyboard-operable pins.
 */
export function SvgMap({ listings, ngos, nowMs, selectedId, onSelect }: MapProps) {
  const selectedListing = listings.find((l) => l.id === selectedId) ?? null;

  let route: { from: { x: number; y: number }; to: { x: number; y: number }; label: string } | null =
    null;
  if (selectedListing) {
    const claimed = ngos.find((n) => n.id === selectedListing.ngoId);
    const near = claimed
      ? { ngo: claimed, d: distanceKm(selectedListing, claimed) }
      : [...ngos]
          .map((n) => ({ ngo: n, d: distanceKm(selectedListing, n) }))
          .sort((a, b) => a.d - b.d)[0];
    if (near) {
      const ngo = near.ngo;
      route = {
        from: project(selectedListing.lat, selectedListing.lng),
        to: project(ngo.lat, ngo.lng),
        label: fmtDistance(near.d),
      };
    }
  }

  const onKey = (e: React.KeyboardEvent, id: string) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onSelect(selectedId === id ? null : id);
    }
  };

  return (
    <figure className="m-0">
      <svg
        role="img"
        aria-label="Stylised map of Hyderabad with food listing pins and NGO diamonds"
        viewBox={`0 0 ${MAP_SIZE.width} ${MAP_SIZE.height}`}
        className="h-auto w-full rounded-card bg-surface"
      >
        {/* Outer Ring Road */}
        <path
          d="M 60 40 L 380 20 L 620 120 L 630 360 L 470 500 L 150 490 L 20 300 Z"
          fill="none"
          stroke="var(--line)"
          strokeWidth="3"
          strokeDasharray="7 9"
          strokeLinejoin="round"
        />

        {/* water: Hussain Sagar + Musi river */}
        <ellipse cx="349" cy="248" rx="30" ry="23" fill="var(--wash)" stroke="var(--line)" />
        <text x="349" y="282" textAnchor="middle" fontSize="10" fontFamily="var(--font-mono)" fill="var(--muted)">
          Hussain Sagar
        </text>
        <path
          d="M 20 392 C 120 396 220 394 320 394 C 400 394 470 410 566 419"
          fill="none"
          stroke="var(--line)"
          strokeWidth="3.5"
        />
        <text x="150" y="382" fontSize="10" fontFamily="var(--font-mono)" fill="var(--muted)">
          Musi river
        </text>

        {/* area nodes */}
        {AREAS.map((a) => {
          const p = project(a.lat, a.lng);
          return (
            <g key={a.name}>
              <circle cx={p.x} cy={p.y} r="2.5" fill="var(--line)" />
              <text
                x={p.x}
                y={p.y + 13}
                textAnchor="middle"
                fontSize="10"
                fontFamily="var(--font-mono)"
                fill="var(--muted)"
              >
                {a.name}
              </text>
            </g>
          );
        })}

        {/* route + distance label */}
        {route && (
          <>
            <line
              x1={route.from.x}
              y1={route.from.y}
              x2={route.to.x}
              y2={route.to.y}
              stroke="var(--foreground)"
              strokeWidth="2.5"
              strokeDasharray="6 6"
            />
            <g transform={`translate(${(route.from.x + route.to.x) / 2} ${(route.from.y + route.to.y) / 2})`}>
              <rect x="-34" y="-11" width="68" height="20" fill="var(--foreground)" />
              <text textAnchor="middle" y="4" fontSize="11" fontFamily="var(--font-mono)" fill="var(--background)">
                {route.label}
              </text>
            </g>
          </>
        )}

        {/* NGO diamonds */}
        {ngos.map((n) => {
          const p = project(n.lat, n.lng);
          const selected = selectedId === n.id;
          return (
            <g
              key={n.id}
              role="button"
              tabIndex={0}
              aria-pressed={selected}
              aria-label={`NGO ${n.name}, ${n.area}`}
              onClick={(e) => {
                e.stopPropagation();
                onSelect(selected ? null : n.id);
              }}
              onKeyDown={(e) => {
                e.stopPropagation();
                onKey(e, n.id);
              }}
              className="cursor-pointer"
            >
              {selected && <circle cx={p.x} cy={p.y} r="13" fill="none" stroke="var(--foreground)" strokeWidth="2" />}
              <path
                transform={`translate(${p.x} ${p.y}) rotate(45)`}
                d="M -6 0 L 0 -6 L 6 0 L 0 6 Z"
                transform-origin={`${p.x} ${p.y}`}
                fill="var(--background)"
                stroke="var(--foreground)"
                strokeWidth="1.8"
              />
            </g>
          );
        })}

        {/* listing pins, form-coded */}
        {listings.map((l) => {
          const p = project(l.lat, l.lng);
          const selected = selectedId === l.id;
          const expired = l.status === "open" && safeUntilMs(l.preparedAt, l.type) < nowMs;
          const claimed = l.status !== "open";
          const urgent = !expired && !claimed && minutesLeft(l, nowMs) < 30;
          const label =
            l.status === "open"
              ? `${l.title}, ${l.area}, ${minutesLeft(l, nowMs)} minutes left`
              : `${l.title}, ${(l.status ?? "").replace("_", " ")}`;
          return (
            <g
              key={l.id}
              role="button"
              tabIndex={0}
              aria-pressed={selected}
              aria-label={label}
              onClick={(e) => {
                e.stopPropagation();
                onSelect(selected ? null : l.id);
              }}
              onKeyDown={(e) => {
                e.stopPropagation();
                onKey(e, l.id);
              }}
              className="cursor-pointer"
              opacity={expired ? 0.55 : 1}
            >
              {urgent && (
                <circle
                  cx={p.x}
                  cy={p.y}
                  r="10"
                  fill="none"
                  stroke="var(--foreground)"
                  strokeWidth="2"
                  className="animate-pulse-ring"
                  style={{ transformBox: "fill-box", transformOrigin: "center" }}
                />
              )}
              {selected && <circle cx={p.x} cy={p.y} r="13" fill="none" stroke="var(--foreground)" strokeWidth="2" />}
              {claimed ? (
                <circle cx={p.x} cy={p.y} r="7.5" fill="none" stroke="var(--foreground)" strokeWidth="3.5" />
              ) : (
                <circle
                  cx={p.x}
                  cy={p.y}
                  r="7.5"
                  fill="var(--foreground)"
                  stroke="var(--foreground)"
                  strokeWidth={expired ? 0 : 2}
                  strokeDasharray={expired ? "3 3" : undefined}
                />
              )}
              <circle cx={p.x} cy={p.y} r="2.4" fill="var(--background)" strokeDasharray={expired ? "2 2" : undefined} />
            </g>
          );
        })}
      </svg>

      <figcaption className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 font-mono text-[11px] text-muted">
        <span className="inline-flex items-center gap-1.5">
          <span className="inline-block h-2.5 w-2.5 rounded-full bg-foreground" /> pin: listing
        </span>
        <span className="inline-flex items-center gap-1.5">
          <MarkDiamond /> diamond: NGO
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span
            className="inline-block h-2.5 w-2.5 rounded-full border-2 border-foreground animate-pulse-ring"
            style={{ transformBox: "fill-box" }}
          />
          pulse: under 30 min
        </span>
        <span>Click a pin or card to draw its route. Fallback map (tiles offline).</span>
      </figcaption>
    </figure>
  );
}

function MarkDiamond() {
  return (
    <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true">
      <rect
        x="2.3"
        y="2.3"
        width="5.4"
        height="5.4"
        transform="rotate(45 5 5)"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
      />
    </svg>
  );
}
