import type { Metadata } from "next";
import { BoardView } from "@/components/board/board-view";

export const metadata: Metadata = {
  title: "Live board",
};

export default function BoardPage() {
  return <BoardView />;
}
