"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { distanceKm, fmtDistance } from "@/lib/utils";
import { safeUntilMs } from "@/services/geo";
import type { Listing, NGO } from "@/types";

export interface LeafletMapProps {
  listings: Listing[];
  ngos: NGO[];
  nowMs: number;
  selectedId: string | null;
  onSelect: (id: string | null) => void;
  /** Fires after repeated tile errors so the parent can swap to the SVG map. */
  onTilesFail: () => void;
}

const CENTER: [number, number] = [17.404, 78.467];

/**
 * Real Leaflet map: colourful standard tiles, brand-colour markers,
 * dashed blue route + distance label for the selection. Markers are
 * keyboard operable via Leaflet's keyboard handling (tab stops; Enter/Space
 * fire click). Loaded client-side only through map-panel.tsx.
 */
export default function LeafletMap({
  listings,
  ngos,
  nowMs,
  selectedId,
  onSelect,
  onTilesFail,
}: LeafletMapProps) {
  const divRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const layerRef = useRef<L.LayerGroup | null>(null);
  const failRef = useRef(onTilesFail);

  useEffect(() => {
    failRef.current = onTilesFail;
  }, [onTilesFail]);

  useEffect(() => {
    if (mapRef.current || !divRef.current) return;
    const map = L.map(divRef.current, {
      center: CENTER,
      zoom: 11,
      scrollWheelZoom: false,
      zoomControl: true,
      keyboard: true,
    });
    mapRef.current = map;
    layerRef.current = L.layerGroup().addTo(map);

    let errors = 0;
    const tiles = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);
    tiles.on("tileerror", () => {
      errors += 1;
      if (errors > 3) failRef.current();
    });

    return () => {
      map.remove();
      mapRef.current = null;
      layerRef.current = null;
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    const layer = layerRef.current;
    if (!map || !layer) return;
    layer.clearLayers();

    for (const l of listings) {
      const expired = l.status === "open" && safeUntilMs(l.preparedAt, l.type) < nowMs;
      const minsLeft = Math.max(
        0,
        Math.round((safeUntilMs(l.preparedAt, l.type) - nowMs) / 60000),
      );
      const urgent = !expired && l.status === "open" && minsLeft < 30;
      const claimed = l.status !== "open";
      const label =
        l.status === "open"
          ? `${l.title}, ${l.area}, ${minsLeft} minutes left${urgent ? " — urgent" : ""}`
          : `${l.title}, ${claimState(l)}`;
      const icon = L.divIcon({
        className: "",
        html: renderIcon(urgent, expired, l.id === selectedId, claimed),
        iconSize: [26, 26],
        iconAnchor: [13, 13],
      });
      L.marker([l.lat, l.lng], { icon, keyboard: true, title: label, alt: label })
        .bindTooltip(label, { className: "route-label", direction: "top", offset: [0, -14] })
        .on("click", () => onSelect(l.id === selectedId ? null : l.id))
        .addTo(layer);
    }

    for (const n of ngos) {
      const label = `NGO ${n.name}, ${n.area}`;
      L.marker([n.lat, n.lng], {
        icon: L.divIcon({
          className: "",
          html: renderDiamond(),
          iconSize: [24, 24],
          iconAnchor: [12, 12],
        }),
        keyboard: true,
        title: label,
        alt: label,
      })
        .bindTooltip(label, { className: "route-label", direction: "top", offset: [0, -12] })
        .on("click", () => onSelect(n.id === selectedId ? null : n.id))
        .addTo(layer);
    }

    /* dashed route with distance for the selected listing ↔ its NGO */
    const sel = listings.find((l) => l.id === selectedId);
    if (sel) {
      const ngo =
        ngos.find((n) => n.id === sel.ngoId) ??
        [...ngos].sort((a, b) => distanceKm(sel, a) - distanceKm(sel, b))[0];
      if (ngo) {
        L.polyline(
          [
            [sel.lat, sel.lng],
            [ngo.lat, ngo.lng],
          ],
          { className: "route-line", weight: 2, dashArray: "6 8", interactive: false, fill: false },
        ).addTo(layer);
        L.tooltip({ className: "route-label", permanent: true, direction: "center" })
          .setLatLng([(sel.lat + ngo.lat) / 2, (sel.lng + ngo.lng) / 2])
          .setContent(fmtDistance(distanceKm(sel, ngo)))
          .addTo(layer);
      }
    }
  }, [listings, ngos, nowMs, selectedId, onSelect]);

  return (
    <div
      ref={divRef}
      className="h-[420px] w-full border border-line sm:h-[480px]"
      aria-label="Map of Hyderabad with food listing pins and NGO diamonds"
      role="region"
    />
  );
}

function claimState(l: Listing) {
  return (l.status ?? "").replace("_", " ");
}

/**
 * Marker art in brand colour: orange pin = open listing (red pulse <30 min),
 * blue + check = claimed, gray = expired. Form (ring/check/stripes) always
 * rides along so the hue is never the only signal.
 */
function renderIcon(urgent: boolean, expired: boolean, selected: boolean, claimed: boolean) {
  const colour = expired
    ? "var(--muted)"
    : claimed
      ? "var(--blue)"
      : urgent
        ? "var(--red)"
        : "var(--orange)";
  return `<span style="color: ${colour}; opacity: ${
    expired ? 0.55 : 1
  }; display: grid; place-items: center; width: 26px; height: 26px; position: relative;">
    ${
      urgent
        ? `<span class="pointer-events-none absolute inset-0 rounded-full border-2 border-current animate-pulse-ring"></span>`
        : ""
    }
    <span class="relative grid place-items-center rounded-full border-2 border-current" style="width: 14px; height: 14px; background: currentcolor">
      <span style="width: 4px; height: 4px; border-radius: 9999px; background: #ffffff"></span>
    </span>
    ${
      claimed
        ? `<span class="pointer-events-none absolute -right-0.5 -top-0.5 grid h-3.5 w-3.5 place-items-center rounded-full border-2 border-current" style="background: #ffffff">
            <svg width="8" height="8" viewBox="0 0 8 8" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M1.5 4.5 L3 6 L6.5 2"/></svg>
          </span>`
        : ""
    }
    ${selected ? `<span class="pointer-events-none absolute inset-1 rounded-full border border-current"></span>` : ""}
  </span>`;
}

function renderDiamond() {
  return `<span style="color: var(--green); display: grid; place-items: center; width: 24px; height: 24px;">
    <svg width="14" height="14" viewBox="0 0 14 14" style="transform: rotate(45deg)">
      <rect x="2" y="2" width="10" height="10" fill="#FFFFFF" stroke="currentColor" stroke-width="2"/>
    </svg>
  </span>`;
}
