"use client";

import { useState } from "react";
import data from "@/data/nutrition.json";
import { Tabs, TabPanel } from "@/components/ui/tabs";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";

type Nutrient = {
  key: string;
  name: string;
  what: string;
  why: string;
  sources: string[];
  signs: string;
};

const GROUPS = [
  { key: "macro", label: "Macronutrients" },
  { key: "micro", label: "Micronutrients" },
] as const;

/** Group colours mirror the palette contract (brief §design tokens). */
const TINT_DOT: Record<string, string> = {
  carbs: "bg-yellow",
  protein: "bg-orange",
  fats: "bg-red-tint border border-red",
  fibre: "bg-green",
  vitamins: "bg-blue",
  iron: "bg-ink",
  calcium: "bg-ink",
  zinc: "bg-ink",
  iodine: "bg-ink",
};

/**
 * Nutrient explorer: two tabs of expandable cards. The anchor ids
 * (#nut-carbs, #nut-protein, #nut-fibre, #nut-vitamins) are what the live
 * board's nutrition tags link to.
 */
export function NutrientExplorer() {
  const [group, setGroup] = useState<"macro" | "micro">("macro");
  const [openKey, setOpenKey] = useState<string | null>("carbs");

  return (
    <div>
      <Tabs
        idBase="nut"
        tabs={GROUPS.map((g) => ({ key: g.key, label: g.label }))}
        active={group}
        onChange={(k) => {
          setGroup(k as "macro" | "micro");
          // keep a sensible first open card per group
          const list = k === "macro" ? data.macro : data.micro;
          setOpenKey(list[0]?.key ?? null);
        }}
      />

      <TabPanel idBase="nut" tabKey="macro" active={group}>
        <ul className="divide-y divide-line border-y border-line">
          {(data.macro as Nutrient[]).map((n) => (
            <Row key={n.key} n={n} open={openKey === n.key} onToggle={() => setOpenKey(openKey === n.key ? null : n.key)} />
          ))}
        </ul>
      </TabPanel>
      <TabPanel idBase="nut" tabKey="micro" active={group}>
        <ul className="divide-y divide-line border-y border-line">
          {(data.micro as Nutrient[]).map((n) => (
            <Row key={n.key} n={n} open={openKey === n.key} onToggle={() => setOpenKey(openKey === n.key ? null : n.key)} />
          ))}
        </ul>
      </TabPanel>

      <p className="mt-4 text-sm text-muted">
        General information, not medical advice.
      </p>
    </div>
  );
}

function Row({ n, open, onToggle }: { n: Nutrient; open: boolean; onToggle: () => void }) {
  return (
    <li>
      <h3 id={`nut-${n.key}`} className="scroll-mt-24">
        <button
          type="button"
          aria-expanded={open}
          aria-controls={`nut-panel-${n.key}`}
          onClick={onToggle}
          className={cn(
            "flex w-full cursor-pointer items-center justify-between gap-4 rounded-lg py-4 pr-2 text-left",
            "font-display text-lg font-semibold leading-snug hover:bg-wash",
          )}
        >
          <span className="flex items-center gap-2.5">
            <span
              className={cn("h-3 w-3 shrink-0 rounded-full", TINT_DOT[n.key] ?? "bg-ink")}
              aria-hidden="true"
            />
            {n.name}
          </span>
          <Plus className={cn("h-5 w-5 shrink-0 transition-transform", open && "rotate-45")} strokeWidth={1.5} />
        </button>
      </h3>
      <div
        id={`nut-panel-${n.key}`}
        role="region"
        aria-labelledby={`nut-${n.key}`}
        hidden={!open}
        className="pb-6"
      >
        <div className="max-w-prose rounded-card border border-line bg-surface p-4">
          <p className="text-sm leading-7">{n.what}</p>
          <p className="mt-2 text-sm leading-7 text-muted">{n.why}</p>
          <dl className="mt-3 grid gap-3 text-sm sm:grid-cols-2">
            <div>
              <dt className="font-mono text-[11px] uppercase tracking-widest text-muted">Common Indian sources</dt>
              <dd className="mt-1 leading-6">{n.sources.join(" · ")}</dd>
            </div>
            <div>
              <dt className="font-mono text-[11px] uppercase tracking-widest text-muted">Signs of too little</dt>
              <dd className="mt-1 leading-6 text-muted">{n.signs}</dd>
            </div>
          </dl>
        </div>
      </div>
    </li>
  );
}
