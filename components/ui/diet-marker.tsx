import { cn } from "@/lib/utils";

/**
 * Indian-standard diet symbol: Veg = green square with a green dot,
 * Non-veg = brown-red square with a brown-red triangle. The words
 * "Veg" / "Non-veg" always accompany the symbol so state is conveyed
 * by text, never by symbol alone.
 */
export function DietMarker({
  veg,
  withLabel = true,
  className,
}: {
  veg: boolean;
  withLabel?: boolean;
  className?: string;
}) {
  // Non-veg convention: a darker shade of the brand red token (red-brown).
  const colour = veg ? "var(--green)" : "var(--red-shade)";
  return (
    <span
      role="img"
      aria-label={veg ? "Vegetarian" : "Non-vegetarian"}
      className={cn("inline-flex shrink-0 items-center gap-1.5", className)}
    >
      <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
        <rect x="1.2" y="1.2" width="11.6" height="11.6" rx="1" fill="none" stroke={colour} strokeWidth="1.75" />
        {veg ? (
          <circle cx="7" cy="7" r="3.1" fill={colour} />
        ) : (
          <path d="M 4.4 10 L 7 4.2 L 9.6 10 Z" fill={colour} />
        )}
      </svg>
      {withLabel && (
        <span className="font-mono text-[11px] uppercase tracking-wide text-muted">
          {veg ? "Veg" : "Non-veg"}
        </span>
      )}
    </span>
  );
}
