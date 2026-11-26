import type { Metadata } from "next";
import { GalleryFoldersGrid } from "@/components/gallery-page";
import { GalleryHero3DWrapper } from "@/components/gallery-page/GalleryHero3DWrapper";
import { getLiveGalleryFolders } from "@/lib/data-fetchers";

// Reads live content from the database (D1) on every request.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Photo Gallery & 3D Virtual Archives | Vastu Vihar Nepal",
  description:
    "Explore our interactive 3D virtual exhibition hall and photo collections of community celebrations, property expos, sports championships, and media coverage across Vastu Vihar Nepal townships.",
};

export default async function GalleryPage() {
  const folders = await getLiveGalleryFolders();

  // Extract photos from database folders to illuminate the 3-wall exhibition
  const heroItems = folders.flatMap((f) => [
    {
      id: `cover-${f.slug}`,
      url: f.coverImage,
      title: f.title,
      category: f.category,
    },
    ...f.images.map((img, idx) => ({
      id: `${f.slug}-${idx}`,
      url: img.src,
      title: img.caption || img.alt || f.title,
      category: f.category,
    })),
  ]);

  return (
    <main>
      <GalleryHero3DWrapper items={heroItems} />
      <GalleryFoldersGrid folders={folders} />
    </main>
  );
}
