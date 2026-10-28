import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export type ButtonVariant =
  | "primary" // orange, ink text (brand action)
  | "green" // NGO / success
  | "blue" // volunteer / tracking
  | "danger" // urgent destructive (white on red = 4.9:1)
  | "outline" // neutral ink outline
  | "secondary" // alias of outline (kept for existing call sites)
  | "outline-green" // coloured outline for the role cards
  | "outline-blue"
  | "ghost";
export type ButtonSize = "sm" | "md" | "lg";

/**
 * Flatt colour button system. Radius 10px, no heavy shadows.
 * Text on solid colours follows the palette contract:
 * white on green/blue/red, ink on orange.
 */
export function buttonStyles(
  variant: ButtonVariant = "primary",
  size: ButtonSize = "md",
  className?: string,
) {
  return cn(
    "inline-flex select-none items-center justify-center gap-2 whitespace-nowrap rounded-btn font-semibold",
    "transition-colors duration-150 active:translate-y-px disabled:pointer-events-none disabled:opacity-45",
    variant === "primary" &&
      "bg-orange text-ink hover:bg-orange-shade active:bg-orange-shade",
    variant === "green" && "bg-green text-white hover:bg-green-shade active:bg-green-shade",
    variant === "blue" && "bg-blue text-white hover:bg-blue-shade active:bg-blue-shade",
    variant === "danger" && "bg-red text-white hover:bg-red-shade active:bg-red-shade",
    variant === "outline" ||
      variant === "secondary"
      ? "border border-ink bg-surface text-ink hover:bg-wash"
      : null,
    variant === "outline-green" &&
      "border border-green bg-surface text-green hover:bg-green-tint",
    variant === "outline-blue" &&
      "border border-blue bg-surface text-blue hover:bg-blue-tint",
    variant === "ghost" && "text-green hover:bg-green-tint",
    size === "sm" && "h-10 px-3 text-sm",
    size === "md" && "h-11 px-4 text-sm",
    size === "lg" && "h-12 px-6 text-base",
    className,
  );
}

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

export function Button({ variant, size, className, type, ...props }: ButtonProps) {
  return (
    <button
      type={type ?? "button"}
      className={buttonStyles(variant, size, className)}
      {...props}
    />
  );
}
