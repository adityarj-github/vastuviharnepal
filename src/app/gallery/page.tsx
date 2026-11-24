import type { Metadata } from "next";
import { PageHero } from "@/components/common/PageHero";
import { GalleryFoldersGrid } from "@/components/gallery-page";
import { galleryFolders } from "@/data/gallery";

export const metadata: Metadata = {
  title: "Photo Gallery & Archives | Vastu Vihar Nepal",
  description:
    "Explore photo collections of community celebrations, property expos, sports championships, and media coverage across Vastu Vihar Nepal townships.",
};

export default function GalleryPage() {
  return (
    <main>
      <PageHero
        location="Gallery"
        bgImage="/hero/gallery-hero.webp"
        bgImageAlt="Vastu Vihar Nepal Community Photo Gallery"
        headingLine1="Moments & Milestones,"
        headingLine2="Captured Across Nepal"
        description="Explore our community celebrations, property expos, sports championships, and media milestones that bring our townships to life."
      />
      <GalleryFoldersGrid folders={galleryFolders} />
    </main>
  );
}
