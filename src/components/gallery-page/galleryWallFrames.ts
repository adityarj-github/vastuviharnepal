import type { GalleryFolder } from "@/data/gallery";

export interface GalleryPhotoItem {
  id: string;
  url: string;
  title: string;
  category?: string;
}

export interface WallSlotConfig {
  id: string;
  wall: "center" | "left" | "right";
  position: [number, number, number];
  rotation: [number, number, number];
  size: [number, number]; // [width, height]
  isHero?: boolean;
}

// ─── 3D WALL SLOTS CONFIGURATION ──────────────────────────────────────
// Scaled & positioned along the 3 wooden walls

export const WALL_SLOTS: WallSlotConfig[] = [
  // ── Center Wall (Z = -3.92)
  {
    id: "center-hero",
    wall: "center",
    position: [0, 1.87, -3.92],
    rotation: [0, 0, 0],
    size: [2.35, 3.1],
    isHero: true,
  },
  {
    id: "center-left-top",
    wall: "center",
    position: [-2.95, 2.78, -3.92],
    rotation: [0, 0, 0],
    size: [2.0, 1.3],
  },
  {
    id: "center-left-bottom",
    wall: "center",
    position: [-2.95, 1.22, -3.92],
    rotation: [0, 0, 0],
    size: [2.0, 1.3],
  },
  {
    id: "center-right-top",
    wall: "center",
    position: [2.95, 2.78, -3.92],
    rotation: [0, 0, 0],
    size: [2.0, 1.3],
  },
  {
    id: "center-right-bottom",
    wall: "center",
    position: [2.95, 1.22, -3.92],
    rotation: [0, 0, 0],
    size: [2.0, 1.3],
  },

  // ── Left Wall (X = -7.42, facing +X) - 4 Frames Spaced Along Wall
  {
    id: "left-1",
    wall: "left",
    position: [-7.4, 1.55, -2.55],
    rotation: [0, Math.PI / 2, 0],
    size: [1.8, 1.4],
  },
  {
    id: "left-2",
    wall: "left",
    position: [-7.4, 1.55, -0.65],
    rotation: [0, Math.PI / 2, 0],
    size: [1.5, 2.2],
  },
  {
    id: "left-3",
    wall: "left",
    position: [-7.4, 1.55, 1.25],
    rotation: [0, Math.PI / 2, 0],
    size: [1.8, 1.4],
  },
  {
    id: "left-4",
    wall: "left",
    position: [-7.4, 1.55, 3.15],
    rotation: [0, Math.PI / 2, 0],
    size: [1.5, 2.2],
  },

  // ── Right Wall (X = 7.42, facing -X) - 4 Frames Spaced Along Wall
  {
    id: "right-1",
    wall: "right",
    position: [7.4, 1.55, -2.55],
    rotation: [0, -Math.PI / 2, 0],
    size: [1.8, 1.4],
  },
  {
    id: "right-2",
    wall: "right",
    position: [7.4, 1.55, -0.65],
    rotation: [0, -Math.PI / 2, 0],
    size: [1.5, 2.2],
  },
  {
    id: "right-3",
    wall: "right",
    position: [7.4, 1.55, 1.25],
    rotation: [0, -Math.PI / 2, 0],
    size: [1.8, 1.4],
  },
  {
    id: "right-4",
    wall: "right",
    position: [7.4, 1.55, 3.15],
    rotation: [0, -Math.PI / 2, 0],
    size: [1.5, 2.2],
  },
];

export const DEFAULT_GALLERY_PHOTOS: GalleryPhotoItem[] = [
  {
    id: "center-hero",
    url: "/gallery/event/image-1.webp",
    title: "Township Grand Milestone Celebration",
    category: "Community Life",
  },
  {
    id: "center-left-top",
    url: "/gallery/expo/image-1.webp",
    title: "International Property Expo Pavilion",
    category: "Exhibitions",
  },
  {
    id: "center-left-bottom",
    url: "/gallery/tournament/image-1.webp",
    title: "Township Premier Cricket Championship",
    category: "Sports & Athletics",
  },
  {
    id: "center-right-top",
    url: "/gallery/press/image-1.webp",
    title: "National Infrastructure Media Briefing",
    category: "Press & Media",
  },
  {
    id: "center-right-bottom",
    url: "/gallery/event/image-2.webp",
    title: "Annual Homeowners Cultural Festival",
    category: "Community Life",
  },
  {
    id: "left-1",
    url: "/gallery/expo/image-2.webp",
    title: "Masterplanned Bungalow Models Display",
    category: "Exhibitions",
  },
  {
    id: "left-2",
    url: "/gallery/event/image-3.webp",
    title: "Festival of Lights at Vastu Vihar",
    category: "Community Life",
  },
  {
    id: "left-3",
    url: "/gallery/tournament/image-2.webp",
    title: "Youth Athletics & Sports Meet",
    category: "Sports & Athletics",
  },
  {
    id: "left-4",
    url: "/gallery/event/image-5.webp",
    title: "Township Green Parks & Walkways",
    category: "Community Life",
  },
  {
    id: "right-1",
    url: "/gallery/press/image-2.webp",
    title: "Smart Housing Summit Keynote",
    category: "Press & Media",
  },
  {
    id: "right-2",
    url: "/gallery/expo/image-3.webp",
    title: "Birgunj Township Architecture Showcase",
    category: "Exhibitions",
  },
  {
    id: "right-3",
    url: "/gallery/event/image-4.webp",
    title: "New Homeowners Welcome Ceremony",
    category: "Community Life",
  },
  {
    id: "right-4",
    url: "/gallery/expo/image-4.webp",
    title: "Sustainable Architecture Expo Pavilion",
    category: "Exhibitions",
  },
];

export type WallImage = { slotId: string; src: string; alt: string };

export function resolveGalleryWallFrames(folders: GalleryFolder[], overrides: WallImage[]) {
  const items: GalleryPhotoItem[] = folders.flatMap((folder) => [
    {
      id: `cover-${folder.slug}`,
      url: folder.coverImage,
      title: folder.title,
      category: folder.category,
    },
    ...folder.images.map((image, index) => ({
      id: `${folder.slug}-${index}`,
      url: image.src,
      title: image.caption || image.alt || folder.title,
      category: folder.category,
    })),
  ]);
  const bySlot = new Map(overrides.map((image) => [image.slotId, image]));

  return WALL_SLOTS.map((slot, index) => {
    const fallback = items[index] ?? DEFAULT_GALLERY_PHOTOS[index];
    const override = bySlot.get(slot.id);
    const photo = override
      ? { ...fallback, id: slot.id, url: override.src, title: override.alt }
      : fallback;
    return { slotId: slot.id, wall: slot.wall, photo, fallback, custom: !!override };
  });
}
