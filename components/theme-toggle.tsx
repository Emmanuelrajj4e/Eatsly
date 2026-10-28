"use client";

import { useTheme } from "@/components/theme-provider";
import { SunIcon, MoonIcon } from "lucide-react";

/** Theme toggle: light (white page) or inverted (black page). Both monochrome. */
export function ThemeToggle({ compact = false }: { compact?: boolean }) {
  const { theme, toggle } = useTheme();
  const next = theme === "dark" ? "light" : "dark";
  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={`Switch to ${next === "dark" ? "inverted" : "light"} theme`}
      title={`Switch to ${next === "dark" ? "inverted" : "light"} theme`}
      className={
        "grid cursor-pointer place-items-center border border-line bg-surface text-foreground transition-colors hover:border-line-strong hover:bg-wash " +
        (compact ? "h-11 w-11" : "h-11 w-11")
      }
    >
      {theme === "dark" ? (
        <SunIcon className="h-5 w-5" strokeWidth={1.5} />
      ) : (
        <MoonIcon className="h-5 w-5" strokeWidth={1.5} />
      )}
    </button>
  );
}
