"use client";

import { useEffect, useRef, useState } from "react";
import { ModelCardImage } from "./ModelCardImage";
import Link from "next/link";
import type { ProjectItem } from "@/data/projects";
import styles from "./ModelsGrid.module.css";

interface ModelsGridProps {
  projects: ProjectItem[];
}

const BHK_FILTERS = ["All", "2 BHK", "3 BHK", "4 BHK", "5 BHK", "7 BHK"];

export function ModelsGrid({ projects }: ModelsGridProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const [isGridVisible, setIsGridVisible] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("All");

  useEffect(() => {
    const section = sectionRef.current;
    const grid = gridRef.current;
    if (!section || !grid) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setIsVisible(true);
      setIsGridVisible(true);
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        if (entry.target === grid) setIsGridVisible(true);
        else setIsVisible(true);
        observer.unobserve(entry.target);
      }
    }, { threshold: 0.1 });

    observer.observe(section);
    observer.observe(grid);
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
      ref={sectionRef} data-site-motion="off"
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
                  className={`${styles.filterPill} ${isActive ? styles.filterPillActive : ""
                    }`}
                  onClick={() => setSelectedFilter(filter)}
                >
                  {filter}
                </button>
              );
            })}
          </div>
        </div>

        <div
          ref={gridRef}
          className={[
            styles.grid,
            filteredProjects.length === 7 && styles.puzzle,
            isGridVisible && styles.puzzleReady,
          ].filter(Boolean).join(" ")}
        >
          {filteredProjects.map((project, idx) => {
            const firstType = project.modelTypes[0];
            const badgeLabel = firstType?.modelName ?? "";

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
                  <div className={styles.cardInner}>
                    <div className={styles.meta}>
                      <div className={styles.headerRow}>
                        <div className={styles.info}>
                          <h3 className={styles.name}>{project.name}</h3>
                          <span className={styles.price}>
                            {project.price ?? "Price on Request"}
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

                    <ModelCardImage
                      src={project.gallery[0]}
                      alt={project.name}
                      sizes="(max-width: 680px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className={styles.imageWrap}
                    >
                      {badgeLabel && (
                        <span className={styles.badge}>{badgeLabel}</span>
                      )}
                    </ModelCardImage>
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
