"use client";

import { useState, useRef, useEffect, type FormEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { ActionButton } from "@/components/buttons";
import type { BlogPost } from "@/data/blog";
import styles from "./BlogDetail.module.css";

interface BlogDetailClientProps {
  post: BlogPost;
  relatedPosts: BlogPost[];
}

function BookmarkIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18" aria-hidden="true">
      <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" />
    </svg>
  );
}

const CITY_OPTIONS = [
  "Birtamode, Jhapa",
  "Birgunj, Parsa",
  "Kathmandu / Valley",
  "Other / General Inquiry",
];

export function BlogDetailClient({ post, relatedPosts }: BlogDetailClientProps) {
  const authorInitials = post.author.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2);

  // Sticky Lead Form State
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState(CITY_OPTIONS[0]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [modelInterest, setModelInterest] = useState("");
  const [consent, setConsent] = useState(false);
  const [consentError, setConsentError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close custom dropdown on outside click or escape
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsDropdownOpen(false);
      }
    }

    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isDropdownOpen]);

  const handleLeadSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!consent) {
      setConsentError(true);
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: fullName.trim(),
          phone: phone.trim(),
          source: "Blog Lead",
          locationPref: city,
          interestType: modelInterest || undefined,
          blogSlug: post.slug,
        }),
      });

      if (!res.ok) {
        console.error("Failed to submit blog inquiry");
      }
      setIsSubmitted(true);
    } catch (err) {
      console.error("Error submitting lead:", err);
      setIsSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setFullName("");
    setPhone("");
    setCity(CITY_OPTIONS[0]);
    setModelInterest("");
    setConsent(false);
    setConsentError(false);
    setIsSubmitted(false);
  };

  return (
    <div className={styles.page}>
      <article className={styles.articleSection} aria-label={post.title}>
        <div className="container">
          <div className={styles.mainGrid}>
            {/* Left Column: Article Content */}
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
                  sizes="(max-width: 1080px) 100vw, 880px"
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

            {/* Right Column: Sticky Lead Form for Desktop */}
            <aside className={styles.sidebarCol} aria-label="Consultation inquiry">
              <div className={styles.leadCard}>
                <div className={styles.leadHeader}>
                  <span className={styles.leadEyebrow}>Free Consultation</span>
                  <h2 className={styles.leadTitle}>Speak with a Housing Advisor</h2>
                  <p className={styles.leadSubtitle}>
                    Interested in monolithic bungalow models or planning a site visit in Birtamode or Birgunj? Get pricing &amp; brochures.
                  </p>
                </div>

                {isSubmitted ? (
                  <div className={styles.successBox} role="alert">
                    <p className={styles.successText}>
                      ✓ Thank you, <strong>{fullName}</strong>! Your inquiry regarding <em>{post.category}</em> has been registered. Our housing advisor will call you shortly.
                    </p>
                    <button type="button" className={styles.resetBtn} onClick={handleReset}>
                      Submit another inquiry
                    </button>
                  </div>
                ) : (
                  <form className={styles.leadForm} onSubmit={handleLeadSubmit}>
                    <div className={styles.formRow}>
                      <div className={styles.fieldGroup}>
                        <label htmlFor="blog-lead-name" className={styles.fieldLabel}>
                          Full Name <span className={styles.required}>*</span>
                        </label>
                        <input
                          id="blog-lead-name"
                          type="text"
                          required
                          placeholder="e.g. Ramesh Shrestha"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          className={styles.input}
                        />
                      </div>

                      <div className={styles.fieldGroup}>
                        <label htmlFor="blog-lead-phone" className={styles.fieldLabel}>
                          Phone Number <span className={styles.required}>*</span>
                        </label>
                        <input
                          id="blog-lead-phone"
                          type="tel"
                          required
                          placeholder="+977 98XXXXXXXX"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className={styles.input}
                        />
                      </div>
                    </div>

                    <div className={styles.formRow}>
                      <div className={styles.fieldGroup} ref={dropdownRef}>
                        <label id="blog-lead-city-label" className={styles.fieldLabel}>
                          Preferred Location
                        </label>
                        <div className={styles.dropdownWrap}>
                          <button
                            type="button"
                            id="blog-lead-city"
                            aria-haspopup="listbox"
                            aria-expanded={isDropdownOpen}
                            aria-labelledby="blog-lead-city-label blog-lead-city"
                            className={`${styles.dropdownTrigger} ${isDropdownOpen ? styles.dropdownTriggerOpen : ""
                              }`}
                            onClick={() => setIsDropdownOpen((prev) => !prev)}
                          >
                            <span className={styles.dropdownValue}>{city}</span>
                            <svg
                              viewBox="0 0 24 24"
                              width="16"
                              height="16"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2.2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className={`${styles.dropdownChevron} ${isDropdownOpen ? styles.dropdownChevronOpen : ""
                                }`}
                              aria-hidden="true"
                            >
                              <path d="m6 9 6 6 6-6" />
                            </svg>
                          </button>

                          {isDropdownOpen && (
                            <div
                              className={styles.dropdownMenu}
                              role="listbox"
                              aria-labelledby="blog-lead-city-label"
                            >
                              {CITY_OPTIONS.map((c) => {
                                const isSelected = city === c;
                                return (
                                  <button
                                    key={c}
                                    type="button"
                                    role="option"
                                    aria-selected={isSelected}
                                    className={`${styles.dropdownOption} ${isSelected ? styles.dropdownOptionActive : ""
                                      }`}
                                    onClick={() => {
                                      setCity(c);
                                      setIsDropdownOpen(false);
                                    }}
                                  >
                                    <span>{c}</span>
                                    {isSelected && (
                                      <svg
                                        viewBox="0 0 24 24"
                                        width="15"
                                        height="15"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2.5"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className={styles.optionCheck}
                                        aria-hidden="true"
                                      >
                                        <path d="M20 6 9 17l-5-5" />
                                      </svg>
                                    )}
                                  </button>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className={styles.fieldGroup}>
                        <label htmlFor="blog-lead-interest" className={styles.fieldLabel}>
                          Interested Model / Query
                        </label>
                        <input
                          id="blog-lead-interest"
                          type="text"
                          placeholder="e.g. Pashupati 3BHK / Price list"
                          value={modelInterest}
                          onChange={(e) => setModelInterest(e.target.value)}
                          className={styles.input}
                        />
                      </div>
                    </div>

                    <div className={styles.consentRow}>
                      <label className={styles.consentLabel}>
                        <input
                          type="checkbox"
                          checked={consent}
                          onChange={(e) => {
                            setConsent(e.target.checked);
                            if (e.target.checked) setConsentError(false);
                          }}
                          className={styles.consentCheckbox}
                          required
                        />
                        <span className={styles.consentText}>
                          I agree to receive project calls and accept the{" "}
                          <Link href="/privacy-policy" className={styles.consentLink} target="_blank">
                            Privacy Policy
                          </Link>{" "}
                          &amp;{" "}
                          <Link href="/terms" className={styles.consentLink} target="_blank">
                            Terms
                          </Link>.
                        </span>
                      </label>
                      {consentError && (
                        <span className={styles.consentError}>
                          Please agree before submitting.
                        </span>
                      )}
                    </div>

                    <div className={styles.submitBtnWrap}>
                      <ActionButton
                        text={isSubmitting ? "Submitting..." : "Get Model Plans & Pricing"}
                        type="submit"
                        disabled={isSubmitting}
                      />
                    </div>
                  </form>
                )}
              </div>
            </aside>
          </div>

          {/* Related Articles Section (Full Width) */}
          {relatedPosts && relatedPosts.length > 0 && (
            <aside className={styles.relatedSection} aria-label="Related articles">
              <h2 className={styles.relatedHeading}>More Articles to Explore</h2>
              <div className={styles.relatedGrid}>
                {relatedPosts.map((relPost) => (
                  <article key={relPost.id} className={styles.card}>
                    <Link
                      href={`/blog/${relPost.slug}`}
                      className={styles.cardLink}
                      aria-label={`Read article: ${relPost.title}`}
                    >
                      <div className={styles.imageWrap}>
                        <span className={styles.badge}>{relPost.category}</span>
                        <Image
                          src={relPost.coverImage}
                          alt={relPost.coverImageAlt}
                          fill
                          sizes="(max-width: 680px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          className={styles.image}
                        />
                      </div>

                      <div className={styles.meta}>
                        <div className={styles.headerRow}>
                          <div className={styles.info}>
                            <h3 className={styles.name}>{relPost.title}</h3>
                            <span className={styles.date}>{relPost.publishedDate}</span>
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
            </aside>
          )}
        </div>
      </article>
    </div>
  );
}
