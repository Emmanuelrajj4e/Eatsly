import data from "@/data/landing.json";
import { PatternImage } from "@/components/landing/pattern-image";

/**
 * g. How it works: Post → Claim → Track → Serve. The numbering is real
 * because it is a strict sequence — each photo is a labelled placeholder.
 */
export function HowItWorks() {
  return (
    <section id="how" aria-label="How Eatsly works" className="mx-auto max-w-6xl px-4 pb-16">
      <div className="border-b border-line pb-4">
        <p className="font-mono text-xs uppercase tracking-widest text-muted">Four stages</p>
        <h2 className="mt-2 font-display text-3xl font-extrabold tracking-tight">
          Post, claim, track, serve
        </h2>
        <p className="mt-2 max-w-2xl text-muted">
          One path from leftover to plate. The safety clock makes every stage explicit.
        </p>
      </div>

      <ol className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {data.steps.map((step, i) => (
          <li key={step.n} className="flex flex-col">
            <PatternImage
              subject={step.subject}
              caption={`Photo placeholder: ${step.photo}`}
              ratio="4 / 3"
              tone={STEP_TONES[i]}
              className="rounded-card"
            />
            <div className="mt-4 flex items-center gap-2.5">
              <span
                className="grid h-8 w-8 shrink-0 place-items-center rounded-full font-mono text-xs font-bold"
                style={NUM_TONES[i]}
                aria-hidden="true"
              >
                {i + 1}
              </span>
              <h3 className="font-display text-xl font-bold tracking-tight">{step.title}</h3>
            </div>
            <p className="mt-2 text-sm leading-6 text-muted">{step.sentence}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}

const STEP_TONES = ["orange", "green", "blue", "yellow"] as const;

const NUM_TONES = [
  { background: "var(--orange)", color: "var(--ink)" },
  { background: "var(--green)", color: "#ffffff" },
  { background: "var(--blue)", color: "#ffffff" },
  { background: "var(--yellow)", color: "var(--ink)" },
];
