import type { Metadata } from "next";
import { PageHero } from "@/components/common/PageHero";
import { OpenApplicationClient } from "@/components/career-page/OpenApplicationClient";

export const metadata: Metadata = {
  title: "Open Application | Careers | Vastu Vihar Nepal",
  description:
    "Submit a spontaneous open application and resume to join Vastu Vihar Nepal across architecture, civil engineering, site operations, or client advisory.",
};

export default function OpenApplicationPage() {
  return (
    <main>
      <PageHero
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Careers", href: "/career" },
          { label: "Open Application" },
        ]}
        bgImage="/career.webp"
        bgImageAlt="Open application for careers at Vastu Vihar Nepal"
        headingLine1="Open Application,"
        headingLine2="Build With Us"
      />
      <OpenApplicationClient />
    </main>
  );
}
