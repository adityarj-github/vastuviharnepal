
"use client";

import TiltedCard from "@/components/animation/TiltedCard";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { ModelCardImage } from "../models-page/ModelCardImage";
import { ActionButton, IconButton } from "@/components/buttons";
import { motionScrollBehavior } from "@/components/animation/motionPreference";
import type { ProjectItem } from "@/data/projects";
import { ExploreHomesShowcase, ModelExploreButton, ShowcaseArrow } from "./ExploreHomesShowcase";
import styles from "./ExploreHomes.module.css";

interface ExploreHomesClientProps {
    projects: ProjectItem[];
}

export function ExploreHomesClient({ projects }: ExploreHomesClientProps) {
    const sectionRef = useRef<HTMLElement>(null);
    const gridRef = useRef<HTMLDivElement>(null);
    const [isVisible, setIsVisible] = useState(false);

    const [railIndex, setRailIndex] = useState(0);

    function scrollModels(direction?: -1 | 1) {
        const grid = gridRef.current;
        const first = grid?.children[0] as HTMLElement | undefined;
        const second = grid?.children[1] as HTMLElement | undefined;
        if (!grid || !first || !second) return;

        const step = second.offsetLeft - first.offsetLeft;
        if (step <= 0) return;

        const index = Math.round(grid.scrollLeft / step);
        if (direction === undefined) {
            setRailIndex(index);
        } else {
            grid.scrollTo({ left: (index + direction) * step, behavior: motionScrollBehavior() });
        }
    }


    useLayoutEffect(() => {
        const grid = gridRef.current;
        if (!grid) return;
        const mobile = window.matchMedia("(max-width: 820px)");

        function centerInitialModel() {
            if (!mobile.matches || !grid || grid.scrollLeft > 1) return;
            const first = grid.children[0] as HTMLElement | undefined;
            const second = grid.children[1] as HTMLElement | undefined;
            if (!first || !second) return;

            const index = Math.min(2, grid.childElementCount - 1);
            grid.scrollLeft = index * (second.offsetLeft - first.offsetLeft);
            setRailIndex(index);
        }

        centerInitialModel();
        mobile.addEventListener("change", centerInitialModel);
        return () => mobile.removeEventListener("change", centerInitialModel);
    }, [projects.length]);

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

    useEffect(() => {
        const section = sectionRef.current;
        const rail = gridRef.current;
        const stage = section?.querySelector<HTMLElement>("#home-model-showcase");
        const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
        if (!section || !rail || reduceMotion.matches ||
            !("IntersectionObserver" in window) || !Element.prototype.animate) return;

        const rows = stage ? [rail, stage] : [rail];
        const animations = new Set<Animation>();
        const timing = { easing: "cubic-bezier(.22, 1, .36, 1)", fill: "backwards" } as const;

        function cancelAnimations() {
            animations.forEach((animation) => animation.cancel());
            animations.clear();
        }

        function track(animation: Animation) {
            animations.add(animation);
            animation.onfinish = animation.oncancel = () => { animations.delete(animation); };
        }

        const observer = new IntersectionObserver((entries) => {
            for (const { target, intersectionRatio } of entries) {
                if (intersectionRatio < .35) continue;
                observer.unobserve(target);
                target.removeAttribute("data-model-intro-pending");

                const center = target.querySelector<HTMLElement>(
                    target === rail ? '[data-rail-side="active"]' : '[data-slot="0"]'
                );
                if (!center || reduceMotion.matches || target.contains(document.activeElement)) continue;

                const centerBox = center.getBoundingClientRect();
                const neighbors = target === rail
                    ? [center.previousElementSibling, center.nextElementSibling]
                    : Array.from(target.children).filter((card) => card !== center);

                // Read every position before starting any animation.
                const sides = neighbors.flatMap((card) => {
                    if (!card) return [];
                    const box = card.getBoundingClientRect();
                    const offset = (centerBox.left + centerBox.right - box.left - box.right) / 2;
                    return [{ card, offset }];
                });

                track(center.animate([
                    { opacity: 0, scale: ".9", translate: "0 14px" },
                    { opacity: 1, scale: "1", translate: "0 0" },
                ], { ...timing, id: "home-model-center", duration: 400 }));

                for (const { card, offset } of sides) {
                    track(card.animate([
                        { opacity: 0, translate: `${offset}px 0`, scale: ".88" },
                        { opacity: 1, translate: "0 0", scale: "1" },
                    ], { ...timing, id: "home-model-side", duration: 620, delay: 400 }));
                }
            }
        }, { threshold: .35 });

        rows.forEach((row) => {
            const bounds = row.getBoundingClientRect();
            if (bounds.top >= window.innerHeight || bounds.width === 0) {
                row.setAttribute("data-model-intro-pending", "");
            }
            observer.observe(row);
        });

        const clearPending = () => rows.forEach((row) => row.removeAttribute("data-model-intro-pending"));
        const onPreferenceChange = () => {
            if (!reduceMotion.matches) return;
            observer.disconnect();
            cancelAnimations();
            clearPending();
        };

        section.addEventListener("pointerdown", cancelAnimations, { passive: true });
        section.addEventListener("focusin", cancelAnimations);
        reduceMotion.addEventListener("change", onPreferenceChange);
        return () => {
            observer.disconnect();
            section.removeEventListener("pointerdown", cancelAnimations);
            section.removeEventListener("focusin", cancelAnimations);
            reduceMotion.removeEventListener("change", onPreferenceChange);
            cancelAnimations();
            clearPending();
        };
    }, []);

    return (
        <section
            ref={sectionRef} data-site-motion="off"
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
                <ExploreHomesShowcase projects={projects} />
                <div className={styles.compactModels}>
                    <div
                        ref={gridRef}
                        id="compact-home-models"
                        className={styles.grid}
                        role="region"
                        aria-label="Browse home models"
                        onScroll={() => scrollModels()}
                    >
                        {projects.map((project, index) => {
                            const badgeLabel =
                                project.modelTypes[0]?.modelName ?? "";

                            return (
                                <article
                                    key={project.slug}
                                    data-rail-side={index === railIndex ? "active" : index < railIndex ? "before" : "after"}
                                    className={styles.card}
                                >
                                    <TiltedCard
                                        containerWidth="100%"
                                        containerHeight="100%"
                                        imageWidth="100%"
                                        imageHeight="100%"
                                        radius={26}
                                        rotateAmplitude={10}
                                        scaleOnHover={1.03}
                                        glare={0}
                                        shadow={0}
                                        showTooltip={false}
                                        intro={false}
                                        className={styles.tiltedCard}
                                    >
                                        <div className={styles.cardInner}>
                                            <div className={styles.meta}>
                                                <div className={styles.headerRow}>
                                                    <h3 className={styles.name}>
                                                        {project.name}
                                                    </h3>
                                                    <span className={styles.price}>
                                                        {project.price ?? "Price on Request"}
                                                    </span>
                                                </div>
                                                <ModelExploreButton project={project} />
                                            </div>

                                            <ModelCardImage
                                              src={project.gallery[0]}
                                              alt={project.name}
                                              sizes="(max-width: 565px) 67vw, (max-width: 820px) 368px, 512px"
                                              className={styles.imageWrap}
                                              imageClassName={styles.image}
                                            >
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
                                            </ModelCardImage>
                                        </div>
                                    </TiltedCard>
                                </article>
                            );
                        })}
                    </div>
                    {projects.length > 1 && (
                        <div className={styles.railControls}>
                            <IconButton
                                ariaLabel="Previous model"
                                aria-controls="compact-home-models"
                                icon={<ShowcaseArrow previous />}
                                disabled={railIndex <= 0}
                                onClick={() => scrollModels(-1)}
                            />
                            <ActionButton className={styles.railExplore} text="Explore Models" href="/models" />
                            <IconButton
                                ariaLabel="Next model"
                                aria-controls="compact-home-models"
                                icon={<ShowcaseArrow />}
                                disabled={railIndex >= projects.length - 1}
                                onClick={() => scrollModels(1)}
                            />
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}
