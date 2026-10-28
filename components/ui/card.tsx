import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  /** Editorial hairline card. `inverted` = full-black panel (white ink). */
  inverted?: boolean;
}

export function Card({ inverted, className, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-card border border-line bg-surface p-5",
        inverted && "border-transparent bg-foreground text-background",
        className,
      )}
      {...props}
    />
  );
}
