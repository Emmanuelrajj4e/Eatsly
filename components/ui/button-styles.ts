import { cn } from "@/lib/utils";

/** Shared (server-safe) button appearance maps — no "use client" here. */
export type ButtonVariant = "primary" | "accent" | "outline" | "ghost" | "danger";
export type ButtonSize = "sm" | "md" | "lg";

const variants: Record<ButtonVariant, string> = {
  primary:
    "bg-primary text-primary-foreground hover:bg-primary-strong active:scale-[.98] shadow-sm",
  accent:
    "bg-accent text-accent-foreground hover:brightness-105 active:scale-[.98] shadow-sm",
  outline:
    "border border-border bg-surface hover:bg-surface-2 text-foreground",
  ghost: "hover:bg-surface-2 text-foreground",
  danger:
    "bg-rose-600 text-white hover:bg-rose-700 active:scale-[.98] shadow-sm",
};

const sizes: Record<ButtonSize, string> = {
  sm: "h-8 px-3 text-sm gap-1.5 rounded-lg",
  md: "h-10 px-4 text-sm gap-2 rounded-xl",
  lg: "h-12 px-6 text-base gap-2 rounded-xl",
};

export function buttonClasses(
  variant: ButtonVariant = "primary",
  size: ButtonSize = "md",
  extra?: string
) {
  return cn(
    "inline-flex select-none items-center justify-center font-medium transition-colors",
    "disabled:pointer-events-none disabled:opacity-50",
    variants[variant],
    sizes[size],
    extra
  );
}
