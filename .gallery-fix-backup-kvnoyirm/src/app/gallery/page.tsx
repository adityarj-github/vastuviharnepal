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
  const [folders, wallImages] = await Promise.all([
    getLiveGalleryFolders(),
    prisma.galleryWallImage.findMany().catch((error: unknown) => {
      console.error("Could not read gallery wall images:", error);
      return [];
    }),
  ]);
  const heroItems = resolveGalleryWallFrames(folders, wallImages).map(({ photo }) => photo);

  return (
    <main>
      <GalleryHero3DWrapper items={heroItems} />
      <GalleryFoldersGrid folders={folders} />
    </main>
  );
}