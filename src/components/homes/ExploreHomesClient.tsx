"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { ProjectItem } from "@/data/projects";
import styles from "./ExploreHomes.module.css";

interface ExploreHomesClientProps {
    projects: ProjectItem[];
}

export function ExploreHomesClient({ projects }: ExploreHomesClientProps) {
    const sectionRef = useRef<HTMLElement>(null);
    const [isVisible, setIsVisible] = useState(false);

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

    return (
        <section
            ref={sectionRef}
            className={`${styles.section} ${isVisible ? styles.visible : ""}`}
            aria-labelledby="explore-homes-heading"
        >
            <div className="container">
                {/* Heading (2 lines) + Small Description */}
                <div className={styles.header}>
                    <h2 id="explore-homes-heading" className={styles.heading}>
                        <span className={styles.revealMask}>
                            <span
                                className={`${styles.headingLine} ${styles.revealText}`}
                                style={{ transitionDelay: "0ms" }}
                            >
                                Best Residence from us
                            </span>
                        </span>
                        <span className={styles.revealMask}>
                            <span
                                className={`${styles.headingLine} ${styles.revealText}`}
                                style={{ transitionDelay: "120ms" }}
                            >
                                for you
                            </span>
                        </span>
                    </h2>

                    <div className={styles.revealMask}>
                        <p
                            className={`${styles.description} ${styles.revealText}`}
                            style={{ transitionDelay: "220ms" }}
                        >
                            Explore thoughtfully planned bungalows and villas crafted for modern
                            family living across Nepal.
                        </p>
                    </div>
                </div>

                {/* 4-Column Desktop / 2x2 Cross-Height Mobile Grid */}
                <div className={styles.grid}>
                    {projects.map((project, index) => {
                        const badgeLabel = project.modelTypes[0]?.modelName ?? "";
                        const displayIndex = String(index + 1).padStart(2, "0");

                        return (
                            <Link
                                key={project.slug}
                                href={`/models/${project.slug}`}
                                className={`${styles.card} ${styles.revealCard}`}
                                style={{ transitionDelay: `${260 + index * 110}ms` }}
                            >
                                <div className={styles.imageWrap}>
                                    {badgeLabel && (
                                        <span className={styles.badge}>{badgeLabel}</span>
                                    )}
                                    <Image
                                        src={project.gallery[0]}
                                        alt={project.name}
                                        fill
                                        sizes="(max-width: 820px) 50vw, 25vw"
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
                                    {/* <span className={styles.number}>\{displayIndex}</span> */}
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}