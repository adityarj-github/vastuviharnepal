"use client";

import { useState, useRef, useEffect } from "react";
import { ActionButton, IconButton } from "@/components/buttons";
import type { OfficeData } from "@/data/office";
import styles from "./OfficeContact.module.css";

interface OfficeContactClientProps {
  offices: OfficeData[];
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

export function OfficeContactClient({ offices }: OfficeContactClientProps) {
  const [copiedOffice, setCopiedOffice] = useState<string | null>(null);
  const [openMap, setOpenMap] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

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

  async function copyCoordinates(office: OfficeData) {
    try {
      await navigator.clipboard.writeText(office.coordinates);
      setCopiedOffice(office.title);
      window.setTimeout(() => setCopiedOffice(null), 1800);
    } catch {
      setCopiedOffice(null);
    }
  }

  return (
    <section
      ref={sectionRef} data-site-motion="off"
      className={`${styles.section} ${isVisible ? styles.visible : ""}`}
      aria-label="Branch office locations"
    >
      <div className={styles.container}>
        <div className={`${styles.header} ${styles.revealItem}`}>
          <span className={styles.eyebrow}>Branch Network</span>
          <h2 className={styles.heading}>Our Branch Offices</h2>
          <p className={styles.subheading}>
            Connect with our dedicated regional teams across Nepal for project consultation, site visits, and booking services.
          </p>
        </div>

        <div className={styles.officeGrid}>
          {offices.map((office, idx) => {
            const query = encodeURIComponent(office.coordinates);
            const embedUrl = `https://maps.google.com/maps?q=${query}&output=embed`;
            const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${query}`;
            const isMapOpen = openMap === office.title;
            const isCopied = copiedOffice === office.title;

            return (
              <article
                className={`${styles.officeCard} ${styles.revealItem}`}
                style={{ transitionDelay: `${140 + idx * 120}ms` }}
                key={office.title}
              >
                <div className={styles.cardHeader}>
                  <div className={styles.iconBadge}>
                    <BuildingIcon />
                  </div>
                  <div className={styles.headerText}>
                    <span className={styles.cardTag}>{office.eyebrow}</span>
                    <h3 className={styles.cardTitle}>{office.title} Office</h3>
                  </div>
                </div>

                <div className={styles.cardBody}>
                  <div className={styles.infoGroup}>
                    <span className={styles.infoLabel}>Address</span>
                    <div className={styles.infoRow}>
                      <span className={styles.infoIcon}>
                        <PinIcon />
                      </span>
                      <p className={styles.infoText}>{office.address}</p>
                    </div>
                  </div>

                  <div className={styles.infoGroup}>
                    <span className={styles.infoLabel}>Email</span>
                    <div className={styles.infoRow}>
                      <span className={styles.infoIcon}>
                        <MailIcon />
                      </span>
                      <a href={`mailto:${office.email}`} className={styles.infoLink}>
                        {office.email}
                      </a>
                    </div>
                  </div>

                  <div className={styles.infoGroup}>
                    <span className={styles.infoLabel}>Phone Numbers</span>
                    <div className={styles.phonesList}>
                      {office.phones.map((phone) => (
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

                {isMapOpen && (
                  <div className={styles.mapFrame}>
                    <iframe
                      title={`Map showing ${office.title} office`}
                      src={embedUrl}
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                    />
                  </div>
                )}

                <div className={styles.actions}>
                  <ActionButton
                    text={isMapOpen ? "Hide Map" : "View Map"}
                    type="button"
                    aria-expanded={isMapOpen}
                    onClick={() => setOpenMap(isMapOpen ? null : office.title)}
                  />
                  <ActionButton
                    text="Directions"
                    href={directionsUrl}
                    target="_blank"
                    rel="noreferrer"
                  />
                  <IconButton
                    type="button"
                    onClick={() => void copyCoordinates(office)}
                    ariaLabel={isCopied ? "Coordinates copied" : `Copy ${office.title} coordinates`}
                    icon={isCopied ? <span aria-hidden="true">✓</span> : <CopyIcon />}
                  />
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
