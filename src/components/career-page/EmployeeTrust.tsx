"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { StatCounter } from "@/components/home/StatCounter";
import styles from "./EmployeeTrust.module.css";

const TEAM_AVATARS = [
  { src: "/career/1.webp", pos: "25% 20%", alt: "Vastu Vihar team member" },
  { src: "/career/2.webp", pos: "30% 25%", alt: "Vastu Vihar engineer" },
  { src: "/career/3.webp", pos: "50% 20%", alt: "Vastu Vihar architect" },
  { src: "/career/4.webp", pos: "40% 20%", alt: "Vastu Vihar site lead" },
  { src: "/career/2.webp", pos: "70% 25%", alt: "Vastu Vihar planner" },
  { src: "/career/1.webp", pos: "65% 25%", alt: "Vastu Vihar advisor" },
  { src: "/career/3.webp", pos: "25% 30%", alt: "Vastu Vihar designer" },
  { src: "/career/4.webp", pos: "60% 25%", alt: "Vastu Vihar supervisor" },
];

function SparkleIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="22"
      height="22"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <path d="M12 2v20" />
      <path d="M2 12h20" />
      <path d="m4.93 4.93 14.14 14.14" />
      <path d="m19.07 4.93-14.14 14.14" />
    </svg>
  );
}

function LaurelBadge() {
  return (
    <div className={styles.laurelWrap} aria-hidden="true">
      <svg
        viewBox="0 0 120 72"
        width="104"
        height="62"
        fill="none"
        className={styles.laurelSvg}
      >
        <path
          d="M28 58C15 49 10 34 15 18M24 52c-6-8-6-18-1-27M21 43c-3-6-2-13 2-19"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
        />
        <path
          d="M92 58c13-9 18-24 13-40M96 52c6-8 6-18 1-27M99 43c3-6 2-13-2-19"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
        />
      </svg>
      <span className={styles.laurelText}>
        TRUSTED
        <br />
        EMPLOYER
        <br />
        NEPAL
      </span>
    </div>
  );
}

export function EmployeeTrust() {
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
      aria-labelledby="employee-trust-heading"
    >
      <div className="container">
        <div className={`${styles.frame} ${styles.revealItem}`}>
          {/* Left Column */}
          <div className={styles.leftCol}>
            <div className={styles.headingRow}>
              <h2 id="employee-trust-heading" className={styles.heading}>
                Trusted by
                <br />
                750+ Team
                <br />
                Members
                <br />
                Across Nepal
              </h2>
              <span className={styles.sparkle}>
                <SparkleIcon />
              </span>
            </div>

            <p className={styles.description}>
              Every township we deliver is powered by engineers, architects, and
              advisors who build long-term, rewarding careers with Vastu Vihar
              Nepal.
            </p>
          </div>

          {/* Right Cards */}
          <div className={styles.cardsGrid}>
            {/* Card 1: Light Card with 4x2 Team Grid + 750+ Employees */}
            <article
              className={`${styles.lightCard} ${styles.revealCard}`}
              style={{ transitionDelay: "120ms" }}
            >
              <div className={styles.avatarGrid}>
                {TEAM_AVATARS.map((avatar, idx) => (
                  <div
                    key={idx}
                    className={`${styles.avatarWrap} ${styles.revealAvatar}`}
                    style={{ transitionDelay: `${220 + idx * 55}ms` }}
                  >
                    <Image
                      src={avatar.src}
                      alt={avatar.alt}
                      fill
                      sizes="60px"
                      className={styles.avatarImg}
                      style={{ objectPosition: avatar.pos }}
                    />
                  </div>
                ))}
              </div>

              <div className={styles.lightCardFooter}>
                <StatCounter target={750} suffix="+" className={styles.bigStat} />
                <span className={styles.statCaption}>
                  Dedicated
                  <br />
                  Employees
                </span>
              </div>
            </article>

            {/* Card 2: Dark Card with 32+ Years of Trust + Laurel */}
            <article
              className={`${styles.darkCard} ${styles.revealCard}`}
              style={{ transitionDelay: "220ms" }}
            >
              <div className={styles.darkCardTop}>
                <div>
                  <StatCounter target={32} suffix="+" className={styles.darkStat} />
                  <span className={styles.darkStatLabel}>Years of Trust</span>
                </div>
                <LaurelBadge />
              </div>

              <p className={styles.darkCardDesc}>
                Building lasting careers through monolithic engineering,
                mentorship, and 20k+ homes delivered across 2 countries.
              </p>
            </article>

            {/* Card 3: Portrait Image Card */}
            <div
              className={`${styles.photoCard} ${styles.revealCard}`}
              style={{ transitionDelay: "320ms" }}
            >
              <Image
                src="/career/4.webp"
                alt="Vastu Vihar Nepal team member on site"
                fill
                sizes="(max-width: 900px) 100vw, 220px"
                className={styles.photoImg}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
