import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/common/PageHero";
import { GalleryAlbumClient } from "@/components/gallery-page";
import { getLiveGalleryFolder, getLiveGalleryFolders } from "@/lib/data-fetchers";
import { galleryFolders } from "@/data/gallery";

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
      <PageHero
        location={[
          { label: "Home", href: "/" },
          { label: "Gallery", href: "/gallery" },
          { label: folder.title },
        ]}
        bgImage="/hero/gallery-hero.webp"
        bgImageAlt={folder.title}
        headingLine1={folder.title}
        headingLine2={`(${folder.images.length} Photos)`}
        description={folder.description}
      />
      <GalleryAlbumClient folder={folder} otherFolders={otherFolders} />
    </main>
  );
}
