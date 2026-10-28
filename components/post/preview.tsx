"use client";

import { fmtClock, fmtDistance, fmtCountdown, distanceKm } from "@/lib/utils";
import { etaMinutes, windowMinutes } from "@/services/geo";
import { getNgos } from "@/services/ngos";
import { MIN_POST_MINUTES, SAFE_WINDOWS, KG_PER_SERVING } from "@/config/brand";
import { TAG_TONES, Tag } from "@/components/ui/chip";
import { Card } from "@/components/ui/card";
import { TriangleAlert } from "lucide-react";
import rawAreas from "@/data/areas.json";
import type { FoodType } from "@/types";

const AREAS = rawAreas as Array<{ name: string; lat: number; lng: number }>;

export interface FormData {
  title: string;
  donorName: string;
  area: string;
  type: FoodType;
  veg: boolean;
  servings: number;
  preparedTime: string; // "HH:MM"
  tags?: string[];
}

/** Everything the preview needs. Clock reads come only from the shared ticker. */
export function buildFormData(
  data: FormData,
  nowMs: number,
): {
  preparedAt: string;
  endMs: number;
  leftMs: number;
  totalMs: number;
  weightKg: number;
  nearest?: { name: string; km: number; eta: number };
} | null {
  if (!/^\d{2}:\d{2}$/.test(data.preparedTime)) return null;
  const [h, m] = data.preparedTime.split(":").map(Number);
  const d = new Date();
  d.setHours(h, m, 0, 0);
  const endMs = d.getTime() + windowMinutes(data.type) * 60000;
  return {
    preparedAt: d.toISOString(),
    endMs,
    leftMs: endMs - nowMs,
    totalMs: windowMinutes(data.type) * 60000,
    weightKg: data.servings * KG_PER_SERVING,
    nearest: nearestNgo(data.area),
  };
}

function nearestNgo(areaName: string) {
  const area = AREAS.find((a) => a.name === areaName);
  if (!area) return undefined;
  const sorted = getNgos()
    .map((n) => ({ ngo: n, km: distanceKm(area, n) }))
    .sort((a, b) => a.km - b.km)[0];
  if (!sorted) return undefined;
  return {
    name: sorted.ngo.name,
    km: sorted.km,
    eta: etaMinutes(area, sorted.ngo),
  };
}

/** Right-hand panel: safe-until clock, live countdown, weight, NGO, block notice. */
export function PreviewPanel({ data, nowMs }: { data: FormData | null; nowMs: number }) {
  const built = data ? buildFormData(data, nowMs) : null;
  const blocked = built ? built.leftMs < MIN_POST_MINUTES * 60000 : false;

  if (!built) {
    return (
      <aside aria-label="Post preview" className="space-y-4">
        <Card>
          <p className="font-mono text-xs uppercase tracking-widest text-muted">
            Live preview
          </p>
          <p className="mt-3 text-sm text-muted">
            Fill the form and this panel previews the listing exactly as NGOs will see
            it on the board — clock, weight and the nearest NGO.
          </p>
        </Card>
        <RulesCard />
      </aside>
    );
  }

  if (blocked) {
    return (
      <aside aria-label="Post preview" className="space-y-4">
        <Card className="border-red border-2 bg-red-tint">
          <p className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-red">
            <TriangleAlert className="h-4 w-4" strokeWidth={2} aria-hidden="true" /> Cannot post — too late
          </p>
          <p className="mt-2 text-sm text-ink">
            This batch has under <strong>{MIN_POST_MINUTES} minutes</strong> of safe
            window left, so NGOs cannot reach it in time. Serve it fresh, or post the
            next batch with an earlier prepare time.
          </p>
          <p className="mt-2 font-mono text-2xl tabular-nums text-red">
            {fmtCountdown(Math.max(0, built.leftMs))}
          </p>
        </Card>
        <RulesCard />
      </aside>
    );
  }

  return (
    <aside aria-label="Post preview" className="space-y-4">
      <Card>
        <p className="font-mono text-xs uppercase tracking-widest text-muted">Live preview</p>
        <div className="mt-3 grid gap-2 text-sm">
          <Row label="Safe until" value={fmtClock(new Date(built.endMs).toISOString())} />
          <Row label="Food type" value={SAFE_WINDOWS[data!.type].label} />
          <Row label="Diet" value={data!.veg ? "Veg" : "Non-veg"} />
          <Row label="Est. weight" value={`≈ ${built.weightKg.toFixed(1)} kg`} />
        </div>
        {/* nutrition profile, exactly as the board will render it */}
        {data!.tags && data!.tags.length > 0 && (
          <p className="mt-3 flex flex-wrap items-center gap-1.5">
            <span className="font-mono text-[10px] uppercase tracking-widest text-muted">
              Nutrition:
            </span>
            {data!.tags.map((t) => (
              <Tag key={t} className={TAG_TONES[t] ?? undefined}>
                {t}
              </Tag>
            ))}
          </p>
        )}

        <p className="mt-3 font-mono text-3xl font-semibold tabular-nums">
          {fmtCountdown(Math.max(0, built.leftMs))}
        </p>
        <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-wash" aria-hidden="true">
          <div
            className={
              built.leftMs < 30 * 60000
                ? "bar-striped h-full"
                : built.leftMs < 90 * 60000
                  ? "h-full rounded-full bg-yellow"
                  : "h-full rounded-full bg-green"
            }
            style={{
              width: `${Math.min(100, Math.max(0, (built.leftMs / built.totalMs) * 100))}%`,
              transition: "width 1s linear",
            }}
          />
        </div>

        {built.nearest && (
          <p className="mt-3 rounded-card bg-blue-tint/60 p-2.5 text-sm text-muted">
            Nearest NGO{" "}
            <span className="font-medium text-ink">{built.nearest.name}</span>
            <span className="block font-mono text-xs">
              {fmtDistance(built.nearest.km)} · ETA {built.nearest.eta} min
            </span>
          </p>
        )}
      </Card>
      <RulesCard />
    </aside>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <span className="text-muted">{label}</span>
      <span className="font-medium text-foreground">{value}</span>
    </div>
  );
}

/** The four safe-window rules, exactly as the board enforces them. */
export function RulesCard() {
  return (
    <Card aria-label="Safe-window rules">
      <p className="flex items-center justify-between font-mono text-xs uppercase tracking-widest text-muted">
        Safe-window rules <Tag>enforced</Tag>
      </p>
      <ul className="mt-2 space-y-1.5 text-sm text-muted">
        {Object.values(SAFE_WINDOWS).map((w) => (
          <li key={w.label} className="flex justify-between gap-2">
            <span>{w.label}</span>
            <span className="font-mono text-foreground">{w.minutes / 60} h</span>
          </li>
        ))}
      </ul>
      <p className="mt-2 text-xs text-muted">
        Claims are accepted only when an NGO can arrive at least 10 minutes before
        this clock ends.
      </p>
    </Card>
  );
}
