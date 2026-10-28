import type { Metadata } from "next";
import { NetworkView } from "@/components/network/network-view";
import { Tag } from "@/components/ui/chip";

export const metadata: Metadata = {
  title: "For NGOs & volunteers",
};

export default function NetworkPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div className="max-w-xl">
          <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
            For NGOs &amp; volunteers
          </h1>
          <p className="mt-1 text-sm text-muted">
            One dashboard for the people who move the food: active runs with live
            clocks, and a one-minute onboarding card for new NGOs.
          </p>
        </div>
        <Tag>sample data</Tag>
      </div>

      <div className="mt-6">
        <NetworkView />
      </div>
    </div>
  );
}
