"use client";

import { StatCounter } from "@/components/home/StatCounter";
import { useEffect, useRef, useState } from "react";
import { qualitySectionData } from "@/data/quality";
import styles from "./QualityOverview.module.css";

const KEY_BENCHMARKS = [
  {
    value: "200+", target: 200, suffix: "+",
    label: "Years Bio-Concrete Lifespan",
  },
  {
    value: "+30%", target: 30, prefix: "+", suffix: "%",
    label: "Compressive Strength Boost",
  },
  {
    value: "8 – 12°C",
    label: "Passive Thermal Shield",
  },
  {
    value: "0%",
    label: "Toxic VOCs & Offgassing",
  },
];

export function QualityOverview() {
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
      ref={sectionRef} data-site-motion="off"
      className={`${styles.section} ${isVisible ? styles.visible : ""}`}
      aria-labelledby="quality-overview-heading"
    >
      <div className="container">
        {/* Header: Eyebrow + Bold Heading */}
        <div className={`${styles.header} ${styles.revealItem}`}>
          <span className={styles.eyebrow}>
            {qualitySectionData.smallHeading}
          </span>
          <h2 id="quality-overview-heading" className={styles.heading}>
            Scientific R&amp;D Meets Residential Durability
          </h2>
        </div>

        {/* 2-Column Split: Text (Left) & Stats 2x2 Grid (Right) - Matches About page */}
        <div className={styles.contentSplit}>
          <div
            className={`${styles.paragraphsCol} ${styles.revealItem}`}
            style={{ transitionDelay: "150ms" }}
          >
            <p className={styles.lead}>
              At Vastu Vihar Nepal, engineering is rooted in scientific durability. From alkaline-adapted calcifying microbes to monolithic raft foundations, every material is certified to safeguard your investment for generations.
            </p>
            <p className={styles.paragraph}>
              Our research focuses on passive comfort and seismic resilience—lowering indoor tropical heat without relying on electricity, eliminating toxic chemical offgassing, and delivering crack-free structural longevity.
            </p>
          </div>

          {/* Right: Stats 2x2 Grid like About Page */}
          <div className={styles.statsGrid}>
            {KEY_BENCHMARKS.map((item, idx) => (
              <article
                key={idx}
                className={`${styles.statCard} ${styles.revealItem}`}
                style={{ transitionDelay: `${200 + idx * 80}ms` }}
              >
                {item.target === undefined ? (
                  <span className={styles.statValue}>{item.value}</span>
                ) : (
                  <StatCounter target={item.target} prefix={item.prefix} suffix={item.suffix} className={styles.statValue} />
                )}
                <h3 className={styles.statLabel}>{item.label}</h3>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
