"use client";

import { useEffect, useRef, useState } from "react";
import type { AwardCardVariant, AwardItem } from "@/data/awards";
import styles from "./AwardsSection.module.css";

interface AwardsSectionClientProps {
  headingLine1: string;
  headingLine2: string;
  description: string;
  awards: AwardItem[];
}

const variantClassMap: Record<AwardCardVariant, string> = {
  navy: styles.cardNavy,
  sky: styles.cardSky,
  orange: styles.cardOrange,
};

export function AwardsSectionClient({
  headingLine1,
  headingLine2,
  description,
  awards,
}: AwardsSectionClientProps) {
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
      { threshold: 0.15 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className={`${styles.section} ${isVisible ? styles.visible : ""}`}
      aria-labelledby="awards-heading"
    >
      <div className="container">
        {/* Heading + Description */}
        <div className={styles.header}>
          <h2 id="awards-heading" className={styles.heading}>
            <span className={styles.revealMask}>
              <span
                className={`${styles.headingLine} ${styles.revealText}`}
                style={{ transitionDelay: "0ms" }}
              >
                {headingLine1}
              </span>
            </span>
            <span className={styles.revealMask}>
              <span
                className={`${styles.headingLine} ${styles.revealText}`}
                style={{ transitionDelay: "120ms" }}
              >
                {headingLine2}
              </span>
            </span>
          </h2>

          <div className={styles.revealMask}>
            <p
              className={`${styles.description} ${styles.revealText}`}
              style={{ transitionDelay: "220ms" }}
            >
              {description}
            </p>
          </div>
        </div>

        {/* 3 Horizontal Cards (Scrollable on Mobile) */}
        <div className={styles.track}>
          {awards.map((award, index) => (
            <article
              key={award.id}
              className={`${styles.card} ${variantClassMap[award.variant]} ${styles.revealCard}`}
              style={{ transitionDelay: `${260 + index * 120}ms` }}
            >
              <div className={styles.topBlock}>
                <span className={styles.monogram}>{award.monogram}</span>

                <div className={styles.titleGroup}>
                  <span className={styles.category}>{award.category}</span>
                  <span className={styles.year}>{award.year}</span>
                  <h3 className={styles.title}>{award.title}</h3>
                </div>

                <div className={styles.recipients}>
                  {award.recipientLines.map((line, i) => (
                    <span key={i}>{line}</span>
                  ))}
                </div>
              </div>

              <div className={styles.bottomBlock}>
                <div className={styles.certificateRow}>
                  <div className={styles.certificateText}>
                    <span className={styles.certificateHeading}>
                      {award.certificateHeading}
                    </span>
                    <p className={styles.certificateNote}>
                      {award.certificateNote}
                    </p>
                  </div>

                  <span className={styles.verticalTag} aria-hidden="true">
                    <span className={styles.verticalLine} />
                    {award.verticalLabel}
                  </span>
                </div>

                <div className={styles.footerTag}>{award.footerTag}</div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}