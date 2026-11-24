import { PageHero } from "@/components/common/PageHero";
import { aboutPageData } from "@/data/about";

export function AboutHero() {
  const { hero } = aboutPageData;

  return (
    <PageHero
      location="About Us"
      bgImage="/hero/about-hero.webp"
      bgImageAlt="Vastu Vihar Nepal"
      headingLine1={hero.headingLine1}
      headingLine2={hero.headingLine2}
      description={hero.description}
    />
  );
}
