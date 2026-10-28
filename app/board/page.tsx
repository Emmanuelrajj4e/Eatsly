import type { Metadata } from "next";
import { BoardView } from "@/components/board/board-view";
import { RequireRole } from "@/components/require-role";

export const metadata: Metadata = {
  title: "Live board",
 description: "Surplus food listings with live safety clocks — for NGOs and volunteers.",
};

/** NGO + Volunteer only: donors and signed-out visitors are sent to /start. */
export default function BoardPage() {
  return (
    <RequireRole roles={["ngo", "volunteer"]}>
      <BoardView />
    </RequireRole>
  );
}
