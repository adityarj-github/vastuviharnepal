"use client";

import { useEffect, useRef, useState } from "react";
import { aboutPageData, aboutSectionData } from "@/data/about";
import styles from "./AboutStoryStats.module.css";

export function AboutStoryStats() {
    const { story } = aboutPageData;
    const sectionRef = useRef<HTMLElement>(null);
    const [isVisible, setIsVisible] = useState(false);

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
            { threshold: 0.12 }
        );

        observer.observe(el);
        return () => observer.disconnect();
    }, []);

    return (
        <section
            ref={sectionRef}
            className={`${styles.section} ${isVisible ? styles.visible : ""}`}
            aria-labelledby="about-story-heading"
        >
            <div className="container">
                {/* Header: Eyebrow + Bold Heading (without tab background) */}
                <div className={`${styles.header} ${styles.revealItem}`}>
                    <span className={styles.eyebrow}>{story.smallHeading}</span>
                    <h2 id="about-story-heading" className={styles.heading}>
                        {story.boldHeading}
                    </h2>
                </div>

                {/* 2-Column Content: Text (Left) | Stats (Right) */}
                <div className={styles.contentSplit}>
                    {/* Left: Vertically Stacked Paragraphs */}
                    <div className={`${styles.paragraphsCol} ${styles.revealItem}`} style={{ transitionDelay: "150ms" }}>
                        {story.paragraphs.map((text, idx) => (
                            <p key={idx} className={styles.paragraph}>
                                {text}
                            </p>
                        ))}
                    </div>

                    {/* Right: Stats 2x2 Grid */}
                    <div className={styles.statsGrid}>
                        {aboutSectionData.stats.map((stat, idx) => (
                            <article
                                key={stat.id}
                                className={`${styles.statCard} ${styles.revealItem}`}
                                style={{ transitionDelay: `${200 + idx * 80}ms` }}
                            >
                                <span className={styles.statValue}>
                                    {stat.value}
                                    {stat.suffix ?? ""}
                                </span>
                                <h3 className={styles.statLabel}>{stat.label}</h3>
                            </article>
                        ))}
                    </div>
                </div>

                {/* Vision & Mission */}
                <div className={styles.vmGrid}>
                    <article
                        className={`${styles.vmCardDark} ${styles.revealItem}`}
                        style={{ transitionDelay: "380ms" }}
                    >
                        <span className={styles.vmLabel}>{story.vision.label}</span>
                        <p className={styles.vmText}>{story.vision.text}</p>
                    </article>

                    <article
                        className={`${styles.vmCardLight} ${styles.revealItem}`}
                        style={{ transitionDelay: "460ms" }}
                    >
                        <span className={styles.vmLabel}>{story.mission.label}</span>
                        <p className={styles.vmText}>{story.mission.text}</p>
                    </article>
                </div>
            </div>
        </section>
    );
}
