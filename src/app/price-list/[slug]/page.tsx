import { Suspense } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { priceListData } from "@/data/priceList";
import { PriceList } from "@/components/price-list/PriceList";
import { PageHero } from "@/components/common/PageHero";

interface PriceListPageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return priceListData.locations.map((loc) => ({
    slug: loc.location.toLowerCase(),
  }));
}

export async function generateMetadata({
  params,
}: PriceListPageProps): Promise<Metadata> {
  const { slug } = await params;
  const location = priceListData.locations.find(
    (l) => l.location.toLowerCase() === slug.toLowerCase()
  );

  if (!location) {
    return {
      title: "Price List Not Found | Vastu Vihar Nepal",
    };
  }

  return {
    title: `${location.location} Price Details | Vastu Vihar Nepal`,
    description: `Official price list, specifications, and payment schedules for residential bungalows and duplexes in ${location.location}, Nepal.`,
  };
}

async function PriceListDetail({ params }: PriceListPageProps) {
  const { slug } = await params;
  const location = priceListData.locations.find(
    (l) => l.location.toLowerCase() === slug.toLowerCase()
  );

  if (!location) {
    notFound();
  }

  return (
    <main>
      <PageHero
        location={[
          { label: "Home", href: "/" },
          { label: "Price List", href: "/price-list" },
          { label: `${location.location} Price Details` },
        ]}
        bgImage="/hero/price-list-hero.webp"
        bgImageAlt={`Vastu Vihar Nepal ${location.location} Price Details`}
        headingLine1={`${location.location} Price Details`}
        description={`Explore comprehensive duplex and bungalow pricing, land area dimensions, luxury material specifications, and staged construction payment plans for ${location.location}.`}
      />
      <PriceList locationData={location} />
    </main>
  );
}

export default function PriceListDetailPage({ params }: PriceListPageProps) {
  return (
    <Suspense fallback={null}>
      <PriceListDetail params={params} />
    </Suspense>
  );
}
