"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ActionButton } from "@/components/buttons";
import type { QualityTechItem } from "@/data/quality";
import styles from "./QualitySection.module.css";

export interface QualitySectionClientProps {
  smallHeading?: string;
  boldDescription?: string;
  cta?: {
    label: string;
    href: string;
  };
  leftCard: QualityTechItem;
  centerCard: QualityTechItem;
  rightCard: QualityTechItem;
  technologies?: QualityTechItem[];
  showInnovations?: boolean;
}

export function QualitySectionClient({
  smallHeading,
  boldDescription,
  cta,
  leftCard,
  centerCard,
  rightCard,
  technologies,
  showInnovations = false,
}: QualitySectionClientProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) {
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
      { threshold: 0.12 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className={`${styles.section} ${isVisible ? styles.visible : ""}`}
      aria-labelledby="quality-heading"
    >
      <div className="container">
        {/* Small Heading + Bold Description */}
        <div className={styles.header}>
          <div className={styles.revealMask}>
            <span
              id="quality-heading"
              className={`${styles.smallHeading} ${styles.revealText}`}
              style={{ transitionDelay: "0ms" }}
            >
              {smallHeading}
            </span>
          </div>

          <div className={styles.revealMask}>
            <p
              className={`${styles.boldDescription} ${styles.revealText}`}
              style={{ transitionDelay: "120ms" }}
            >
              {boldDescription}
            </p>
          </div>
        </div>

        {/* 3-Card Focal Showcase */}
        <div className={`${styles.stage} ${styles.revealStage}`}>
          {/* Left Card */}
          <article className={styles.sideCard}>
            <div className={styles.sideImageWrap} aria-hidden="true">
              <Image
                src={leftCard.image}
                alt={leftCard.shortTitle}
                fill
                sizes="(max-width: 960px) 45vw, 280px"
                className={styles.sideImage}
              />
              <div className={styles.sideGlassOverlay} />
            </div>

            <span className={styles.sidePill}>{leftCard.tag}</span>

            <div className={styles.sideBottom}>
              <h3 className={styles.sideTitle}>{leftCard.shortTitle}</h3>
              <p className={styles.sideDesc}>{leftCard.shortSummary ?? leftCard.summary}</p>
            </div>
          </article>

          {/* Center Hero Card */}
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
              <span className={styles.centerPill}>
                {centerCard.tag}
              </span>
            </div>

            <div className={styles.centerBottom}>
              <div className={styles.centerBottomLeft}>
                <h3 className={styles.centerTitle}>{centerCard.shortTitle}</h3>
                <div className={styles.statsRow}>
                  {centerCard.stats.map((stat) => (
                    <div key={stat.label} className={styles.statTile}>
                      <span className={styles.statValue}>{stat.value}</span>
                      <span className={styles.statLabel}>{stat.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className={styles.centerBottomRight}>
                <p className={styles.centerDesc}>{centerCard.summary}</p>
              </div>
            </div>
          </article>

          {/* Right Card */}
          <article className={styles.sideCard}>
            <div className={styles.sideImageWrap} aria-hidden="true">
              <Image
                src={rightCard.image}
                alt={rightCard.shortTitle}
                fill
                sizes="(max-width: 960px) 45vw, 280px"
                className={styles.sideImage}
              />
              <div className={styles.sideGlassOverlay} />
            </div>

            <span className={styles.sidePill}>{rightCard.tag}</span>

            <div className={styles.sideBottom}>
              <h3 className={styles.sideTitle}>{rightCard.shortTitle}</h3>
              <p className={styles.sideDesc}>{rightCard.shortSummary ?? rightCard.summary}</p>
            </div>
          </article>
        </div>

        {/* 8 Innovations Section (When enabled on Quality Page) */}
        {showInnovations && technologies && technologies.length > 0 && (
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
                  className={`${styles.techItem} ${styles.revealStage}`}
                  style={{ transitionDelay: `${100 + (idx % 4) * 60}ms` }}
                >
                  <h4 className={styles.techTitle}>{tech.shortTitle}</h4>
                  <p className={styles.techSummary}>{tech.summary}</p>
                </article>
              ))}
            </div>
          </div>
        )}

        {/* Button to Technology Page */}
        {cta && (
          <div className={`${styles.ctaWrap} ${styles.revealCta}`}>
            <ActionButton text={cta.label} href={cta.href} />
          </div>
        )}
      </div>
    </section>
  );
}