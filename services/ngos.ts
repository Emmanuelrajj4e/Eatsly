import rawNgos from "@/data/ngos.json";
import rawAreas from "@/data/areas.json";
import type { NGO } from "@/types";
import { connectSync, readJson, writeJson } from "@/services/storage";

/**
 * NGOs from the seed plus ones added through the onboarding form.
 * Onboarded NGOs persist to localStorage and join every claim dialog.
 */

const KEY = "annadaan:ngos:v1";

type Listener = (ngos: NGO[]) => void;

const listeners = new Set<Listener>();

function refresh() {
  const all = getNgos();
  listeners.forEach((fn) => fn(all));
}

const broadcast = connectSync("annadaan-ngos", refresh);

export function subscribe(fn: Listener): () => void {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
}

export function getNgos(): NGO[] {
  const extra = readJson<NGO[]>(KEY) ?? [];
  return [...(rawNgos as NGO[]), ...extra];
}

export function getNgoById(id: string): NGO | undefined {
  return getNgos().find((n) => n.id === id);
}

export interface NgoOnboardingInput {
  name: string;
  area: string;
  vehicle: string;
  contact: string;
}

/** Onboarding card write path; persists so dialogs and map pins see it everywhere. */
export function onboardNgo(input: NgoOnboardingInput): NGO {
  const area = rawAreas.find((a) => a.name === input.area);
  const ngo: NGO = {
    id: `ngo-op${Date.now().toString(36)}`,
    name: input.name.trim(),
    area: input.area,
    lat: area?.lat ?? 17.4,
    lng: area?.lng ?? 78.45,
    vehicle: input.vehicle.trim() || "Bicycle pickup",
    contact: input.contact.trim() || "[+91 contact placeholder]",
    newlyAdded: true,
  };
  const extra = readJson<NGO[]>(KEY) ?? [];
  extra.push(ngo);
  writeJson(KEY, extra);
  refresh();
  broadcast();
  return ngo;
}
