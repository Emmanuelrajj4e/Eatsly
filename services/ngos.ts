import rawNgos from "@/data/ngos.json";
import type { NGO } from "@/types";

/** Seed NGOs (sample data). Onboarded NGOs are appended by the write path later. */
export function getNgos(): NGO[] {
  return rawNgos as NGO[];
}

export function getNgoById(id: string): NGO | undefined {
  return getNgos().find((n) => n.id === id);
}
