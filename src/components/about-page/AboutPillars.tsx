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
        <div className={styles.header}>
          <h2 id="about-pillars-heading" className={styles.heading}>
            <span className={styles.headingLine}>{pillars.headingLine1}</span>
            <span className={styles.headingLine}>{pillars.headingLine2}</span>
          </h2>
          <p className={styles.description}>{pillars.description}</p>
        </div>

        <div className={styles.grid}>
          {pillars.items.map((item, idx) => (
            <article
              key={item.number}
              className={`${styles.card} ${styles.revealCard}`}
              style={{ transitionDelay: `${idx * 100}ms` }}
            >
              <span className={styles.number}>{item.number}</span>
              <div>
                <h3 className={styles.title}>{item.title}</h3>
                <p className={styles.text}>{item.description}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}