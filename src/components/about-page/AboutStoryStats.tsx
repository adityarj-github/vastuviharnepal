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
                <div className={`${styles.storyGrid} ${styles.revealItem}`}>
                    <span className={styles.smallHeading}>
                        {story.smallHeading}
                    </span>

                    <div className={styles.storyBody}>
                        <h2 id="about-story-heading" className={styles.boldHeading}>
                            {story.boldHeading}
                        </h2>
                        <div className={styles.paragraphs}>
                            {story.paragraphs.map((text) => (
                                <p key={text.slice(0, 24)} className={styles.paragraph}>
                                    {text}
                                </p>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Stats Row */}
                <div className={styles.statsGrid}>
                    {aboutSectionData.stats.map((stat, idx) => (
                        <article
                            key={stat.id}
                            className={`${styles.statCard} ${styles.revealItem}`}
                            style={{ transitionDelay: `${120 + idx * 90}ms` }}
                        >
                            <span className={styles.statValue}>
                                {stat.value}
                                {stat.suffix ?? ""}
                            </span>
                            <h3 className={styles.statLabel}>{stat.label}</h3>
                        </article>
                    ))}
                </div>

                {/* Vision & Mission */}
                <div className={styles.vmGrid}>
                    <article
                        className={`${styles.vmCardDark} ${styles.revealItem}`}
                        style={{ transitionDelay: "260ms" }}
                    >
                        <span className={styles.vmLabel}>{story.vision.label}</span>
                        <p className={styles.vmText}>{story.vision.text}</p>
                    </article>

                    <article
                        className={`${styles.vmCardLight} ${styles.revealItem}`}
                        style={{ transitionDelay: "340ms" }}
                    >
                        <span className={styles.vmLabel}>{story.mission.label}</span>
                        <p className={styles.vmText}>{story.mission.text}</p>
                    </article>
                </div>
            </div>
        </section>
    );
}