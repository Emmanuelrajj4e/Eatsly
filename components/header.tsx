"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { APP_NAME, DEMO_TRACKING_ID } from "@/config/brand";
import { cn } from "@/lib/utils";
import { Menu, X } from "lucide-react";
import { Logo } from "@/components/logo";
import { buttonStyles } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { ROLE_LABELS } from "@/services/auth";
import type { Role } from "@/services/auth";

const BASE_NAV = [
  { href: "/why", label: "Why Eatsly" },
  { href: "/#how", label: "How it works" },
  { href: "/nutrition", label: "Nutrition" },
  { href: `/track/${DEMO_TRACKING_ID}`, label: "Track" },
  { href: "/impact", label: "Impact" },
];

/** Role-gated menu items: the Board is only ever shown to NGO + Volunteer. */
const ROLE_NAV: Partial<Record<Role, Array<{ href: string; label: string }>>> = {
  ngo: [
    { href: "/board", label: "Board" },
    { href: "/pickups", label: "Pickups" },
  ],
  volunteer: [
    { href: "/pickups", label: "Pickups" },
    { href: "/board", label: "Board" },
  ],
  donor: [{ href: "/post", label: "Post food" }],
};

const BADGE_DOTS: Record<Role, string> = {
  donor: "bg-orange",
  ngo: "bg-green",
  volunteer: "bg-blue",
};

export function NavLinks({
  onNavigate,
  role = null,
}: {
  onNavigate?: () => void;
  role?: Role | null;
}) {
  const links = [...BASE_NAV, ...(role ? (ROLE_NAV[role] ?? []) : [])];
  return (
    <>
      {links.map((l) => (
        <Link
          key={l.href}
          href={l.href}
          onClick={onNavigate}
          className="inline-flex min-h-11 items-center rounded-md px-2.5 py-1.5 text-sm font-semibold text-muted underline-offset-4 hover:text-ink hover:underline"
        >
          {l.label}
        </Link>
      ))}
    </>
  );
}

/** Small role pill + "Switch role" (shown once a demo sign-in exists). */
function RoleBadge({ compact = false }: { compact?: boolean }) {
  const auth = useAuth();
  if (!auth) return null;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full border border-line bg-surface px-3 py-1.5",
        compact && "self-start",
      )}
    >
      <span className={cn("h-2.5 w-2.5 rounded-full", BADGE_DOTS[auth.role])} aria-hidden="true" />
      <span className="text-sm font-semibold leading-none">
        {auth.name}, {ROLE_LABELS[auth.role]}
      </span>
      <Link
        href="/start"
        className="ml-1 font-mono text-[10px] uppercase tracking-wide text-blue underline-offset-4 hover:underline"
      >
        Switch role
      </Link>
    </span>
  );
}

/** Sticky header: logo, primary links (brief §1b), strong CTAs. */
export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const auth = useAuth();

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-surface/95 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-2 px-4">
        <Link
          href="/"
          aria-label={`${APP_NAME} home`}
          className="mr-1 flex min-h-11 items-center"
        >
          <Logo />
        </Link>

        <nav aria-label="Primary" className="ml-2 hidden items-center md:flex">
          <NavLinks role={auth?.role ?? null} />
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <span className="hidden lg:inline-flex">
            <RoleBadge />
          </span>
          <Link
            href="/start"
            className={cn(buttonStyles("primary", "md", "hidden min-[420px]:inline-flex"))}
          >
            Get started
          </Link>
          <button
            type="button"
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            onClick={() => setMenuOpen((v) => !v)}
            className="grid h-11 w-11 cursor-pointer place-items-center rounded-xl border border-line bg-surface text-ink hover:bg-wash"
          >
            {menuOpen ? <X className="h-5 w-5" strokeWidth={1.5} /> : <Menu className="h-5 w-5" strokeWidth={1.5} />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div id="mobile-menu" className="border-t border-line bg-surface px-4 py-3 md:hidden">
          <nav aria-label="Primary mobile" className="flex flex-col">
            <NavLinks
              role={auth?.role ?? null}
              onNavigate={() => setMenuOpen(false)}
            />
            <span className="mt-2">
              <RoleBadge compact />
            </span>
            <Link
              href="/start"
              onClick={() => setMenuOpen(false)}
              className={cn(buttonStyles("primary", "md", "mt-2 w-full"))}
            >
              Get started
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
