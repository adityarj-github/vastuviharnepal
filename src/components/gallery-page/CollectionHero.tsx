"use client";

import Image from "next/image";
import Link from "next/link";
import type { GalleryImage } from "@/data/gallery";
import heroStyles from "@/components/common/PageHero.module.css";
import styles from "./CollectionHero.module.css";

interface CollectionHeroProps {
  slug: string;
  title: string;
  heroImages: GalleryImage[];
  onSelectPhoto: (photo: GalleryImage) => void;
}

const WALL_WASH_CONES = [18, 34, 50, 66, 82];

function PlantDecoration({ side }: { side: "left" | "right" }) {
  const isRight = side === "right";
  return (
    <div
      className={`${styles.plantWrap} ${
        isRight ? styles.plantRight : styles.plantLeft
      }`}
      aria-hidden="true"
    >
      <svg viewBox="0 0 180 260" className={styles.plantSvg} fill="none">
        <defs>
          <linearGradient id={`pot-body-${side}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#2E231C" />
            <stop offset="32%" stopColor="#5A4537" />
            <stop offset="68%" stopColor="#453429" />
            <stop offset="100%" stopColor="#251C16" />
          </linearGradient>
          <linearGradient id={`pot-rim-${side}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#5C4838" />
            <stop offset="45%" stopColor="#B89867" />
            <stop offset="100%" stopColor="#433328" />
          </linearGradient>
          <radialGradient id={`plant-shadow-${side}`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(16, 11, 7, 0.68)" />
            <stop offset="60%" stopColor="rgba(16, 11, 7, 0.28)" />
            <stop offset="100%" stopColor="rgba(16, 11, 7, 0)" />
          </radialGradient>
        </defs>

        {/* Grounded floor contact shadow */}
        <ellipse cx="90" cy="246" rx="48" ry="8" fill={`url(#plant-shadow-${side})`} />

        {/* Back layer muted deep green fronds */}
        <g transform={isRight ? "translate(180, 0) scale(-1, 1)" : undefined}>
          <path d="M88 176 C76 122 50 76 18 52 C42 78 64 120 82 176 Z" fill="#253E20" />
          <path d="M90 176 C84 114 70 60 52 24 C74 62 86 112 91 176 Z" fill="#2D4A26" />
          <path d="M92 176 C96 116 112 64 134 28 C116 70 102 118 95 176 Z" fill="#284322" />
          <path d="M94 176 C108 128 134 86 164 62 C136 92 114 132 98 176 Z" fill="#2F4D28" />

          {/* Mid layer Kentia/Areca arching fronds */}
          <path d="M86 178 C66 138 36 112 8 104 C36 118 62 144 82 178 Z" fill="#3A5B30" />
          <path d="M88 176 C72 126 52 86 30 56 C56 88 74 128 87 176 Z" fill="#466B3A" />
          <path d="M90 176 C88 118 88 68 88 22 C96 68 96 118 93 176 Z" fill="#3E6134" />
          <path d="M93 176 C104 124 124 84 148 52 C128 88 108 128 96 176 Z" fill="#4B723E" />
          <path d="M95 178 C116 142 144 118 172 108 C144 124 118 148 98 178 Z" fill="#37572E" />

          {/* Front highlight leaves with subtle warm top catchlight */}
          <path d="M87 178 C74 146 54 126 32 122 C54 132 72 152 84 178 Z" fill="#547C45" />
          <path d="M91 176 C84 134 74 96 66 64 C80 96 89 134 93 176 Z" fill="#5D864D" />
          <path d="M93 176 C102 138 118 104 136 82 C122 108 106 142 96 176 Z" fill="#567F47" />
          <path d="M95 178 C110 150 130 132 152 128 C132 138 112 156 97 178 Z" fill="#4B713E" />

          {/* Subtle central leaf midribs */}
          <path d="M88 174 C76 130 56 88 32 58" stroke="#6B945A" strokeWidth="1" strokeOpacity="0.45" />
          <path d="M91 174 C90 124 89 72 88 26" stroke="#6B945A" strokeWidth="1" strokeOpacity="0.45" />
          <path d="M93 174 C104 130 122 90 146 54" stroke="#6B945A" strokeWidth="1" strokeOpacity="0.45" />
        </g>

        {/* Natural dark potting soil mound */}
        <ellipse cx="90" cy="176" rx="34" ry="7" fill="#231A13" />

        {/* Tapered contemporary matte-bronze planter */}
        <path
          d="M52 175 L128 175 L117 240 C116 245 106 247 90 247 C74 247 64 245 63 240 Z"
          fill={`url(#pot-body-${side})`}
        />
        {/* Beveled planter rim */}
        <path
          d="M50 173 C50 170 130 170 130 173 L128 180 C128 183 52 183 52 180 Z"
          fill={`url(#pot-rim-${side})`}
        />
        <ellipse cx="90" cy="173" rx="38" ry="4.5" fill="none" stroke="#C8A66A" strokeWidth="0.9" strokeOpacity="0.55" />
      </svg>
    </div>
  );
}

function SlatPanel({ side }: { side: "left" | "right" }) {
  return (
    <div
      className={`${styles.slatPanel} ${
        side === "left" ? styles.slatLeft : styles.slatRight
      }`}
      aria-hidden="true"
    >
      {Array.from({ length: 7 }, (_, i) => (
        <span key={i} className={styles.slatBar} />
      ))}
    </div>
  );
}

/**
 * Static 2D Contemporary Exhibition Wall Hero for individual gallery collections.
 * Displays up to 5 collection-specific backend photographs in bronze & champagne-gold
 * frames with warm golden backlighting. Never rotates or auto-advances.
 */
export function CollectionHero({
  slug,
  title,
  heroImages,
  onSelectPhoto,
}: CollectionHeroProps) {
  const displayPhotos = heroImages.slice(0, 5);
  const count = displayPhotos.length;

  return (
    <div className={styles.wrapper}>
      <section className={styles.wall} aria-labelledby="album-title">
        {/* Soft Architectural Ceiling Cove & Downward Wall-Wash Lighting */}
        <div className={styles.ceilingTrack} aria-hidden="true">
          <div className={styles.ceilingCoveWash} />
          <div className={styles.wallWashCones}>
            {WALL_WASH_CONES.map((leftPct, i) => (
              <span
                key={i}
                className={styles.wallWashBeam}
                style={{ left: `${leftPct}%` }}
              />
            ))}
          </div>
        </div>

        {/* Architectural Limestone Wall Texture & Soft Wash */}
        <div className={styles.wallWash} aria-hidden="true" />

        {/* Flanking Walnut Slat Panels & Potted Plants */}
        <SlatPanel side="left" />
        <SlatPanel side="right" />
        <PlantDecoration side="left" />
        <PlantDecoration side="right" />

        {/* Static Exhibition Photograph Frames */}
        <div className={styles.display}>
          {count > 0 && (
            <ul
              className={`${styles.frames} ${
                count === 1
                  ? styles.framesSingle
                  : count <= 3
                    ? styles.framesCompact
                    : ""
              }`}
              data-site-motion="off"
            >
              {displayPhotos.map((photo, index) => (
                <li
                  key={`${photo.src}-${index}`}
                  className={styles.frame}
                  data-motion-wall-frame
                >
                  <button
                    type="button"
                    className={styles.frameButton}
                    onClick={() => onSelectPhoto(photo)}
                    aria-label={`View ${photo.caption || photo.alt || `photograph ${index + 1}`} in lightbox`}
                  >
                    <span className={styles.mat}>
                      <Image
                        src={photo.src}
                        alt={photo.alt}
                        fill
                        priority
                        sizes={
                          index === 0
                            ? "(max-width: 767px) 78vw, 420px"
                            : "(max-width: 767px) 42vw, 320px"
                        }
                        unoptimized={photo.src.startsWith("/api/files/")}
                      />
                    </span>
                    <span className={styles.frameHoverBadge} aria-hidden="true">
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.2"
                        width="13"
                        height="13"
                      >
                        <circle cx="11" cy="11" r="7" />
                        <path d="m20 20-3.5-3.5" />
                        <path d="M11 8v6M8 11h6" />
                      </svg>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Architectural Sandstone Ledge & Polished Stone Floor */}
        <div className={styles.floorZone} aria-hidden="true">
          <div className={styles.wallLedge} />
          <div className={styles.floorScrim} />
        </div>

        {/* Dynamic Collection Breadcrumb & Heading */}
        <header
          className={styles.caption}
          data-motion-gallery-caption
          data-site-motion="off"
        >
          <nav className={heroStyles.breadcrumbNav} aria-label="Breadcrumb">
            <ol className={heroStyles.breadcrumbList}>
              <li className={heroStyles.breadcrumbItem}>
                <Link href="/" className={heroStyles.breadcrumbLink}>
                  Home
                </Link>
              </li>
              <li className={heroStyles.breadcrumbItem}>
                <span className={heroStyles.separator} aria-hidden="true">
                  /
                </span>
                <Link href="/gallery" className={heroStyles.breadcrumbLink}>
                  Gallery
                </Link>
              </li>
              <li className={heroStyles.breadcrumbItem}>
                <span className={heroStyles.separator} aria-hidden="true">
                  /
                </span>
                <span className={heroStyles.current} aria-current="page">
                  {slug}
                </span>
              </li>
            </ol>
          </nav>
          <h1
            className={`${heroStyles.heading} ${styles.title}`}
            id="album-title"
          >
            {title}
          </h1>
        </header>
      </section>
    </div>
  );
}
