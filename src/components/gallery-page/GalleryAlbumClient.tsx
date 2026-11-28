"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import type { GalleryFolder } from "@/data/gallery";
import styles from "./GalleryAlbumClient.module.css";

interface GalleryAlbumClientProps {
  folder: GalleryFolder;
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

  const showNext = useCallback(() => {
    if (lightboxIndex === null) return;
    setLightboxIndex((prev) =>
      prev === null ? null : (prev + 1) % images.length
    );
  }, [lightboxIndex, images.length]);

  const showPrev = useCallback(() => {
    if (lightboxIndex === null) return;
    setLightboxIndex((prev) =>
      prev === null ? null : (prev - 1 + images.length) % images.length
    );
  }, [lightboxIndex, images.length]);

  const closeLightbox = useCallback(() => {
    setLightboxIndex(null);
  }, []);

  // Keyboard navigation for Lightbox
  useEffect(() => {
    if (lightboxIndex === null) return;

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowRight") showNext();
      if (e.key === "ArrowLeft") showPrev();
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightboxIndex, closeLightbox, showNext, showPrev]);

  return (
    <section className={`${styles.section} ${isVisible ? styles.visible : ""}`} data-site-motion="off">
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
              key={img.src}
              className={`${styles.photoCard} ${styles.revealCard}`}
              style={{ transitionDelay: `${80 + (idx % 6) * 60}ms` }}
              onClick={() => setLightboxIndex(idx)}
              role="button"
              tabIndex={0}
              aria-label={`View photo ${idx + 1} enlarged`}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  setLightboxIndex(idx);
                }
              }}
            >
              <Image
                src={img.src}
                alt={img.alt}
                fill
                sizes="(max-width: 560px) 100vw, (max-width: 900px) 50vw, 33vw"
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

        {/* Lightbox Modal */}
        {lightboxIndex !== null && (
          <div
            className={styles.lightboxModal}
            role="dialog"
            aria-modal="true"
            aria-label="Image lightbox"
          >
            <div className={styles.lightboxHeader}>
              <span className={styles.lightboxCounter}>
                {lightboxIndex + 1} / {images.length}
              </span>

              <button
                type="button"
                className={styles.closeBtn}
                onClick={closeLightbox}
                aria-label="Close lightbox"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  width="20"
                  height="20"
                  aria-hidden="true"
                >
                  <path d="M18 6 6 18" />
                  <path d="m6 6 12 12" />
                </svg>
              </button>
            </div>

            <div className={styles.lightboxMain}>
              <button
                type="button"
                className={`${styles.navBtn} ${styles.prevBtn}`}
                onClick={showPrev}
                aria-label="Previous image"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  width="22"
                  height="22"
                  aria-hidden="true"
                >
                  <path d="m15 18-6-6 6-6" />
                </svg>
              </button>

              <div className={styles.lightboxImageWrap}>
                <Image
                  src={images[lightboxIndex].src}
                  alt={images[lightboxIndex].alt}
                  fill
                  priority
                  className={styles.lightboxImg}
                />
              </div>

              <button
                type="button"
                className={`${styles.navBtn} ${styles.nextBtn}`}
                onClick={showNext}
                aria-label="Next image"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  width="22"
                  height="22"
                  aria-hidden="true"
                >
                  <path d="m9 18 6-6-6-6" />
                </svg>
              </button>
            </div>
          </div>
        )}

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
  );
}
