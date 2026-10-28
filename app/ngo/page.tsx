import type { Metadata } from "next";
import { NetworkView } from "@/components/network/network-view";

export const metadata: Metadata = {
  title: "For NGOs & volunteers",
};

export default function NgoPage() {
  return <NetworkView />;
}
