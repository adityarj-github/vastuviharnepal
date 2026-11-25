export interface FooterLink {
  label: string;
  href: string;
}

export interface FooterSocialLink {
  platform: "facebook" | "instagram" | "youtube" | "linkedin";
  label: string;
  href: string;
}

export interface FooterLinkSection {
  title: string;
  links: FooterLink[];
}

export interface FooterLeadCard {
  eyebrow?: string;
  title: string;
  description: string;
  buttonText: string;
  buttonHref: string;
}

export interface FooterData {
  brandName: string;
  logo: string;
  tagline: string;
  socialLinks: FooterSocialLink[];
  linkSections: FooterLinkSection[];
  leadCard?: FooterLeadCard;
  newsletterHeadingLine1: string;
  newsletterHeadingLine2: string;
  newsletterPlaceholder: string;
  email: string;
}

export const footerData: FooterData = {
  brandName: "Vastu Vihar Nepal",
  logo: "/vastu-white.svg",
  tagline:
    "Thoughtfully planned bungalow communities and modern residences crafted for families across Nepal.",
  socialLinks: [
    { platform: "facebook", label: "Facebook", href: "https://www.facebook.com/VastuViharOfficial/" },
    { platform: "instagram", label: "Instagram", href: "https://www.instagram.com/vastuvihar_official" },
    { platform: "youtube", label: "YouTube", href: "https://www.youtube.com/@vastu_vihar" },
    { platform: "linkedin", label: "LinkedIn", href: "https://linkedin.com/company/vastu-vihar-technoculture-building-centre-pvt-ltd" },
  ],
  linkSections: [
    {
      title: "Company",
      links: [
        { label: "About Us", href: "/about" },
        { label: "Technology & Quality", href: "/technology" },
        { label: "Blog & Insights", href: "/blog" },
      ],
    },
    {
      title: "Residences",
      links: [
        { label: "All Models", href: "/models" },
        { label: "Book a Site Visit", href: "/contact/site" },
        { label: "Visit Our Branch", href: "/contact/branch" },
      ],
    },
    {
      title: "Get in Touch",
      links: [
        { label: "Careers", href: "/career" },
        { label: "Contact Us", href: "/contact" },
      ],
    },
    {
      title: "Legal",
      links: [
        { label: "Terms & Conditions", href: "/terms" },
        { label: "Privacy Policy", href: "/privacy-policy" },
      ],
    },
  ],
  leadCard: {
    eyebrow: "Consultation & Visits",
    title: "Planning Your Next Home?",
    description:
      "Speak directly with our property advisors to explore bungalow models, request floor plans, or schedule a private site visit.",
    buttonText: "Schedule a Visit",
    buttonHref: "/contact/site",
  },
  newsletterHeadingLine1: "Vastu Vihar",
  newsletterHeadingLine2: "in your mailbox",
  newsletterPlaceholder: "info@vastuviharnepal.com",
  email: "info@vastuviharnepal.com",
};