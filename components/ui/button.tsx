import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
export type ButtonSize = "md" | "lg";

/** Shared styles so <Link> can look like a Button too. All sizes ≥44px tall. */
export function buttonStyles(
  variant: ButtonVariant = "primary",
  size: ButtonSize = "md",
  className?: string,
) {
  return cn(
    "inline-flex select-none items-center justify-center gap-2 whitespace-nowrap rounded-btn font-medium",
    "transition duration-150 active:translate-y-px disabled:pointer-events-none disabled:opacity-50",
    variant === "primary" &&
      "bg-marigold text-marigold-ink hover:brightness-95 font-semibold",
    variant === "secondary" &&
      "border border-line bg-surface text-foreground hover:bg-foreground/[0.04]",
    variant === "ghost" && "text-foreground hover:bg-foreground/[0.06]",
    variant === "danger" && "bg-chilli text-background hover:brightness-105",
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
