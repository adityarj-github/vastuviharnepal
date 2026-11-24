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

function ArrowRightIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" width="14" height="14" aria-hidden="true">
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  );
}

export function BlogPageClient({ allPosts, categories }: BlogPageClientProps) {
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredPosts =
    activeCategory === "All"
      ? allPosts
      : allPosts.filter((post) => post.category === activeCategory);

  const featuredPost = activeCategory === "All" ? allPosts.find((p) => p.featured) || allPosts[0] : null;
  const gridPosts = featuredPost && activeCategory === "All"
    ? filteredPosts.filter((p) => p.id !== featuredPost.id)
    : filteredPosts;

  return (
    <div className={styles.page}>
      <section className={styles.contentSection} aria-label="Blog posts and insights">
        <div className="container">
          {/* Category Filter Pills */}
          <nav className={styles.filterWrap} aria-label="Filter blog posts by category">
            {categories.map((cat) => {
              const isActive = activeCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  className={`${styles.filterBtn} ${isActive ? styles.filterBtnActive : ""}`}
                  onClick={() => setActiveCategory(cat)}
                  aria-pressed={isActive}
                >
                  {cat}
                </button>
              );
            })}
          </nav>

          {/* Featured Post Spotlight (shown on "All") */}
          {featuredPost && (
            <article>
              <Link
                href={`/blog/${featuredPost.slug}`}
                className={styles.featuredCard}
                aria-label={`Read featured story: ${featuredPost.title}`}
              >
                <div className={styles.featuredImageWrap}>
                  <Image
                    src={featuredPost.coverImage}
                    alt={featuredPost.coverImageAlt}
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 55vw"
                    className={styles.featuredImage}
                  />
                </div>

                <div className={styles.featuredBody}>
                  <div className={styles.featuredTopMeta}>
                    <span className={styles.featuredBadge}>Featured Story</span>
                    <span className={styles.featuredReadTime}>{featuredPost.category} • {featuredPost.readTime}</span>
                  </div>

                  <h2 className={styles.featuredTitle}>{featuredPost.title}</h2>
                  <p className={styles.featuredExcerpt}>{featuredPost.excerpt}</p>

                  <div className={styles.featuredAuthorRow}>
                    <div className={styles.featuredAuthor}>
                      <span className={styles.authorAvatarBadge} aria-hidden="true">
                        {featuredPost.author.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .slice(0, 2)}
                      </span>
                      <div className={styles.authorMeta}>
                        <span className={styles.authorNameBold}>{featuredPost.author.name}</span>
                        <span className={styles.authorRoleText}>{featuredPost.author.role}</span>
                      </div>
                    </div>

                    <span className={styles.readMoreBtn}>
                      <span>Read Story</span>
                      <span className={styles.iconCircle}>
                        <ArrowRightIcon />
                      </span>
                    </span>
                  </div>
                </div>
              </Link>
            </article>
          )}

          {/* Articles Grid */}
          <div className={styles.grid}>
            {gridPosts.map((post) => {
              const authorInitials = post.author.name
                .split(" ")
                .map((n) => n[0])
                .join("")
                .slice(0, 2);

              return (
                <article key={post.id}>
                  <Link
                    href={`/blog/${post.slug}`}
                    className={styles.card}
                    aria-label={`Read article: ${post.title}`}
                  >
                    <div className={styles.imageWrap}>
                      <Image
                        src={post.coverImage}
                        alt={post.coverImageAlt}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className={styles.image}
                      />
                      <span className={styles.badgeOverlay}>{post.category}</span>
                    </div>

                    <div className={styles.body}>
                      <div className={styles.metaRow}>
                        <span>{post.publishedDate}</span>
                        <span className={styles.metaDot} aria-hidden="true" />
                        <span>{post.readTime}</span>
                      </div>

                      <h3 className={styles.cardTitle}>{post.title}</h3>
                      <p className={styles.excerpt}>{post.excerpt}</p>

                      <div className={styles.cardFooter}>
                        <div className={styles.authorWrap}>
                          <span className={styles.authorInitial} aria-hidden="true">
                            {authorInitials}
                          </span>
                          <span className={styles.authorName}>{post.author.name}</span>
                        </div>

                        <span className={styles.readMoreBtn}>
                          <span>Read</span>
                          <span className={styles.iconCircle}>
                            <ArrowRightIcon />
                          </span>
                        </span>
                      </div>
                    </div>
                  </Link>
                </article>
              );
            })}
          </div>

          {/* Bottom Advisory Banner */}
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
      </section>
    </div>
  );
}
