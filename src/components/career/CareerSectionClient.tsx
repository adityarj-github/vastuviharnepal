"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ActionButton } from "@/components/buttons";
import type { CareerSectionData } from "@/data/career";
import styles from "./CareerSection.module.css";

export function CareerSectionClient({
  headingLine1,
  headingLine2,
  description,
  backgroundImage,
  cta,
  images,
}: CareerSectionData) {
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
      aria-labelledby="career-heading"
    >
      {/* Background Image + Dark Fade */}
      <div className={styles.bgWrap} aria-hidden="true">
        <Image
          src={backgroundImage.src}
          alt={backgroundImage.alt}
          fill
          sizes="100vw"
          className={styles.bgImage}
        />
        <div className={styles.overlay} />
      </div>

      <div className={`container ${styles.inner}`}>
        <div className={styles.contentWrap}>
          {/* Left Column: Heading + Description + Button */}
          <div className={styles.textCol}>
            <h2 id="career-heading" className={styles.heading}>
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
                style={{ transitionDelay: "180ms" }}
              >
                {description}
              </p>
            </div>

            <div
              className={styles.revealBtn}
              style={{ transitionDelay: "240ms" }}
            >
              <ActionButton text={cta.label} href={cta.href} />
            </div>
          </div>

          {/* Right Column: Circular Zigzag Images (Vertical on Desktop, Horizontal on Mobile) */}
          <div className={styles.imagesCol}>
            {images.slice(0, 4).map((img, index) => (
              <div
                key={img.src}
                className={`${styles.circleCard} ${styles.revealCard}`}
                style={{ transitionDelay: `${260 + index * 90}ms` }}
              >
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  sizes="(max-width: 820px) 130px, 190px"
                  className={styles.circleImage}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}