"use client";

import { useEffect, useRef, useState } from "react";
import type { JourneyMilestone } from "@/data/journey";
import styles from "./JourneySection.module.css";

interface JourneySectionClientProps {
  headingLine1: string;
  headingLine2: string;
  badgeCaption: string;
  badgeValue: string;
  badgeSuffix: string;
  footerLeft: string;
  footerRight: string;
  milestones: JourneyMilestone[];
}

const circleSizeClasses = [
  styles.circle0,
  styles.circle1,
  styles.circle2,
  styles.circle3,
  styles.circle4,
];

function SparkleIcon({ className }: { className: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M12 0 13.8 10.2 24 12 13.8 13.8 12 24 10.2 13.8 0 12 10.2 10.2 12 0Z" />
    </svg>
  );
}

function ScrollArrowIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      width="14"
      height="14"
      aria-hidden="true"
    >
      <path d="M5 12h14" />
      <path d="m13 6 6 6-6 6" />
    </svg>
  );
}

export function JourneySectionClient({
  headingLine1,
  headingLine2,
  badgeCaption,
  badgeValue,
  badgeSuffix,
  footerLeft,
  footerRight,
  milestones,
}: JourneySectionClientProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const circleRefs = useRef<(HTMLElement | null)[]>([]);

  const [isVisible, setIsVisible] = useState(false);
  const [revealedCircles, setRevealedCircles] = useState<number[]>([]);

  // 1. Observe section entering viewport (triggers water-pour bg + text reveal)
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) {
      setIsVisible(true);
      setRevealedCircles(milestones.map((_, i) => i));
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
  }, [milestones]);

  // 2. Reveal circles: all staggered on desktop, or on horizontal scroll on mobile
  useEffect(() => {
    if (!isVisible) return;

    const isMobile = window.matchMedia("(max-width: 860px)").matches;
    if (!isMobile) {
      setRevealedCircles(milestones.map((_, i) => i));
      return;
    }

    const trackEl = trackRef.current;
    if (!trackEl) return;

    const circleObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = Number(entry.target.getAttribute("data-index"));
            if (!Number.isNaN(idx)) {
              setRevealedCircles((prev) =>
                prev.includes(idx) ? prev : [...prev, idx]
              );
              circleObserver.unobserve(entry.target);
            }
          }
        });
      },
      {
        root: trackEl,
        threshold: 0.25,
      }
    );

    circleRefs.current.forEach((circleEl) => {
      if (circleEl) circleObserver.observe(circleEl);
    });

    return () => circleObserver.disconnect();
  }, [isVisible, milestones]);

  return (
    <section
      ref={sectionRef}
      className={`${styles.section} ${isVisible ? styles.visible : ""}`}
      aria-labelledby="journey-heading"
    >
      <div className="container">
        <div className={styles.card}>
          <div className={styles.layout}>
            {/* Heading */}
            <h2 id="journey-heading" className={styles.heading}>
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

            {/* Year Pill Badge (Bottom-left on desktop, same row as heading on mobile) */}
            <div
              className={`${styles.badgeBlock} ${styles.revealBadge}`}
              style={{ transitionDelay: "220ms" }}
            >
              <span className={styles.badgeCaption}>{badgeCaption}</span>
              <div className={styles.badgeRow}>
                <span className={styles.badgePill}>{badgeValue}</span>
                <span className={styles.badgeSuffix}>{badgeSuffix}</span>
              </div>
            </div>

            {/* Mobile-only Scroll Hint Tag */}
            <div className={styles.scrollTagWrap}>
              <span className={styles.scrollTag}>
                <span>Scroll</span>
                <ScrollArrowIcon />
              </span>
            </div>

            {/* Rising Hairline Circles (Horizontal on both desktop & mobile) */}
            <div ref={trackRef} className={styles.circlesTrack}>
              {milestones.map((item, index) => {
                const isLast = index === milestones.length - 1;
                const isCircleVisible = revealedCircles.includes(index);

                return (
                  <article
                    key={item.year}
                    data-index={index}
                    ref={(el) => {
                      circleRefs.current[index] = el;
                    }}
                    className={`${styles.circle} ${circleSizeClasses[index] ?? ""} ${
                      isCircleVisible ? styles.circleVisible : ""
                    }`}
                    style={{
                      transitionDelay: `${260 + index * 140}ms`,
                    }}
                  >
                    {isLast && (
                      <>
                        <SparkleIcon
                          className={`${styles.sparkle} ${styles.sparkleTopRight}`}
                        />
                        <SparkleIcon
                          className={`${styles.sparkle} ${styles.sparkleIntersect}`}
                        />
                      </>
                    )}

                    <div className={styles.circleContent}>
                      <h3 className={styles.circleYear}>{item.year}</h3>
                      <p className={styles.circleText}>{item.text}</p>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>

          {/* Hairline Footer */}
          <div className={styles.footer}>
            <span>{footerLeft}</span>
            <div className={styles.footerRightGroup}>
              <span>Nepal &amp; India</span>
              <span>{footerRight}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}