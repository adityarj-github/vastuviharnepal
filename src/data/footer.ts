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

export interface FooterData {
  brandName: string;
  logo: string;
  tagline: string;
  socialLinks: FooterSocialLink[];
  linkSections: FooterLinkSection[];
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
    { platform: "facebook", label: "Facebook", href: "https://facebook.com" },
    { platform: "instagram", label: "Instagram", href: "https://instagram.com" },
    { platform: "youtube", label: "YouTube", href: "https://youtube.com" },
    { platform: "linkedin", label: "LinkedIn", href: "https://linkedin.com" },
  ],
  linkSections: [
    {
      title: "Company",
      links: [
        { label: "Home", href: "/" },
        { label: "About Us", href: "/about" },
        { label: "Our Journey", href: "/#journey" },
        { label: "Technology & Quality", href: "/technology" },
        { label: "Awards", href: "/#awards" },
        { label: "Careers", href: "/career" },
        { label: "Contact Us", href: "/contact/site" },
      ],
    },
    {
      title: "Residences",
      links: [
        { label: "All Models", href: "/models" },
        { label: "Pashupati Bungalow", href: "/models/pashupati-bungalow" },
        { label: "Kanchanjunga Bungalow", href: "/models/kanchanjunga-bungalow" },
        { label: "Sagarmatha Bungalow", href: "/models/sagarmatha-bungalow" },
        { label: "Suryodaya Bungalow", href: "/models/suryodaya-bungalow" },
        { label: "Book a Site Visit", href: "/contact/site" },
      ],
    },
    {
      title: "Legal",
      links: [
        { label: "Terms & Conditions", href: "/terms" },
        { label: "Privacy Policy", href: "/privacy-policy" },
        { label: "Cookie Policy", href: "/cookie-policy" },
        { label: "Disclaimer", href: "/disclaimer" },
      ],
    },
  ],
  newsletterHeadingLine1: "Vastu Vihar",
  newsletterHeadingLine2: "in your mailbox",
  newsletterPlaceholder: "name@example.com",
  email: "info@vastuviharnepal.com",
};