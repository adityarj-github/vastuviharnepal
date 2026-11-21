export interface JourneyMilestone {
  year: string;
  image: string;
  text: string;
}

export const journeyData = {
  headingLine1: "Our Journey",
  headingLine2: "Through Time",
  badgeCaption: "Building trust since",
  badgeValue: "1994",
  badgeSuffix: "32+ Years",
  footerLeft: "Vastu Vihar",
  footerRight: "1994 — 2026",
  milestones: [
    {
      year: "1994",
      image: "/png/p1.webp",
      text: "Technoculture Building Centre Pvt. Ltd. was founded in Patna, This was just the beginning",
    },
    {
      year: "2001",
      image: "/png/p2.webp",
      text: "The Vastu Vihar brand introduced planned bungalow communities for families in Bihar and Jharkhand.",
    },
    {
      year: "2008",
      image: "/png/p3.webp",
      text: "Advanced earthquake-resistant construction technology and engineered building methods became key priorities.",
    },
    {
      year: "2020",
      image: "/png/p4.webp",
      text: "Vastu Vihar grew its network of townships with parks, community facilities and thoughtfully planned residential spaces.",
    },
    {
      year: "2026",
      image: "/ananta.webp",
      text: "Continuing our journey across Eastern India and Nepal with thoughtfully designed homes and integrated townships.",
    },
  ] as JourneyMilestone[],
};