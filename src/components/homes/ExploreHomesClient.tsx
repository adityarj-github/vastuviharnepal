
"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ActionButton } from "@/components/buttons/ActionButton";
import TiltedCard from "@/components/animation/TiltedCard";
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
            {/* Background Image */}
            {/* <div className={styles.background} aria-hidden="true">
                <Image
                    src="/home-bg.jpeg"
                    alt=""
                    fill
                    sizes="100vw"
                    className={styles.backgroundImage}
                />
            </div> */}

            {/* Combined Dark + Blur + Fade Overlay */}
            {/* <div
                className={styles.backgroundOverlay}
                aria-hidden="true"
            /> */}

            {/* Hidden image attribution */}
            <a
                href="https://www.magnific.com/free-ai-image/aerial-view-city_72622054.htm"
                rel="nofollow"
                aria-hidden="true"
                tabIndex={-1}
                style={{ display: "none" }}
            >
                Image by magnific
            </a>

            {/* Main Content */}
            <div className={`container ${styles.content}`}>
                {/* Heading + Description + Explore Button */}
                <div className={styles.header}>
                    <div className={styles.headerLeft}>
                        <h2
                            id="explore-homes-heading"
                            className={styles.heading}
                        >
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

                        <div className={styles.buttonReveal}>
                            <ActionButton
                                text="Explore Models"
                                href="/models"
                            />
                        </div>
                    </div>
                </div>

                {/* Project Grid */}
                <div className={styles.grid}>
                    {projects.map((project, index) => {
                        const badgeLabel =
                            project.modelTypes[0]?.modelName ?? "";

                        return (
                            <Link
                                key={project.slug}
                                href={`/models/${project.slug}`}
                                className={`${styles.card} ${styles.revealCard}`}
                                style={{
                                    transitionDelay: `${260 + index * 110}ms`,
                                }}
                            >
                                <TiltedCard
                                    containerWidth="100%"
                                    containerHeight="100%"
                                    imageWidth="100%"
                                    imageHeight="100%"
                                    radius={26}
                                    rotateAmplitude={10}
                                    scaleOnHover={1.03}
                                    glare={1}
                                    glareColor="#d8e0ea"
                                    shadow={0}
                                    showTooltip={false}
                                    intro={false}
                                    className={styles.tiltedCard}
                                >
                                    <div className={styles.cardInner}>
                                        <div className={styles.imageWrap}>
                                            {badgeLabel && (
                                                <span className={styles.badge}>
                                                    <svg
                                                        className={styles.badgeIcon}
                                                        viewBox="0 0 24 24"
                                                        width="15"
                                                        height="15"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        strokeWidth="1.9"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        aria-hidden="true"
                                                    >
                                                        <path d="M3 10.5 12 3l9 7.5" />
                                                        <path d="M5 9.5V19a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V9.5" />
                                                        <path d="M9.5 21v-6a2.5 2.5 0 0 1 5 0v6" />
                                                    </svg>
                                                    <span>{badgeLabel}</span>
                                                </span>
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
                                            <div className={styles.headerRow}>
                                                <h3 className={styles.name}>
                                                    {project.name}
                                                </h3>
                                                <span className={styles.price}>
                                                    {project.price ?? "Price on Request"}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </TiltedCard>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
