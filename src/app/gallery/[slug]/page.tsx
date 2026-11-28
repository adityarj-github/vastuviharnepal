import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { GalleryAlbumClient } from "@/components/gallery-page";
import { getLiveGalleryFolder, getLiveGalleryFolders } from "@/lib/data-fetchers";
import { galleryFolders } from "@/data/gallery";

// Reads live content from the database (D1) on every request.
export const dynamic = "force-dynamic";

interface GalleryAlbumPageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return galleryFolders.map((f) => ({
    slug: f.slug,
  }));
}

export async function generateMetadata({
  params,
}: GalleryAlbumPageProps): Promise<Metadata> {
  const { slug } = await params;
  const folder = await getLiveGalleryFolder(slug);

  if (!folder) {
    return {
      title: "Album Not Found | Vastu Vihar Nepal",
    };
  }

  return {
    title: `${folder.title} | Photo Gallery | Vastu Vihar Nepal`,
    description: folder.description,
  };
}

export default async function GalleryAlbumPage({
  params,
}: GalleryAlbumPageProps) {
  const { slug } = await params;
  const folder = await getLiveGalleryFolder(slug);

  if (!folder) {
    notFound();
  }

  const allFolders = await getLiveGalleryFolders();
  const otherFolders = allFolders.filter((f) => f.slug !== slug);

  return (
    <main>
      <GalleryAlbumClient folder={folder} otherFolders={otherFolders} />
    </main>
  );
}
