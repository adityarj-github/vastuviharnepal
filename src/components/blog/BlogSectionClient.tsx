"use client";

import Image from "next/image";
import Link from "next/link";
import { ActionButton } from "@/components/buttons";
import type { BlogPost } from "@/data/blog";
import styles from "./BlogSection.module.css";

interface BlogSectionClientProps {
  posts: BlogPost[];
}

export function BlogSectionClient({ posts }: BlogSectionClientProps) {
  return (
    <section className={styles.section} aria-labelledby="home-blog-heading">
      <div className="container">
        {/* Header Row */}
        <div className={styles.header}>
          <div className={styles.headerCol}>
            <span className={styles.eyebrow}>Insights &amp; Editorial</span>
            <h2 id="home-blog-heading" className={styles.heading}>
              <span className={styles.headingLine}>Stories of Engineering,</span>
              <span className={styles.headingLine}>Architecture &amp; Living</span>
            </h2>
          </div>

          <div className={styles.headerActionCol}>
            <p className={styles.description}>
              Explore expert insights into earthquake-resilient monolithic concrete, planned township living, and smart home investment across Nepal.
            </p>
            <ActionButton text="Explore All Articles" href="/blog" />
          </div>
        </div>

        {/* 3-Article Grid (Model Card UI) */}
        <div className={styles.grid}>
          {posts.map((post) => {
            const authorInitials = post.author.name
              .split(" ")
              .map((n) => n[0])
              .join("")
              .slice(0, 2);

            return (
              <article key={post.id} className={styles.card}>
                <Link href={`/blog/${post.slug}`} className={styles.cardLink} aria-label={`Read article: ${post.title}`}>
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
                    <div className={styles.info}>
                      <span className={styles.categoryText}>{post.category}</span>
                      <h3 className={styles.name}>{post.title}</h3>
                    </div>

                    <p className={styles.excerpt}>{post.excerpt}</p>

                    <div className={styles.specsRow}>
                      <span className={styles.specChip}>{post.publishedDate}</span>
                      <span className={styles.specChip}>{post.readTime}</span>
                    </div>

                    <div className={styles.cardFooter}>
                      <div className={styles.authorWrap}>
                        <span className={styles.authorInitial} aria-hidden="true">
                          {authorInitials}
                        </span>
                        <span className={styles.authorName}>{post.author.name}</span>
                      </div>

                      <span className={styles.viewDetails}>
                        <span>Read Article</span>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" width="15" height="15" aria-hidden="true">
                          <path d="M5 12h14" />
                          <path d="m12 5 7 7-7 7" />
                        </svg>
                      </span>
                    </div>
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
