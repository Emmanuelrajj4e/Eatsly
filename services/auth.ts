/**
 * Demo auth: a { role, name, city } triple in localStorage under
 * "eatsly-auth". No real accounts, no backend — an API would replace
 * every function here (see README).
 */
export type Role = "donor" | "ngo" | "volunteer";

export interface Auth {
  role: Role;
  name: string;
  city: string;
}

const KEY = "eatsly-auth";
const listeners = new Set<(auth: Auth | null) => void>();

export const ROLE_LABELS: Record<Role, string> = {
  donor: "Donor",
  ngo: "NGO",
  volunteer: "Volunteer",
};

/** Where each role lands after sign-in. */
export function roleHome(role: Role): string {
  switch (role) {
    case "donor":
      return "/post";
    case "ngo":
      return "/board";
    case "volunteer":
      return "/pickups";
  }
}

export function getAuth(): Auth | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Auth;
    if (parsed && parsed.role && parsed.name) return parsed;
    return null;
  } catch {
    return null;
  }
}

export function setAuth(auth: Auth) {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(auth));
  } catch {
    /* storage unavailable: session-only auth */
  }
  bump();
}

export function clearAuth() {
  try {
    window.localStorage.removeItem(KEY);
  } catch {
    /* ignore */
  }
  bump();
}

function bump() {
  const value = getAuth();
  for (const cb of listeners) cb(value);
}

export function subscribeAuth(cb: (auth: Auth | null) => void): () => void {
  listeners.add(cb);
  return () => {
    listeners.delete(cb);
  };
}
