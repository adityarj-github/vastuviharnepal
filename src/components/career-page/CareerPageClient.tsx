import { NavyCtaCard } from "@/components/common/NavyCtaCard";
import ctaStyles from "@/components/common/NavyCtaCard.module.css";
import Image from "next/image";
import { StatCounter } from "@/components/home/StatCounter";
import { ActionButton, IconButton } from "@/components/buttons";
import { WorkCulture } from "./WorkCulture";
import { careerPageData, type JobOpening } from "@/data/career";
import styles from "./CareerPage.module.css";

interface CareerPageClientProps {
  initialOpenings?: JobOpening[];
}

function LayersIcon() {
  return (
    <svg data-career-draw viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="15" height="15" aria-hidden="true">
      <path pathLength={1} d="m12 2 9 4.5-9 4.5-9-4.5L12 2Z" />
      <path pathLength={1} d="m3 12 9 4.5 9-4.5" />
      <path pathLength={1} d="m3 17.5 9 4.5 9-4.5" />
    </svg>
  );
}

function BriefcaseIcon() {
  return (
    <svg data-career-draw viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16" aria-hidden="true">
      <rect pathLength={1} width="20" height="14" x="2" y="7" rx="2" />
      <path pathLength={1} d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
    </svg>
  );
}

function PinIcon() {
  return (
    <svg data-career-draw viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" width="15" height="15" aria-hidden="true">
      <path pathLength={1} d="M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 1 1 14 0Z" />
      <circle pathLength={1} cx="12" cy="10" r="2.5" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg data-career-draw viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" width="17" height="17" aria-hidden="true">
      <rect pathLength={1} width="20" height="16" x="2" y="4" rx="2" />
      <path pathLength={1} d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg data-career-draw viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" width="17" height="17" aria-hidden="true">
      <path pathLength={1} d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  );
}

export function CareerPageClient({ initialOpenings }: CareerPageClientProps = {}) {
  const { directApplication } = careerPageData;
  const openings = initialOpenings && initialOpenings.length > 0 ? initialOpenings : careerPageData.openings;
  return (
    <div className={styles.page} data-site-motion="off">
      <div className="container">
        {/* Section 1: Open Positions */}
        <section className={styles.jobsSection} aria-labelledby="jobs-heading">
          <div className={styles.sectionHeader} data-site-reveal="group">
            <div className={styles.jobsHeaderTop}>
              <span className={styles.eyebrow}>Opportunities</span>
              <span className={styles.jobCountBadge}>
                <StatCounter target={openings.length} duration={700} /> Open Positions
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
            {openings.map((job) => {
              const applyHref = `/career/apply?position=${encodeURIComponent(job.title)}`;

              return (
                <article
                  key={job.id}
                  className={styles.jobCard} data-site-reveal="group"
                >
                  <div className={styles.jobCardHeader}>
                    <span className={styles.jobIconBox} aria-hidden="true">
                      <BriefcaseIcon />
                    </span>
                    <span className={styles.jobStatusPill}>
                      ★ Open Role
                    </span>
                  </div>

                  <div className={styles.jobTop}>
                    <h3 className={styles.jobTitle}>{job.title}</h3>

                    <div className={styles.jobSubMeta}>
                      <span className={styles.jobSubItem}>
                        <PinIcon />
                        <span>{job.location}</span>
                      </span>
                      <span className={styles.jobSubDivider} aria-hidden="true">|</span>
                      <span className={styles.jobSubItem}>
                        <LayersIcon />
                        <span>{job.department}</span>
                      </span>
                    </div>

                    <span className={styles.jobDivider} aria-hidden="true" />

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

                    <p className={styles.jobDesc}>{job.description}</p>
                  </div>

                  <div className={styles.jobAction}>
                    <ActionButton
                      text="Apply Now"
                      href={applyHref}
                    />
                  </div>

                  <Image
                    src="/Modern Building with Blue Wave Arcs.png"
                    alt=""
                    width={360}
                    height={248}
                    className={styles.cardBgImage}
                    aria-hidden="true"
                  />
                </article>
              );
            })}
          </div>
        </section>
      </div>

      {/* Section 2: Work Culture */}
      <WorkCulture />

      <div className="container">
        <section aria-labelledby="open-application-heading">
          <NavyCtaCard
            titleId="open-application-heading"
            eyebrow="Spontaneous Application"
            title={directApplication.title}
            description={directApplication.description}
            primary={{ label: "Send Open Application", href: "/career/open-application" }}
          >
            <IconButton
              href={`mailto:${directApplication.email}`}
              ariaLabel="Email talent acquisition"
              className={ctaStyles.contactIcon}
              icon={<MailIcon />}
            />
            <IconButton
              href={`tel:${directApplication.phone.replace(/[^+\d]/g, "")}`}
              ariaLabel="Call recruiting team"
              className={ctaStyles.contactIcon}
              icon={<PhoneIcon />}
            />
          </NavyCtaCard>
        </section>
      </div>
    </div>
  );
}
