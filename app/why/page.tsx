import type { Metadata } from "next";
import { WhyEatsly } from "@/components/why/why-view";

export const metadata: Metadata = {
  title: "Why Eatsly",
  description:
    "The food exists. What is missing is time, trust and coordination — the four gaps Eatsly closes.",
};

export default function WhyPage() {
  return (
    <>
      <section className="mx-auto max-w-6xl px-4 pb-2 pt-12">
        <p className="font-mono text-xs uppercase tracking-widest text-muted">Why Eatsly</p>
        <h1 className="mt-3 max-w-3xl font-quote text-4xl italic leading-tight md:text-6xl">
          The food exists. What is missing is time, trust and coordination.
        </h1>
        <p className="mt-4 max-w-xl text-lg text-muted">
          Hyderabad already cooks more food than it eats on gathering days. Eatsly
          exists because the gap between a full tray and an empty plate is a
          logistics problem, not a food problem.
        </p>
      </section>
      <WhyEatsly />
    </>
  );
}
