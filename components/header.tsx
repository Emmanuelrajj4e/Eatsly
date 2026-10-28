"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { APP_NAME } from "@/config/brand";
import { cn } from "@/lib/utils";
import { Menu, X, Plus } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { buttonStyles } from "@/components/ui/button";

const NAV = [
  { href: "/board", label: "Board" },
  { href: "/track/ETS-2041", label: "Track" },
  { href: "/nutrition", label: "Nutrition" },
  { href: "/impact", label: "Impact" },
  { href: "/ngo", label: "NGOs" },
];

/**
 * Eatsly mark: a plate — circle outline with one solid quarter wedge
 * standing in for a clock hand.
 */
export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <span className="inline-flex items-center gap-2.5">
      <svg width="26" height="26" viewBox="0 0 26 26" aria-hidden="true">
        <circle cx="13" cy="13" r="11.6" fill="none" stroke="currentColor" strokeWidth="1.8" />
        <path
          d="M13 13 L13 3 A10 10 0 0 1 21.66 18 Z"
          fill="currentColor"
          stroke="none"
        />
      </svg>
      {!compact && (
        <span className="font-display text-xl font-extrabold tracking-tight text-foreground">
          {APP_NAME}
        </span>
      )}
    </span>
  );
}

export function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <>
      {NAV.map((l) => (
        <Link
          key={l.href}
          href={l.href}
          onClick={onNavigate}
          className="inline-flex items-center px-2.5 py-2 text-sm font-medium text-muted underline-offset-4 hover:text-foreground hover:underline"
        >
          {l.label}
        </Link>
      ))}
    </>
  );
}

/** Sticky header with the always-visible solid "Donate food" button. */
export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-background">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-2 px-4">
        <Link href="/" aria-label={`${APP_NAME} home`} className="mr-1 flex h-11 items-center">
          <Logo />
        </Link>

        <nav aria-label="Primary" className="ml-2 hidden items-center md:flex">
          <NavLinks />
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <ThemeToggle />
          <Link
            href="/post"
            className={cn(buttonStyles("primary", "md", "hidden min-[420px]:inline-flex"))}
          >
            <Plus className="h-4 w-4" strokeWidth={1.5} />
            Donate food
          </Link>
          <button
            type="button"
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            onClick={() => setMenuOpen((v) => !v)}
            className="grid h-11 w-11 cursor-pointer place-items-center border border-line bg-surface text-foreground"
          >
            {menuOpen ? <X className="h-5 w-5" strokeWidth={1.5} /> : <Menu className="h-5 w-5" strokeWidth={1.5} />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div
          id="mobile-menu"
          className="border-t border-line bg-surface px-4 py-3 md:hidden"
        >
          <nav aria-label="Primary mobile" className="flex flex-col">
            <NavLinks onNavigate={() => setMenuOpen(false)} />
            <Link
              href="/post"
              onClick={() => setMenuOpen(false)}
              className={cn(buttonStyles("primary", "md", "mt-2 w-full"))}
            >
              <Plus className="h-4 w-4" strokeWidth={1.5} />
              Donate food
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
