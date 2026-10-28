import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  /** Only the selected card gets a shadow (per design direction). */
  selected?: boolean;
}

export function Card({ selected, className, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-card border border-line bg-surface p-5",
        selected && "border-foreground/45 shadow-[var(--shadow-selected)]",
        className,
      )}
      {...props}
    />
  );
}
