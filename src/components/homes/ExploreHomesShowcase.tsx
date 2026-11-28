"use client";

import { useState, type CSSProperties } from "react";
import TiltedCard from "@/components/animation/TiltedCard";
import { ActionButton, IconButton } from "@/components/buttons";
import type { ProjectItem } from "@/data/projects";
import { ModelCardImage } from "../models-page/ModelCardImage";
import styles from "./ExploreHomes.module.css";

export function ShowcaseArrow({ previous = false }: { previous?: boolean }) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={previous ? "M19 12H5m6-6-6 6 6 6" : "M5 12h14m-6-6 6 6-6 6"} />
    </svg>
  );
}

export function ModelExploreButton({ project }: { project: ProjectItem }) {
  return (
    <IconButton
      className={styles.modelArrow}
      ariaLabel={`Explore ${project.name}`}
      href={`/models/${project.slug}`}
      icon={<ShowcaseArrow />}
    />
  );
}

export function ExploreHomesShowcase({ projects }: { projects: ProjectItem[] }) {
  const count = projects.length;
  const visibleCount = Math.min(count, 5);
  const middle = Math.floor(visibleCount / 2);
  const [active, setActive] = useState(middle);

  if (!count) return null;

  const wrap = (index: number) => (index + count) % count;
  const current = wrap(active);

  return (
    <div className={styles.showcase}>
      <div className={styles.stage} id="home-model-showcase">
        {Array.from({ length: visibleCount }, (_, index) => {
          const offset = index - middle;
          const depth = Math.abs(offset);
          const project = projects[wrap(current + offset)];
          const label = project.modelTypes[0]?.modelName;

          return (
            <article
              className={styles.showcaseCard}
              key={project.slug}
              data-slot={offset}
              style={{ "--slot": offset, "--scale": 1 - depth * 0.06, "--layer": 3 - depth } as CSSProperties}
            >
              <TiltedCard
                containerWidth="100%" containerHeight="100%"
                imageWidth="100%" imageHeight="100%" radius={22}
                rotateAmplitude={6} scaleOnHover={1.015} glare={0} shadow={0}
                showTooltip={false} intro={false} className={styles.tiltedCard}
              >
                <div className={styles.showcaseFace}>
                  <ModelCardImage
                    src={project.gallery[0]} alt={project.name}
                    sizes="(max-width: 1900px) 24vw, 448px"
                    className={styles.showcasePhoto} imageClassName={styles.image}
                  />
                  {label && <span className={styles.badge}>{label}</span>}
                  <div className={styles.showcaseDetails}>
                    <div className={styles.cardTitle}>
                      <h3 className={styles.name}>{project.name}</h3>
                      <span className={styles.price}>{project.price ?? "Price on Request"}</span>
                    </div>
                    <ModelExploreButton project={project} />
                  </div>
                </div>
              </TiltedCard>
            </article>
          );
        })}
      </div>

      <div className={styles.showcaseControls}>
        {count > 1 && (
          <IconButton
            className={styles.showcaseArrow}
            ariaLabel="Previous model"
            aria-controls="home-model-showcase"
            icon={<ShowcaseArrow previous />}
            onClick={() => setActive((index) => wrap(index - 1))}
          />
        )}
        <ActionButton text="Explore Models" href="/models" />
        {count > 1 && (
          <IconButton
            className={styles.showcaseArrow}
            ariaLabel="Next model"
            aria-controls="home-model-showcase"
            icon={<ShowcaseArrow />}
            onClick={() => setActive((index) => wrap(index + 1))}
          />
        )}
      </div>
      <p className="sr-only" aria-live="polite">{projects[current].name}, model {current + 1} of {count}</p>
    </div>
  );
}
