export type AwardCardVariant = "navy" | "sky" | "orange";

export interface AwardItem {
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
  variant: AwardCardVariant;
}

export const awardsSectionData = {
  headingLine1: "Honored for Excellence",
  headingLine2: "& Trusted Living",
  description:
    "Recognitions celebrating over three decades of quality township development and homeowner trust across the region.",
  awards: [
    {
      id: "vishwesariya-award",
      monogram: "VW.",
      category: "Engineering & Architecture",
      year: "Prestigious Honor",
      title: "Vishwesariya Award.",
      recipientLines: ["Awarded to", "Vinay Kumar Tiwary", "Founder, Vastu Vihar"],
      certificateHeading: "Official Recognition",
      certificateNote:
        "Honored for exemplary contribution to residential engineering, structural quality, and planned township development.",
      verticalLabel: "Engineering Honor",
      footerTag: "vastuvihar. honors",
      variant: "navy",
    },
    {
      id: "bharat-nirman-ratna",
      monogram: "BN.",
      category: "National Excellence",
      year: "Ratna Samman",
      title: "Bharat Nirman Ratna.",
      recipientLines: ["Awarded to", "Vinay Kumar Tiwary", "Vastu Vihar Group"],
      certificateHeading: "National Certificate",
      certificateNote:
        "Recognized for outstanding leadership in nation-building through affordable, reliable, and community-first housing.",
      verticalLabel: "National Award",
      footerTag: "vastuvihar. honors",
      variant: "sky",
    },
    {
      id: "orange-business-excellence-2024",
      monogram: "OB.",
      category: "Business Excellence",
      year: "August 2024",
      title: "Orange Excellence Award.",
      recipientLines: ["Awarded to", "Vastu Vihar", "Best Real Estate Company"],
      certificateHeading: "2024 Official Certificate",
      certificateNote:
        "Conferred for excellence in real estate delivery, customer satisfaction, and modern residential communities.",
      verticalLabel: "2024 Excellence",
      footerTag: "vastuvihar. winners",
      variant: "orange",
    },
  ] as AwardItem[],
};