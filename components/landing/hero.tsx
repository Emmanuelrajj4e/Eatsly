import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { buttonStyles } from "@/components/ui/button";
import { PatternImage } from "@/components/landing/pattern-image";

/**
 * Hero, brief §1c: the quote as a large Instrument Serif italic headline
 * with a yellow highlight under "finds a plate", one-line mission, three
 * role CTAs (each preselects a role in /start), colour photo + floating
 * live-tracking card. No listing cards, no board content.
 */

/** Splits the hero quote so the last words get the yellow highlight. */
function HighlightedQuote({ text }: { text: string }) {
  const marker = "finds a plate";
  const idx = text.indexOf(marker);
  if (idx === -1) return <>{text}</>;
  const head = text.slice(0, idx);
  const tail = text.slice(idx);
  return (
    <>
      {head}
      <span className="bg-[linear-gradient(to_top,var(--yellow)_30%,transparent_30%)] [box-decoration-break:clone]">
        {tail}
      </span>
    </>
  );
}

/**
 * Floating live-tracking card: mini colourful map with a pulsing volunteer
 * marker, donor/NGO pins and an ETA chip. Decorative sample art — the facts
 * it repeats (ID, ETA) are written as text next to it.
 */
function MiniTrackCard() {
  return (
    <div
      aria-label="Sample live tracking card"
      className="w-full max-w-[300px] rounded-card border border-line bg-surface p-3 shadow-[var(--shadow-float)]"
    >
      <div className="flex items-center justify-between gap-2">
        <p className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest text-muted">
          <span className="relative grid h-2.5 w-2.5 place-items-center" aria-hidden="true">
            <span className="absolute h-2.5 w-2.5 animate-pulse-ring rounded-full bg-blue" />
            <span className="h-1.5 w-1.5 rounded-full bg-blue" />
          </span>
          Live tracking · sample
        </p>
        <p className="font-mono text-[10px] font-semibold text-blue">ETS-2041</p>
      </div>

      {/* mini map: streets, route, pins, moving volunteer */}
      <svg viewBox="0 0 264 116" className="mt-2 w-full rounded-xl bg-blue-tint" aria-hidden="true">
        {/* streets */}
        <g stroke="var(--green-tint)" strokeWidth="7" strokeLinecap="round" fill="none">
          <path d="M8 30 H256" />
          <path d="M8 62 H256" />
          <path d="M8 92 H256" />
          <path d="M52 8 V108" />
          <path d="M118 8 V108" />
          <path d="M196 8 V108" />
        </g>
        <g stroke="var(--line)" strokeWidth="2.5" strokeLinecap="round" fill="none">
          <path d="M0 46 H264" opacity="0.8" />
          <path d="M160 0 V116" opacity="0.8" />
        </g>
        {/* park + water blobs for colour */}
        <ellipse cx="226" cy="24" rx="30" ry="13" fill="var(--green-tint)" />
        <ellipse cx="30" cy="98" rx="26" ry="10" fill="var(--blue-tint)" />
        {/* travelled (solid green) + remaining (dashed blue) */}
        <path d="M52 30 V62" stroke="var(--green)" strokeWidth="4" strokeLinecap="round" fill="none" />
        <path
          d="M52 62 H118 V92"
          stroke="var(--blue)"
          strokeWidth="3.5"
          strokeDasharray="6 6"
          strokeLinecap="round"
          fill="none"
        />
        {/* donor pin (orange) */}
        <circle cx="52" cy="30" r="7" fill="var(--orange)" stroke="#fff" strokeWidth="3" />
        {/* ngo pin (green) */}
        <circle cx="118" cy="92" r="7" fill="var(--green)" stroke="#fff" strokeWidth="3" />
        {/* volunteer marker: blue dot + pulsing ring */}
        <g>
          <circle cx="118" cy="62" r="15" fill="var(--blue)" opacity="0.25" />
          <circle cx="118" cy="62" r="7.5" fill="var(--blue)" stroke="#fff" strokeWidth="3" />
        </g>
      </svg>

      <p className="mt-2 flex items-center justify-between font-mono text-[11px] text-muted">
        <span>ETA 12 min · Imran (scooter)</span>
        <span className="rounded-full bg-green px-2 py-0.5 text-[10px] font-semibold text-white">
          On time
        </span>
      </p>
    </div>
  );
}

export function Hero() {
  return (
    <section className="mx-auto max-w-6xl px-4 pb-16 pt-10 md:pt-14">
      <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_400px] lg:items-center">
        <div className="fade-up">
          <p className="inline-flex items-center gap-2 rounded-full bg-orange-tint px-3 py-1 font-mono text-[11px] uppercase tracking-widest text-ink">
            Every plate, on time
          </p>
          <h1 className="mt-4 max-w-4xl font-quote text-[2.6rem] italic leading-[1.04] sm:text-6xl md:text-[4.2rem]">
            <HighlightedQuote text={"No food should expire before it finds a plate."} />
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-muted">
            Eatsly connects surplus food donors with verified NGOs and volunteers in
            Hyderabad — every listing carries a live food-safety clock, every claim is
            checked against it, and every delivery is tracked to the plate.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/start?role=donor"
              className={buttonStyles("primary", "lg")}
            >
              Donate food
              <ArrowRight className="h-5 w-5" strokeWidth={2} />
            </Link>
            <Link href="/start?role=ngo" className={buttonStyles("outline-green", "lg")}>
              I&apos;m an NGO
            </Link>
            <Link href="/start?role=volunteer" className={buttonStyles("outline-blue", "lg")}>
              Become a volunteer
            </Link>
          </div>
          <p className="mt-4 font-mono text-[11px] text-muted">
            Demo sign-in — no real accounts. All data is sample data.
          </p>
        </div>

        <div className="relative fade-up pb-10 sm:pb-12">
          <PatternImage
            subject="Image: hands sharing a plate of hot food"
            caption="Photo placeholder: hero-hands-sharing-meal.jpg"
            ratio="4 / 3.4"
            tone="yellow"
            className="rounded-card"
          />
          <div className="absolute inset-x-4 bottom-0 flex justify-center sm:inset-x-6">
            <MiniTrackCard />
          </div>
        </div>
      </div>
    </section>
  );
}
