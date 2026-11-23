"use client";

import { useEffect, useRef, useState } from "react";
import { ActionButton, IconButton } from "@/components/buttons";
import { careerPageData } from "@/data/career";
import styles from "./CareerPage.module.css";

function BriefcaseIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16" aria-hidden="true">
      <rect width="20" height="14" x="2" y="7" rx="2" />
      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
    </svg>
  );
}

function PinIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" width="15" height="15" aria-hidden="true">
      <path d="M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 1 1 14 0Z" />
      <circle cx="12" cy="10" r="2.5" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" width="17" height="17" aria-hidden="true">
      <rect width="20" height="16" x="2" y="4" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" width="17" height="17" aria-hidden="true">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="15" height="15" aria-hidden="true">
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

export function CareerPageClient() {
  const { intro, perks, openings, directApplication } = careerPageData;
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
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
      { threshold: 0.08 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={containerRef}
      className={`${styles.page} ${isVisible ? styles.visible : ""}`}
    >
      {/* Section 1: Why Vastu Vihar Nepal (Rounded Card with Margin + Yellow BG Image + No Glassmorphism) */}
      <section className={styles.perksSection} aria-labelledby="why-join-heading">
        <div className="container">
          <div className={styles.perksCard}>
            {/* Heading without tagline */}
            <div className={`${styles.perksHeader} ${styles.revealItem}`}>
              <h2 id="why-join-heading" className={styles.perksHeading}>
                {intro.heading}
              </h2>
            </div>

            {/* Grid without counter & without bg color - heading and description only */}
            <div className={styles.perksGrid}>
              {perks.map((perk, idx) => (
                <article
                  key={perk.id}
                  className={`${styles.perkItem} ${styles.revealItem}`}
                  style={{ transitionDelay: `${120 + idx * 80}ms` }}
                >
                  <h3 className={styles.perkTitle}>{perk.title}</h3>
                  <p className={styles.perkDesc}>{perk.description}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="container">
        {/* Section 2: Open Positions */}
        <section className={styles.jobsSection} aria-labelledby="jobs-heading">
          <div
            className={`${styles.sectionHeader} ${styles.revealItem}`}
            style={{ transitionDelay: "100ms" }}
          >
            <div className={styles.jobsHeaderTop}>
              <span className={styles.eyebrow}>Opportunities</span>
              <span className={styles.jobCountBadge}>
                {openings.length} Open Positions
              </span>
            </div>
            <h2 id="jobs-heading" className={styles.heading}>
              Current Openings
            </h2>
            <p className={styles.description}>
              Explore our current vacancies across engineering, architecture, design, and client advisory.
            </p>
          </div>

          <div className={styles.jobsList}>
            {openings.map((job, idx) => {
              const applySubject = encodeURIComponent(
                `Job Application: ${job.title} (${job.location})`
              );
              const applyHref = `mailto:${directApplication.email}?subject=${applySubject}`;

              return (
                <article
                  key={job.id}
                  className={`${styles.jobCard} ${styles.revealItem}`}
                  style={{ transitionDelay: `${150 + idx * 90}ms` }}
                >
                  <div className={styles.jobTop}>
                    <div className={styles.jobMeta}>
                      <span className={styles.jobDept}>{job.department}</span>
                      <div className={styles.jobBadges}>
                        <span className={styles.badge}>
                          <BriefcaseIcon />
                          <span>{job.type}</span>
                        </span>
                        <span className={styles.badge}>
                          <PinIcon />
                          <span>{job.location}</span>
                        </span>
                      </div>
                    </div>

                    <h3 className={styles.jobTitle}>{job.title}</h3>
                    <p className={styles.jobDesc}>{job.description}</p>
                  </div>

                  <div className={styles.requirementsWrap}>
                    <h4 className={styles.reqTitle}>Key Qualifications</h4>
                    <ul className={styles.reqList}>
                      {job.requirements.map((req, reqIdx) => (
                        <li key={reqIdx} className={styles.reqItem}>
                          <span className={styles.reqIcon}>
                            <CheckIcon />
                          </span>
                          <span>{req}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className={styles.jobAction}>
                    <ActionButton
                      text="Apply For Position"
                      href={applyHref}
                    />
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        {/* Section 3: Direct Application Banner */}
        <section
          className={`${styles.bannerSection} ${styles.revealItem}`}
          style={{ transitionDelay: "200ms" }}
          aria-label="Spontaneous application"
        >
          <div className={styles.bannerCard}>
            <div className={styles.bannerContent}>
              <span className={styles.bannerTag}>Spontaneous Application</span>
              <h2 className={styles.bannerTitle}>{directApplication.title}</h2>
              <p className={styles.bannerDesc}>{directApplication.description}</p>
            </div>

            <div className={styles.bannerActions}>
              <ActionButton
                text="Send Open Application"
                href={`mailto:${directApplication.email}?subject=Spontaneous%20Career%20Application`}
              />
              <IconButton
                href={`mailto:${directApplication.email}`}
                ariaLabel="Email talent acquisition"
                icon={<MailIcon />}
              />
              <IconButton
                href={`tel:${directApplication.phone.replace(/[^+\d]/g, "")}`}
                ariaLabel="Call recruiting team"
                icon={<PhoneIcon />}
              />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
