import Link from "next/link";
import { APP_NAME, APP_MISSION, APP_TAGLINE, CITY } from "@/config/brand";
import { Logo } from "@/components/header";
import {
  InstagramGlyph,
  LinkedInGlyph,
  XGlyph,
  YouTubeGlyph,
} from "@/components/icons";

const SOCIALS = [
  { label: `${APP_NAME} on X`, href: "#", aria: "X" },
  { label: "Instagram", href: "#", aria: "Instagram" },
  { label: "LinkedIn", href: "#", aria: "LinkedIn" },
  { label: "YouTube", href: "#", aria: "YouTube" },
];

/**
 * Trust-heavy footer. Bracketed items ([...]) are deliberate placeholders
 * to be filled with legal details before launch — this is the only place
 * the UI is allowed to show placeholders.
 */
export function Footer() {
  return (
    <footer className="mt-16 border-t border-line bg-surface">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 md:grid-cols-[1.3fr_1fr_0.8fr_1fr]">
        <div>
          <Logo />
          <p className="mt-3 max-w-sm text-sm text-muted">{APP_TAGLINE} {APP_MISSION}</p>
          <div className="mt-4 flex gap-2">
            {SOCIALS.map((s) => (
              <a
                key={s.aria}
                href={s.href}
                aria-label={s.label}
                className="grid h-11 w-11 place-items-center rounded-btn border border-line text-muted transition-colors hover:text-foreground"
              >
                {s.aria === "X" && <XGlyph className="h-4.5 w-4.5" />}
                {s.aria === "Instagram" && <InstagramGlyph className="h-5 w-5" />}
                {s.aria === "LinkedIn" && <LinkedInGlyph className="h-5 w-5" />}
                {s.aria === "YouTube" && <YouTubeGlyph className="h-5 w-5" />}
              </a>
            ))}
          </div>
        </div>

        <div className="text-sm">
          <h2 className="font-mono text-xs uppercase tracking-wide text-muted">Registered office</h2>
          <address className="mt-3 not-italic leading-6 text-muted">
            [Office address, Line 1]
            <br />
            [Area, {CITY} 500 0xx]
            <br />
            [Registration number]
          </address>
          <p className="mt-2 text-muted">[Tax-benefit note placeholder]</p>
          <h2 className="mt-6 font-mono text-xs uppercase tracking-wide text-muted">
            Financials
          </h2>
          <a href="#" className="mt-2 inline-block leading-6 underline underline-offset-4 decoration-line hover:text-foreground">
            [Annual report — publish placeholder]
          </a>
        </div>

        <div className="text-sm">
          <h2 className="font-mono text-xs uppercase tracking-wide text-muted">Explore</h2>
          <ul className="mt-3 space-y-2">
            {[
              { href: "/board", label: "Live board" },
              { href: "/post", label: "Post surplus" },
              { href: "/impact", label: "Impact" },
              { href: "/network", label: "For NGOs" },
            ].map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="leading-6 underline-offset-4 hover:underline">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="text-sm">
          <h2 className="font-mono text-xs uppercase tracking-wide text-muted">Contact</h2>
          <p className="mt-3 leading-6 text-muted">
            [hello@annadaan.example.org]
            <br />
            [+91 phone placeholder]
          </p>
          <h2 className="mt-6 font-mono text-xs uppercase tracking-wide text-muted">Policies</h2>
          <ul className="mt-3 space-y-2">
            {["Privacy policy", "Food safety policy", "Driver safety"].map((l) => (
              <li key={l}>
                <a href="#" className="leading-6 underline-offset-4 hover:underline">
                  [{l} — placeholder]
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-line">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-2 px-4 py-4 text-xs text-muted">
          <span>© {APP_NAME}. Sample product for a hackathon demo.</span>
          <span className="font-mono">Meals served so far: 12,480 (sample)</span>
          <span>Sample data — every listing, NGO and number on this site is illustrative.</span>
        </div>
      </div>
    </footer>
  );
}
