import Link from "next/link";
import { DEMO_TRACKING_ID } from "@/config/brand";
import { TrackPanel } from "@/components/track/track-panel";
import { buttonStyles } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

/**
 * h. Live tracking preview: an embedded demo of the tracking view plus a
 * jump to the full page for the featured run.
 */
export function TrackPreview() {
  return (
    <section aria-label="Live tracking preview" className="bg-foreground text-background">
      <div className="mx-auto max-w-6xl px-4 py-16">
        <div className="border-b border-background/20 pb-4">
          <p className="font-mono text-xs uppercase tracking-widest text-background/70">
            Signature feature
          </p>
          <h2 className="mt-2 font-display text-3xl font-extrabold tracking-tight">
            Follow a plate ride, live
          </h2>
          <p className="mt-2 max-w-2xl text-background/70">
            Every claimed run gets a tracking page with stages, a moving volunteer
            marker, an ETA countdown and proof of delivery at the end. This is the
            demo run — speed it up or reset it below.
          </p>
        </div>

        <div className="mt-8 border border-background/20 bg-background p-5 text-foreground">
          <TrackPanel id={DEMO_TRACKING_ID} />
          <div className="mt-4 flex flex-wrap items-center gap-3 border-t border-line pt-4">
            <Link href={`/track/${DEMO_TRACKING_ID}`} className={buttonStyles("primary", "lg")}>
              Track delivery {DEMO_TRACKING_ID}
              <ArrowRight className="h-5 w-5" strokeWidth={1.5} />
            </Link>
            <span className="font-mono text-[11px] uppercase tracking-widest text-muted">
              Opens the full tracking page
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
