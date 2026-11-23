import type { Metadata } from "next";
import { PageHero } from "@/components/common/PageHero";
import { Contact } from "@/components/contact/contact/Contact";

export const metadata: Metadata = {
  title: "Contact Us | Vastu Vihar Nepal",
  description:
    "Get in touch with Vastu Vihar Nepal for inquiries on bungalow models, township site visits, booking assistance, and customer support.",
};

export default function ContactPage() {
  return (
    <main>
      <PageHero
        location="Contact Us"
        bgImage="/brand-bg.webp"
        bgImageAlt="Contact Vastu Vihar Nepal"
        headingLine1="Get In Touch,"
        headingLine2="We're Here To Help"
      />
      <Contact />
    </main>
  );
}
