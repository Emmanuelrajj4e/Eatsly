/**
 * j. Why it matters: short editorial with only established facts, each with a
 * named source and year in a footnote. Where a figure is uncertain, the sentence
 * is written without a number instead.
 */
export function WhyMatters() {
  return (
    <section aria-labelledby="why-heading" className="mx-auto max-w-3xl px-4 py-16">
      <div className="border-b border-line pb-4">
        <p className="font-mono text-xs uppercase tracking-widest text-muted">Why it matters</p>
        <h2 id="why-heading" className="mt-2 font-display text-3xl font-extrabold tracking-tight">
          The same food, two different evenings
        </h2>
      </div>

      <div className="mt-6 space-y-5 text-base leading-8">
        <p>
          One evening, at a wedding hall, trays of biryani go cold on the buffet counter.
          The same evening, a few kilometres away, a community kitchen wonders whether it
          has enough for the second serving line. Nothing about the food changed — only
          whether somebody could move it in the hours that matter.
        </p>
        <p>
          The world has the same problem at scale: roughly a fifth of the food available
          to consumers is wasted, while hundreds of millions of people do not get enough
          to eat.<sup>1</sup><sup>2</sup> Close to home, the quieter costs are common:
          anaemia among Indian women and adolescents has stayed stubbornly high through
          several survey rounds.<sup>3</sup> These are not exotic failures — they are
          logistics and attention problems, which is what a live clock is for.
        </p>
        <p>
          Eatsly is built around one honest constraint: food has a window. Posted with a
          started countdown, claimed only when a volunteer can arrive with margin, and
          greyed out the moment the window closes. That is the whole trade — move it in
          time, or don&apos;t move it at all.
        </p>
      </div>

      <ol className="mt-8 space-y-2 border-t border-line pt-4 text-sm text-muted">
        <li>
          <sup>1</sup> UNEP Food Waste Index Report 2024: about 19% of available food was
          wasted (2022 reference year).
        </li>
        <li>
          <sup>2</sup> FAO, The State of Food Security and Nutrition in the World 2024:
          an estimated 733 million people faced hunger in 2023.
        </li>
        <li>
          <sup>3</sup> National Family Health Survey (NFHS-5), 2019–21: over half of
          women (15–49) in India were anaemic.
        </li>
      </ol>
    </section>
  );
}
