import { Countdown } from "@/components/countdown";
import { CATEGORY_META, STATUS_META } from "@/lib/constants";
import { effectiveStatus } from "@/lib/data";
import { cn, fmtDistance } from "@/lib/utils";
import Link from "next/link";
import type { Donation } from "@/types";

/** Compact donation card reused by browse, claims, tasks and listings. */
export function DonationCard({
  d,
  distanceKm,
  href,
  action,
  className,
}: {
  d: Donation;
  distanceKm?: number | null;
  href: string;
  action?: React.ReactNode;
  className?: string;
}) {
  const status = effectiveStatus(d);
  const meta = CATEGORY_META[d.category as keyof typeof CATEGORY_META];
  const st = STATUS_META[status];

  return (
    <div
      className={cn(
        "group rounded-2xl border border-border bg-surface shadow-card transition-transform hover:-translate-y-0.5",
        status === "expired" && "opacity-60",
        className
      )}
    >
      <Link href={href} className="block p-4">
        <div className="flex gap-3">
          {d.photoUrl ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={d.photoUrl}
              alt={`Photo of ${d.title}`}
              width={64}
              height={64}
              loading="lazy"
              className="size-16 shrink-0 rounded-xl object-cover"
            />
          ) : (
            <span
              aria-hidden="true"
              className="grid size-16 shrink-0 place-items-center rounded-xl bg-surface-2 text-3xl"
            >
              {meta?.emoji ?? "🍱"}
            </span>
          )}
          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-2">
              <h3 className="truncate font-semibold leading-snug">{d.title}</h3>
              <span className={cn("shrink-0 rounded-full px-2 py-0.5 text-xs font-medium", st.badge)}>
                {st.label}
              </span>
            </div>
            <p className="mt-0.5 truncate text-sm text-muted-foreground">
              {d.donorName}
            </p>
            <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">
              <span
                className={cn(
                  "rounded-full px-2 py-0.5 font-medium",
                  d.isVeg
                    ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                    : "bg-rose-500/10 text-rose-600 dark:text-rose-400"
                )}
              >
                {d.isVeg ? "VEG" : "NON-VEG"}
              </span>
              <span className="text-muted-foreground">
                🍱 {d.servings} servings · {d.kg} kg
              </span>
              {distanceKm != null && (
                <span className="text-muted-foreground">📍 {fmtDistance(distanceKm)}</span>
              )}
            </div>
          </div>
        </div>
        <div className="mt-3 flex items-center justify-between text-xs">
          <Countdown target={d.bestBefore} />
          <span className="text-muted-foreground">
            packed {new Date(d.packedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
          </span>
        </div>
      </Link>
      {action && <div className="border-t border-border p-3">{action}</div>}
    </div>
  );
}
