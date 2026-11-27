import Link from "next/link";
import heroStyles from "@/components/common/PageHero.module.css";
import wallStyles from "@/components/gallery-page/GalleryHero3D.module.css";
import type { Metadata } from "next";
import { GalleryFoldersGrid } from "@/components/gallery-page";
import { GalleryHero3DWrapper } from "@/components/gallery-page/GalleryHero3DWrapper";
import { resolveGalleryWallFrames } from "@/components/gallery-page/galleryWallFrames";
import { getLiveGalleryFolders } from "@/lib/data-fetchers";
import { prisma } from "@/lib/prisma";

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
      <div className={wallStyles.pageHero}>
        <GalleryHero3DWrapper items={heroItems} />

        <header className={wallStyles.heroCaption}>
          <nav className={heroStyles.breadcrumbNav} aria-label="Breadcrumb">
            <ol className={heroStyles.breadcrumbList}>
              <li className={heroStyles.breadcrumbItem}>
                <Link href="/" className={heroStyles.breadcrumbLink}>Home</Link>
              </li>
              <li className={heroStyles.breadcrumbItem}>
                <span className={heroStyles.separator} aria-hidden="true">/</span>
                <span className={heroStyles.current} aria-current="page">gallery</span>
              </li>
            </ol>
          </nav>
          <h1 className={`${heroStyles.heading} ${wallStyles.heroTitle}`}>Gallery</h1>
        </header>
      </div>
      <GalleryFoldersGrid folders={folders} />
    </main>
  );
}
