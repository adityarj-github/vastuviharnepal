import type { Metadata } from "next";
import { PriceListHome } from "@/components/price-list/PriceListHome";

export const metadata: Metadata = {
  title: "Price List | Vastu Vihar Nepal",
  description:
    "View location-wise price lists for Vastu Vihar Nepal's duplex bungalows and residences in Birtamode and Birgunj — including specifications, payment schedules, and terms.",
};

export default function PriceListPage() {
  return <PriceListHome />;
}
