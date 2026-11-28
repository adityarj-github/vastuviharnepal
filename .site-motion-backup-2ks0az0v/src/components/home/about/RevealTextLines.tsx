"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./AboutSection.module.css";

interface RevealTextLinesProps {
  lines: string[];
}

export function RevealTextLines({ lines }: RevealTextLinesProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
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
      { threshold: 0.25 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} className={styles.descriptionWrap}>
      {lines.map((line, index) => (
        <div key={index} className={styles.revealMask}>
          <p
            className={`${styles.description} ${
              index > 0 ? styles.descriptionMuted : ""
            } ${styles.revealLine} ${isVisible ? styles.revealLineVisible : ""}`}
            style={{ transitionDelay: `${index * 130}ms` }}
          >
            {line}
          </p>
        </div>
      ))}
    </div>
  );
}