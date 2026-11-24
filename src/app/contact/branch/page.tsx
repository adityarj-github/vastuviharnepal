import type { Metadata } from "next";
import { PageHero } from "@/components/common/PageHero";
import { OfficeContact } from "@/components/contact/office/OfficeContact";

export const metadata: Metadata = {
  title: "Branch Offices | Vastu Vihar Nepal",
  description:
    "Locate Vastu Vihar Nepal branch offices across Birgunj, Kathmandu, Birtamode, and Janakpur.",
};

export default function BranchContactPage() {
  return (
    <main>
      <PageHero
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Contact", href: "/contact" },
          { label: "Branch Offices" },
        ]}
        bgImage="/hero/contact-hero.webp"
        bgImageAlt="Vastu Vihar Nepal Branch Offices"
        headingLine1="Our Offices,"
        headingLine2="Across Nepal"
      />
      <OfficeContact />
    </main>
  );
}
