"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import TiltedCard from "@/components/animation/TiltedCard";
import { projectsList, type ProjectItem } from "@/data/projects";
import styles from "./OtherModelsCarousel.module.css";

interface OtherModelsCarouselProps {
  currentSlug?: string;
  title?: string;
  subtitle?: string;
}

export function OtherModelsCarousel({
  currentSlug,
  title = "Other Models to Explore",
  subtitle = "Discover alternative layout plans, duplex bungalows, and customizable spaces across Nepal.",
}: OtherModelsCarouselProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);

  // Filter out the current model if a slug is provided
  const relevantProjects = currentSlug
    ? projectsList.filter((p) => p.slug !== currentSlug)
    : projectsList;

  const scrollNext = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    const card = el.firstElementChild as HTMLElement | null;
    const scrollAmount = card ? card.offsetWidth + 24 : 340;

    if (el.scrollLeft + el.clientWidth >= el.scrollWidth - 15) {
      el.scrollTo({ left: 0, behavior: "smooth" });
    } else {
      el.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  }, []);

  const scrollPrev = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    const card = el.firstElementChild as HTMLElement | null;
    const scrollAmount = card ? card.offsetWidth + 24 : 340;

    if (el.scrollLeft <= 15) {
      el.scrollTo({ left: el.scrollWidth, behavior: "smooth" });
    } else {
      el.scrollBy({ left: -scrollAmount, behavior: "smooth" });
    }
  }, []);

  // Autoscroll interval
  useEffect(() => {
    if (isPaused) return;

    const timer = setInterval(() => {
      scrollNext();
    }, 3800);

    return () => clearInterval(timer);
  }, [isPaused, scrollNext]);

  return (
    <section
      className={styles.section}
      aria-labelledby="other-models-heading"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={() => setIsPaused(true)}
      onTouchEnd={() => setIsPaused(false)}
    >
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <div className={styles.eyebrowWrap}>
            <span>Residence Collection</span>
          </div>
          <h2 id="other-models-heading" className={styles.heading}>
            {title}
          </h2>
          {subtitle && <p className={styles.subheading}>{subtitle}</p>}
        </div>

        {/* Carousel Navigation Buttons */}
        <div className={styles.navControls}>
          <button
            type="button"
            className={styles.navBtn}
            onClick={scrollPrev}
            aria-label="Previous model"
          >
            <svg
              viewBox="0 0 24 24"
              width="20"
              height="20"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="m15 18-6-6 6-6" />
            </svg>
          </button>

          <button
            type="button"
            className={styles.navBtn}
            onClick={scrollNext}
            aria-label="Next model"
          >
            <svg
              viewBox="0 0 24 24"
              width="20"
              height="20"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="m9 18 6-6-6-6" />
            </svg>
          </button>
        </div>
      </div>

      {/* Horizontal Scroll Track */}
      <div className={styles.trackContainer}>
        <div ref={trackRef} className={styles.track} role="region" aria-label="Other bungalow models carousel">
          {relevantProjects.map((item) => {
            const modelType = item.modelTypes[0];
            const badge = modelType?.modelName ?? "Bungalow";
            const thumbnail = item.gallery[0] ?? "/simplex/model-simplex-wide.webp";

            const areaStat = modelType?.stats.find((s) =>
              /builtup/i.test(s.label)
            );
            const bedsStat = modelType?.stats.find((s) =>
              /bedroom/i.test(s.label)
            );
            const floorsStat = modelType?.stats.find((s) =>
              /floor/i.test(s.label)
            );

            return (
              <div key={item.slug} className={styles.card}>
                <Link
                  href={`/models/${item.slug}`}
                  className={styles.cardLink}
                  aria-label={`View ${item.name}`}
                >
                  <TiltedCard
                    containerWidth="100%"
                    containerHeight="100%"
                    imageWidth="100%"
                    imageHeight="100%"
                    radius={24}
                    rotateAmplitude={10}
                    scaleOnHover={1.03}
                    glare={1}
                    glareColor="#d8e0ea"
                    shadow={0}
                    captionText={item.name}
                    showTooltip={true}
                    intro={false}
                    className={styles.tiltedCard}
                  >
                    <div className={styles.cardInner}>
                      <div className={styles.imageWrap}>
                        <span className={styles.badge}>{badge}</span>
                        <Image
                          src={thumbnail}
                          alt={item.name}
                          fill
                          sizes="(max-width: 768px) 85vw, 340px"
                          className={styles.image}
                        />
                      </div>

                      <div className={styles.cardBody}>
                        <div className={styles.headerRow}>
                          <div className={styles.info}>
                            <h3 className={styles.title}>{item.name}</h3>
                            <span className={styles.price}>
                              {item.price ?? "Pricing on Request"}
                            </span>
                          </div>

                          <span className={styles.arrowCircle} aria-hidden="true">
                            <svg
                              viewBox="0 0 24 24"
                              width="16"
                              height="16"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M7 17 17 7" />
                              <path d="M7 7h10v10" />
                            </svg>
                          </span>
                        </div>
                      </div>
                    </div>
                  </TiltedCard>
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
