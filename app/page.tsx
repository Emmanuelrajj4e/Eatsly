import { Hero } from "@/components/landing/hero";
import { BuiltFor } from "@/components/landing/built-for";
import { WhyCondensed } from "@/components/landing/why-condensed";
import { WhoItHelps } from "@/components/landing/who-it-helps";

/**
 * Landing in brief order — announcement bar + header live in the layout:
 * c hero · d built for · e why Eatsly (condensed) · f who it helps.
 * No live board, no listing cards anywhere on this page.
 * Sections g–m land in Phase 6.
 */
export default function HomePage() {
  return (
    <div className="space-y-16 pb-6 md:space-y-24">
      <Hero />
      <BuiltFor />
      <WhyCondensed />
      <WhoItHelps />
    </div>
  );
}
