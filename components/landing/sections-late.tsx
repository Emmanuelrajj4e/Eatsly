import Link from "next/link";
import data from "@/data/city.json";
import { CITY } from "@/config/brand";
import { buttonStyles } from "@/components/ui/button";
import {
  Accordion,
  type AccordionItem,
} from "@/components/ui/accordion";
import { ArrowRight, Plus } from "lucide-react";

type CityRow = { area: string; donors: number; ngos: number };

/** k. City breakdown: sample donor/NGO density per Hyderabad area. */
export function CityBreakdown() {
  const rows = data.areas as CityRow[];
  const donors = rows.reduce((s, r) => s + r.donors, 0);
  const ngos = rows.reduce((s, r) => s + r.ngos, 0);
  return (
    <section aria-label="City breakdown" className="mx-auto max-w-6xl px-4 py-16">
      <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-line pb-4">
        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-muted">City snapshot</p>
          <h2 className="mt-2 font-display text-3xl font-extrabold tracking-tight">
            Where {CITY} is posting
          </h2>
        </div>
        <p className="font-mono text-[11px] uppercase tracking-widest text-muted">Sample data</p>
      </div>

      <table className="mt-6 w-full border-collapse text-sm">
        <caption className="sr-only">
          {CITY} areas with active donor units and NGO partners (sample data)
        </caption>
        <thead>
          <tr className="border-b border-line text-left font-mono text-[11px] uppercase tracking-widest text-muted">
            <th scope="col" className="py-2 pr-4">Area</th>
            <th scope="col" className="py-2 pr-4">Donor units</th>
            <th scope="col" className="py-2">NGO partners</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.area} className="border-b border-line">
              <th scope="row" className="py-2.5 pr-4 text-left font-medium">{r.area}</th>
              <td className="py-2.5 pr-4 font-mono tabular-nums">{r.donors}</td>
              <td className="py-2.5 font-mono tabular-nums">{r.ngos}</td>
            </tr>
          ))}
          <tr className="font-semibold">
            <th scope="row" className="py-3 pr-4 text-left">Total</th>
            <td className="py-3 pr-4 font-mono tabular-nums">{donors}</td>
            <td className="py-3 font-mono tabular-nums">{ngos}</td>
          </tr>
        </tbody>
      </table>
      <p className="mt-3 text-xs text-muted">
        Sample network across {rows.length} {CITY} areas — illustrative numbers for the
        demo, not a census.
      </p>
    </section>
  );
}

/** l. Stories: three short sample quotes, first names only. */
export function Stories() {
  const stories = [
    {
      who: "Donor · Sakina",
      what: "“The wedding ended at 11. By 11:40 a NGO had claimed 120 plates — the clock told us someone was watching.”",
      note: "Sample story",
    },
    {
      who: "NGO coordinator · Rukmini",
      what: "“We plan routes against the safe window now. No more guessing which hall is worth driving to.”",
      note: "Sample story",
    },
    {
      who: "Volunteer · Imran",
      what: "“Forty servings, one scooter, zero waste. The tracking page meant the kitchen had tea ready when I arrived.”",
      note: "Sample story",
    },
  ];
  return (
    <section aria-label="Voices" className="border-y border-line bg-surface">
      <div className="mx-auto max-w-6xl px-4 py-14">
        <h2 className="border-b border-line pb-4 font-display text-3xl font-extrabold tracking-tight">
          Three voices on the clock
        </h2>
        <ul className="mt-6 grid gap-6 md:grid-cols-3">
          {stories.map((s) => (
            <li key={s.who}>
              <blockquote>
                <p className="font-quote text-2xl italic leading-snug">{s.what}</p>
                <footer className="mt-3 font-mono text-[11px] uppercase tracking-widest text-muted">
                  {s.who} · {s.note}
                </footer>
              </blockquote>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/** m. FAQ accordion. */
export function Faq() {
  const items: AccordionItem[] = [
    {
      id: "safe",
      question: "Is donated food safe?",
      answer:
        "Every post starts a visible safe-time clock from its last-cooked time: hot cooked food gets 4 hours, sweets and dry snacks 12, packaged 24 and fresh produce 48. Claims are only accepted when a requested NGO can arrive at least 10 minutes before the window ends, and expired listings leave the board.",
    },
    {
      id: "who",
      question: "Who can donate?",
      answer:
        "Restaurants, wedding halls, hostel messes, office canteens, bakeries and households. Post surplus one time or every shift — the form takes a dish, servings, last-cooked time and the area.",
    },
    {
      id: "verify",
      question: "How are NGOs verified?",
      answer:
        "In this demo the network is a curated sample list. In production, NGOs would register with [Registration number] and contact details checked before their claim buttons go live.",
    },
    {
      id: "expire",
      question: "What happens if food expires?",
      answer:
        "The listing turns greyed and “Expired” on the board and drops out of claim queues automatically. Nothing expired is ever offered — the clock is the safety rule, not an afterthought.",
    },
    {
      id: "track",
      question: "How does tracking work?",
      answer:
        "A claimed run gets a live page with stages (posted, claimed, volunteer assigned, picked up, in transit, delivered), a moving map marker, an ETA countdown and proof of delivery at the end. The demo here is simulated; a real feed would subscribe behind the same interface.",
    },
  ];
  return (
    <section aria-label="Frequently asked questions" className="mx-auto max-w-3xl px-4 py-16">
      <h2 className="border-b border-line pb-4 font-display text-3xl font-extrabold tracking-tight">
        Questions people actually ask
      </h2>
      <div className="mt-6">
        <Accordion items={items} />
      </div>
    </section>
  );
}

/** n. Final CTA with the second quote. */
export function FinalCta() {
  return (
    <section aria-label="Get started" className="bg-foreground text-background">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-16 md:grid-cols-[1.2fr_minmax(0,1fr)] md:items-end">
        <div>
          <h2 className="font-quote text-4xl italic leading-tight md:text-6xl">
            “Surplus is only waste if nobody is watching the clock.”
          </h2>
          <p className="mt-4 max-w-lg text-background/70">
            Post what is left, claim what can still be reached, and let the tracking
            page close the loop.
          </p>
        </div>
        <div className="flex flex-wrap gap-3 md:justify-end">
          <Link href="/post" className={buttonStyles("secondary", "lg", "border-background bg-background text-foreground hover:bg-transparent hover:text-background")}>
            <Plus className="h-5 w-5" strokeWidth={1.5} />
            Post surplus
          </Link>
          <Link href="/board" className={buttonStyles("secondary", "lg", "border-background text-background hover:bg-background hover:text-foreground")}>
            Claim food
            <ArrowRight className="h-5 w-5" strokeWidth={1.5} />
          </Link>
        </div>
      </div>
    </section>
  );
}
