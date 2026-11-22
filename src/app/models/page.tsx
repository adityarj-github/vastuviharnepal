import type { Metadata } from "next";
import { PageHero } from "@/components/common/PageHero";
import { ModelsGrid, ModelLeadSection } from "@/components/models-page";
import { projectsList } from "@/data/projects";
import { QualitySection } from "@/components/quality/QualitySection";

export const metadata: Metadata = {
  title: "Residence Models & Floor Plans | Vastu Vihar Nepal",
  description:
    "Explore Vastu Vihar Nepal's collection of modern, Vastu-compliant bungalows and duplex villas—including Pashupati, Kanchanjunga, Sagarmatha, and Suryodaya.",
};

export default function ModelsPage() {
  return (
    <main>
      <PageHero
        location="Models"
        bgImage="/kanchanjunga/model-kanchanjunga-wide.webp"
        bgImageAlt="Vastu Vihar Nepal Residential Bungalow Models"
        headingLine1="Our Residence Models,"
        headingLine2="Tailored For Living"
        description="Explore thoughtfully planned Vastu-compliant bungalows, duplex villas, and simplex residences across Nepal—engineered with earthquake-resistant raft foundations."
      />
      <ModelsGrid projects={projectsList} />
      <QualitySection />
      <div className="container" style={{ paddingBottom: "clamp(3.5rem, 6vw, 5.5rem)" }}>
        <ModelLeadSection />
      </div>
    </main>
  );
}
