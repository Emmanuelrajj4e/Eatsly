import { TickerStrip } from "@/components/footer";
import { Hero } from "@/components/landing/hero";
import { ServesRow, MissionBlack } from "@/components/landing/band-sections";
import { ImpactGrid } from "@/components/landing/impact-grid";
import { HowItWorks } from "@/components/landing/how-it-works";

/**
 * Landing, in order:
 * a ticker strip · c hero + live card · d who it serves · e mission (black)
 * · f impact counters · g how it works. Sections h–n join in Phase 6.
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
    </>
  );
}
