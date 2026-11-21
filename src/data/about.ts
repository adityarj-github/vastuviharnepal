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


export interface AboutStat {
  id: string;
  value: number;
  suffix?: string;
  label: string;
  icon: "home" | "trust" | "employees" | "countries";
}

export interface AboutSectionData {
  eyebrow: string;
  descriptionLines: string[];
  stats: AboutStat[];
}

export const aboutSectionData: AboutSectionData = {
  eyebrow: "About",
  descriptionLines: [
    "Vastu Vihar Nepal brings over three decades of trusted township development to families across Nepal.",
    "We design well-planned residential communities with reliable infrastructure, transparent processes, and lasting value.",
  ],
  stats: [
    {
      id: "homes",
      value: 20,
      suffix: "k+",
      label: "Homes Delivered",
      icon: "home",
    },
    {
      id: "years",
      value: 32,
      suffix: "+",
      label: "Years of Trust",
      icon: "trust",
    },
    {
      id: "employees",
      value: 750,
      suffix: "+",
      label: "Employees",
      icon: "employees",
    },
    {
      id: "countries",
      value: 2,
      label: "Countries",
      icon: "countries",
    },
  ],
};


export interface AboutPillar {
  number: string;
  title: string;
  description: string;
}

export interface AboutPageData {
  hero: {
    eyebrow: string;
    headingLine1: string;
    headingLine2: string;
    description: string;
    image: string;
    imageAlt: string;
    cta: {
      label: string;
      href: string;
    };
  };
  story: {
    smallHeading: string;
    boldHeading: string;
    paragraphs: string[];
    vision: {
      label: string;
      text: string;
    };
    mission: {
      label: string;
      text: string;
    };
  };
  pillars: {
    headingLine1: string;
    headingLine2: string;
    description: string;
    items: AboutPillar[];
  };
}

export const aboutPageData: AboutPageData = {
  hero: {
    eyebrow: "About Vastu Vihar Nepal",
    headingLine1: "Building Planned",
    headingLine2: "Communities Since 1994",
    description:
      "What began in Patna as Technoculture Building Centre Pvt. Ltd. has grown into a trusted housing network across Eastern India and Nepal combining Vastu-aligned planning, in-house R&D, and accessible modern living.",
    image: "/about/about-hero.webp",
    imageAlt: "Vastu Vihar Nepal planned residential township",
    cta: {
      label: "Explore Our Models",
      href: "/models",
    },
  },
  story: {
    smallHeading: "Who We Are",
    boldHeading:
      "Three decades of engineering resilient, breathable, and family-first townships.",
    paragraphs: [
      "Founded in 1994, Vastu Vihar set out with a straightforward goal: make thoughtfully planned bungalow communities and quality homes accessible to everyday families.",
      "Over the last 32+ years, our in-house research and engineering teams have pioneered earthquake-resistant methods, rat-trap bond thermal walls, self-healing bio-concrete, and solar-ready residences tailored to the climate and terrain of Eastern India and Nepal.",
    ],
    vision: {
      label: "Our Vision",
      text: "To set the benchmark for sustainable, Vastu-compliant, and climate-resilient townships where every family enjoys open green spaces and lasting structural peace of mind.",
    },
    mission: {
      label: "Our Mission",
      text: "To combine continuous construction R&D with transparent delivery lowering environmental impact while making well-planned bungalows and integrated communities attainable.",
    },
  },
  pillars: {
    headingLine1: "What Guides",
    headingLine2: "Every Township",
    description:
      "Four foundational standards that shape how we plan, engineer, and hand over every home.",
    items: [
      {
        number: "01",
        title: "Vastu-Aligned Planning",
        description:
          "Every plot, road grid, and bungalow layout is oriented for natural daylight, cross-ventilation, and harmonious daily living.",
      },
      {
        number: "02",
        title: "In-House Construction R&D",
        description:
          "From Bacillus pasteurii bio-concrete to welded wire girders and insulated rat-trap walls, we engineer for decades of durability.",
      },
      {
        number: "03",
        title: "Green & Self-Sustaining",
        description:
          "Solar moving roofs, VOC-free construction, and microorganism-based sanitation systems reduce utility costs and carbon footprint.",
      },
      {
        number: "04",
        title: "Integrated Community Life",
        description:
          "Gated security, parks, kids' play areas, meditation spaces, and reliable water and power backup built into every township.",
      },
    ],
  },
};