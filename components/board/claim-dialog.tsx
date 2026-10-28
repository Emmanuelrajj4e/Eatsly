"use client";

import { Dialog } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/toast";
import { Check } from "lucide-react";
import { fmtDistance, distanceKm } from "@/lib/utils";
import { etaMinutes, safeUntilMs } from "@/services/geo";
import { claim } from "@/services/listings";
import { getNgos } from "@/services/ngos";
import { SAFETY_BUFFER_MIN } from "@/config/brand";
import { cn } from "@/lib/utils";
import type { Listing } from "@/types";

/**
 * Claim dialog: every NGO with distance and ETA. NGOs that cannot arrive
 * SAFETY_BUFFER_MIN before the safe window closes are disabled with the reason.
 */
export function ClaimDialog({
  listing,
  nowMs,
  onClose,
}: {
  listing: Listing | null;
  nowMs: number;
  onClose: () => void;
}) {
  const toast = useToast();

  const tryClaim = (listingId: string, ngoId: string) => {
    const res = claim(listingId, ngoId);
    if (res.ok) {
      toast(
        `Claimed — ${ngoName(ngoId)} is on the run for "${listing?.title ?? ""}".`,
        "success",
      );
      onClose();
    } else {
      toast(res.reason ?? "Claim failed.", "error");
    }
  };

  return (
    <Dialog
      open={listing !== null}
      onClose={onClose}
      title="Claim this food"
      className="max-w-lg"
    >
      {listing && (
        <>
          <p className="text-sm text-muted">
            {listing.title} · {listing.servings} servings.
            Window closes {new Date(safeUntilMs(listing.preparedAt, listing.type))
              .toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false })}
            . We keep a {SAFETY_BUFFER_MIN}-minute safety buffer — NGOs that cannot make it are disabled.
          </p>

          <ul className="mt-4 space-y-2" aria-label="NGOs by distance">
            {sortedNgos(listing).map(({ ngo, km }) => {
              const eta = etaMinutes(ngo, listing);
              const left = Math.floor(
                (safeUntilMs(listing.preparedAt, listing.type) - nowMs) / 60000,
              );
              const cutoff = left - SAFETY_BUFFER_MIN;
              const ok = eta <= cutoff && cutoff >= 0;
              const reason = ok
                ? null
                : cutoff < 0
                  ? "Window closes too soon — no safety margin left."
                  : `Too far: arrives ${eta - cutoff} min after the cutoff (ETA ${eta} min, max ${cutoff}).`;
              return (
                <li key={ngo.id}>
                  <button
                    type="button"
                    disabled={!ok}
                    onClick={() => tryClaim(listing.id, ngo.id)}
                    className={cn(
                      "flex w-full items-center justify-between gap-3 rounded-card border p-3 text-left transition-colors",
                      ok
                        ? "cursor-pointer border-line bg-surface hover:border-line-strong hover:bg-wash"
                        : "cursor-not-allowed border-line/70 bg-background opacity-75",
                    )}
                  >
                    <span>
                      <span className="flex items-center gap-2 font-medium">
                        {ok && <Check className="h-4 w-4 text-foreground" strokeWidth={2} />}
                        {ngo.name}
                      </span>
                      <span className="mt-0.5 block font-mono text-xs text-muted">{ngo.area}</span>
                      {reason && (
                        <span className="mt-1 block text-xs text-muted">{reason}</span>
                      )}
                    </span>
                    <span className="shrink-0 text-right font-mono text-xs">
                      {fmtDistance(km)}
                      <br />
                      ETA {eta} min
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </>
      )}
    </Dialog>
  );
}

function sortedNgos(listing: Listing) {
  return getNgos()
    .map((n) => ({ ngo: n, km: distanceKm(listing, n) }))
    .sort((a, b) => a.km - b.km);
}

function ngoName(id: string) {
  return getNgos().find((n) => n.id === id)?.name ?? "The NGO";
}
