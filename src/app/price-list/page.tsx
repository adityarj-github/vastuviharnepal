import type { Metadata } from "next";
import { PageHero } from "@/components/common/PageHero";
import {
  PriceListHome,
  type PriceListBranchItem,
} from "@/components/price-list/PriceListHome";
import { BreadcrumbJsonLd } from "@/components/JsonLd";
import { getAllPriceLists } from "@/lib/priceLists";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Price List & Township Investment Details | Vastu Vihar Nepal",
  description:
    "Explore transparent location-wise price lists, carpet area details, milestone payment schedules, and luxury specifications for Vastu Vihar Nepal townships in Birtamode and Birgunj.",
};

export default async function PriceListPage() {
  let branches: PriceListBranchItem[] = [];

  try {
    const entries = await getAllPriceLists();
    const active = entries.filter((e) => e.status === "active" && !e.isDeleted);
    if (active.length > 0) {
      branches = active.map((entry) => {
        const slug = entry.project.slug;
        const bungalows = entry.project.bungalows || [];
        const flats = entry.project.flats || [];
        const modelsCount = bungalows.length + flats.length;

        // Compute starting price from lowest deluxe/luxury price
        let startingPrice = "";
        const allPrices = bungalows
          .map((b) => {
            const raw = (b.deluxePrice || b.luxuryPrice || "").replace(
              /[^0-9]/g,
              ""
            );
            return raw ? parseInt(raw, 10) : 0;
          })
          .filter((p) => p > 0);

        if (allPrices.length > 0) {
          const min = Math.min(...allPrices);
          startingPrice = `From Rs. ${(min / 100000).toFixed(0)} Lakhs`;
        }

        const image =
          slug === "birgunj"
            ? "/Price/birgunj.webp"
            : slug === "birtamode"
              ? "/Price/birtamode.webp"
              : "/Price/birtamode.webp";

        return {
          slug,
          name: entry.project.projectName || `${slug} Township`,
          phase: entry.project.phaseLabel || "Phase 1",
          locationState:
            slug === "birgunj"
              ? "Madhesh Province, Parsa"
              : "Koshi Province, Jhapa",
          siteAddress: entry.project.siteAddress || "Nepal",
          modelsCount: modelsCount || 8,
          startingPrice:
            startingPrice ||
            (slug === "birgunj" ? "From Rs. 30 Lakhs" : "From Rs. 35 Lakhs"),
          bhkRange: "2 to 7 BHK Duplex & Villas",
          image,
          statusBadge: entry.project.bookingStatus || "Booking Open",
        };
      });
    }
  } catch (err) {
    console.error("Failed to load dynamic price lists, using defaults", err);
  }

  // Safe fallback if database is unavailable
  if (branches.length === 0) {
    branches = [
      {
        slug: "birtamode",
        name: "Birtamode Phase 1",
        phase: "Phase 1",
        locationState: "Koshi Province, Jhapa",
        siteAddress: "Charpani, Near Heaven's Water Park, Birtamode, Nepal",
        modelsCount: 8,
        startingPrice: "From Rs. 35 Lakhs",
        bhkRange: "2 to 7 BHK Duplex & Villas",
        image: "/Price/birtamode.webp",
        statusBadge: "Booking Open",
      },
      {
        slug: "birgunj",
        name: "Birgunj Branch, Phase 1",
        phase: "Phase 1",
        locationState: "Madhesh Province, Parsa",
        siteAddress: "Lukahi Mai, Laxmanwa, Birgunj, Nepal",
        modelsCount: 8,
        startingPrice: "From Rs. 30 Lakhs",
        bhkRange: "2 to 7 BHK Duplex & Villas",
        image: "/Price/birgunj.webp",
        statusBadge: "Booking Open",
      },
    ];
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
      <PriceListHome branches={branches} />
      <BreadcrumbJsonLd items={[{ name: "Price List" }]} />
    </main>
  );
}
