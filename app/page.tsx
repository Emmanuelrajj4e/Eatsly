import Link from "next/link";
import { APP_HASHTAG, APP_MISSION, APP_TAGLINE } from "@/config/brand";
import { ArrowRightIcon, PlusIcon } from "@/components/icons";
import { buttonStyles } from "@/components/ui/button";

/**
 * Phase-1 home: hero only. Sections (how-it-works, counters, city, stories)
 * are layered in Phase 2 — this stays buildable and content-true meanwhile.
 */
export default function HomePage() {
  return (
    <section className="mx-auto max-w-6xl px-4 pb-10 pt-14 md:pt-20">
      <p className="font-mono text-sm font-medium uppercase tracking-widest text-leaf">
        Live food-safety countdowns · {APP_HASHTAG}
      </p>
      <h1 className="mt-3 max-w-3xl font-display text-5xl font-extrabold leading-[1.02] tracking-tight sm:text-6xl md:text-7xl">
        {APP_TAGLINE}
      </h1>
      <p className="mt-4 max-w-xl text-lg text-muted">{APP_MISSION}</p>

      <div className="mt-7 flex flex-wrap gap-3">
        <Link href="/post" className={buttonStyles("primary", "lg")}>
          <PlusIcon className="h-5 w-5" />
          Post surplus
        </Link>
        <Link href="/board" className={buttonStyles("secondary", "lg")}>
          Claim food
          <ArrowRightIcon className="h-5 w-5" />
        </Link>
      </div>
    </section>
  );
}
