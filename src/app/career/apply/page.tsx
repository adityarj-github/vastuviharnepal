import { Suspense } from "react";
import type { Metadata } from "next";
import { PageHero } from "@/components/common/PageHero";
import { CareerApplyClient } from "@/components/career-page/CareerApplyClient";
import { getLiveJobOpenings } from "@/lib/data-fetchers";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Apply for Careers | Vastu Vihar Nepal",
  description:
    "Submit your job application and resume to join Vastu Vihar Nepal's team of architects, engineers, and real estate professionals.",
};

export default async function CareerApplyPage() {
  const openings = await getLiveJobOpenings();

  return (
    <main>
      <PageHero
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Careers", href: "/career" },
          { label: "Apply" },
        ]}
        bgImage="/career.webp"
        bgImageAlt="Apply for careers at Vastu Vihar Nepal"
        headingLine1="Join Our Team,"
        headingLine2="Submit Application"
      />
      <Suspense fallback={<div style={{ minHeight: "60vh", background: "#ffffff" }} />}>
        <CareerApplyClient initialOpenings={openings} />
      </Suspense>
    </main>
  );
}