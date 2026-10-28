import Link from "next/link";
import { APP_NAME, APP_MISSION, APP_TAGLINE, CITY } from "@/config/brand";
import { Logo } from "@/components/logo";
import { DemoReset } from "@/components/demo-reset";

const SOCIALS = ["X", "Instagram", "LinkedIn", "YouTube", "GitHub"] as const;

/**
 * Trust-heavy footer on ink. Bracketed items ([...]) are deliberate
 * placeholders for legal details — the only place the UI is allowed these.
 */
export function Footer() {
  return (
    <footer className="mt-16 bg-ink text-[#E8ECFA]">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 md:grid-cols-[1.25fr_0.85fr_1fr_1.1fr]">
        <div>
          <Logo variant="light" />
          <p className="mt-3 max-w-sm text-sm leading-6 text-white/70">{APP_MISSION}</p>
          <p className="mt-4 font-quote text-xl italic text-white">{APP_TAGLINE}</p>
          <div className="mt-5 flex flex-wrap gap-2">
            {SOCIALS.map((s) => (
              <a
                key={s}
                href="#"
                aria-label={`${APP_NAME} on ${s} (sample link)`}
                className="grid min-h-11 place-items-center rounded-xl border border-white/25 px-3 font-mono text-[11px] uppercase tracking-wide text-white/80 transition-colors hover:border-white/60 hover:text-white"
              >
                {s.slice(0, 2)}
              </a>
            ))}
          </div>
        </div>

        <nav aria-label="Footer" className="text-sm">
          <h2 className="font-mono text-xs uppercase tracking-widest text-white/60">Explore</h2>
          <ul className="mt-3 space-y-1">
            {[
              { href: "/why", label: "Why Eatsly" },
              { href: "/#how", label: "How it works" },
              { href: "/board", label: "Live board" },
              { href: "/track/ETS-2041", label: "Track a delivery" },
              { href: "/post", label: "Post surplus" },
              { href: "/nutrition", label: "Nutrition" },
              { href: "/impact", label: "Impact" },
              { href: "/start", label: "Choose your role" },
            ].map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="inline-flex min-h-8 items-center rounded-md underline-offset-4 hover:underline"
                >
                  {l.label}
                </Link>
              </li>
            ))}
            <li className="pt-2">
              <DemoReset />
            </li>
          </ul>
        </nav>

        <div className="text-sm">
          <h2 className="font-mono text-xs uppercase tracking-widest text-white/60">
            Registered office
          </h2>
          <address className="mt-3 not-italic leading-6 text-white/70">
            [Office address, Line 1]
            <br />
            [Area, {CITY} 500 0xx]
            <br />
            [Registration number]
          </address>
          <p className="mt-2 leading-6 text-white/70">[Tax-benefit note placeholder]</p>
          <h2 className="mt-6 font-mono text-xs uppercase tracking-widest text-white/60">
            Financials
          </h2>
          <a
            href="#"
            className="mt-2 inline-block min-h-8 leading-6 underline decoration-white/30 underline-offset-4 hover:decoration-white/70"
          >
            [Annual report — publish placeholder]
          </a>
        </div>

        <div className="text-sm">
          <h2 className="font-mono text-xs uppercase tracking-widest text-white/60">Contact</h2>
          <p className="mt-3 leading-6 text-white/70">
            [hello@eatsly.example.org]
            <br />
            [+91 phone placeholder]
          </p>
          <h2 className="mt-6 font-mono text-xs uppercase tracking-widest text-white/60">
            Policies
          </h2>
          <ul className="mt-3 space-y-1">
            {["Privacy policy", "Food safety policy", "Volunteer safety"].map((l) => (
              <li key={l}>
                <a
                  href="#"
                  className="inline-flex min-h-8 items-center rounded-md underline decoration-white/30 underline-offset-4 hover:decoration-white/70"
                >
                  [{l} — placeholder]
                </a>
              </li>
            ))}
          </ul>
          <h2 className="mt-6 font-mono text-xs uppercase tracking-widest text-white/60">
            Photos
          </h2>
          <p className="mt-3 leading-6 text-white/70">
            Photography credits added on publish; see IMAGES_NEEDED.md.
          </p>
        </div>
      </div>

      <div className="border-t border-white/15">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-2 px-4 py-4 text-xs text-white/60">
          <span>© {APP_NAME}. Sample product for a hackathon demo.</span>
          <span>Sample data — every listing, NGO and number is illustrative.</span>
        </div>
      </div>
    </footer>
  );
}
