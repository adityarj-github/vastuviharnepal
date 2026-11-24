"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ActionButton } from "@/components/buttons";
import type { BlogPost } from "@/data/blog";
import styles from "./BlogPage.module.css";

interface BlogPageClientProps {
  allPosts: BlogPost[];
  categories: string[];
}

export function BlogPageClient({ allPosts, categories }: BlogPageClientProps) {
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredPosts =
    activeCategory === "All"
      ? allPosts
      : allPosts.filter((post) => post.category === activeCategory);

  return (
    <div className={styles.page}>
      <section className={styles.section} aria-labelledby="blog-heading">
        <div className="container">
          {/* Header & Filter Bar (Matches ModelsGrid) */}
          <div className={styles.header}>
            <div className={styles.headerLeft}>
              <div className={styles.eyebrowWrap}>
                <span className={styles.dot} />
                <span>Editorial &amp; Insights</span>
              </div>

              <h2 id="blog-heading" className={styles.heading}>
                Explore Articles ({filteredPosts.length})
              </h2>
            </div>

            {/* Filter Pills */}
            <div
              className={styles.filterBar}
              role="tablist"
              aria-label="Filter articles by category"
            >
              {categories.map((cat) => {
                const isActive = activeCategory === cat;
                return (
                  <button
                    key={cat}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    className={`${styles.filterPill} ${isActive ? styles.filterPillActive : ""
                      }`}
                    onClick={() => setActiveCategory(cat)}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Articles Grid */}
          <div className={styles.grid}>
            {filteredPosts.map((post) => (
              <article key={post.id} className={styles.card}>
                <Link
                  href={`/blog/${post.slug}`}
                  className={styles.cardLink}
                  aria-label={`Read article: ${post.title}`}
                >
                  <div className={styles.imageWrap}>
                    <span className={styles.badge}>{post.category}</span>
                    <Image
                      src={post.coverImage}
                      alt={post.coverImageAlt}
                      fill
                      sizes="(max-width: 680px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className={styles.image}
                    />
                  </div>

                  <div className={styles.meta}>
                    <div className={styles.headerRow}>
                      <div className={styles.info}>
                        <h3 className={styles.name}>{post.title}</h3>
                        <span className={styles.date}>{post.publishedDate}</span>
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
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom Advisory Banner with Outer Margin (Matches PageHero & Footer) */}
      <div className={styles.bottomCtaWrapper}>
        <section className={styles.bottomCtaCard} aria-label="Consultation callout">
          <div className={styles.bottomCtaInner}>
            <span className={styles.ctaEyebrow}>Have Questions About Home Construction?</span>
            <h2 className={styles.ctaHeading}>Experience Monolithic Living Firsthand</h2>
            <p className={styles.ctaDesc}>
              Book a guided private site tour at our Birtamode or Birgunj township developments, or speak directly with our structural engineering advisors.
            </p>
            <ActionButton text="Schedule a Site Visit" href="/contact/site" />
          </div>
        </section>
      </div>
    </div>
  );
}
