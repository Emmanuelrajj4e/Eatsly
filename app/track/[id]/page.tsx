import { Suspense, use } from "react";
import type { Metadata } from "next";
import { TrackPanel } from "@/components/track/track-panel";

export const metadata: Metadata = {
  title: "Live tracking",
};

function TrackPanelFallback() {
  return (
    <div aria-busy="true" className="space-y-3">
      <div className="h-16 animate-pulse bg-wash" />
      <div className="h-64 animate-pulse bg-wash" />
      <div className="h-24 animate-pulse bg-wash" />
    </div>
  );
}

export default function TrackPage({ params }: PageProps<"/track/[id]">) {
  return (
    <section className="mx-auto max-w-4xl px-4 pb-16 pt-8">
      <p className="font-mono text-xs uppercase tracking-widest text-muted">
        Every stage, on the record
      </p>
      <h1 className="mt-2 font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
        Live tracking
      </h1>
      <p className="mt-2 max-w-xl text-sm text-muted">
        The volunteer ride is simulated for the demo — stages, times and the route
        marker all move on the run’s clock.
      </p>
      <div className="mt-6">
        <Suspense fallback={<TrackPanelFallback />}>
          <TrackBody params={params} />
        </Suspense>
      </div>
    </section>
  );
}

/** Param access lives inside Suspense so the shell can prerender. */
function TrackBody({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  return <TrackPanel id={id} />;
}
