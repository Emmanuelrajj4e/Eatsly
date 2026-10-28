import type { Metadata } from "next";
import { PickupsView } from "@/components/pickups/pickups-view";
import { RequireRole } from "@/components/require-role";

export const metadata: Metadata = {
  title: "Pickups",
};

/** NGO + Volunteer shared run desk (onboarding card lands in Phase 6). */
export default function PickupsPage() {
  return (
    <RequireRole roles={["ngo", "volunteer"]}>
      <PickupsView />
    </RequireRole>
  );
}
