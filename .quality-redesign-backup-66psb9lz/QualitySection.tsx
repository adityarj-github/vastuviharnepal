import { qualitySectionData } from "@/data/quality";
import { QualitySectionClient } from "./QualitySectionClient";

interface QualitySectionProps {
  showInnovations?: boolean;
  smallHeading?: string;
  boldDescription?: string;
  cta?: {
    label: string;
    href: string;
  };
}

export function QualitySection({
  showInnovations = false,
  smallHeading,
  boldDescription,
  cta,
}: QualitySectionProps = {}) {
  const data = qualitySectionData;

  const leftCard =
    data.technologies.find((t) => t.id === "insulated-walls") ?? data.technologies[2];
  const centerCard =
    data.technologies.find((t) => t.id === "calcifying-microbe") ?? data.technologies[0];
  const rightCard =
    data.technologies.find((t) => t.id === "green-energy") ?? data.technologies[5];

  return (
    <QualitySectionClient
      smallHeading={smallHeading ?? data.smallHeading}
      boldDescription={boldDescription ?? data.boldDescription}
      cta={cta ?? (showInnovations ? undefined : data.cta)}
      leftCard={leftCard}
      centerCard={centerCard}
      rightCard={rightCard}
      technologies={data.technologies}
      showInnovations={showInnovations}
    />
  );
}