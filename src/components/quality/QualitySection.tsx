import { qualitySectionData } from "@/data/quality";
import { QualitySectionClient } from "./QualitySectionClient";

interface QualitySectionProps {
  showInnovations?: boolean;
  smallHeading?: string;
  boldDescription?: string;
  cta?: { label: string; href: string };
}

const featuredIds = [
  "calcifying-microbe",
  "insulated-walls",
  "welded-wire-girder",
  "green-energy",
];

export function QualitySection({
  showInnovations = false,
  smallHeading,
  boldDescription,
  cta,
}: QualitySectionProps = {}) {
  const data = qualitySectionData;
  const featured = featuredIds.flatMap((id) => data.technologies.filter((tech) => tech.id === id));
  const technologies = showInnovations
    ? [...featured, ...data.technologies.filter((tech) => !featuredIds.includes(tech.id))]
    : featured;

  return (
    <QualitySectionClient
      smallHeading={smallHeading ?? data.smallHeading}
      boldDescription={boldDescription ?? data.boldDescription}
      cta={cta ?? (showInnovations ? undefined : data.cta)}
      technologies={technologies}
      showInnovations={showInnovations}
    />
  );
}
