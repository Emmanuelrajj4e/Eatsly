import { cn } from "@/lib/utils";

/**
 * Indian-standard diet symbol, monochrome edition:
 * Veg = square outline with a hollow circle. Non-veg = square outline with a
 * solid triangle. The words "Veg" / "Non-veg" always accompany the symbol so
 * state is conveyed by text, never by shape alone.
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
  return (
    <span
      role="img"
      aria-label={veg ? "Vegetarian" : "Non-vegetarian"}
      className={cn("inline-flex shrink-0 items-center gap-1.5", className)}
    >
      <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
        <rect x="1.2" y="1.2" width="11.6" height="11.6" rx="1" fill="none" stroke="currentColor" strokeWidth="1.75" />
        {veg ? (
          <circle cx="7" cy="7" r="3.1" fill="none" stroke="currentColor" strokeWidth="1.75" />
        ) : (
          <path d="M 4.4 10 L 7 4.2 L 9.6 10 Z" fill="currentColor" />
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
