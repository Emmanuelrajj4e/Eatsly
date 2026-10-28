"use client";

import areasJson from "@/data/areas.json";
import { MAP_SIZE, project, safeUntilMs } from "@/services/geo";
import { distanceKm, fmtDistance } from "@/lib/utils";
import type { Listing, NGO } from "@/types";

const AREAS = areasJson as Array<{ name: string; lat: number; lng: number }>;

function urgencyColor(listing: Listing, nowMs: number) {
  if (listing.status !== "open") return "var(--muted)";
  const mins = (safeUntilMs(listing.preparedAt, listing.type) - nowMs) / 60000;
  if (mins < 30) return "var(--chilli)";
  if (mins < 90) return "var(--amber)";
  return "var(--leaf)";
}

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
 * Stylised Hyderabad map: real area positions on an abstracted geography
 * (dashed Outer Ring Road, Hussain Sagar, the Musi). Keyboard-operable pins.
 */
export function SvgMap({ listings, ngos, nowMs, selectedId, onSelect }: MapProps) {
  const selectedListing = listings.find((l) => l.id === selectedId) ?? null;

  // Route: selected listing -> its claimed NGO, else nearest NGO.
  let route: { from: { x: number; y: number }; to: { x: number; y: number }; label: string } | null =
    null;
  if (selectedListing) {
    const claimed = ngos.find((n) => n.id === selectedListing.ngoId);
    const near = claimed
      ? { ngo: claimed, d: distanceKm(selectedListing, claimed) }
      : ngos
          .map((n) => ({ ngo: n, d: distanceKm(selectedListing, n) }))
          .sort((a, b) => a.d - b.d)[0];
    if (near && selectedListing.status !== "open") {
      const ngoS = near.ngo;
      const a = project(selectedListing.lat, selectedListing.lng);
      const b = project(ngoS.lat, ngoS.lng);
      route = { from: a, to: b, label: fmtDistance(near.d) };
    } else if (near) {
      const ngoS = near.ngo;
      const a = project(selectedListing.lat, selectedListing.lng);
      const b = project(ngoS.lat, ngoS.lng);
      route = { from: a, to: b, label: fmtDistance(near.d) };
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
          opacity="0.9"
        />

        {/* Water: Hussain Sagar + Musi river */}
        <ellipse cx="349" cy="248" rx="30" ry="23" fill="var(--water)" opacity="0.85" />
        <text x="349" y="249" textAnchor="middle" fontSize="9" fontFamily="var(--font-mono)" fill="var(--surface)">
          HS L
        </text>
        <text x="349" y="284" textAnchor="middle" fontSize="10" fontFamily="var(--font-mono)" fill="var(--muted)">
          Hussain Sagar
        </text>
        <path
          d="M 20 392 C 120 396 220 394 320 394 C 400 394 470 410 566 419"
          fill="none"
          stroke="var(--water)"
          strokeWidth="3.5"
          opacity="0.85"
        />
        <text x="150" y="382" fontSize="10" fontFamily="var(--font-mono)" fill="var(--muted)">
          Musi river
        </text>

        {/* Area nodes */}
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

        {/* route + label under pins */}
        {route && (
          <>
            <line
              x1={route.from.x}
              y1={route.from.y}
              x2={route.to.x}
              y2={route.to.y}
              stroke="var(--marigold)"
              strokeWidth="2.5"
              strokeDasharray="6 6"
            />
            <g
              transform={`translate(${(route.from.x + route.to.x) / 2} ${(route.from.y + route.to.y) / 2})`}
            >
              <rect x="-34" y="-11" width="68" height="20" rx="10" fill="var(--marigold)" />
              <text
                textAnchor="middle"
                y="4"
                fontSize="11"
                fontFamily="var(--font-mono)"
                fill="var(--marigold-ink)"
              >
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
              <title>{`${n.name} · ${n.area}`}</title>
              {selected && <circle cx={p.x} cy={p.y} r="13" fill="none" stroke="var(--foreground)" strokeWidth="2" />}
              <path
                transform={`translate(${p.x} ${p.y - 14}) rotate(45)`}
                d="M -6 0 L 0 -6 L 6 0 L 0 6 Z"
                fill="var(--marigold)"
                stroke="var(--surface)"
                strokeWidth="1.6"
              />
            </g>
          );
        })}

        {/* Listing pins */}
        {listings.map((l) => {
          const p = project(l.lat, l.lng);
          const selected = selectedId === l.id;
          const color = urgencyColor(l, nowMs);
          const pulse = l.status === "open" && minutesLeft(l, nowMs) < 30;
          const label =
            l.status === "open"
              ? `${l.title}, ${l.area}, ${minutesLeft(l, nowMs)} minutes left`
              : `${l.title}, ${l.status.replace("_", " ")}`;
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
            >
              <title>{label}</title>
              {pulse && (
                <circle
                  cx={p.x}
                  cy={p.y}
                  r="9"
                  fill={color}
                  className="animate-pin-pulse"
                  style={{ transformBox: "fill-box", transformOrigin: "center" }}
                />
              )}
              {selected && <circle cx={p.x} cy={p.y} r="13" fill="none" stroke="var(--foreground)" strokeWidth="2" />}
              <circle cx={p.x} cy={p.y} r={selected ? 9.5 : 8.5} fill={color} stroke="var(--surface)" strokeWidth="2" />
              <circle cx={p.x} cy={p.y} r="2.6" fill="var(--surface)" />
            </g>
          );
        })}
      </svg>

      <figcaption className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 font-mono text-[11px] text-muted">
        <span className="inline-flex items-center gap-1.5">
          <MarkDot /> pin: listing
        </span>
        <span className="inline-flex items-center gap-1.5">
          <MarkDiamond /> diamond: NGO
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="inline-block h-2.5 w-2.5 rounded-full bg-chilli animate-pin-pulse" style={{ transformBox: "fill-box" }} />
          pulse: under 30 min
        </span>
        <span>Tap a pin or card to see the route.</span>
      </figcaption>
    </figure>
  );
}

function MarkDot() {
  return <span className="inline-block h-2.5 w-2.5 rounded-full bg-leaf" />;
}

function MarkDiamond() {
  return (
    <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true">
      <rect x="2.3" y="2.3" width="5.4" height="5.4" transform="rotate(45 5 5)" fill="var(--marigold)" />
    </svg>
  );
}
