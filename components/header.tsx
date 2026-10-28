"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { APP_NAME } from "@/config/brand";
import { cn } from "@/lib/utils";
import {
  CloseIcon,
  MenuIcon,
  PlusIcon,
} from "@/components/icons";
import { ThemeToggle } from "@/components/theme-toggle";
import { buttonStyles } from "@/components/ui/button";

const NAV = [
  { href: "/board", label: "Board" },
  { href: "/#how", label: "How it works" },
  { href: "/impact", label: "Impact" },
  { href: "/network", label: "For NGOs" },
];

/** Logo: clock inside a food bowl — countdown is the product idea. */
export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <span className="inline-flex items-center gap-2">
      <svg width="30" height="30" viewBox="0 0 30 30" aria-hidden="true">
        <rect x="1.5" y="1.5" width="27" height="27" rx="7" fill="var(--marigold)" />
        <path
          d="M8 17.5h14a7 7 0 0 1-14 0Z"
          fill="none"
          stroke="var(--marigold-ink)"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="15" cy="12.2" r="4.6" fill="none" stroke="var(--marigold-ink)" strokeWidth="1.8" />
        <path
          d="M15 10.2v2l1.7 1"
          fill="none"
          stroke="var(--marigold-ink)"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
      </svg>
      {!compact && (
        <span className="font-display text-lg font-bold tracking-tight text-foreground">
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
          className="inline-flex items-center px-2.5 py-2 text-sm font-medium text-muted underline-offset-4 hover:text-foreground hover:decoration-marigold hover:underline"
        >
          {l.label}
        </Link>
      ))}
    </>
  );
}

/** Sticky header with the always-visible "Donate food" CTA. */
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
    <header className="sticky top-0 z-40 border-b border-line bg-background/90 backdrop-blur-sm">
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
            <PlusIcon className="h-4 w-4" />
            Donate food
          </Link>
          <button
            type="button"
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            onClick={() => setMenuOpen((v) => !v)}
            className="grid h-11 w-11 cursor-pointer place-items-center rounded-btn border border-line bg-surface text-foreground md:hidden"
          >
            {menuOpen ? <CloseIcon className="h-5 w-5" /> : <MenuIcon className="h-5 w-5" />}
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
              <PlusIcon className="h-4 w-4" />
              Donate food
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}

