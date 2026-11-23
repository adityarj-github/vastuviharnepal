"use client";

import { useEffect, useRef, useState } from "react";
import { aboutPageData } from "@/data/about";
import styles from "./AboutPillars.module.css";

export function AboutPillars() {
  const { pillars } = aboutPageData;
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
      { threshold: 0.12 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className={`${styles.section} ${isVisible ? styles.visible : ""}`}
      aria-labelledby="about-pillars-heading"
    >
      <div className="container">
        <div className={styles.card}>
          {/* Heading without tagline */}
          <div className={`${styles.header} ${styles.revealItem}`}>
            <h2 id="about-pillars-heading" className={styles.heading}>
              {pillars.headingLine1} {pillars.headingLine2}
            </h2>
          </div>

          {/* Grid without counter & without bg color - heading and description only */}
          <div className={styles.grid}>
            {pillars.items.map((item, idx) => (
              <article
                key={item.title}
                className={`${styles.item} ${styles.revealItem}`}
                style={{ transitionDelay: `${idx * 100}ms` }}
              >
                <h3 className={styles.title}>{item.title}</h3>
                <p className={styles.text}>{item.description}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
