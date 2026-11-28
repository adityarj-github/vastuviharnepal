import type { Metadata } from "next";
import { CareerSvgMotion } from "@/components/career-page/CareerSvgMotion";
import { PageHero } from "@/components/common/PageHero";
import { LifeAtVastuVihar } from "@/components/career-page/LifeAtVastuVihar";
import { EmployeeTrust } from "@/components/career-page/EmployeeTrust";
import { CareerPageClient } from "@/components/career-page/CareerPageClient";
import { getLiveJobOpenings } from "@/lib/data-fetchers";

// Reads live content from the database (D1) on every request.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Careers | Vastu Vihar Nepal",
  description:
    "Join our team of architects, civil engineers, project managers, and housing advisors building thoughtfully planned township communities across Nepal.",
};

export default async function CareerPage() {
  const openings = await getLiveJobOpenings();

  return (
    <CareerSvgMotion>
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
      <LifeAtVastuVihar />
      <EmployeeTrust />
      <CareerPageClient initialOpenings={openings} />
    </CareerSvgMotion>
  );
}
