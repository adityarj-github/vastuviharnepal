export interface NavSubItem {
  label: string;
  description: string;
  href: string;
}

export interface NavItem {
  label: string;
  href?: string;
  children?: NavSubItem[];
}

export interface SocialLink {
  label: string;
  href: string;
  platform: "facebook" | "instagram" | "youtube";
}

export const navigationData = {
  links: [
    { label: "About", href: "/about" },
    { label: "Models", href: "/models" },
    {
      label: "Contact",
      children: [
        {
          label: "Site Contact",
          description: "Book a site visit or reach our project office",
          href: "/contact/site",
        },
        {
          label: "Branch Contact",
          description: "Connect with our Nepal regional branch offices",
          href: "/contact/branch",
        },
      ],
    },
  ] as NavItem[],
  cta: {
    callLabel: "Call Us",
    phoneHref: "tel:+977123456789",
    emailHref: "mailto:info@vastuviharnepal.com",
    emailAria: "Email Vastu Vihar Nepal",
  },
  socials: [
    { label: "Facebook", href: "https://facebook.com", platform: "facebook" },
    { label: "Instagram", href: "https://instagram.com", platform: "instagram" },
    { label: "YouTube", href: "https://youtube.com", platform: "youtube" },
  ] as SocialLink[],
};