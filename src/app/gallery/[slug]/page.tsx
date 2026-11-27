import Image from "next/image";
import Link from "next/link";
import heroStyles from "@/components/common/PageHero.module.css";
import styles from "./AlbumWall.module.css";
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
      <div className={styles.wrapper}>
        <section className={styles.wall} aria-labelledby="album-title">
          <div className={styles.display}>
            {folder.recentImages.length > 0 && (
              <ul className={styles.frames}>
                {folder.recentImages.map((photo, index) => (
                  <li key={`${photo.src}-${index}`} className={styles.frame}>
                    <div className={styles.mat}>
                      <Image
                        src={photo.src}
                        alt={photo.alt}
                        fill
                        sizes="(max-width: 960px) 32vw, 350px"
                        unoptimized={photo.src.startsWith("/api/files/")}
                      />
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <header className={styles.caption}>
            <nav className={heroStyles.breadcrumbNav} aria-label="Breadcrumb">
              <ol className={heroStyles.breadcrumbList}>
                <li className={heroStyles.breadcrumbItem}>
                  <Link href="/" className={heroStyles.breadcrumbLink}>Home</Link>
                </li>
                <li className={heroStyles.breadcrumbItem}>
                  <span className={heroStyles.separator} aria-hidden="true">/</span>
                  <Link href="/gallery" className={heroStyles.breadcrumbLink}>Gallery</Link>
                </li>
                <li className={heroStyles.breadcrumbItem}>
                  <span className={heroStyles.separator} aria-hidden="true">/</span>
                  <span className={heroStyles.current} aria-current="page">{folder.slug}</span>
                </li>
              </ol>
            </nav>
            <h1 className={`${heroStyles.heading} ${styles.title}`} id="album-title">
              {folder.title}
            </h1>
          </header>
        </section>
      </div>
      <GalleryAlbumClient folder={folder} otherFolders={otherFolders} />
    </main>
  );
}
