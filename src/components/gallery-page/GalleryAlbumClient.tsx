"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import type { GalleryFolder, GalleryImage } from "@/data/gallery";
import { CollectionHero } from "./CollectionHero";
import { CollectionLightbox } from "./CollectionLightbox";
import styles from "./GalleryAlbumClient.module.css";

interface GalleryAlbumClientProps {
  folder: GalleryFolder & { recentImages?: GalleryImage[] };
  otherFolders: GalleryFolder[];
}

export function GalleryAlbumClient({
  folder,
  otherFolders,
}: GalleryAlbumClientProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const raf = requestAnimationFrame(() => setIsVisible(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  const images = folder.images;
  const heroImages =
    folder.recentImages && folder.recentImages.length > 0
      ? folder.recentImages
      : images.slice(0, 5);

  const openHeroPhoto = useCallback(
    (photo: GalleryImage) => {
      const idx = images.findIndex((img) => img.src === photo.src);
      setLightboxIndex(idx >= 0 ? idx : 0);
    },
    [images]
  );

  const showNext = useCallback(() => {
    if (lightboxIndex === null || images.length === 0) return;
    setLightboxIndex((prev) =>
      prev === null ? null : (prev + 1) % images.length
    );
  }, [lightboxIndex, images.length]);

  const showPrev = useCallback(() => {
    if (lightboxIndex === null || images.length === 0) return;
    setLightboxIndex((prev) =>
      prev === null ? null : (prev - 1 + images.length) % images.length
    );
  }, [lightboxIndex, images.length]);

  const closeLightbox = useCallback(() => {
    setLightboxIndex(null);
  }, []);

  return (
    <>
      <CollectionHero
        slug={folder.slug}
        title={folder.title}
        heroImages={heroImages}
        onSelectPhoto={openHeroPhoto}
      />

      <section
        className={`${styles.section} ${isVisible ? styles.visible : ""}`}
        data-site-motion="off"
      >
        <div className="container">
          {/* Album Header & Back Link */}
          <div className={styles.albumHeader}>
            <div>
              <span className={styles.countText}>
                Showing all {images.length} photos
              </span>
            </div>

            <Link href="/gallery" className={styles.backLink}>
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                width="16"
                height="16"
                aria-hidden="true"
              >
                <path d="M19 12H5" />
                <path d="m12 19-7-7 7-7" />
              </svg>
              All Collections
            </Link>
          </div>

          {/* Photos Grid */}
          <div className={styles.photoGrid}>
            {images.map((img, idx) => (
              <div
                key={`${img.src}-${idx}`}
                className={`${styles.photoCard} ${styles.revealCard}`}
                style={{ transitionDelay: `${80 + (idx % 6) * 60}ms` }}
                onClick={() => setLightboxIndex(idx)}
                role="button"
                tabIndex={0}
                aria-label={`View photo ${idx + 1} enlarged`}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setLightboxIndex(idx);
                  }
                }}
              >
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  sizes="(max-width: 560px) 100vw, (max-width: 900px) 50vw, 33vw"
                  unoptimized={img.src.startsWith("/api/files/")}
                  className={styles.photoImage}
                />

                <div className={styles.hoverOverlay}>
                  <span className={styles.zoomPill}>
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      width="14"
                      height="14"
                      aria-hidden="true"
                    >
                      <circle cx="11" cy="11" r="8" />
                      <path d="m21 21-4.3-4.3" />
                      <path d="M11 8v6" />
                      <path d="M8 11h6" />
                    </svg>
                    Enlarge Photo
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Lightbox Modal (shared between hero wall & photo grid) */}
          <CollectionLightbox
            images={images}
            activeIndex={lightboxIndex}
            onClose={closeLightbox}
            onPrev={showPrev}
            onNext={showNext}
          />

          {/* Other Collections Navigation */}
          {otherFolders.length > 0 && (
            <div className={styles.otherAlbums}>
              <h3 className={styles.otherAlbumsHeading}>
                Browse Other Collections
              </h3>
              <div className={styles.miniAlbumsGrid}>
                {otherFolders.map((item) => (
                  <Link
                    key={item.slug}
                    href={`/gallery/${item.slug}`}
                    className={styles.miniCard}
                  >
                    <div className={styles.miniThumbWrap}>
                      <Image
                        src={item.coverImage}
                        alt={item.title}
                        fill
                        sizes="72px"
                        unoptimized={item.coverImage.startsWith("/api/files/")}
                        className={styles.miniThumb}
                      />
                    </div>
                    <div className={styles.miniInfo}>
                      <span className={styles.miniTitle}>{item.title}</span>
                      <span className={styles.miniCount}>
                        {item.images.length} Photos
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
