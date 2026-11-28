"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { galleryFolders, type GalleryFolder } from "@/data/gallery";
import styles from "./GalleryFoldersGrid.module.css";

interface GalleryFoldersGridProps {
  folders?: GalleryFolder[];
}

export function GalleryFoldersGrid({
  folders = galleryFolders,
}: GalleryFoldersGridProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className={`${styles.section} ${isVisible ? styles.visible : ""}`}
      aria-labelledby="gallery-folders-heading"
    >
      <div className="container">
        <div className={styles.header}>
          <div className={styles.revealMask}>
            <div
              className={`${styles.eyebrowWrap} ${styles.revealText}`}
              style={{ transitionDelay: "0ms" }}
            >
              <span className={styles.eyebrow}>Photo Albums & Archives</span>
            </div>
          </div>

          <h2 id="gallery-folders-heading" className={styles.heading}>
            <span className={styles.revealMask}>
              <span
                className={`${styles.headingLine} ${styles.revealText}`}
                style={{ transitionDelay: "100ms" }}
              >
                Township Moments, Expos & Sporting Heritage
              </span>
            </span>
          </h2>

          <div className={styles.revealMask}>
            <p
              className={`${styles.lead} ${styles.revealText}`}
              style={{ transitionDelay: "200ms" }}
            >
              Browse our curated collections capturing the life, growth, community gatherings, and media milestones of Vastu Vihar Nepal.
            </p>
          </div>
        </div>

        {/* Dynamic Bento Grid Layout */}
        <div className={styles.bentoGrid}>
          {folders.map((folder, idx) => {
            // Alternating Bento structure: 0 -> Wide (7), 1 -> Narrow (5), 2 -> Narrow (5), 3 -> Wide (7)
            const isWide = idx === 0 || idx === 3;
            const bentoSpanClass = isWide
              ? styles.bentoWide
              : styles.bentoNarrow;

            return (
              <article
                key={folder.slug}
                className={`${styles.bentoCard} ${bentoSpanClass} ${styles.revealCard}`}
                style={{ transitionDelay: `${150 + idx * 90}ms` }}
              >
                <Link
                  href={`/gallery/${folder.slug}`}
                  className={styles.cardLink}
                >
                  {/* Full-Bleed Background Visual with Dark Gradient */}
                  <div className={styles.bgImageWrap}>
                    <Image
                      src={folder.coverImage}
                      alt={folder.title}
                      fill
                      sizes="(max-width: 680px) 100vw, (max-width: 960px) 50vw, 60vw"
                      className={styles.bgImage}
                    />
                    <div className={styles.overlay} />
                  </div>

                  {/* Top Bar: Category Pill & Photo Count Badge */}
                  <div className={styles.topRow}>
                    <span className={styles.categoryPill}>
                      {folder.category}
                    </span>
                    <span className={styles.countBadge}>
                      {folder.images.length} Photos
                    </span>
                  </div>

                  {/* Bottom Content Area */}
                  <div className={styles.bottomContent}>
                    <h3 className={styles.title}>{folder.title}</h3>
                    <span className={styles.viewAction}>
                      Open Album Collection
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
                        <path d="M5 12h14" />
                        <path d="m13 6 6 6-6 6" />
                      </svg>
                    </span>
                  </div>
                </Link>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
