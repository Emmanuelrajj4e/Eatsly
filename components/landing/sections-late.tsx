import Link from "next/link";
import { buttonStyles } from "@/components/ui/button";
import { Accordion, type AccordionItem } from "@/components/ui/accordion";
import { ArrowRight, Bike, ChefHat, HeartHandshake, Quote } from "lucide-react";
import { cn } from "@/lib/utils";

/** l. Stories: three short sample quotes, first names only, role-tinted cards. */
const STORIES = [
  {
    who: "Donor · Sakina",
    what: "\u201CThe wedding ended at 11. By 11:40 an NGO had claimed 120 plates — the clock told us someone was watching.\u201D",
    note: "Sample story",
    tone: "orange" as const,
    icon: ChefHat,
  },
  {
    who: "NGO coordinator · Rukmini",
    what: "\u201CWe plan routes against the safe window now. No more guessing which hall is worth driving to.\u201D",
    note: "Sample story",
    tone: "green" as const,
    icon: HeartHandshake,
  },
  {
    who: "Volunteer · Imran",
    what: "\u201CForty servings, one scooter, zero waste. The tracking page meant the kitchen had tea ready when I arrived.\u201D",
    note: "Sample story",
    tone: "blue" as const,
    icon: Bike,
  },
];

const STORY_TONES = {
  orange: "border-t-4 border-orange bg-orange-tint/50",
  green: "border-t-4 border-green bg-green-tint/50",
  blue: "border-t-4 border-blue bg-blue-tint/50",
} as const;

const STORY_ICON = {
  orange: "text-orange",
  green: "text-green",
  blue: "text-blue",
} as const;

export function Stories() {
  return (
    <section aria-label="Voices" className="mx-auto max-w-6xl px-4 py-16">
      <h2 className="border-b border-line pb-4 font-display text-3xl font-bold tracking-tight">
        Three voices on the clock
      </h2>
      <ul className="mt-6 grid gap-4 md:grid-cols-3">
        {STORIES.map((s) => {
          const Icon = s.icon;
          return (
            <li
              key={s.who}
              className={cn("flex flex-col rounded-card border border-line bg-surface p-5", STORY_TONES[s.tone])}
            >
              <Quote className={cn("h-6 w-6", STORY_ICON[s.tone])} strokeWidth={1.5} aria-hidden="true" />
              <blockquote>
                <p className="mt-3 font-quote text-2xl italic leading-snug text-ink">{s.what}</p>
                <footer className="mt-3 flex items-center gap-2 font-mono text-[11px] uppercase tracking-widest text-muted">
                  {Icon && <Icon className="h-3.5 w-3.5" strokeWidth={2} aria-hidden="true" />}
                  {s.who} · {s.note}
                </footer>
              </blockquote>
            </li>
          );
        })}
      </ul>
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
        "The listing turns greyed and \u201CExpired\u201D on the board and drops out of claim queues automatically. Nothing expired is ever offered — the clock is the safety rule, not an afterthought.",
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
      <h2 className="border-b border-line pb-4 font-display text-3xl font-bold tracking-tight">
        Questions people actually ask
      </h2>
      <div className="mt-6">
        <Accordion items={items} />
      </div>
    </section>
  );
}

/** n. Final CTA on ink with the second quote + all three role doors. */
export function FinalCta() {
  return (
    <section aria-label="Get started" className="border-t border-line bg-ink text-white">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-16 md:grid-cols-[1.2fr_minmax(0,1fr)] md:items-end">
        <div>
          <h2 className="font-quote text-4xl italic leading-tight md:text-6xl">
            “Surplus is only waste if nobody is watching the clock.”
          </h2>
          <p className="mt-4 max-w-lg text-white/70">
            Post what is left, claim what can still be reached, and let the tracking
            page close the loop.
          </p>
        </div>
        <div className="flex flex-col gap-3 md:items-end">
          <Link href="/start?role=donor" className={cn(buttonStyles("primary", "lg", "w-full md:w-auto"))}>
            <ChefHat className="h-5 w-5" strokeWidth={2} aria-hidden="true" />
            Donate food
          </Link>
          <Link href="/start?role=ngo" className={cn(buttonStyles("green", "lg", "w-full md:w-auto"))}>
            I&apos;m an NGO
          </Link>
          <Link
            href="/start?role=volunteer"
            className={cn(
              buttonStyles("blue", "lg", "w-full md:w-auto"),
            )}
          >
            Become a volunteer
            <ArrowRight className="h-5 w-5" strokeWidth={2} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}
