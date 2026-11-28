"use client";

import { motionInterval, motionScrollBehavior } from "@/components/animation/motionPreference";
import { useCallback, useEffect, useRef, useState } from "react";
import type { TestimonialsSectionData } from "@/data/testimonials";
import styles from "./TestimonialsSection.module.css";

function ChevronLeftIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      width="18"
      height="18"
      aria-hidden="true"
    >
      <path d="m15 18-6-6 6-6" />
    </svg>
  );
}

function ChevronRightIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      width="18"
      height="18"
      aria-hidden="true"
    >
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}

export function TestimonialsSectionClient({
  headingLine1,
  headingLine2,
  description,
  testimonials,
}: TestimonialsSectionData) {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  const [isVisible, setIsVisible] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  // Scroll-reveal observer
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

  // Scroll by one card width + gap (with wrap-around)
  const scrollByCard = useCallback((direction: "prev" | "next") => {
    const track = trackRef.current;
    if (!track) return;

    const firstCard = track.firstElementChild as HTMLElement | null;
    if (!firstCard) return;

    const gap = parseFloat(window.getComputedStyle(track).gap || "0");
    const step = firstCard.offsetWidth + gap;
    const maxScroll = track.scrollWidth - track.clientWidth;

    if (direction === "next") {
      if (track.scrollLeft >= maxScroll - 8) {
        track.scrollTo({ left: 0, behavior: motionScrollBehavior() });
      } else {
        track.scrollBy({ left: step, behavior: motionScrollBehavior() });
      }
    } else {
      if (track.scrollLeft <= 8) {
        track.scrollTo({ left: maxScroll, behavior: motionScrollBehavior() });
      } else {
        track.scrollBy({ left: -step, behavior: motionScrollBehavior() });
      }
    }
  }, []);

  // Auto-scroll every 4s when visible and not paused
  useEffect(() => {
    if (!isVisible || isPaused) return;

    return motionInterval(() => scrollByCard("next"), 2000);
  }, [isVisible, isPaused, scrollByCard]);

  return (
    <section
      ref={sectionRef} data-site-motion="off"
      className={`${styles.section} ${isVisible ? styles.visible : ""}`}
      aria-labelledby="testimonials-heading"
    >
      <div className="container">
        {/* Heading + Description */}
        <div className={styles.header}>
          <h2 id="testimonials-heading" className={styles.heading}>
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
              style={{ transitionDelay: "220ms" }}
            >
              {description}
            </p>
          </div>
        </div>

        {/* Auto-Scrolling Carousel + Controls */}
        <div
          className={styles.revealTrack}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={() => setIsPaused(true)}
          onTouchEnd={() => setIsPaused(false)}
        >
          <div ref={trackRef} className={styles.track}>
            {testimonials.map((item) => {
              const initial = item.name.trim().charAt(0).toUpperCase();

              return (
                <article key={item.id} className={styles.card}>
                  <blockquote className={styles.quote}>
                    &ldquo;{item.quote}&rdquo;
                  </blockquote>

                  <div className={styles.author}>
                    <span className={styles.avatar} aria-hidden="true">
                      {initial}
                    </span>
                    <div className={styles.authorMeta}>
                      <span className={styles.name}>{item.name}</span>
                      <span className={styles.model}>
                        {item.modelPurchased}
                      </span>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

          <div className={styles.controls}>
            <button
              type="button"
              onClick={() => scrollByCard("prev")}
              className={styles.navBtn}
              aria-label="Previous testimonial"
            >
              <ChevronLeftIcon />
            </button>
            <button
              type="button"
              onClick={() => scrollByCard("next")}
              className={styles.navBtn}
              aria-label="Next testimonial"
            >
              <ChevronRightIcon />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}