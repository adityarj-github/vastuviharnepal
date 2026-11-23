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
    { label: "Home", href: "/" },
    { label: "About", href: "/about" },
    { label: "Models", href: "/models" },
    // { label: "Projects", href: "/projects" },
    { label: "Gallery", href: "/gallery" },
    { label: "Price List", href: "/price-list" },
    {
      label: "Contact",
      children: [
        {
          label: "Contact",
          description: "Contact us for any enquiries",
          href: "/contact",
        },
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
    callLabel: "Book Now",
    phoneHref: "tel:+9779705191815",
    emailHref: "mailto:info@vastuvihar.org",
    emailAria: "Email Vastu Vihar Nepal",
  },
  socials: [
    { label: "Facebook", href: "https://facebook.com", platform: "facebook" },
    { label: "Instagram", href: "https://instagram.com", platform: "instagram" },
    { label: "YouTube", href: "https://youtube.com", platform: "youtube" },
  ] as SocialLink[],
};