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

        {/* 3-Article Grid */}
        <div className={styles.grid}>
          {posts.map((post) => (
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
  );
}
