export type WhyUsCardVariant = "navy" | "sky" | "orange";

export interface WhyUsItem {
  id: string;
  monogram: string;
  category: string;
  year: string;
  title: string;
  recipientLines: string[];
  certificateHeading: string;
  certificateNote: string;
  verticalLabel: string;
  footerTag: string;
  variant: WhyUsCardVariant;
}

export const whyUsSectionData = {
  headingLine1: "Why Choose",
  headingLine2: "Vastu Vihar Nepal",
  description:
    "Building more than homes—we craft secure, Vastu-compliant, and enduring townships backed by three decades of engineering excellence.",
  items: [
    {
      id: "proven-legacy",
      monogram: "32+",
      category: "Proven Heritage",
      year: "Since 1994",
      title: "32+ Years of Trusted Legacy.",
      recipientLines: ["35,000+ Happy Families", "100+ Completed Communities", "Eastern India & Nepal Leader"],
      certificateHeading: "Legacy & Reliability",
      certificateNote:
        "Over three decades of planned township leadership delivering generational security, verified land titles, and community living.",
      verticalLabel: "Proven Heritage",
      footerTag: "vastuvihar. why choose us",
      variant: "navy" as WhyUsCardVariant,
    },
    {
      id: "earthquake-resilient",
      monogram: "EQ.",
      category: "Structural Excellence",
      year: "Seismic-Tested",
      title: "Earthquake-Resilient Build.",
      recipientLines: ["Monolithic Raft Foundations", "Superior Grade Steel & RCC", "Anti-Seismic Structural Code"],
      certificateHeading: "Safety Assurance",
      certificateNote:
        "Engineered on monolithic raft foundations specifically designed to absorb seismic energy, prevent settlement, and protect families.",
      verticalLabel: "Structural Safety",
      footerTag: "vastuvihar. engineering",
      variant: "sky" as WhyUsCardVariant,
    },
    {
      id: "vastu-transparency",
      monogram: "100%",
      category: "Harmonious Living",
      year: "Clear Ownership",
      title: "Vastu & Legal Transparency.",
      recipientLines: ["100% Clear Land Ownership", "Authentic Vedic Vastu Principles", "Transparent, Timely Handover"],
      certificateHeading: "Ownership Assurance",
      certificateNote:
        "Complete legal clarity from booking to registration, paired with layouts optimized for natural light, fresh air, and prosperity.",
      verticalLabel: "Total Peace of Mind",
      footerTag: "vastuvihar. assurance",
      variant: "orange" as WhyUsCardVariant,
    },
  ] as WhyUsItem[],
};

// Aliases for backwards compatibility
export type AwardCardVariant = WhyUsCardVariant;
export type AwardItem = WhyUsItem;
export const awardsSectionData = {
  ...whyUsSectionData,
  awards: whyUsSectionData.items,
};
