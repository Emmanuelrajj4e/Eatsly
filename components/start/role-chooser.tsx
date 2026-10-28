"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { LogoMark } from "@/components/logo";
import { buttonStyles } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { roleHome, setAuth, ROLE_LABELS } from "@/services/auth";
import { useAuth } from "@/hooks/use-auth";
import type { Role } from "@/services/auth";
import { Bike, Building2, ChefHat, HeartHandshake, Store, Users } from "lucide-react";

const ROLE_CARDS = [
  {
    id: "donor" as Role,
    icon: ChefHat,
    title: "I'm donating food",
    promise: "Restaurants, wedding halls, hostels, canteens, bakeries, households.",
    tone: "orange",
    card: "border-orange hover:border-orange",
    chip: "bg-orange text-ink",
    active: "border-orange ring-3 ring-orange/20",
  },
  {
    id: "ngo" as Role,
    icon: HeartHandshake,
    title: "I'm an NGO",
    promise: "Verified kitchens and shelters that can claim and serve meals.",
    tone: "green",
    card: "border-green hover:border-green",
    chip: "bg-green text-white",
    active: "border-green ring-3 ring-green/20",
  },
  {
    id: "volunteer" as Role,
    icon: Bike,
    title: "I'll carry it",
    promise: "Volunteers who pick up claims on a scooter or by car.",
    tone: "blue",
    card: "border-blue hover:border-blue",
    chip: "bg-blue text-white",
    active: "border-blue ring-3 ring-blue/20",
  },
] as const;

const REASONS: Record<string, string> = {
  signin: "That page needs a role first — pick yours below.",
  role: "That page is only for the roles marked below. Switch to continue.",
};

/** /start: three role cards + name/city. Saves to localStorage ("eatsly-auth"). */
export function RoleChooser() {
  const router = useRouter();
  const sp = useSearchParams();
  const auth = useAuth();
  const reason = sp.get("reason") ?? "";
  const initialRole = sp.get("role");

  const [role, setRole] = useState<Role | null>(
    initialRole === "donor" || initialRole === "ngo" || initialRole === "volunteer"
      ? (initialRole as Role)
      : null,
  );
  const [name, setName] = useState("");
  const [city, setCity] = useState("Hyderabad");
  const [error, setError] = useState<string | null>(null);

  const canContinue = useMemo(() => role !== null && name.trim().length >= 2, [role, name]);

  /** rAF touch keeps the prerendered shell stable; auth only in callbacks */
  const signedIn = auth !== null;

  const onContinue = (e: React.FormEvent) => {
    e.preventDefault();
    if (!role) {
      setError("Pick a role to continue.");
      return;
    }
    if (name.trim().length < 2) {
      setError("Add your first name — labels on the board use it.");
      return;
    }
    setError(null);
    setAuth({ role, name: name.trim(), city: city.trim() || "Hyderabad" });
    router.push(roleHome(role));
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 md:py-14">
      <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-muted">
        <LogoMark className="h-5 w-5" />
        Start here
      </div>
      <h1 className="mt-3 max-w-2xl font-display text-3xl font-bold sm:text-4xl">
        How do you want to help?
      </h1>
      <p className="mt-2 max-w-xl text-muted">
        Each role opens its own tools. You can switch any time from the header.
      </p>

      {reason && (
        <p
          role="status"
          className="mt-5 flex items-start gap-2 rounded-card border border-yellow bg-yellow-tint px-4 py-3 text-sm text-ink"
        >
          <Building2 className="mt-0.5 h-4 w-4 shrink-0 text-yellow-shade" aria-hidden="true" />
          {REASONS[reason] ?? REASONS.role}
        </p>
      )}

      {signedIn && (
        <p className="mt-5 rounded-card border border-green/40 bg-green-tint px-4 py-3 text-sm text-ink">
          Signed in as <strong>{auth.name}</strong> ({ROLE_LABELS[auth.role]}) — continuing will
          switch this browser&apos;s role.
        </p>
      )}

      <fieldset className="mt-8">
        <legend className="sr-only">Choose a role</legend>
        <ul className="grid gap-4 md:grid-cols-3">
          {ROLE_CARDS.map((c) => {
            const Icon = c.icon;
            const selected = role === c.id;
            return (
              <li key={c.id}>
                <button
                  type="button"
                  aria-pressed={selected}
                  onClick={() => setRole(c.id)}
                  className={cn(
                    "w-full cursor-pointer rounded-card border-2 bg-surface p-5 text-left transition-all",
                    c.card,
                    selected && c.active,
                  )}
                >
                  <span
                    className={cn(
                      "grid h-11 w-11 place-items-center rounded-xl",
                      c.chip,
                    )}
                    aria-hidden="true"
                  >
                    <Icon className="h-5 w-5" strokeWidth={2} />
                  </span>
                  <span className="mt-3 block font-display text-lg font-bold">{c.title}</span>
                  <span className="mt-1.5 block text-sm leading-6 text-muted">{c.promise}</span>
                  <span className="mt-3 inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-wide text-muted">
                    <Store className="h-3.5 w-3.5" strokeWidth={1.5} aria-hidden="true" />
                    {selected ? "Selected" : "Tap to pick"}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </fieldset>

      <form onSubmit={onContinue} className="mt-8 max-w-md rounded-card border border-line bg-surface p-5">
        <div className="grid gap-4">
          <label className="block">
            <span className="font-mono text-xs uppercase tracking-widest text-muted">
              Your name
            </span>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Sample: Meera"
              autoComplete="name"
              className="mt-1.5 h-11 w-full rounded-btn border border-line bg-background px-3 text-sm outline-none focus:border-blue"
            />
          </label>
          <label className="block">
            <span className="font-mono text-xs uppercase tracking-widest text-muted">City</span>
            <input
              value={city}
              onChange={(e) => setCity(e.target.value)}
              autoComplete="address-level2"
              className="mt-1.5 h-11 w-full rounded-btn border border-line bg-background px-3 text-sm outline-none focus:border-blue"
            />
          </label>
        </div>
        {error && (
          <p role="alert" className="mt-3 rounded-btn bg-red-tint px-3 py-2 text-sm text-red">
            {error}
          </p>
        )}
        <button
          type="submit"
          disabled={!canContinue}
          className={cn(buttonStyles("primary", "md", "mt-5 w-full"))}
        >
          Continue
          <Users className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
        </button>
        <p className="mt-3 text-center font-mono text-[11px] text-muted">
          Demo sign-in — no real accounts. Role and name stay in this browser.
        </p>
        <p className="mt-1 text-center text-[13px] text-muted">
          Not sure yet? <Link href="/" className="underline underline-offset-4 hover:text-blue">Look around the product</Link> first.
        </p>
      </form>
    </div>
  );
}
