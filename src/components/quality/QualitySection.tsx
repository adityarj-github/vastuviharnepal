import { qualitySectionData } from "@/data/quality";
import { QualitySectionClient } from "./QualitySectionClient";

export function QualitySection() {
  const { smallHeading, boldDescription, cta, technologies } = qualitySectionData;

  const leftCard =
    technologies.find((t) => t.id === "insulated-walls") ?? technologies[2];
  const centerCard =
    technologies.find((t) => t.id === "calcifying-microbe") ?? technologies[0];
  const rightCard =
    technologies.find((t) => t.id === "green-energy") ?? technologies[5];

  return (
    <QualitySectionClient
      smallHeading={smallHeading}
      boldDescription={boldDescription}
      cta={cta}
      leftCard={leftCard}
      centerCard={centerCard}
      rightCard={rightCard}
    />
  );
}