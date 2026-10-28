import data from "@/data/landing.json";

/** d. Who it serves: quiet text row of donor and NGO types (no fake logos). */
export function ServesRow() {
  const { donorTypes, ngoTypes } = data.serves;
  return (
    <section className="border-y border-line bg-surface" aria-label="Who Eatsly serves">
      <div className="mx-auto grid max-w-6xl gap-6 px-4 py-8 md:grid-cols-2">
        <div>
          <h2 className="font-mono text-xs uppercase tracking-widest text-muted">Donor types</h2>
          <p className="mt-3 text-lg leading-8 text-foreground">
            {donorTypes.join(" · ")}
          </p>
        </div>
        <div className="md:border-l md:border-line md:pl-8">
          <h2 className="font-mono text-xs uppercase tracking-widest text-muted">NGO types</h2>
          <p className="mt-3 text-lg leading-8 text-foreground">
            {ngoTypes.join(" · ")}
          </p>
        </div>
      </div>
    </section>
  );
}

/** e. Mission statement: full-black panel, huge white sentence. */
export function MissionBlack() {
  return (
    <section className="bg-foreground text-background" aria-label="Mission">
      <p className="mx-auto max-w-6xl px-4 py-16 font-quote text-3xl italic leading-snug md:py-24 md:text-5xl">
        “Surplus is only waste if nobody is watching the clock.”
      </p>
    </section>
  );
}
