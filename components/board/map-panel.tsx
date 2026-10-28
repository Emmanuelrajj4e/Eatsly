"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { SvgMap } from "@/components/board/svg-map";
import type { Listing, NGO } from "@/types";

const LeafletMap = dynamic(() => import("./leaflet-map"), {
  ssr: false,
  loading: () => (
    <div className="h-[420px] w-full animate-pulse border border-line bg-wash sm:h-[480px]" aria-hidden="true" />
  ),
});

type MapProps = {
  listings: Listing[];
  ngos: NGO[];
  nowMs: number;
  selectedId: string | null;
  onSelect: (id: string | null) => void;
};

/**
 * Map shell for the board: real Leaflet + OSM tiles, swapping to the
 * stylised SVG Hyderabad map when tiles fail to load (offline, blocked CDN).
 */
export function MapPanel(props: MapProps) {
  const [tilesFailed, setTilesFailed] = useState(false);

  if (tilesFailed) return <SvgMap {...props} />;

  return <LeafletMap {...props} onTilesFail={() => setTilesFailed(true)} />;
}
