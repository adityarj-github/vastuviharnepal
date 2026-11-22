"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { ProjectItem } from "@/data/projects";
import styles from "./ModelsGrid.module.css";

interface ModelsGridProps {
  projects: ProjectItem[];
}

const BHK_FILTERS = ["All", "2 BHK", "3 BHK", "4 BHK", "5 BHK", "7 BHK"];

export function ModelsGrid({ projects }: ModelsGridProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("All");

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
      { threshold: 0.1 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const filteredProjects = projects.filter((project) => {
    if (selectedFilter === "All") return true;
    const modelName = project.modelTypes[0]?.modelName ?? "";
    const features = project.features.join(" ");
    return modelName.includes(selectedFilter) || features.includes(selectedFilter);
  });

  return (
    <section
      ref={sectionRef}
      className={`${styles.section} ${isVisible ? styles.visible : ""}`}
      aria-labelledby="models-grid-heading"
    >
      <div className="container">
        {/* Header & Filter Bar */}
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <div className={styles.revealMask}>
              <div
                className={`${styles.eyebrowWrap} ${styles.revealText}`}
                style={{ transitionDelay: "0ms" }}
              >
                <span className={styles.eyebrow}>Residence Portfolio</span>
              </div>
            </div>

            <h2 id="models-grid-heading" className={styles.heading}>
              <span className={styles.revealMask}>
                <span
                  className={`${styles.headingLine} ${styles.revealText}`}
                  style={{ transitionDelay: "100ms" }}
                >
                  Explore Bungalows & Villas ({filteredProjects.length})
                </span>
              </span>
            </h2>
          </div>

          {/* Filter Pills */}
          <div
            className={styles.filterBar}
            role="tablist"
            aria-label="Filter models by BHK"
          >
            {BHK_FILTERS.map((filter) => {
              const isActive = selectedFilter === filter;
              return (
                <button
                  key={filter}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  className={`${styles.filterPill} ${
                    isActive ? styles.filterPillActive : ""
                  }`}
                  onClick={() => setSelectedFilter(filter)}
                >
                  {filter}
                </button>
              );
            })}
          </div>
        </div>

        {/* Models Grid (Desktop 3 cols, Tablet 2 cols, Mobile Single Model) */}
        <div className={styles.grid}>
          {filteredProjects.map((project, idx) => {
            const firstType = project.modelTypes[0];
            const badgeLabel = firstType?.modelName ?? "";
            const stats = firstType?.stats ?? [];

            const builtup = stats.find((s) =>
              s.label.toLowerCase().includes("builtup")
            )?.value;

            const bedrooms = stats.find((s) =>
              s.label.toLowerCase().includes("bedroom")
            )?.value;

            const floors = stats.find((s) =>
              s.label.toLowerCase().includes("floor")
            )?.value;

            return (
              <article
                key={project.slug}
                className={`${styles.card} ${styles.revealCard}`}
                style={{ transitionDelay: `${120 + (idx % 3) * 80}ms` }}
              >
                <Link
                  href={`/models/${project.slug}`}
                  className={styles.cardLink}
                >
                  {/* Uniform Equal-Height Thumbnail */}
                  <div className={styles.imageWrap}>
                    {badgeLabel && (
                      <span className={styles.badge}>{badgeLabel}</span>
                    )}

                    <Image
                      src={project.gallery[0]}
                      alt={project.name}
                      fill
                      sizes="(max-width: 680px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className={styles.image}
                    />
                  </div>

                  <div className={styles.meta}>
                    <div className={styles.info}>
                      <span className={styles.price}>
                        {project.price ?? "Price on Request"}
                      </span>
                      <h3 className={styles.name}>{project.name}</h3>
                    </div>

                    <p className={styles.description}>{project.description}</p>

                    {/* Quick Specs Chips */}
                    <div className={styles.specsRow}>
                      {builtup && (
                        <span className={styles.specChip}>
                          <strong>{builtup}</strong> Sqft
                        </span>
                      )}
                      {bedrooms && (
                        <span className={styles.specChip}>
                          <strong>{bedrooms}</strong> Beds
                        </span>
                      )}
                      {floors && (
                        <span className={styles.specChip}>
                          Floors: {floors}
                        </span>
                      )}
                    </div>

                    <div className={styles.cardFooter}>
                      <span className={styles.viewDetails}>
                        Explore Model & Plans
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          width="16"
                          height="16"
                          aria-hidden="true"
                        >
                          <path d="M5 12h14" />
                          <path d="m13 6 6 6-6 6" />
                        </svg>
                      </span>
                    </div>
                  </div>
                </Link>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
