import { AboutHero } from "@/components/about-page/AboutHero";
import { AboutPillars } from "@/components/about-page/AboutPillars";
import { AboutStoryStats } from "@/components/about-page/AboutStoryStats";
import { AwardsSection } from "@/components/awards/AwardsSection";
import { JourneySection } from "@/components/journey/JourneySection";
import type { Metadata } from "next";


export const metadata: Metadata = {
  title: "About Us | Vastu Vihar Nepal",
  description:
    "Discover Vastu Vihar Nepal's 32+ year journey since 1994—building Vastu-compliant, earthquake-resistant, and sustainable residential townships.",
};

export default function AboutPage() {
  return (
    <main>
      <AboutHero />
      <AboutStoryStats />
      <JourneySection />
      <AboutPillars />
      <AwardsSection />
      {/* <ContactBanner /> */}
    </main>
  );
}