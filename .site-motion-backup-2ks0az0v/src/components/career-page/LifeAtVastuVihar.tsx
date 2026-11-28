"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import styles from "./LifeAtVastuVihar.module.css";

function TeamIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="30"
      height="30"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="7" r="3" />
      <path d="M7.5 20v-1.5a4.5 4.5 0 0 1 9 0V20" />
      <circle cx="5.5" cy="9.5" r="2.2" />
      <path d="M2 20v-1a3.5 3.5 0 0 1 4.5-3.35" />
      <circle cx="18.5" cy="9.5" r="2.2" />
      <path d="M22 20v-1a3.5 3.5 0 0 0-4.5-3.35" />
    </svg>
  );
}

function GrowthIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="30"
      height="30"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M4 20v-4" />
      <path d="M9 20v-7" />
      <path d="M14 20v-10" />
      <path d="M19 20V7" />
      <path d="M4 12 10 7l4 3 6-6" />
      <path d="M16 4h4v4" />
    </svg>
  );
}

function BalanceIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="30"
      height="30"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 3v18" />
      <path d="M8 21h8" />
      <path d="M4 7h16" />
      <path d="M4 7 2 13h4L4 7Z" />
      <path d="M20 7l-2 6h4l-2-6Z" />
      <path d="M2 13a2 2 0 0 0 4 0" />
      <path d="M18 13a2 2 0 0 0 4 0" />
    </svg>
  );
}

function PurposeIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="30"
      height="30"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="9" r="6" />
      <path d="m12 6 1 2 2.2.3-1.6 1.5.4 2.2-2-1.1-2 1.1.4-2.2-1.6-1.5L11 8l1-2Z" />
      <path d="M8.5 14.2 7 21l5-2.5L17 21l-1.5-6.8" />
    </svg>
  );
}

const HIGHLIGHTS = [
  {
    id: "collaborative-teams",
    title: "Collaborative Teams",
    description: "Work with passionate and skilled people.",
    Icon: TeamIcon,
  },
  {
    id: "growth-opportunities",
    title: "Growth Opportunities",
    description: "Learn, lead and advance your career.",
    Icon: GrowthIcon,
  },
  {
    id: "work-life-balance",
    title: "Work-Life Balance",
    description: "Flexible, inclusive and people-first environment.",
    Icon: BalanceIcon,
  },
  {
    id: "purpose-driven-work",
    title: "Purpose-Driven Work",
    description: "Contribute to meaningful and lasting impact.",
    Icon: PurposeIcon,
  },
];

export function LifeAtVastuVihar() {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const id = requestAnimationFrame(() => setIsVisible(true));
      return () => cancelAnimationFrame(id);
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className={`${styles.section} ${isVisible ? styles.visible : ""}`}
      aria-labelledby="life-at-vastu-vihar-heading"
    >
      <div className="container">
        {/* Top Split: Left Intro + Right 3-Image Collage */}
        <div className={styles.topGrid}>
          <div className={`${styles.introCol} ${styles.revealItem}`}>

            <h2 id="life-at-vastu-vihar-heading" className={styles.heading}>
              Life at
              <br />
              Vastu Vihar
            </h2>

            <p className={styles.description}>
              More than a workplace, Vastu Vihar is a community of creators,
              planners and problem-solvers, working together to build better
              living for tomorrow.
            </p>
          </div>

          <div
            className={`${styles.collage} ${styles.revealItem}`}
            style={{ transitionDelay: "120ms" }}
          >
            <div className={`${styles.photoCard} ${styles.photoLarge}`}>
              <Image
                src="/career/1.webp"
                alt="Vastu Vihar Nepal team collaborating in the studio"
                fill
                sizes="(max-width: 900px) 100vw, 38vw"
                className={styles.photo}
              />
            </div>

            <div className={`${styles.photoCard} ${styles.photoTopRight}`}>
              <Image
                src="/career/2.webp"
                alt="Engineers and architects reviewing plans together"
                fill
                sizes="(max-width: 900px) 50vw, 24vw"
                className={styles.photo}
              />
            </div>

            <div className={`${styles.photoCard} ${styles.photoBottomRight}`}>
              <Image
                src="/career/3.webp"
                alt="Team culture and workspace at Vastu Vihar Nepal"
                fill
                sizes="(max-width: 900px) 50vw, 24vw"
                className={styles.photo}
              />
            </div>
          </div>
        </div>

        {/* Bottom 4-Column Highlights */}
        <div className={styles.highlightsGrid}>
          {HIGHLIGHTS.map(({ id, title, description, Icon }, idx) => (
            <div
              key={id}
              className={`${styles.highlightItem} ${styles.revealItem}`}
              style={{ transitionDelay: `${180 + idx * 70}ms` }}
            >
              <span className={styles.highlightIcon}>
                <Icon />
              </span>
              <div className={styles.highlightText}>
                <h3 className={styles.highlightTitle}>{title}</h3>
                <p className={styles.highlightDesc}>{description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
