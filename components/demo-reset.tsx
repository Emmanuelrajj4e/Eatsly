"use client";

import { resetDemoData } from "@/services/demo-reset";

/**
 * Footer "Reset demo data": clears saved overrides/posts/NGOs so the seed
 * sample state returns fresh. Auth (role sign-in) is kept.
 */
export function DemoReset() {
  return (
    <button
      type="button"
      onClick={() => {
        resetDemoData();
        window.location.reload();
      }}
      className="inline-flex min-h-11 cursor-pointer items-center rounded-md font-medium text-white/75 underline decoration-white/30 underline-offset-4 transition-colors hover:text-white hover:decoration-white/70"
    >
      Reset demo data
    </button>
  );
}
