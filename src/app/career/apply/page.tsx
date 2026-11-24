import { Suspense } from "react";
import type { Metadata } from "next";
import { PageHero } from "@/components/common/PageHero";
import { CareerApplyClient } from "@/components/career-page/CareerApplyClient";

export const metadata: Metadata = {
  title: "Apply for Careers | Vastu Vihar Nepal",
  description:
    "Submit your job application and resume to join Vastu Vihar Nepal's team of architects, engineers, and real estate professionals.",
};

export default function CareerApplyPage() {
  return (
    <main>
      <PageHero
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Careers", href: "/career" },
          { label: "Apply" },
        ]}
        bgImage="/hero/career-hero.webp"
        bgImageAlt="Apply for careers at Vastu Vihar Nepal"
        headingLine1="Join Our Team,"
        headingLine2="Submit Application"
      />
      <Suspense fallback={<div style={{ minHeight: "60vh", background: "#ffffff" }} />}>
        <CareerApplyClient />
      </Suspense>
    </main>
  );
}
