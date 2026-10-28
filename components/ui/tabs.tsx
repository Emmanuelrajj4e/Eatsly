"use client";

import { useRef } from "react";
import { cn } from "@/lib/utils";

export interface TabsProps {
  tabs: Array<{ key: string; label: string }>;
  active: string;
  onChange: (key: string) => void;
  className?: string;
  /** Shared id prefix for aria-controls wiring. */
  idBase: string;
}

/**
 * WAI-ARIA tabs: roving focus with ArrowLeft/Right, aria-selected,
 * panel ids wired for aria-controls.
 */
export function Tabs({ tabs, active, onChange, className, idBase }: TabsProps) {
  const listRef = useRef<HTMLDivElement>(null);

  const onKeyDown = (e: React.KeyboardEvent) => {
    const idx = tabs.findIndex((t) => t.key === active);
    let next = idx;
    if (e.key === "ArrowRight") next = (idx + 1) % tabs.length;
    else if (e.key === "ArrowLeft") next = (idx - 1 + tabs.length) % tabs.length;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = tabs.length - 1;
    else return;
    e.preventDefault();
    const key = tabs[next].key;
    onChange(key);
    const btn = listRef.current?.querySelector<HTMLButtonElement>(`#${idBase}-tab-${key}`);
    btn?.focus();
  };

  return (
    <div
      ref={listRef}
      role="tablist"
      aria-label="Nutrient groups"
      onKeyDown={onKeyDown}
      className={cn("flex gap-0 border-b border-line", className)}
    >
      {tabs.map((t) => {
        const selected = active === t.key;
        return (
          <button
            key={t.key}
            id={`${idBase}-tab-${t.key}`}
            role="tab"
            type="button"
            aria-selected={selected}
            aria-controls={`${idBase}-panel-${t.key}`}
            tabIndex={selected ? 0 : -1}
            onClick={() => onChange(t.key)}
            className={cn(
              "h-11 cursor-pointer border-b-2 px-4 font-mono text-xs uppercase tracking-widest transition-colors",
              selected
                ? "border-foreground font-semibold text-foreground"
                : "border-transparent text-muted hover:text-foreground",
            )}
          >
            {t.label}
          </button>
        );
      })}
    </div>
  );
}

/** Wired panel: receives the idBase so Tabs/panels stay in sync. */
export function TabPanel({
  idBase,
  tabKey,
  active,
  children,
}: {
  idBase: string;
  tabKey: string;
  active: string;
  children: React.ReactNode;
}) {
  return (
    <div
      id={`${idBase}-panel-${tabKey}`}
      role="tabpanel"
      aria-labelledby={`${idBase}-tab-${tabKey}`}
      hidden={active !== tabKey}
      className="pt-4"
    >
      {children}
    </div>
  );
}
