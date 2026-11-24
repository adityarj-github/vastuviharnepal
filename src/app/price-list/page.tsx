import type { Metadata } from "next";
import { PageHero } from "@/components/common/PageHero";
import { PriceListHome } from "@/components/price-list/PriceListHome";

export const metadata: Metadata = {
  title: "Price List | Vastu Vihar Nepal",
  description:
    "View location-wise price lists for Vastu Vihar Nepal's duplex bungalows and residences in Birtamode and Birgunj — including specifications, payment schedules, and terms.",
};

export default function PriceListPage() {
  return (
    <main>
      <PageHero
        location="Price List"
        bgImage="/hero/price-list-hero.webp"
        bgImageAlt="Vastu Vihar Nepal Residential Townships Price List"
        headingLine1="Transparent Pricing,"
        headingLine2="For Every Family"
        description="Explore clear, transparent pricing, carpet area details, milestone payment schedules, and luxury specifications for our residential townships in Nepal."
      />
      <PriceListHome />
    </main>
  );
}
