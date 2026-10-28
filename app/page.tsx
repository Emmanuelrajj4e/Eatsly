import { Hero } from "@/components/home/hero";
import { HowItWorks } from "@/components/home/how-it-works";
import { ImpactStrip } from "@/components/home/impact-strip";
import { CityBreakdown } from "@/components/home/city-breakdown";
import { Stories } from "@/components/home/stories";

export default function HomePage() {
  return (
    <>
      <Hero />
      <HowItWorks />
      <ImpactStrip />
      <CityBreakdown />
      <Stories />
    </>
  );
}
