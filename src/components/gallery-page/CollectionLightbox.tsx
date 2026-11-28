"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import type { GalleryImage } from "@/data/gallery";
import styles from "./GalleryAlbumClient.module.css";

interface CollectionLightboxProps {
  images: GalleryImage[];
  activeIndex: number | null;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}

/**
 * Full-screen collection lightbox with keyboard, backdrop-click,
 * and touch-swipe navigation scoped to the active collection.
 */
export function CollectionLightbox({
  images,
  activeIndex,
  onClose,
  onPrev,
  onNext,
}: CollectionLightboxProps) {
  const touchStartX = useRef<number | null>(null);

  useEffect(() => {
    if (activeIndex === null) return;

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowRight") onNext();
      else if (e.key === "ArrowLeft") onPrev();
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeIndex, onClose, onNext, onPrev]);

  if (activeIndex === null || !images[activeIndex]) return null;
  const activePhoto = images[activeIndex];

  return (
    <div
      className={styles.lightboxModal}
      role="dialog"
      aria-modal="true"
      aria-label={activePhoto.caption || activePhoto.alt || "Image lightbox"}
      onClick={onClose}
      onTouchStart={(e) => {
        touchStartX.current = e.touches[0]?.clientX ?? null;
      }}
      onTouchEnd={(e) => {
        if (touchStartX.current === null) return;
        const endX = e.changedTouches[0]?.clientX ?? touchStartX.current;
        const dx = endX - touchStartX.current;
        touchStartX.current = null;
        if (Math.abs(dx) > 48) {
          if (dx < 0) onNext();
          else onPrev();
        }
      }}
    >
      <div
        className={styles.lightboxHeader}
        onClick={(e) => e.stopPropagation()}
      >
        <span className={styles.lightboxCounter}>
          {activeIndex + 1} / {images.length}
        </span>

        <button
          type="button"
          className={styles.closeBtn}
          onClick={onClose}
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
        {images.length > 1 && (
          <button
            type="button"
            className={`${styles.navBtn} ${styles.prevBtn}`}
            onClick={(e) => {
              e.stopPropagation();
              onPrev();
            }}
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
        )}

        <div
          className={styles.lightboxImageWrap}
          onClick={(e) => e.stopPropagation()}
        >
          <Image
            src={activePhoto.src}
            alt={activePhoto.alt}
            fill
            priority
            sizes="(max-width: 767px) 94vw, 1100px"
            unoptimized={activePhoto.src.startsWith("/api/files/")}
            className={styles.lightboxImg}
          />
        </div>

        {images.length > 1 && (
          <button
            type="button"
            className={`${styles.navBtn} ${styles.nextBtn}`}
            onClick={(e) => {
              e.stopPropagation();
              onNext();
            }}
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
        )}
      </div>
    </div>
  );
}
