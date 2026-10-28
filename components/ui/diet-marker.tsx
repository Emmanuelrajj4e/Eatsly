import { cn } from "@/lib/utils";

/**
 * Indian-standard diet symbol: square with a centred dot.
 * Green = veg, brown-red = non-veg. Fill colours are constant in both themes
 * (they are shapes with fixed semantics, not text tokens).
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
  const color = veg ? "var(--leaf-flat)" : "var(--nonveg-flat)";
  return (
    <span
      role="img"
      aria-label={veg ? "Vegetarian" : "Non-vegetarian"}
      className={cn("inline-flex shrink-0 items-center gap-1.5", className)}
    >
      <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
        <rect x="1.2" y="1.2" width="11.6" height="11.6" rx="2.4" fill="none" stroke={color} strokeWidth="2" />
        <circle cx="7" cy="7" r="2.7" fill={color} />
      </svg>
      {withLabel && (
        <span className="font-mono text-[11px] uppercase tracking-wide text-muted">
          {veg ? "Veg" : "Non-veg"}
        </span>
      )}
    </span>
  );
}
