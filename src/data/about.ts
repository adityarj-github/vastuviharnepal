export interface LogoAsset {
  src: string;
  alt: string;
  width: number;
  height: number;
}

export interface AboutData {
  brandName: string;
  region: string;
  heading: string;
  subheading: string;
  description: string;
  logos: {
    default: LogoAsset;
    dark: LogoAsset;
    white: LogoAsset;
  };
  icons: {
    favicon: string;
    appIcon: string;
  };
}

export const aboutData: AboutData = {
  brandName: "Vastu Vihar",
  region: "Nepal",
  heading: "Building Modern Living Spaces Across Nepal",
  subheading: "Trusted real estate and planned townships by Vastu Vihar.",
  description:
    "Vastu Vihar Nepal brings thoughtfully planned residential townships, modern infrastructure, and reliable homeownership to communities across Nepal.",
  logos: {
    default: {
      src: "/vastu-logo-dark.webp",
      alt: "Vastu Vihar Nepal Logo",
      width: 180,
      height: 52,
    },
    dark: {
      src: "/vastu-logo-dark.webp",
      alt: "Vastu Vihar Nepal Dark Logo",
      width: 180,
      height: 52,
    },
    white: {
      src: "/vastu-white.svg",
      alt: "Vastu Vihar Nepal White Logo",
      width: 180,
      height: 52,
    },
  },
  icons: {
    favicon: "/favicon.webp",
    appIcon: "/icon.png",
  },
};