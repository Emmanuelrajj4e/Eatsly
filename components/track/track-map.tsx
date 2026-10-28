"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { routeFor } from "@/services/tracking";

const CENTER: [number, number] = [17.404, 78.467];

/**
 * Tracking map: dashed blue route whose travelled part is green, volunteer
 * marker (blue, pulsing) moving along the path, green NGO diamond at the
 * end, orange donor pin at the start. The same 1 Hz state feed drives it;
 * Leaflet handles keyboard panning.
 */
export default function TrackMap({ id, progress }: { id: string; progress: number }) {
  const divRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const baseRef = useRef<L.Polyline | null>(null);
  const solidRef = useRef<L.Polyline | null>(null);
  const bikeRef = useRef<L.Marker | null>(null);

  useEffect(() => {
    if (mapRef.current || !divRef.current) return;
    // A map created without an initial view throws "Set map center and zoom
    // first." the instant a tile layer is added — always open with a view.
    const map = L.map(divRef.current, {
      center: CENTER,
      zoom: 12,
      scrollWheelZoom: false,
      zoomControl: true,
      keyboard: true,
      attributionControl: true,
    });
    mapRef.current = map;
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);
    return () => {
      map.remove();
      mapRef.current = null;
      // The route overlays belong to this map instance — dropping the stale
      // refs makes a remount rebuild (and re-frame) them on the fresh map.
      baseRef.current = null;
      solidRef.current = null;
      bikeRef.current = null;
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !divRef.current) return;
    const route = routeFor(id);
    if (!route) return;

    const from: L.LatLngExpression = [route.from.lat, route.from.lng];
    const to: L.LatLngExpression = [route.to.lat, route.to.lng];

    const bounds = L.latLngBounds([from, to]).pad(0.25);
    if (!baseRef.current) {
      map.fitBounds(bounds, { padding: [20, 20] });
      baseRef.current = L.polyline([from, to], {
        className: "route-line",
        weight: 2,
        dashArray: "6 8",
        interactive: false,
        fill: false,
      }).addTo(map);
    }

    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
    const here: L.LatLngExpression = [
      lerp(route.from.lat, route.to.lat, progress),
      lerp(route.from.lng, route.to.lng, progress),
    ];

    if (!solidRef.current) {
      solidRef.current = L.polyline([from, from], {
        className: "route-done",
        weight: 3.5,
        dashArray: undefined,
        interactive: false,
        fill: false,
      }).addTo(map);
    }
    solidRef.current.setLatLngs([from, progress > 0 ? here : from]);

    if (!bikeRef.current) {
      bikeRef.current = L.marker(from, {
        keyboard: false,
        icon: L.divIcon({
          className: "",
          html: `<span style="display:grid;place-items:center;width:28px;height:28px;position:relative;color:var(--blue)">
              <span class="pointer-events-none absolute inset-0 rounded-full border-2 border-current animate-pulse-ring"></span>
              <span style="width:13px;height:13px;border-radius:9999px;background:currentColor;border:2px solid #ffffff"></span>
            </span>`,
          iconSize: [28, 28],
          iconAnchor: [14, 14],
        }),
      }).addTo(map);
      L.marker(to, {
        keyboard: false,
        icon: L.divIcon({
          className: "",
          html: `<span style="color:var(--green);display:grid;place-items:center;width:24px;height:24px">
              <svg width="14" height="14" viewBox="0 0 14 14" style="transform:rotate(45deg)">
                <rect x="2" y="2" width="10" height="10" fill="#FFFFFF" stroke="currentColor" stroke-width="2"/>
              </svg>
            </span>`,
          iconSize: [24, 24],
          iconAnchor: [12, 12],
        }),
      }).addTo(map);
      L.marker(from, {
        keyboard: false,
        icon: L.divIcon({
          className: "",
          html: `<span style="display:grid;place-items:center;width:22px;height:22px;position:relative;color:var(--orange)">
              <span class="relative grid place-items-center rounded-full" style="width:11px;height:11px;background:currentColor;border:2px solid #ffffff">
                <span style="width:3px;height:3px;border-radius:9999px;background:#ffffff"></span>
              </span>
            </span>`,
          iconSize: [22, 22],
          iconAnchor: [11, 11],
        }),
      }).addTo(map);
    }
    bikeRef.current.setLatLng(here);

    return () => {
      /* marker/line teardown happens with the map on unmount */
      void map;
    };
  }, [id, progress]);

  return (
    <div
      ref={divRef}
      className="h-64 w-full border border-line sm:h-72"
      role="region"
      aria-label="Delivery route map"
    />
  );
}
