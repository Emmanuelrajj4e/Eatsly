"use client";

import { useState } from "react";
import data from "@/data/nutrition.json";
import { Card } from "@/components/ui/card";
import { X, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

type Food = (typeof data.foods)[number] & Record<string, unknown>;

const MAX_ITEMS = 6;

/** Meal targets are plain approximations; every number says so. */
const TARGETS: Record<string, { item: keyof Food; unit: string; label: string; target: number }> = {
  kcal: { item: "kcal", unit: "kcal", label: "Energy", target: 700 },
  protein: { item: "protein", unit: "g", label: "Protein", target: 25 },
  carbs: { item: "carbs", unit: "g", label: "Carbs", target: 95 },
  fat: { item: "fat", unit: "g", label: "Fat", target: 23 },
  fibre: { item: "fibre", unit: "g", label: "Fibre", target: 10 },
  iron: { item: "iron", unit: "mg", label: "Iron", target: 6 },
  calcium: { item: "calcium", unit: "mg", label: "Calcium", target: 350 },
};

const FOODS = data.foods as Food[];

/**
 * The Plate Builder: tap foods onto a thali drawn in SVG; the bars for
 * energy, protein, carbs, fat, fibre, iron and calcium update live with a
 * plain-language balance note — never a numeric score.
 */
export function PlateBuilder({ compact = false }: { compact?: boolean }) {
  const [plate, setPlate] = useState<Food[]>(() => FOODS.slice(0, 3) as Food[]);

  const totals = plate.reduce<Record<string, number>>(
    (acc, f) => {
      for (const t of Object.values(TARGETS)) {
        acc[t.item as string] = (acc[t.item as string] ?? 0) + Number(f[t.item] ?? 0);
      }
      return acc;
    },
    {},
  );

  const toggle = (food: Food) => {
    setPlate((prev) =>
      prev.some((f) => f.name === food.name)
        ? prev.filter((f) => f.name !== food.name)
        : prev.length >= MAX_ITEMS
          ? prev
          : [...prev, food],
    );
  };

  const onPlate = (food: Food) => plate.some((f) => f.name === food.name);
  const notes = balanceNotes(plate, totals);

  return (
    <Card className={cn("grid gap-6", compact ? "sm:grid-cols-[minmax(0,240px)_1fr]" : "lg:grid-cols-[minmax(0,260px)_1fr] lg:gap-8")}>
      {/* thali */}
      <figure className="m-0">
        <svg
          role="img"
          aria-label={`Thali with ${plate.map((f) => f.name).join(", ") || "nothing yet"} on it`}
          viewBox="0 0 220 220"
          className="mx-auto h-auto w-full max-w-[240px]"
        >
          <circle cx="110" cy="110" r="100" fill="var(--surface)" stroke="var(--line-strong)" strokeWidth="2.5" />
          <circle cx="110" cy="110" r="88" fill="none" stroke="var(--line)" strokeDasharray="3 5" />
          {plate.map((f, i) => {
            const angle = (i / Math.max(plate.length, 3)) * Math.PI * 2 - Math.PI / 2;
            const cx = 110 + Math.cos(angle) * 62;
            const cy = 110 + Math.sin(angle) * 62;
            const initials = f.name.slice(0, 2).toUpperCase();
            return (
              <g key={f.name}>
                <circle cx={cx} cy={cy} r="20" fill="var(--background)" stroke="var(--foreground)" strokeWidth="1.8" />
                <text x={cx} y={cy + 4} textAnchor="middle" fontSize="11" fontFamily="var(--font-mono)" fill="var(--foreground)">
                  {initials}
                </text>
              </g>
            );
          })}
          {plate.length === 0 && (
            <text x="110" y="114" textAnchor="middle" fontSize="11" fontFamily="var(--font-mono)" fill="var(--muted)">
              empty plate
            </text>
          )}
        </svg>
        <figcaption className="mt-2 text-center font-mono text-[11px] uppercase tracking-widest text-muted">
          {plate.map((f) => f.name).join(" · ") || "Tap foods to build a thali"}
        </figcaption>
      </figure>

      <div>
        {/* bars */}
        <div role="group" aria-label="Approximate meal totals">
          <ul className="grid grid-cols-1 border-y border-line sm:grid-cols-2">
            {Object.entries(TARGETS).map(([key, t]) => {
              const value = totals[t.item as string] ?? 0;
              const share = Math.min(1, value / t.target);
              return (
                <li key={key} className="px-1 py-2.5 sm:border-r sm:border-line">
                  <p className="flex items-baseline justify-between gap-2 text-sm">
                    <span className="font-mono text-[11px] uppercase tracking-widest text-muted">{t.label}</span>
                    <span className="font-mono tabular-nums">
                      {Math.round(value)}
                      <span className="text-muted"> {t.unit}</span>
                    </span>
                  </p>
                  <div className="mt-1 h-2 border border-line" aria-hidden="true">
                    <div className="h-full bg-foreground" style={{ width: `${share * 100}%` }} />
                  </div>
                  <p className="sr-only">{Math.round((value / t.target) * 100)}% of the approximate per-meal target.</p>
                </li>
              );
            })}
          </ul>
        </div>

        {/* plain-language note instead of a score */}
        <ul aria-live="polite" className="mt-3 space-y-1 text-sm leading-6">
          {notes.map((n) => (
            <li key={n} className="flex items-start gap-2">
              <Plus className="mt-1 h-3.5 w-3.5 shrink-0 text-muted" strokeWidth={2} />
              <span>{n}</span>
            </li>
          ))}
        </ul>

        {/* food chips */}
        <div className="mt-4">
          <h3 className="font-mono text-[11px] uppercase tracking-widest text-muted">
            Common Indian foods — tap to add or remove
          </h3>
          <ul className="mt-2 flex flex-wrap gap-2">
            {FOODS.map((f) => {
              const on = onPlate(f);
              return (
                <li key={f.name}>
                  <button
                    type="button"
                    aria-pressed={on}
                    onClick={() => toggle(f)}
                    className={cn(
                      "inline-flex h-11 cursor-pointer items-center gap-1.5 border px-3 font-mono text-xs transition-colors",
                      on
                        ? "border-transparent bg-foreground text-background"
                        : "border-line bg-surface text-foreground hover:bg-wash",
                    )}
                  >
                    {f.name}
                    {on && <X className="h-3.5 w-3.5" strokeWidth={2} />}
                  </button>
                </li>
              );
            })}
          </ul>
          {plate.length >= MAX_ITEMS && (
            <p className="mt-2 font-mono text-[11px] text-muted">
              Plate holds {MAX_ITEMS} foods for the demo — remove one to add another.
            </p>
          )}
          <p className="mt-3 text-xs text-muted">
            Values approximate per typical serving; reference: Indian Food Composition Tables
            (ICMR-NIN). Meal targets above are rough per-meal guides, not prescriptions.
          </p>
        </div>
      </div>
    </Card>
  );
}

/** Rules written in plain words — the brief says no numeric score. */
function balanceNotes(plate: Food[], totals: Record<string, number>): string[] {
  const notes: string[] = [];
  if (plate.length === 0) {
    return ["Start with a grain — rice, roti or millet — then add one dal or curd."];
  }
  const hasVeg = plate.some((f) => f.name === "Spinach" || f.name === "Mixed veg");
  const proteinPct = (totals.protein ?? 0) * 4 / Math.max(totals.kcal ?? 1, 1);
  const fibreShare = (totals.fibre ?? 0) / TARGETS.fibre.target;
  const grain = plate.some((f) => ["Rice", "Roti", "Millet"].includes(f.name));

  if (!grain) notes.push("Add rice, roti or millet so the plate has steady energy.");
  if (!hasVeg) notes.push("Add a vegetable for more fibre and vitamins.");
  else if (fibreShare < 0.6) notes.push("Fibre is still low — rajma, greens or a banana would top it up.");
  if (proteinPct < 0.12 && !plate.some((f) => ["Dal", "Rajma", "Egg", "Chicken", "Fish", "Paneer", "Curd", "Milk"].includes(f.name))) {
    notes.push("Add dal, curd, egg or paneer — this plate is light on protein for a growing child.");
  }
  if (grain && hasVeg && proteinPct >= 0.12) notes.push("Balanced plate: grain + vegetable + protein covers the essentials.");
  return notes.slice(0, 2);
}
