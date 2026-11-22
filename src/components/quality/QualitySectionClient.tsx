"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ActionButton } from "@/components/buttons";
import type { QualityTechItem } from "@/data/quality";
import styles from "./QualitySection.module.css";

interface QualitySectionClientProps {
  smallHeading: string;
  boldDescription: string;
  cta: {
    label: string;
    href: string;
  };
  leftCard: QualityTechItem;
  centerCard: QualityTechItem;
  rightCard: QualityTechItem;
}

export function QualitySectionClient({
  smallHeading,
  boldDescription,
  cta,
  leftCard,
  centerCard,
  rightCard,
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
            <div className={styles.sideImageWrap}>
              <Image
                src={leftCard.image}
                alt={leftCard.shortTitle}
                fill
                sizes="(max-width: 960px) 45vw, 240px"
                className={styles.sideImage}
              />
            </div>
            <span className={styles.pill}>{leftCard.tag}</span>
            <div>
              <p className={styles.sideBrand}>{leftCard.brand}</p>
              <h3 className={styles.sideTitle}>{leftCard.shortTitle}</h3>
            </div>
          </article>

          {/* Center Hero Card */}
          <article className={styles.centerCard}>
            <div className={styles.centerImageWrap} aria-hidden="true">
              <Image
                src={centerCard.image}
                alt={centerCard.shortTitle}
                fill
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

          {/* Right Card */}
          <article className={styles.sideCard}>
            <div className={styles.sideImageWrap}>
              <Image
                src={rightCard.image}
                alt={rightCard.shortTitle}
                fill
                sizes="(max-width: 960px) 45vw, 240px"
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

        {/* Button to Technology Page */}
        <div className={`${styles.ctaWrap} ${styles.revealCta}`}>
          <ActionButton text={cta.label} href={cta.href} />
        </div>
      </div>
    </section>
  );
}