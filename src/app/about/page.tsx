import { PageHero } from "@/components/common/PageHero";
import { AboutPillars } from "@/components/about-page/AboutPillars";
import { AboutStoryStats } from "@/components/about-page/AboutStoryStats";
import { WhyUsSection } from "@/components/why-us";
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
        bgImage="/hero/about-hero.webp"
        bgImageAlt="Vastu Vihar Nepal"
        headingLine1={hero.headingLine1}
        headingLine2={hero.headingLine2}
        description={hero.description}
      />
      <AboutStoryStats />
      <JourneySection />
      <WhyUsSection />
      <AboutPillars />
      {/* <ContactBanner /> */}
    </main>
  );
}
