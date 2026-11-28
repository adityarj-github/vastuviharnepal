"use client";

import Image from "next/image";
import type { GalleryPhotoItem } from "../galleryWallFrames";
import styles from "../GalleryHero3D.module.css";

interface GalleryFallbackProps {
  photos: GalleryPhotoItem[];
  onSelectPhoto: (photo: GalleryPhotoItem, index: number) => void;
}

/**
 * Accessible static architectural fallback rendered when WebGL is unavailable.
 */
export function GalleryFallback({
  photos,
  onSelectPhoto,
}: GalleryFallbackProps) {
  return (
    <div className={styles.fallbackContainer}>
      <div className={styles.fallbackGrid}>
        {photos.slice(0, 9).map((photo, index) => (
          <button
            key={`${photo.id}-${index}`}
            type="button"
            className={styles.fallbackCard}
            onClick={() => onSelectPhoto(photo, index)}
            aria-label={`View ${photo.title}`}
          >
            <Image
              src={photo.url}
              alt={photo.title}
              fill
              sizes="(max-width: 767px) 45vw, 28vw"
              className={styles.fallbackImage}
              unoptimized={photo.url.startsWith("/api/files/")}
            />
            <span className={styles.fallbackLabel}>{photo.title}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
