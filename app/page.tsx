import { TickerStrip } from "@/components/footer";
import { Hero } from "@/components/landing/hero";
import { ServesRow, MissionBlack } from "@/components/landing/band-sections";
import { ImpactGrid } from "@/components/landing/impact-grid";
import { HowItWorks } from "@/components/landing/how-it-works";
import { TrackPreview } from "@/components/landing/track-preview";
import { NutritionTeaser } from "@/components/landing/nutrition-teaser";
import { WhyMatters } from "@/components/landing/why-matters";
import { CityBreakdown, Stories, Faq, FinalCta } from "@/components/landing/sections-late";

/**
 * Landing, in order:
 * a ticker strip · c hero + live card · d who it serves · e mission (black)
 * · f impact counters · g how it works · h live tracking preview (black)
 * · i nutrition teaser · j why it matters · k city breakdown · l stories
 * · m FAQ · n final CTA.
 */
export default function HomePage() {
  return (
    <>
      <TickerStrip />
      <Hero />
      <ServesRow />
      <MissionBlack />
      <ImpactGrid />
      <HowItWorks />
      <TrackPreview />
      <NutritionTeaser />
      <WhyMatters />
      <CityBreakdown />
      <Stories />
      <Faq />
      <FinalCta />
    </>
  );
}
