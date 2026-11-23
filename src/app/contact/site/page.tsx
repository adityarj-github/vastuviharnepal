import type { Metadata } from "next";
import { PageHero } from "@/components/common/PageHero";
import { SiteContact } from "@/components/contact/site/SiteContact";

export const metadata: Metadata = {
  title: "Site Contact & Location | Vastu Vihar Nepal",
  description:
    "Visit our active township site in Birgunj. Connect directly with our on-site engineers, project directors, and site office.",
};

export default function SiteContactPage() {
  return (
    <main>
      <PageHero
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Contact", href: "/contact" },
          { label: "Site Contact" },
        ]}
        bgImage="/contact.webp"
        bgImageAlt="Vastu Vihar Nepal Site Location"
        headingLine1="Site Contact,"
        headingLine2="Project Location"
      />
      <SiteContact />
    </main>
  );
}
