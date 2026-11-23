"use client";

import Image from "next/image";
import Link from "next/link";
import type { BlogPost } from "@/data/blog";
import styles from "./BlogDetail.module.css";
import cardStyles from "./BlogPage.module.css";

interface BlogDetailClientProps {
  post: BlogPost;
  relatedPosts: BlogPost[];
}

function ArrowRightIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" width="14" height="14" aria-hidden="true">
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  );
}

function BookmarkIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18" aria-hidden="true">
      <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" />
    </svg>
  );
}

export function BlogDetailClient({ post, relatedPosts }: BlogDetailClientProps) {
  const authorInitials = post.author.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2);

  return (
    <div className={styles.page}>
      <article className={styles.articleSection} aria-label={post.title}>
        <div className="container">
          <div className={styles.articleLayout}>
            {/* Article Header Meta */}
            <header className={styles.articleHeader}>
              <span className={styles.categoryBadge}>{post.category}</span>
              <h1 className={styles.articleTitle}>{post.title}</h1>

              <div className={styles.authorRow}>
                <div className={styles.authorDetails}>
                  <span className={styles.authorAvatar} aria-hidden="true">
                    {authorInitials}
                  </span>
                  <div className={styles.authorText}>
                    <span className={styles.authorName}>{post.author.name}</span>
                    <span className={styles.authorRole}>{post.author.role}</span>
                  </div>
                </div>

                <div className={styles.metaInfo}>
                  <span>{post.publishedDate}</span>
                  <span className={styles.metaDot} aria-hidden="true" />
                  <span>{post.readTime}</span>
                </div>
              </div>
            </header>

            {/* Cover Image */}
            <div className={styles.coverImageWrap}>
              <Image
                src={post.coverImage}
                alt={post.coverImageAlt}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 880px"
                className={styles.coverImage}
              />
            </div>

            {/* Key Takeaways Callout */}
            {post.keyTakeaways && post.keyTakeaways.length > 0 && (
              <div className={styles.takeawaysBox}>
                <h2 className={styles.takeawaysHeading}>
                  <BookmarkIcon />
                  <span>Key Architectural Takeaways</span>
                </h2>
                <ul className={styles.takeawaysList}>
                  {post.keyTakeaways.map((takeaway, idx) => (
                    <li key={idx} className={styles.takeawaysItem}>
                      {takeaway}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Main Body Content */}
            <div className={styles.bodyContent}>
              {post.sections.map((section, sIdx) => (
                <section key={sIdx} className={styles.contentBlock}>
                  {section.heading && (
                    <h2 className={styles.blockHeading}>{section.heading}</h2>
                  )}

                  {section.paragraphs.map((p, pIdx) => (
                    <p key={pIdx} className={styles.paragraph}>
                      {p}
                    </p>
                  ))}

                  {section.bulletPoints && section.bulletPoints.length > 0 && (
                    <ul className={styles.bulletList}>
                      {section.bulletPoints.map((item, bIdx) => (
                        <li key={bIdx} className={styles.bulletItem}>
                          {item}
                        </li>
                      ))}
                    </ul>
                  )}

                  {section.quote && (
                    <blockquote className={styles.quoteBlock}>
                      <p className={styles.quoteText}>&ldquo;{section.quote}&rdquo;</p>
                    </blockquote>
                  )}
                </section>
              ))}
            </div>

            {/* Tags Row */}
            {post.tags && post.tags.length > 0 && (
              <div className={styles.tagsRow}>
                <span className={styles.tagLabel}>Topics:</span>
                {post.tags.map((tag) => (
                  <span key={tag} className={styles.tagPill}>
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            {/* Author Box */}
            <div className={styles.authorCard}>
              <span className={styles.authorCardAvatar} aria-hidden="true">
                {authorInitials}
              </span>
              <div className={styles.authorCardInfo}>
                <span className={styles.authorCardName}>{post.author.name}</span>
                <span className={styles.authorCardRole}>{post.author.role} at Vastu Vihar Nepal</span>
                <p className={styles.authorCardBio}>
                  Specializing in earthquake-resilient monolithic housing, sustainable materials, and contemporary community planning tailored for families across Nepal.
                </p>
              </div>
            </div>
          </div>

          {/* Related Articles Section */}
          {relatedPosts && relatedPosts.length > 0 && (
            <aside className={styles.relatedSection} aria-label="Related articles">
              <h2 className={styles.relatedHeading}>More Articles to Explore</h2>
              <div className={styles.relatedGrid}>
                {relatedPosts.map((relPost) => {
                  const relInitials = relPost.author.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .slice(0, 2);

                  return (
                    <article key={relPost.id}>
                      <Link
                        href={`/blog/${relPost.slug}`}
                        className={cardStyles.card}
                        aria-label={`Read article: ${relPost.title}`}
                      >
                        <div className={cardStyles.imageWrap}>
                          <Image
                            src={relPost.coverImage}
                            alt={relPost.coverImageAlt}
                            fill
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                            className={cardStyles.image}
                          />
                          <span className={cardStyles.badgeOverlay}>{relPost.category}</span>
                        </div>

                        <div className={cardStyles.body}>
                          <div className={cardStyles.metaRow}>
                            <span>{relPost.publishedDate}</span>
                            <span className={cardStyles.metaDot} aria-hidden="true" />
                            <span>{relPost.readTime}</span>
                          </div>

                          <h3 className={cardStyles.cardTitle}>{relPost.title}</h3>
                          <p className={cardStyles.excerpt}>{relPost.excerpt}</p>

                          <div className={cardStyles.cardFooter}>
                            <div className={cardStyles.authorWrap}>
                              <span className={cardStyles.authorInitial} aria-hidden="true">
                                {relInitials}
                              </span>
                              <span className={cardStyles.authorName}>{relPost.author.name}</span>
                            </div>

                            <span className={cardStyles.readMoreBtn}>
                              <span>Read</span>
                              <span className={cardStyles.iconCircle}>
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
            </aside>
          )}
        </div>
      </article>
    </div>
  );
}
