import Link from "next/link";
import { APP_NAME, APP_MISSION, APP_TAGLINE, CITY, TICKER_EVENTS } from "@/config/brand";
import { Logo } from "@/components/header";

/** Landing strip a: full-black, white mono text, slow marquee of sample events. */
export function TickerStrip() {
  const items = [...TICKER_EVENTS, ...TICKER_EVENTS];
  return (
    <div
      className="overflow-hidden border-b border-line bg-foreground text-background"
      role="region"
      aria-label="Live sample events ticker"
    >
      <div className="mask-marquee py-1.5">
        {items.map((event, i) => (
          <span
            key={i}
            className="flex items-center gap-2 px-5 font-mono text-[11px] uppercase tracking-widest"
          >
            {event}
          </span>
        ))}
      </div>
      <span className="sr-only text-[10px]">Sample data ticker. {TICKER_EVENTS.join("; ")}</span>
    </div>
  );
}

/**
 * Trust-heavy footer. Bracketed items ([...]) are deliberate placeholders
 * for legal details — the only place the UI is allowed these.
 */
export function Footer() {
  return (
    <footer className="mt-16 border-t border-line bg-surface">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 md:grid-cols-[1.3fr_1fr_0.8fr_1fr]">
        <div>
          <Logo />
          <p className="mt-3 max-w-sm text-sm text-muted">{APP_MISSION}</p>
          <p className="mt-4 font-quote text-xl italic">{APP_TAGLINE}</p>
          <div className="mt-4 flex gap-2">
            {["X", "Instagram", "LinkedIn", "YouTube"].map((s) => (
              <a
                key={s}
                href="#"
                aria-label={`${APP_NAME} on ${s}`}
                className="grid h-11 w-11 place-items-center border border-line font-mono text-xs uppercase tracking-wide text-muted transition-colors hover:border-line-strong hover:text-foreground"
              >
                {s.slice(0, 2)}
              </a>
            ))}
          </div>
        </div>

        <div className="text-sm">
          <h2 className="font-mono text-xs uppercase tracking-widest text-muted">Registered office</h2>
          <address className="mt-3 not-italic leading-6 text-muted">
            [Office address, Line 1]
            <br />
            [Area, {CITY} 500 0xx]
            <br />
            [Registration number]
          </address>
          <p className="mt-2 text-muted">[Tax-benefit note placeholder]</p>
          <h2 className="mt-6 font-mono text-xs uppercase tracking-widest text-muted">Financials</h2>
          <a href="#" className="mt-2 inline-block leading-6 underline underline-offset-4 decoration-line">
            [Annual report — publish placeholder]
          </a>
        </div>

        <div className="text-sm">
          <h2 className="font-mono text-xs uppercase tracking-widest text-muted">Explore</h2>
          <ul className="mt-3 space-y-2">
            {[
              { href: "/board", label: "Live board" },
              { href: "/track/ETS-2041", label: "Track a delivery" },
              { href: "/post", label: "Post surplus" },
              { href: "/nutrition", label: "Nutrition" },
              { href: "/impact", label: "Impact" },
              { href: "/ngo", label: "For NGOs" },
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
          <h2 className="font-mono text-xs uppercase tracking-widest text-muted">Contact</h2>
          <p className="mt-3 leading-6 text-muted">
            [hello@eatsly.example.org]
            <br />
            [+91 phone placeholder]
          </p>
          <h2 className="mt-6 font-mono text-xs uppercase tracking-widest text-muted">Policies</h2>
          <ul className="mt-3 space-y-2">
            {["Privacy policy", "Food safety policy", "Volunteer safety"].map((l) => (
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
          <span>Sample data — every listing, NGO and number is illustrative.</span>
          <span>Photos: monochrome placeholders; see IMAGES_NEEDED.md. Credits due on publish.</span>
        </div>
      </div>
    </footer>
  );
}
