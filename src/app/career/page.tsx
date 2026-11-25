import type { Metadata } from "next";
import { PageHero } from "@/components/common/PageHero";
import { CareerPageClient } from "@/components/career-page/CareerPageClient";
import { getLiveJobOpenings } from "@/lib/data-fetchers";

export const metadata: Metadata = {
  title: "Careers | Vastu Vihar Nepal",
  description:
    "Join our team of architects, civil engineers, project managers, and housing advisors building thoughtfully planned township communities across Nepal.",
};

export default async function CareerPage() {
  const openings = await getLiveJobOpenings();

  return (
    <main>
      <PageHero
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Careers" },
        ]}
        bgImage="/hero/career-hero.webp"
        bgImageAlt="Careers at Vastu Vihar Nepal"
        headingLine1="Join Our Team,"
        headingLine2="Build The Future"
      />
      <CareerPageClient initialOpenings={openings} />
    </main>
  );
}
