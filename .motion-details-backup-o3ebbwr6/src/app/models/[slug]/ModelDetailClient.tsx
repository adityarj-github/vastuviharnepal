"use client";

import { motionInterval } from "@/components/animation/motionPreference";
import { StatCounter } from "@/components/home/StatCounter";
import { useState, useEffect } from "react";
import Image from "next/image";
import { ActionButton } from "@/components/buttons";
import { OtherModelsCarousel, ModelLeadSection } from "@/components/models-page";
import type { ProjectItem } from "@/data/projects";
import styles from "./ModelDetail.module.css";

interface ModelDetailClientProps {
  project: ProjectItem;
}

export function ModelDetailClient({ project }: ModelDetailClientProps) {
  const [activePhoto, setActivePhoto] = useState(0);
  const [activePlanTab, setActivePlanTab] = useState<"2D" | "3D">("2D");
  const [isVisible, setIsVisible] = useState(false);
  const [isSliderPaused, setIsSliderPaused] = useState(false);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  useEffect(() => {
    const raf = requestAnimationFrame(() => setIsVisible(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  // Sliding animation timer for gallery photos
  useEffect(() => {
    if (isSliderPaused || project.gallery.length <= 1) return;

    return motionInterval(() => {
      setActivePhoto((prev) => (prev + 1) % project.gallery.length);
    }, 4500);
  }, [isSliderPaused, project.gallery.length]);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
    setIsSliderPaused(true);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    setIsSliderPaused(false);
    if (touchStartX === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX - touchEndX;
    if (Math.abs(diff) > 40) {
      if (diff > 0) {
        setActivePhoto((prev) => (prev + 1) % project.gallery.length);
      } else {
        setActivePhoto((prev) =>
          prev === 0 ? project.gallery.length - 1 : prev - 1
        );
      }
    }
    setTouchStartX(null);
  };

  const modelType = project.modelTypes[0];
  const layouts = modelType?.layouts ?? [];
  const currentLayout =
    layouts.find((l) => l.type === activePlanTab) ?? layouts[0];

  return (
    <section className={`${styles.section} ${isVisible ? styles.visible : ""}`} data-site-motion="off">
      <div className="container">
        <div className={styles.layoutGrid}>
          {/* Main Visuals & Floor Plans */}
          <div className={`${styles.gallerySection} ${styles.revealItem}`} style={{ transitionDelay: "100ms" }}>
            {/* Sliding Gallery Viewport */}
            <div
              className={styles.mainImageWrap}
              onMouseEnter={() => setIsSliderPaused(true)}
              onMouseLeave={() => setIsSliderPaused(false)}
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
            >
              <div
                className={styles.sliderTrack}
                style={{ transform: `translateX(-${activePhoto * 100}%)` }}
              >
                {project.gallery.map((photo, idx) => (
                  <div key={photo} className={styles.slide}>
                    <Image
                      src={photo}
                      alt={`${project.name} photo ${idx + 1}`}
                      fill
                      priority={idx === 0}
                      sizes="(max-width: 960px) 100vw, 65vw"
                      className={styles.mainImage}
                    />
                  </div>
                ))}
              </div>

              {/* Slider Next & Prev Nav Arrows */}
              {project.gallery.length > 1 && (
                <>
                  <button
                    type="button"
                    className={`${styles.sliderNavBtn} ${styles.prevBtn}`}
                    onClick={() =>
                      setActivePhoto((prev) =>
                        prev === 0 ? project.gallery.length - 1 : prev - 1
                      )
                    }
                    aria-label="Previous photo"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      width="20"
                      height="20"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="m15 18-6-6 6-6" />
                    </svg>
                  </button>

                  <button
                    type="button"
                    className={`${styles.sliderNavBtn} ${styles.nextBtn}`}
                    onClick={() =>
                      setActivePhoto((prev) =>
                        prev === project.gallery.length - 1 ? 0 : prev + 1
                      )
                    }
                    aria-label="Next photo"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      width="20"
                      height="20"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="m9 18 6-6-6-6" />
                    </svg>
                  </button>

                  <span className={styles.photoCounter}>
                    {activePhoto + 1} / {project.gallery.length}
                  </span>
                </>
              )}
            </div>

            {/* Thumbnail Selectors */}
            {project.gallery.length > 1 && (
              <div
                className={styles.thumbsRow}
                role="tablist"
                aria-label="Model photo thumbnails"
              >
                {project.gallery.map((photo, idx) => (
                  <button
                    key={photo}
                    type="button"
                    role="tab"
                    aria-selected={activePhoto === idx}
                    className={`${styles.thumbBtn} ${
                      activePhoto === idx ? styles.thumbBtnActive : ""
                    }`}
                    onClick={() => setActivePhoto(idx)}
                  >
                    <Image
                      src={photo}
                      alt={`Thumbnail ${idx + 1}`}
                      fill
                      sizes="90px"
                      className={styles.thumbImg}
                    />
                  </button>
                ))}
              </div>
            )}

            {/* 2D & 3D Architectural Floor Plans */}
            {layouts.length > 0 && (
              <div className={styles.floorPlansSection}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    flexWrap: "wrap",
                    gap: "1rem",
                  }}
                >
                  <h2 className={styles.sectionHeading}>
                    Architectural Layout Plans
                  </h2>

                  <div
                    className={styles.planTabs}
                    role="tablist"
                    aria-label="Floor plan view"
                  >
                    {layouts.map((l) => {
                      const isActive = activePlanTab === l.type;
                      return (
                        <button
                          key={l.type}
                          type="button"
                          role="tab"
                          aria-selected={isActive}
                          className={`${styles.planTabBtn} ${
                            isActive ? styles.planTabBtnActive : ""
                          }`}
                          onClick={() => setActivePlanTab(l.type)}
                        >
                          {l.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {currentLayout && (
                  <div className={styles.planImageWrap}>
                    <Image
                      src={currentLayout.url}
                      alt={`${project.name} ${currentLayout.label}`}
                      fill
                      sizes="(max-width: 960px) 100vw, 65vw"
                      className={styles.planImage}
                    />
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Sidebar Specs & CTA */}
          <aside className={`${styles.sidebar} ${styles.revealItem}`} style={{ transitionDelay: "220ms" }}>
            <div className={styles.sidebarCard}>
              <span className={styles.modelBadge}>
                {modelType?.modelName ?? "Bungalow"}
              </span>

              <span className={styles.priceTag}>
                {project.price || "Price on Request"}
              </span>

              {/* Technical Specifications Table */}
              <div className={styles.statsTable}>
                {modelType?.stats.map((stat) => (
                  <div key={stat.label} className={styles.statRow}>
                    <span className={styles.statLabel}>{stat.label}</span>
                    <span className={styles.statVal}>
                      {typeof stat.value === "number" ? (
                        <StatCounter target={stat.value} suffix={stat.unit ? ` ${stat.unit}` : ""} />
                      ) : (
                        <>{stat.value} {stat.unit ?? ""}</>
                      )}
                    </span>
                  </div>
                ))}
              </div>

              {/* Key Features List */}
              {project.features.length > 0 && (
                <ul className={styles.featuresList}>
                  {project.features.map((feat) => (
                    <li key={feat} className={styles.featureItem}>
                      <svg
                        className={styles.checkIcon}
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        width="16"
                        height="16"
                        aria-hidden="true"
                      >
                        <path d="M20 6 9 17l-5-5" />
                      </svg>
                      {feat}
                    </li>
                  ))}
                </ul>
              )}

              <ActionButton
                text="Inquire & Book Site Visit"
                href="/contact/site"
              />
            </div>

            {/* Foundation Assurance Card */}
            {project.benefits && project.benefits.length > 0 && (
              <div className={styles.benefitsCard}>
                <h3 className={styles.benefitsTitle}>
                  Raft Foundation Structural Benefits
                </h3>
                <ul className={styles.benefitsList}>
                  {project.benefits.map((b, i) => (
                    <li key={i}>{b}</li>
                  ))}
                </ul>
              </div>
            )}
          </aside>
        </div>

        {/* Horizontal Scroll Other Models to Explore */}
        <div className={styles.revealItem} style={{ transitionDelay: "300ms" }}>
          <OtherModelsCarousel currentSlug={project.slug} />
        </div>

        {/* Lead Form & Action Buttons (Call / Site Visit) */}
        <div className={styles.revealItem} style={{ transitionDelay: "360ms" }}>
          <ModelLeadSection currentModel={project} />
        </div>
      </div>
    </section>
  );
}
