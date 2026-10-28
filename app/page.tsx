import { Hero } from "@/components/landing/hero";
import { BuiltFor } from "@/components/landing/built-for";
import { WhyCondensed } from "@/components/landing/why-condensed";
import { WhoItHelps } from "@/components/landing/who-it-helps";
import { HowItWorks } from "@/components/landing/how-it-works";
import { TrackPreview } from "@/components/landing/track-preview";
import { NutritionTeaser } from "@/components/landing/nutrition-teaser";
import { ImpactGrid } from "@/components/landing/impact-grid";
import { Stories, Faq, FinalCta } from "@/components/landing/sections-late";

/**
 * Landing in the brief order — announcement bar + header live in the layout:
 * c hero · d built for · e why (condensed) · f who it helps · g how it works
 * · h live tracking demo · i nutrition teaser · j impact counters · k stories
 * · l FAQ · m final CTA (+ ink footer).
 * No live board and no listing cards anywhere on this page.
 */
export default function HomePage() {
  return (
    <>
      <Hero />
      <BuiltFor />
      <WhyCondensed />
      <WhoItHelps />
      <HowItWorks />
      <TrackPreview />
      <NutritionTeaser />
      <ImpactGrid />
      <Stories />
      <Faq />
      <FinalCta />
    </>
  );
}
