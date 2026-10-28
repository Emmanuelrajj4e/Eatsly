"use client";

import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface ChipProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  selected?: boolean;
  children: ReactNode;
}

/** Fully-round, mono-labelled toggle chip. Used for board filters. */
export function Chip({ selected, className, children, ...props }: ChipProps) {
  return (
    <button
      type="button"
      aria-pressed={selected ?? false}
      className={cn(
        "inline-flex h-11 cursor-pointer items-center gap-2 rounded-full border px-4",
        "font-mono text-[13px] uppercase tracking-wide transition-colors",
        selected
          ? "border-transparent bg-foreground text-background"
          : "border-line bg-surface text-foreground hover:bg-foreground/[0.05]",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}

/** Non-interactive label chip (e.g. area, food type on cards). */
export function Tag({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border border-line bg-background px-2.5 py-1",
        "font-mono text-xs text-muted",
        className,
      )}
    >
      {children}
    </span>
  );
}
