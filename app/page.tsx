import Link from "next/link";
import { HERO_QUOTE, APP_MISSION } from "@/config/brand";
import { buttonStyles } from "@/components/ui/button";
import { ArrowRight, Plus } from "lucide-react";

/**
 * Phase-1 landing stub: hero quote + mission + CTAs. Sections a–g land in
 * Phase 2; this already renders real content, never an empty shell.
 */
export default function HomePage() {
  return (
    <section className="mx-auto max-w-6xl px-4 pb-16 pt-16 md:pt-24">
      <p className="font-mono text-xs uppercase tracking-widest text-muted">
        Live food-safety tracking · Hyderabad
      </p>
      <h1 className="mt-4 max-w-4xl font-quote text-5xl italic leading-[1.05] sm:text-6xl md:text-7xl">
        {HERO_QUOTE}
      </h1>
      <p className="mt-6 max-w-xl text-lg text-muted">{APP_MISSION}</p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Link href="/post" className={buttonStyles("primary", "lg")}>
          <Plus className="h-5 w-5" strokeWidth={1.5} />
          Post surplus
        </Link>
        <Link href="/board" className={buttonStyles("secondary", "lg")}>
          Claim food
          <ArrowRight className="h-5 w-5" strokeWidth={1.5} />
        </Link>
      </div>
    </section>
  );
}
