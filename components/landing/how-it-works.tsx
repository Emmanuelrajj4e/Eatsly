import data from "@/data/landing.json";
import { PatternImage } from "@/components/landing/pattern-image";

/**
 * g. How it works: Post → Claim → Track → Serve. The numbering is real
 * because it is a strict sequence — each photo is a labelled placeholder.
 */
export function HowItWorks() {
  return (
    <section aria-label="How Eatsly works" className="mx-auto max-w-6xl px-4 pb-16">
      <div className="border-b border-line pb-4">
        <p className="font-mono text-xs uppercase tracking-widest text-muted">Four stages</p>
        <h2 className="mt-2 font-display text-3xl font-extrabold tracking-tight">
          Post, claim, track, serve
        </h2>
        <p className="mt-2 max-w-2xl text-muted">
          One path from leftover to plate. The safety clock makes every stage explicit.
        </p>
      </div>

      <ol className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {data.steps.map((step) => (
          <li key={step.n} className="flex flex-col">
            <PatternImage subject={step.subject} caption={`Photo placeholder: ${step.photo}`} ratio="4 / 3" />
            <p className="mt-4 font-mono text-sm tracking-widest text-muted">{step.n}</p>
            <h3 className="mt-1 font-display text-xl font-bold tracking-tight">{step.title}</h3>
            <p className="mt-2 text-sm leading-6 text-muted">{step.sentence}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
