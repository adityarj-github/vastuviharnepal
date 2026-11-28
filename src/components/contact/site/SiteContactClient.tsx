"use client";

import { useState, useRef, useEffect } from "react";
import type { SiteData } from "@/data/site";
import { ActionButton, FlipButton, IconButton } from "@/components/buttons";
import styles from "./SiteContact.module.css";

interface SiteContactClientProps {
  site: SiteData;
  email: string;
}

function PinIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" width="17" height="17" aria-hidden="true">
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

function CopyIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" width="17" height="17" aria-hidden="true">
      <rect width="14" height="14" x="8" y="8" rx="2" />
      <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
    </svg>
  );
}

function BuildingIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="22" height="22" aria-hidden="true">
      <path d="M3 21h18" />
      <path d="M5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16" />
      <path d="M9 9h1" />
      <path d="M9 13h1" />
      <path d="M9 17h1" />
      <path d="M14 9h1" />
      <path d="M14 13h1" />
      <path d="M14 17h1" />
    </svg>
  );
}

export function SiteContactClient({ site, email }: SiteContactClientProps) {
  const [copied, setCopied] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  const query = encodeURIComponent(site.coordinates);
  const embedUrl = `https://maps.google.com/maps?q=${query}&output=embed`;
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${query}`;

  useEffect(() => {
    const el = sectionRef.current;
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
      { threshold: 0.1 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  async function copyCoordinates() {
    try {
      await navigator.clipboard.writeText(site.coordinates);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  }

  return (
    <section
      ref={sectionRef} data-site-motion="off"
      className={`${styles.section} ${isVisible ? styles.visible : ""}`}
      aria-label="Site location details"
    >
      <div className={styles.container}>
        <div className={`${styles.header} ${styles.revealItem}`}>
          <span className={styles.eyebrow}>Project Site Location</span>
          <h2 className={styles.heading}>Birtamode Township Site</h2>
          <p className={styles.subheading}>
            Experience our on-ground construction progress in person. Connect directly with our site team or plan your visit.
          </p>
        </div>

        <div className={styles.topSplit}>
          {/* Left: Site Details Card */}
          <article
            className={`${styles.siteCard} ${styles.revealItem}`}
            style={{ transitionDelay: "140ms" }}
          >
            <div className={styles.cardHeader}>
              <div className={styles.iconBadge}>
                <BuildingIcon />
              </div>
              <div className={styles.headerText}>
                <span className={styles.cardTag}>Active Project Site</span>
                <h3 className={styles.cardTitle}>{site.name}</h3>
              </div>
            </div>

            <div className={styles.cardBody}>
              <div className={styles.infoGroup}>
                <span className={styles.infoLabel}>Site Address</span>
                <div className={styles.infoRow}>
                  <span className={styles.infoIcon}>
                    <PinIcon />
                  </span>
                  <p className={styles.infoText}>{site.address}</p>
                </div>
              </div>

              <div className={styles.infoGroup}>
                <span className={styles.infoLabel}>Email</span>
                <div className={styles.infoRow}>
                  <span className={styles.infoIcon}>
                    <MailIcon />
                  </span>
                  <a href={`mailto:${email}`} className={styles.infoLink}>
                    {email}
                  </a>
                </div>
              </div>

              <div className={styles.infoGroup}>
                <span className={styles.infoLabel}>On-Site Project Contacts</span>
                <div className={styles.phonesList}>
                  {site.phones.map((phone) => (
                    <div className={styles.infoRow} key={phone}>
                      <span className={styles.infoIcon}>
                        <PhoneIcon />
                      </span>
                      <a href={`tel:${phone.replace(/[^+\d]/g, "")}`} className={styles.phoneLink}>
                        {phone}
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className={styles.actions}>
              <ActionButton
                text="Directions"
                href={directionsUrl}
                target="_blank"
                rel="noreferrer"
              />
              <ActionButton
                text="Book Site Visit"
                href="/contact"
              />
              <IconButton
                type="button"
                onClick={() => void copyCoordinates()}
                ariaLabel={copied ? "Coordinates copied" : `Copy ${site.name} coordinates`}
                icon={copied ? <span aria-hidden="true">✓</span> : <CopyIcon />}
              />
              <IconButton
                href={`tel:${site.phones[0]?.replace(/[^+\d]/g, "")}`}
                ariaLabel="Call Site Office"
                icon={<PhoneIcon />}
              />
            </div>
          </article>

          {/* Right: Embedded Live Map */}
          <div
            className={`${styles.mapColumn} ${styles.revealItem}`}
            style={{ transitionDelay: "240ms" }}
          >
            <iframe
              title={`Map showing ${site.name} site`}
              src={embedUrl}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
            <aside className={styles.mapCard}>
              <span className={styles.mapEyebrow}>Live Location</span>
              <h4 className={styles.mapTitle}>{site.name}</h4>
              <p className={styles.mapAddress}>
                <PinIcon />
                <span>{site.address}</span>
              </p>
              <ActionButton
                className={styles.mapButton}
                text="View on Google Maps"
                href={directionsUrl}
                target="_blank"
                rel="noreferrer"
              />
            </aside>
          </div>
        </div>

        {/* Bottom CTAs */}
        <div className={styles.bottomCtas}>
          <article
            className={`${styles.ctaCard} ${styles.revealItem}`}
            style={{ transitionDelay: "320ms" }}
          >
            <div className={styles.ctaHeader}>
              <span className={styles.ctaTag}>Enquiry</span>
              <span className={styles.ctaCategory}>Direct Contact</span>
            </div>
            <h3 className={styles.ctaTitle}>General Inquiries</h3>
            <p className={styles.ctaDescription}>
              Have questions about floor plans, pricing, or amenities? Submit an enquiry to our advisory team.
            </p>
            <FlipButton className={styles.ctaAction} text="Contact Us" href="/contact" />
          </article>

          <article
            className={`${styles.ctaCard} ${styles.revealItem}`}
            style={{ transitionDelay: "400ms" }}
          >
            <div className={styles.ctaHeader}>
              <span className={styles.ctaTag}>Offices</span>
              <span className={styles.ctaCategory}>Branch Network</span>
            </div>
            <h3 className={styles.ctaTitle}>Branch Offices</h3>
            <p className={styles.ctaDescription}>
              Looking for our regional offices in Birgunj and Birtamode? View all branch locations and phone numbers.
            </p>
            <FlipButton className={styles.ctaAction} text="Branch Offices" href="/contact/branch" />
          </article>
        </div>
      </div>
    </section>
  );
}
