import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export type ButtonVariant = "primary" | "secondary" | "ghost";
export type ButtonSize = "md" | "lg";

/**
 * Monochrome button system.
 * primary: solid ink fill, inverts on hover (ink outline, page fill)
 * secondary: outlined, fills on hover
 * ghost: quiet text button
 */
export function buttonStyles(
  variant: ButtonVariant = "primary",
  size: ButtonSize = "md",
  className?: string,
) {
  return cn(
    "inline-flex select-none items-center justify-center gap-2 whitespace-nowrap rounded-btn font-medium",
    "transition-colors duration-150 active:translate-y-px disabled:pointer-events-none disabled:opacity-45",
    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--foreground)]",
    variant === "primary" &&
      "border border-transparent bg-foreground text-background hover:border-line-strong hover:bg-background hover:text-foreground",
    variant === "secondary" &&
      "border border-line-strong bg-transparent text-foreground hover:bg-foreground hover:text-background",
    variant === "ghost" && "text-foreground hover:bg-wash",
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
