import type { Metadata } from "next";
import { ImpactDashboard } from "@/components/impact/dashboard";
import { Tag } from "@/components/ui/chip";

export const metadata: Metadata = {
  title: "Impact",
};

export default function ImpactPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div className="max-w-xl">
          <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
            Impact
          </h1>
          <p className="mt-1 text-sm text-muted">
            What the clock is worth. Counters move the moment a claim lands or a
            volunteer marks a delivery — no waiting for a nightly report.
          </p>
        </div>
        <Tag>sample data</Tag>
      </div>

      <div className="mt-6">
        <ImpactDashboard />
      </div>
    </div>
  );
}
