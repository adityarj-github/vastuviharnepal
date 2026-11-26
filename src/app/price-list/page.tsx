import type { Metadata } from "next";
import { PageHero } from "@/components/common/PageHero";
import {
  PriceListHome,
  type PriceListBranchItem,
} from "@/components/price-list/PriceListHome";
import { BreadcrumbJsonLd } from "@/components/JsonLd";
import { getAllPriceLists } from "@/lib/priceLists";

export const metadata: Metadata = {
  title: "Price List | Vastu Vihar Nepal",
  description:
    "View location-wise price lists for Vastu Vihar Nepal's duplex bungalows and residences in Birtamode and Birgunj — including specifications, payment schedules, and terms.",
};

export default async function PriceListPage() {
  let branches: PriceListBranchItem[] = [];

  try {
    const entries = await getAllPriceLists();
    const active = entries.filter((e) => e.status === "active" && !e.isDeleted);
    if (active.length > 0) {
      branches = active.map((entry) => ({
        slug: entry.project.slug,
        name: entry.project.phaseLabel
          ? `${entry.project.projectName}`
          : `${entry.project.projectName} Township`,
        siteAddress: entry.project.siteAddress,
        modelsCount:
          (entry.project.bungalows?.length || 0) +
          (entry.project.flats?.length || 0),
      }));
    }
  } catch (err) {
    console.error("Failed to load dynamic price lists, using defaults", err);
  }

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
      <PriceListHome branches={branches.length > 0 ? branches : undefined} />
      <BreadcrumbJsonLd items={[{ name: "Price List" }]} />
    </main>
  );
}
