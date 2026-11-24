import type { Metadata } from "next";
import { PageHero } from "@/components/common/PageHero";
import {
  QualityOverview,
} from "@/components/quality-page";
import { QualitySection } from "@/components/quality/QualitySection";
import { JourneySection } from "@/components/journey/JourneySection";

export const metadata: Metadata = {
  title: "Construction Quality & Engineering | Vastu Vihar Nepal",
  description:
    "Explore Vastu Vihar Nepal's proprietary construction technologies—from 200-year self-healing bio-concrete to rat-trap insulated walls, raft foundations, and solar moving roofs.",
};

export default function QualityPage() {
  return (
    <main>
      <PageHero
        location="Construction Quality"
        bgImage="/hero/construction-hero.webp"
        bgImageAlt="Vastu Vihar Nepal Construction Quality and Self-Healing Bio-Concrete"
        headingLine1="Uncompromising Quality,"
        headingLine2="Built For Generations"
        description="Engineered with self-healing bio-concrete, monolithic raft foundations, thermal rat-trap insulation, and green energy innovations."
      />
      <QualityOverview />
      <QualitySection showInnovations={true} />
      <JourneySection />
    </main>
  );
}
