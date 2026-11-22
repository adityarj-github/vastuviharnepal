"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { qualitySectionData, type QualityTechItem } from "@/data/quality";
import styles from "./QualityTechShowcase.module.css";

const CATEGORIES = [
  { id: "all", label: "All Innovations" },
  { id: "bio-concrete", label: "Bio-Concrete" },
  { id: "structural", label: "Structural" },
  { id: "thermal", label: "Thermal & Cooling" },
  { id: "green energy", label: "Green Energy" },
  { id: "eco-living", label: "Eco-Sanitation & Air" },
];

export function QualityTechShowcase() {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [activeCategory, setActiveCategory] = useState("all");
  const { technologies } = qualitySectionData;

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
      { threshold: 0.08 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const filtered = technologies.filter((item) => {
    if (activeCategory === "all") return true;
    if (activeCategory === "bio-concrete") return item.tag.includes("bio-concrete");
    if (activeCategory === "structural") return item.tag.includes("structural");
    if (activeCategory === "thermal") {
      return (
        item.tag.includes("thermal") ||
        item.tag.includes("cooling") ||
        item.tag.includes("pre-fab")
      );
    }
    if (activeCategory === "green energy") return item.tag.includes("green energy");
    if (activeCategory === "eco-living") {
      return item.tag.includes("healthy") || item.tag.includes("sanitation");
    }
    return true;
  });

  return (
    <section
      ref={sectionRef}
      className={`${styles.section} ${isVisible ? styles.visible : ""}`}
      aria-labelledby="technologies-showcase-heading"
    >
      <div className="container">
        <div className={styles.header}>
          <div className={styles.revealMask}>
            <div
              className={`${styles.eyebrowWrap} ${styles.revealText}`}
              style={{ transitionDelay: "0ms" }}
            >
              <span className={styles.eyebrow}>Proprietary Engineering</span>
            </div>
          </div>

          <h2 id="technologies-showcase-heading" className={styles.heading}>
            <span className={styles.revealMask}>
              <span
                className={`${styles.headingLine} ${styles.revealText}`}
                style={{ transitionDelay: "100ms" }}
              >
                8 Foundational Technologies Powering Every Township
              </span>
            </span>
          </h2>

          {/* Interactive Category Filter */}
          <div
            className={styles.filterBar}
            role="tablist"
            aria-label="Technology categories"
          >
            {CATEGORIES.map((cat) => {
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  className={`${styles.filterPill} ${
                    isActive ? styles.filterPillActive : ""
                  }`}
                  onClick={() => setActiveCategory(cat.id)}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Technology Items List */}
        <div className={styles.techList}>
          {filtered.map((item: QualityTechItem, idx: number) => {
            const isReverse = idx % 2 === 1;
            return (
              <article
                key={item.id}
                id={item.id}
                className={`${styles.techCard} ${
                  isReverse ? styles.techCardReverse : ""
                } ${styles.revealCard}`}
                style={{ transitionDelay: `${120 + (idx % 3) * 100}ms` }}
              >
                {/* Visual Image & Highlight Stats */}
                <div className={styles.imageCol}>
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    sizes="(max-width: 960px) 100vw, 50vw"
                    className={styles.techImage}
                  />

                  {/* Overlaid Stat Pills */}
                  <div className={styles.statsOverlay}>
                    {item.stats.map((st, sIdx) => (
                      <div key={sIdx} className={styles.statItem}>
                        <span className={styles.statValue}>{st.value}</span>
                        <span className={styles.statLabel}>{st.label}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Content Column */}
                <div className={styles.contentCol}>
                  <div className={styles.badgeRow}>
                    <span className={styles.brandBadge}>{item.brand}</span>
                    <span className={styles.tagBadge}>{item.tag}</span>
                  </div>

                  <div>
                    <h3 className={styles.shortTitle}>{item.shortTitle}</h3>
                    <p className={styles.fullTitle}>{item.title}</p>
                  </div>

                  <p className={styles.summary}>{item.summary}</p>

                  <div className={styles.detailsList}>
                    {item.details.map((paragraph, pIdx) => (
                      <p key={pIdx} className={styles.detailParagraph}>
                        {paragraph}
                      </p>
                    ))}
                  </div>

                  {/* Sub-Items if present (e.g. Green Energy Systems) */}
                  {item.subItems && item.subItems.length > 0 && (
                    <div className={styles.subItemsGrid}>
                      {item.subItems.map((sub, subIdx) => (
                        <div key={subIdx} className={styles.subItemCard}>
                          <h4 className={styles.subItemTitle}>{sub.title}</h4>
                          <p className={styles.subItemDesc}>{sub.description}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
