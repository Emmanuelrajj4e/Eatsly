"use client";

import { Dialog } from "@/components/ui/dialog";
import { TrackPanel } from "@/components/track/track-panel";
import { cn } from "@/lib/utils";

/**
 * Live tracking drawer: the board's claimed cards open the full tracking
 * view as a side sheet (same panel the /track/[id] page renders).
 */
export function TrackDrawer({
  trackId,
  onClose,
}: {
  trackId: string | null;
  onClose: () => void;
}) {
  return (
    <Dialog
      open={trackId !== null}
      onClose={onClose}
      title={`Live tracking · ${trackId ?? ""}`}
      className={cn(
        "!left-auto !right-0 !top-0 !max-h-[100dvh] !h-[100dvh] !max-w-md !translate-x-0 !translate-y-0",
        "!rounded-none !w-full",
      )}
    >
      {trackId && <TrackPanel id={trackId} />}
    </Dialog>
  );
}
