import { cn } from "@/lib/utils";

/**
 * Shared pin artwork (green pin, white plate, orange leaf).
 * Fixed brand colours so it reads on white and on the ink footer alike.
 */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={cn("h-[26px] w-[26px]", className)} aria-hidden="true">
      <path
        d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"
        fill="var(--green)"
        stroke="var(--green)"
        strokeWidth="1"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="10" r="3.4" fill="none" stroke="#FFFFFF" strokeWidth="1.7" />
      <circle cx="12" cy="10" r="1.8" fill="none" stroke="#FFFFFF" strokeWidth="1.05" />
      <path d="M15.4 6.3 Q15.4 4.5 17.2 4.5 Q17.2 6.3 15.4 6.3 Z" fill="var(--orange)" />
    </svg>
  );
}

/**
 * Logo lockup. variant: "full" = mark + wordmark on light backgrounds,
 * "light" = same but with "Eats" in white (for the ink footer / dark panels),
 * "mark" = artwork only.
 */
export function Logo({
  variant = "full",
  className,
  compact = false,
}: {
  variant?: "full" | "light" | "mark";
  className?: string;
  /** tiny screens: mark only */
  compact?: boolean;
}) {
  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <LogoMark />
      {variant !== "mark" && !compact && (
        <span className="font-display text-[21px] font-bold leading-none tracking-[-0.02em]">
          <span className={variant === "light" ? "text-white" : "text-foreground"}>Eats</span>
          <span className="text-orange">ly</span>
        </span>
      )}
    </span>
  );
}
