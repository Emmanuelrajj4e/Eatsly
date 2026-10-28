"use client";

import "leaflet/dist/leaflet.css";

import { useEffect, useRef } from "react";

declare global {
  interface Window {
    L?: typeof import("leaflet");
  }
}

export interface MapPoint {
  id: string;
  lat: number;
  lng: number;
  label: string;
  /** pin tint class of the marker */
  tone: "primary" | "accent" | "muted";
  selected?: boolean;
}

/**
 * Lightweight Leaflet map (OpenStreetMap tiles — no API keys).
 * Leaflet is imported lazily and only on the client.
 */
export function MapView({
  center,
  points,
  onSelect,
  className,
}: {
  center: { lat: number; lng: number } | null;
  points: MapPoint[];
  onSelect?: (id: string) => void;
  className?: string;
}) {
  const holder = useRef<HTMLDivElement>(null);
  const mapRef = useRef<import("leaflet").Map | null>(null);
  const layerRef = useRef<import("leaflet").LayerGroup | null>(null);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      const mod = await import("leaflet");
      const L =
        window.L ??
        ((mod as unknown as { default?: typeof import("leaflet") }).default ?? mod);
      if (!L || cancelled || !holder.current) return;
      if (mapRef.current) return;

      const dark = document.documentElement.classList.contains("dark");
      const map = L.map(holder.current, { scrollWheelZoom: true });
      L.tileLayer(
        dark
          ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          : "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        {
          attribution: dark
            ? '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> © CARTO'
            : '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          maxZoom: 19,
        }
      ).addTo(map);

      const c = center ?? { lat: 17.385, lng: 78.4867 };
      map.setView([c.lat, c.lng], 12);
      layerRef.current = L.layerGroup().addTo(map);
      mapRef.current = map;
      window.requestAnimationFrame(() => mapRef.current?.invalidateSize());
    })();

    return () => {
      cancelled = true;
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
        layerRef.current = null;
      }
    };
  }, [center]);

  // pins
  useEffect(() => {
    const L = window.L;
    const map = mapRef.current;
    if (!L || !map || !layerRef.current) return;
    layerRef.current.clearLayers();

    const tones: Record<MapPoint["tone"], [string, string]> = {
      primary: ["#16a34a", "#f4efe6"],
      accent: ["#ea580c", "#fff"],
      muted: ["#78716c", "#fff"],
    };

    for (const p of points) {
      const [bg, fg] = tones[p.tone];
      const icon = L.divIcon({
        className: "",
        html: `<div title="${p.label}" style="background:${bg};color:${fg};width:30px;height:30px;display:flex;align-items:center;justify-content:center;border:2px solid #fff;border-radius:50% 50% 50% 4px;box-shadow:0 2px 6px rgba(0,0,0,.35);font-weight:700">${p.selected ? "★" : "•"}</div>`,
        iconSize: [30, 30],
        iconAnchor: [15, 30],
      });
      const marker = L.marker([p.lat, p.lng], { icon, title: p.label }).addTo(layerRef.current);
      marker.bindTooltip(p.label, { direction: "top" });
      if (onSelect) marker.on("click", () => onSelect(p.id));
    }

    if (points.length > 0) {
      const bounds = L.latLngBounds(points.map((p) => [p.lat, p.lng]));
      if (center && center.lat) bounds.extend([center.lat, center.lng]);
      map.fitBounds(bounds, { padding: [40, 40], maxZoom: 14 });
    }
  }, [points, center, onSelect]);

  return (
    <div
      ref={holder}
      className={className ?? "h-80 w-full rounded-2xl"}
      role="region"
      aria-label="Map of donation pickup points"
    />
  );
}
