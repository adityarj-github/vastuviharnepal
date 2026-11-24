import type { Metadata } from "next";
import { PageHero } from "@/components/common/PageHero";
import { CareerPageClient } from "@/components/career-page/CareerPageClient";

export const metadata: Metadata = {
  title: "Careers | Vastu Vihar Nepal",
  description:
    "Join our team of architects, civil engineers, project managers, and housing advisors building thoughtfully planned township communities across Nepal.",
};

export default function CareerPage() {
  return (
    <main>
      <PageHero
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Careers" },
        ]}
        bgImage="/brand-bg.webp"
        bgImageAlt="Careers at Vastu Vihar Nepal"
        headingLine1="Join Our Team,"
        headingLine2="Build The Future"
      />
      <CareerPageClient />
    </main>
  );
}
