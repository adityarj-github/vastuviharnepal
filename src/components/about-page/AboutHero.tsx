"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ActionButton } from "@/components/buttons";
import { aboutPageData } from "@/data/about";
import styles from "./AboutHero.module.css";

export function AboutHero() {
  const { hero } = aboutPageData;
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const raf = requestAnimationFrame(() => setIsVisible(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <section
      className={`${styles.section} ${isVisible ? styles.visible : ""}`}
      aria-labelledby="about-hero-heading"
    >
      {/* Full-Bleed Background Image + Dark Fade */}
      <div className={styles.bgWrap} aria-hidden="true">
        <Image
          src={hero.image}
          alt={hero.imageAlt}
          fill
          priority
          sizes="100vw"
          className={styles.bgImage}
        />
        <div className={styles.overlay} />
      </div>

      <div className={`container ${styles.inner}`}>
        <div className={styles.topRow}>
          <div>
            <div className={styles.revealMask}>
              <span
                className={`${styles.eyebrow} ${styles.revealText}`}
                style={{ transitionDelay: "0ms" }}
              >
                <span className={styles.dot} aria-hidden="true" />
                {hero.eyebrow}
              </span>
            </div>

            <h1 id="about-hero-heading" className={styles.heading}>
              <span className={styles.revealMask}>
                <span
                  className={`${styles.headingLine} ${styles.revealText}`}
                  style={{ transitionDelay: "90ms" }}
                >
                  {hero.headingLine1}
                </span>
              </span>
              <span className={styles.revealMask}>
                <span
                  className={`${styles.headingLine} ${styles.revealText}`}
                  style={{ transitionDelay: "180ms" }}
                >
                  {hero.headingLine2}
                </span>
              </span>
            </h1>
          </div>

          <div className={styles.rightCol}>
            <div className={styles.revealMask}>
              <p
                className={`${styles.description} ${styles.revealText}`}
                style={{ transitionDelay: "220ms" }}
              >
                {hero.description}
              </p>
            </div>
            <div className={styles.revealBtn}>
              <ActionButton
                text={hero.cta.label}
                href={hero.cta.href}
                className={styles.ctaBtn}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}