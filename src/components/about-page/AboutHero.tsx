import { PageHero } from "@/components/common/PageHero";
import { aboutPageData } from "@/data/about";

export function AboutHero() {
  const { hero } = aboutPageData;

  return (
    <PageHero
      location="About Us"
      bgImage="/simplex/model-simplex-wide.webp"
      bgImageAlt="Vastu Vihar Nepal Simplex Model Township"
      headingLine1={hero.headingLine1}
      headingLine2={hero.headingLine2}
      description={hero.description}
    />
  );
}
