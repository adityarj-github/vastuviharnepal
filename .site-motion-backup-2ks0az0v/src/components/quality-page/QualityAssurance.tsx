"use client";

import { useEffect, useRef, useState } from "react";
import { ActionButton } from "@/components/buttons";
import styles from "./QualityAssurance.module.css";

const ASSURANCE_PILLARS = [
  {
    number: "01",
    title: "Monolithic Raft Foundation",
    text: "Heavy reinforced concrete slabs distribute structural loads evenly across soil, preventing differential settlement in Himalayan & riverbank terrains.",
  },
  {
    number: "02",
    title: "Anti-Seismic Structural Code",
    text: "Engineered specifically to absorb ground motion forces with ductile detailing, superior TMT steel ties, and flexible column-beam joints.",
  },
  {
    number: "03",
    title: "Rigorous Material Testing",
    text: "Every batch of Fe-500D steel, high-grade Portland cement, aggregate, and bio-concrete is certified through independent laboratory checks.",
  },
  {
    number: "04",
    title: "Transparent Site Access",
    text: "Homeowners and prospective buyers are invited to inspect ongoing construction stages, structural frames, and thermal wall cross-sections in person.",
  },
];

export function QualityAssurance() {
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
      aria-labelledby="quality-assurance-heading"
    >
      <div className={`container ${styles.inner}`}>
        <div className={styles.header}>
          <div className={styles.revealMask}>
            <div
              className={`${styles.eyebrowWrap} ${styles.revealText}`}
              style={{ transitionDelay: "0ms" }}
            >
              <span className={styles.eyebrow}>Structural Guarantee</span>
            </div>
          </div>

          <h2 id="quality-assurance-heading" className={styles.heading}>
            <span className={styles.revealMask}>
              <span
                className={`${styles.headingLine} ${styles.revealText}`}
                style={{ transitionDelay: "90ms" }}
              >
                Engineered For Seismic Resilience &
              </span>
            </span>
            <span className={styles.revealMask}>
              <span
                className={`${styles.headingLine} ${styles.revealText}`}
                style={{ transitionDelay: "180ms" }}
              >
                Multi-Generational Safety
              </span>
            </span>
          </h2>

          <div className={styles.revealMask}>
            <p
              className={`${styles.lead} ${styles.revealText}`}
              style={{ transitionDelay: "260ms" }}
            >
              Beyond comfort and beauty, our structural engineering focuses on safety where it matters most. Every bungalow and community structure is built to exceed regional seismic codes.
            </p>
          </div>
        </div>

        {/* 4 Pillars */}
        <div className={styles.pillarsGrid}>
          {ASSURANCE_PILLARS.map((p, idx) => (
            <div
              key={p.number}
              className={`${styles.pillarCard} ${styles.revealCard}`}
              style={{ transitionDelay: `${260 + idx * 80}ms` }}
            >
              <span className={styles.pillarNumber}>{p.number}</span>
              <div>
                <h3 className={styles.pillarTitle}>{p.title}</h3>
                <p className={styles.pillarText}>{p.text}</p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Banner */}
        <div
          className={`${styles.ctaBanner} ${styles.revealCard}`}
          style={{ transitionDelay: "580ms" }}
        >
          <div className={styles.ctaTextWrap}>
            <h3 className={styles.ctaTitle}>
              Verify Our Construction Quality in Person
            </h3>
            <p className={styles.ctaSubtitle}>
              Walk through an active township build with our site engineers, observe our raft foundation pours, and examine our self-healing bio-concrete firsthand.
            </p>
          </div>

          <ActionButton
            text="Schedule Site Inspection"
            href="/contact/site"
          />
        </div>
      </div>
    </section>
  );
}
