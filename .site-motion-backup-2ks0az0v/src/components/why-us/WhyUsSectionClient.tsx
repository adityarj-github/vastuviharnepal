"use client";

import { useEffect, useRef, useState } from "react";
import type { WhyUsCardVariant, WhyUsItem } from "@/data/why-us";
import styles from "./WhyUsSection.module.css";

interface WhyUsSectionClientProps {
  headingLine1: string;
  headingLine2: string;
  description: string;
  items: WhyUsItem[];
}

const variantClassMap: Record<WhyUsCardVariant, string> = {
  navy: styles.cardNavy,
  sky: styles.cardSky,
  orange: styles.cardOrange,
};

export function WhyUsSectionClient({
  headingLine1,
  headingLine2,
  description,
  items,
}: WhyUsSectionClientProps) {
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
      id="why-us"
      ref={sectionRef}
      className={`${styles.section} ${isVisible ? styles.visible : ""}`}
      aria-labelledby="why-us-heading"
    >
      <div className="container">
        {/* Heading + Description */}
        <div className={styles.header}>
          <h2 id="why-us-heading" className={styles.heading}>
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
        </div>

        {/* 3 Horizontal Cards (Scrollable on Mobile) */}
        <div className={styles.track}>
          {items.map((item, index) => (
            <article
              key={item.id}
              className={`${styles.card} ${variantClassMap[item.variant]} ${styles.revealCard}`}
              style={{ transitionDelay: `${260 + index * 120}ms` }}
            >
              <div className={styles.topBlock}>
                <span className={styles.monogram}>{item.monogram}</span>

                <div className={styles.titleGroup}>
                  <span className={styles.category}>{item.category}</span>
                  <span className={styles.year}>{item.year}</span>
                  <h3 className={styles.title}>{item.title}</h3>
                </div>

                <div className={styles.recipients}>
                  {item.recipientLines.map((line, i) => (
                    <span key={i}>{line}</span>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
