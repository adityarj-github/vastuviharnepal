"use client";

import { useEffect, useState, type ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "./PageHero.module.css";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface PageHeroCta {
  label: string;
  href: string;
}

export interface PageHeroProps {
  /**
   * Breadcrumbs navigation items or simple location string / array
   * Examples:
   *  - location="About Us" -> Home / About Us
   *  - location={[{ label: "Home", href: "/" }, { label: "About Us" }]}
   *  - breadcrumbs={[{ label: "Home", href: "/" }, { label: "Models", href: "/models" }, { label: "Simplex" }]}
   */
  location?: string | BreadcrumbItem[];
  breadcrumbs?: BreadcrumbItem[];

  /**
   * Full-bleed background image path (defaults to brand background)
   */
  bgImage?: string;
  bgImageAlt?: string;

  /**
   * Main heading lines
   */
  headingLine1: string;
  headingLine2?: string;

  /**
   * Optional price text below heading
   */
  price?: string;

  /**
   * Supporting description text
   */
  description?: string;

  /**
   * Optional CTA action button
   */
  cta?: PageHeroCta;

  /**
   * Additional content inside right column
   */
  children?: ReactNode;

  /**
   * Optional custom class for root section
   */
  className?: string;
}

function resolveBreadcrumbs(
  breadcrumbs?: BreadcrumbItem[],
  location?: string | BreadcrumbItem[]
): BreadcrumbItem[] {
  if (breadcrumbs && breadcrumbs.length > 0) {
    return breadcrumbs;
  }
  if (Array.isArray(location)) {
    return location;
  }
  if (typeof location === "string" && location.trim().length > 0) {
    return [
      { label: "Home", href: "/" },
      { label: location.trim() },
    ];
  }
  return [{ label: "Home", href: "/" }];
}

export function PageHero({
  location,
  breadcrumbs,
  bgImage = "/brand-bg.webp",
  bgImageAlt = "Hero background image",
  headingLine1,
  headingLine2,
  price,
  description,
  children,
  className = "",
}: PageHeroProps) {
  const [isVisible, setIsVisible] = useState(false);
  const items = resolveBreadcrumbs(breadcrumbs, location);

  useEffect(() => {
    const raf = requestAnimationFrame(() => setIsVisible(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div className={styles.wrapper}>
      <section
        className={`${styles.section} ${isVisible ? styles.visible : ""} ${className}`}
        aria-label={`${headingLine1} ${headingLine2 ?? ""}`.trim()}
      >
        {/* Full-Bleed Background Image inside rounded card */}
        <div className={styles.bgWrap} aria-hidden="true">
          <Image
            src={bgImage}
            alt={bgImageAlt}
            fill
            priority
            sizes="100vw"
            className={styles.bgImage}
          />
          {/* Subtle Top Vignette for Navbar readability */}
          <div className={styles.topVignette} />
          {/* Full-Hero Glassmorphism Layer (~3px blur) */}
          <div className={styles.glassOverlay} />
        </div>

        <div className={`container ${styles.inner}`}>
          <div className={styles.topRow}>
            <div className={styles.headingCol}>
              {/* Breadcrumb Navigation on top instead of tag line */}
              <div className={styles.revealMask}>
                <nav
                  aria-label="Breadcrumb"
                  className={`${styles.breadcrumbNav} ${styles.revealText}`}
                  style={{ transitionDelay: "0ms" }}
                >
                  <ol className={styles.breadcrumbList}>
                    {items.map((item, index) => {
                      const isLast = index === items.length - 1;
                      return (
                        <li
                          key={`${item.label}-${index}`}
                          className={styles.breadcrumbItem}
                        >
                          {index > 0 && (
                            <span className={styles.separator} aria-hidden="true">
                              /
                            </span>
                          )}
                          {isLast || !item.href ? (
                            <span
                              className={styles.current}
                              aria-current={isLast ? "page" : undefined}
                            >
                              {item.label}
                            </span>
                          ) : (
                            <Link
                              href={item.href}
                              className={styles.breadcrumbLink}
                            >
                              {item.label}
                            </Link>
                          )}
                        </li>
                      );
                    })}
                  </ol>
                </nav>
              </div>

              <h1 className={styles.heading}>
                <span className={styles.revealMask}>
                  <span
                    className={`${styles.headingLine} ${styles.revealText}`}
                    style={{ transitionDelay: "90ms" }}
                  >
                    {headingLine1}
                  </span>
                </span>
                {headingLine2 && (
                  <span className={styles.revealMask}>
                    <span
                      className={`${styles.headingLine} ${styles.revealText}`}
                      style={{ transitionDelay: "180ms" }}
                    >
                      {headingLine2}
                    </span>
                  </span>
                )}
              </h1>

              {price && (
                <div className={styles.revealMask}>
                  <p
                    className={`${styles.heroPrice} ${styles.revealText}`}
                    style={{ transitionDelay: "200ms" }}
                  >
                    {price}
                  </p>
                </div>
              )}
            </div>

            {children && <div className={styles.rightCol}>{children}</div>}
          </div>
        </div>
      </section>
    </div>
  );
}

export default PageHero;
