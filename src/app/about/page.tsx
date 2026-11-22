import { PageHero } from "@/components/common/PageHero";
import { AboutPillars } from "@/components/about-page/AboutPillars";
import { AboutStoryStats } from "@/components/about-page/AboutStoryStats";
import { AwardsSection } from "@/components/awards/AwardsSection";
import { JourneySection } from "@/components/journey/JourneySection";
import { aboutPageData } from "@/data/about";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us | Vastu Vihar Nepal",
  description:
    "Discover Vastu Vihar Nepal's 32+ year journey since 1994—building Vastu-compliant, earthquake-resistant, and sustainable residential townships.",
};

export default function AboutPage() {
  const { hero } = aboutPageData;

  return (
    <main>
      <PageHero
        location="About Us"
        bgImage="/simplex/model-simplex-wide.webp"
        bgImageAlt="Vastu Vihar Nepal Simplex Model Township"
        headingLine1={hero.headingLine1}
        headingLine2={hero.headingLine2}
        description={hero.description}
      />
      <AboutStoryStats />
      <JourneySection />
      <AboutPillars />
      <AwardsSection />
      {/* <ContactBanner /> */}
    </main>
  );
}
