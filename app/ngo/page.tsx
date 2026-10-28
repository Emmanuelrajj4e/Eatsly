import type { Metadata } from "next";
import { NgoView } from "@/components/ngo/ngo-view";

export const metadata: Metadata = {
  title: "For NGOs & volunteers",
};

export default function NgoPage() {
  return <NgoView />;
}
