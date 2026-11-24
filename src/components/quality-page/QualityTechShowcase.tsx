"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { qualitySectionData } from "@/data/quality";
import styles from "./QualityTechShowcase.module.css";

export function QualityTechShowcase() {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const { technologies } = qualitySectionData;

  const leftCard =
    technologies.find((t) => t.id === "insulated-walls") ?? technologies[2];
  const centerCard =
    technologies.find((t) => t.id === "calcifying-microbe") ?? technologies[0];
  const rightCard =
    technologies.find((t) => t.id === "green-energy") ?? technologies[5];

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

  return (
    <section
      ref={sectionRef}
      className={`${styles.section} ${isVisible ? styles.visible : ""}`}
      aria-labelledby="technologies-showcase-heading"
    >
      <div className="container">
        {/* Section Header */}
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <span className={styles.eyebrow}>Proprietary Engineering</span>
            <h2 id="technologies-showcase-heading" className={styles.heading}>
              Core Construction Technologies
            </h2>
          </div>
          <p className={styles.headerDesc}>
            Engineered with self-healing bio-concrete, monolithic foundations, and passive thermal insulation for generational safety.
          </p>
        </div>

        {/* The 3 Core Images in Middle (Focal Stage) */}
        <div className={`${styles.stage} ${styles.revealItem}`}>
          {/* Left Card: Insulated Walls */}
          <article className={styles.sideCard}>
            <div className={styles.sideImageWrap}>
              <Image
                src={leftCard.image}
                alt={leftCard.shortTitle}
                fill
                sizes="(max-width: 960px) 45vw, 260px"
                className={styles.sideImage}
              />
            </div>
            <span className={styles.pill}>{leftCard.tag}</span>
            <div>
              <p className={styles.sideBrand}>{leftCard.brand}</p>
              <h3 className={styles.sideTitle}>{leftCard.shortTitle}</h3>
            </div>
          </article>

          {/* Center Focal Card: Self-Healing Bio-Concrete */}
          <article className={styles.centerCard}>
            <div className={styles.centerImageWrap} aria-hidden="true">
              <Image
                src={centerCard.image}
                alt={centerCard.shortTitle}
                fill
                priority
                sizes="(max-width: 960px) 100vw, 55vw"
                className={styles.centerImage}
              />
              <div className={styles.centerOverlay} />
            </div>

            <div className={styles.centerTop}>
              <div className={styles.centerTopMeta}>
                <span className={`${styles.pill} ${styles.centerPill}`}>
                  {centerCard.tag}
                </span>
                <div>
                  <p className={styles.centerBrand}>{centerCard.brand}</p>
                  <h3 className={styles.centerTitle}>{centerCard.shortTitle}</h3>
                </div>
              </div>
            </div>

            <div className={styles.statsStack}>
              {centerCard.stats.map((stat) => (
                <div key={stat.label} className={styles.statTile}>
                  <span className={styles.statValue}>{stat.value}</span>
                  <span className={styles.statLabel}>{stat.label}</span>
                </div>
              ))}
            </div>
          </article>

          {/* Right Card: Green Energy */}
          <article className={styles.sideCard}>
            <div className={styles.sideImageWrap}>
              <Image
                src={rightCard.image}
                alt={rightCard.shortTitle}
                fill
                sizes="(max-width: 960px) 45vw, 260px"
                className={styles.sideImage}
              />
            </div>
            <span className={styles.pill}>{rightCard.tag}</span>
            <div>
              <p className={styles.sideBrand}>{rightCard.brand}</p>
              <h3 className={styles.sideTitle}>{rightCard.shortTitle}</h3>
            </div>
          </article>
        </div>

        {/* 8 Innovations: Heading and Description Only, No Bg, No Border, No Padding */}
        <div className={styles.techGridSection}>
          <div className={styles.gridHeader}>
            <h3 className={styles.gridTitle}>All 8 Structural &amp; Eco Innovations</h3>
            <p className={styles.gridSubtitle}>
              Rigorous laboratory-tested standards integrated into all Vastu Vihar Nepal homes.
            </p>
          </div>

          <div className={styles.techGrid}>
            {technologies.map((tech, idx) => (
              <article
                key={tech.id}
                className={`${styles.techItem} ${styles.revealItem}`}
                style={{ transitionDelay: `${100 + (idx % 4) * 60}ms` }}
              >
                <h4 className={styles.techTitle}>{tech.shortTitle}</h4>
                <p className={styles.techSummary}>{tech.summary}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
