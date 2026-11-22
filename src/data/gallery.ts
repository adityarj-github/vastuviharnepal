export interface GalleryImage {
  src: string;
  alt: string;
  caption?: string;
}

export interface GalleryFolder {
  slug: string;
  title: string;
  category: string;
  description: string;
  coverImage: string;
  images: GalleryImage[];
}

export const galleryFolders: GalleryFolder[] = [
  {
    slug: "event",
    title: "Community Events & Celebrations",
    category: "Community Life",
    description:
      "Vibrant cultural festivals, homeowner community meets, family gatherings, and milestone celebrations across our townships.",
    coverImage: "/gallery/event/image-1.webp",
    images: Array.from({ length: 10 }, (_, i) => ({
      src: `/gallery/event/image-${i + 1}.webp`,
      alt: `Vastu Vihar Nepal community celebration photo ${i + 1}`,
      caption: `Community Event Celebration ${i + 1}`,
    })),
  },
  {
    slug: "expo",
    title: "Property Expos & Exhibitions",
    category: "Exhibitions",
    description:
      "Showcasing residential bungalow models, masterplans, and upcoming township developments at major housing expos and property summits.",
    coverImage: "/gallery/expo/image-1.webp",
    images: Array.from({ length: 9 }, (_, i) => ({
      src: `/gallery/expo/image-${i + 1}.webp`,
      alt: `Vastu Vihar Nepal property expo exhibition photo ${i + 1}`,
      caption: `Property Expo Exhibition ${i + 1}`,
    })),
  },
  {
    slug: "tournament",
    title: "Sports Tournaments & Athletics",
    category: "Sports & Recreation",
    description:
      "Annual cricket championships, youth athletics, and outdoor recreational tournaments hosted across our planned township grounds.",
    coverImage: "/gallery/tournament/image-1.webp",
    images: Array.from({ length: 8 }, (_, i) => ({
      src: `/gallery/tournament/image-${i + 1}.webp`,
      alt: `Vastu Vihar Nepal sports tournament photo ${i + 1}`,
      caption: `Sports Championship ${i + 1}`,
    })),
  },
  {
    slug: "press",
    title: "Press Conferences & Media Coverage",
    category: "Media & Press",
    description:
      "Leadership announcements, project launch press conferences, media interviews, and national coverage of our construction innovations.",
    coverImage: "/gallery/press/image-1.webp",
    images: Array.from({ length: 7 }, (_, i) => ({
      src: `/gallery/press/image-${i + 1}.webp`,
      alt: `Vastu Vihar Nepal press conference media photo ${i + 1}`,
      caption: `Press & Media Briefing ${i + 1}`,
    })),
  },
];

export function getGalleryFolder(slug: string): GalleryFolder | undefined {
  return galleryFolders.find((f) => f.slug === slug);
}
