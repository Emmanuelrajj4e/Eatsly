import { DEMO_TRACKING_ID } from "@/config/brand";
import { TrackPanel } from "@/components/track/track-panel";
import { TrackIdField } from "@/components/landing/track-id-field";
import { LogoMark } from "@/components/logo";

/**
 * h. Live tracking demo: embedded interactive tracker on the featured run,
 * plus a field to enter any tracking ID before opening the full page.
 */
export function TrackPreview() {
  return (
    <section
      aria-label="Live tracking demo"
      className="border-y border-line bg-blue-tint/60"
    >
      <div className="mx-auto max-w-6xl px-4 py-16">
        <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-blue">
          <LogoMark className="h-5 w-5" />
          Signature feature
        </div>
        <h2 className="mt-2 max-w-2xl font-display text-3xl font-bold tracking-tight">
          Follow a plate ride, live
        </h2>
        <p className="mt-2 max-w-2xl text-muted">
          Every claimed run gets a tracking page: stages, a moving volunteer marker,
          an ETA countdown and proof of delivery at the end. Here is the sample run —
          speed it up or reset it, or enter any tracking ID below.
        </p>

        <div className="mt-8 rounded-card border border-line bg-surface p-5 shadow-[var(--shadow-float)]">
          <TrackPanel id={DEMO_TRACKING_ID} />
          <TrackIdField />
        </div>
      </div>
    </section>
  );
}
