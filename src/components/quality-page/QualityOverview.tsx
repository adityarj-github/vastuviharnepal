"use client";

import { useEffect, useRef, useState } from "react";
import { qualitySectionData } from "@/data/quality";
import styles from "./QualityOverview.module.css";

const KEY_BENCHMARKS = [
  {
    value: "200+",
    unit: "Years",
    title: "Bio-Concrete Lifespan",
    desc: "Proprietary Bacillus pasteurii bacteria induce continuous self-healing of micro-cracks over two centuries.",
  },
  {
    value: "+30%",
    unit: "Boost",
    title: "Structural Compressive Strength",
    desc: "Microbiologically induced calcite precipitation (MICP) seals internal pores and reinforces load resilience.",
  },
  {
    value: "8 –12°C",
    unit: "Cooler",
    title: "Passive Thermal Shield",
    desc: "Insulated rat-trap brick cavities and filler slabs block direct tropical solar heat without power consumption.",
  },
  {
    value: "0%",
    unit: "Toxins",
    title: "Non-Toxic VOC-Free Air",
    desc: "Engineered materials and natural eco-sanitation eliminate chemical emissions for pure indoor breathing.",
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
      ref={sectionRef}
      className={`${styles.section} ${isVisible ? styles.visible : ""}`}
      aria-labelledby="quality-overview-heading"
    >
      <div className="container">
        <div className={styles.header}>
          <div className={styles.revealMask}>
            <div
              className={`${styles.eyebrowWrap} ${styles.revealText}`}
              style={{ transitionDelay: "0ms" }}
            >
              <span className={styles.eyebrow}>
                {qualitySectionData.smallHeading}
              </span>
            </div>
          </div>

          <h2 id="quality-overview-heading" className={styles.heading}>
            <span className={styles.revealMask}>
              <span
                className={`${styles.headingLine} ${styles.revealText}`}
                style={{ transitionDelay: "90ms" }}
              >
                Scientific R&D Meets
              </span>
            </span>
            <span className={styles.revealMask}>
              <span
                className={`${styles.headingLine} ${styles.revealText}`}
                style={{ transitionDelay: "180ms" }}
              >
                Residential Durability
              </span>
            </span>
          </h2>

          <div className={styles.revealMask}>
            <p
              className={`${styles.lead} ${styles.revealText}`}
              style={{ transitionDelay: "260ms" }}
            >
              {qualitySectionData.boldDescription}
            </p>
          </div>
        </div>

        <div className={styles.metricsGrid}>
          {KEY_BENCHMARKS.map((item, idx) => (
            <article
              key={idx}
              className={`${styles.metricCard} ${styles.revealCard}`}
              style={{ transitionDelay: `${280 + idx * 80}ms` }}
            >
              <div className={styles.metricValueWrap}>
                <span className={styles.metricValue}>{item.value}</span>
                <span className={styles.metricUnit}>{item.unit}</span>
              </div>
              <div>
                <h3 className={styles.metricTitle}>{item.title}</h3>
                <p className={styles.metricDesc}>{item.desc}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
