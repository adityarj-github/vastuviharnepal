"use client";

import { useState } from "react";
import { ContactBreadcrumb } from "../shared/ContactBreadcrumb";
import { ActionButton, IconButton } from "@/components/buttons";
import type { OfficeData } from "@/data/office";
import styles from "./OfficeContact.module.css";

interface OfficeContactClientProps {
  offices: OfficeData[];
}

function PinIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 1 1 14 0Z" />
      <circle cx="12" cy="10" r="2.25" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="3" y="5" width="18" height="14" rx="1.5" />
      <path d="m4 7 8 6 8-6" />
    </svg>
  );
}

function PersonIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="7" r="3.5" />
      <path d="M4.5 21v-2a7.5 7.5 0 0 1 15 0v2" />
    </svg>
  );
}

function CopyIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="8" y="8" width="12" height="13" rx="2" />
      <path d="M16 8V5a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h2" />
    </svg>
  );
}

function BuildingIcon() {
  return (
    <svg viewBox="0 0 48 48" fill="none" aria-hidden="true">
      <path d="M8 40V17l16-9v32M24 40V22l16-7v25M4 40h40" />
      <path d="M14 19h3M14 25h3M14 31h3M29 25h3M37 22h3M29 31h3M37 29h3M20 40v-7h8v7" />
    </svg>
  );
}

export function OfficeContactClient({ offices }: OfficeContactClientProps) {
  const [copiedOffice, setCopiedOffice] = useState<string | null>(null);
  const [openMap, setOpenMap] = useState<string | null>(null);

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
    <main className={styles.page}>
      <section className={styles.intro} aria-labelledby="office-heading">
        <div className={styles.introInner}>
          <h1 id="office-heading">Our offices</h1>
          <ContactBreadcrumb current="Branch Contact" />
        </div>
      </section>

      <section className={styles.directorySurface} aria-label="Office locations">
        <div className={styles.directory}>
          <div className={styles.directoryHeading}>
            <h2>Office locations</h2>
            <p>{offices.length} offices</p>
          </div>

          <div className={styles.officeList}>
            {offices.map((office) => {
            const query = encodeURIComponent(office.coordinates);
            const embedUrl = `https://maps.google.com/maps?q=${query}&output=embed`;
            const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${query}`;
            const isMapOpen = openMap === office.title;

            return (
              <article className={styles.officeShell} key={office.title}>
                <div className={styles.shellHeader}>
                  <span className={styles.buildingTile}><BuildingIcon /></span>
                  <h3>{office.title}</h3>
                </div>

                <div className={styles.office}>
                  <div className={styles.officeBody}>

                    <div className={styles.officeInfoGrid}>
                      <div className={styles.locationDetails}>
                        <p className={styles.eyebrow}>Office details</p>
                        <div className={styles.infoRow}>
                          <span className={styles.rowIcon}><PinIcon /></span>
                          <p>{office.address}</p>
                        </div>
                        <div className={styles.infoRow}>
                          <span className={styles.rowIcon}><MailIcon /></span>
                          <a href={`mailto:${office.email}`}>{office.email}</a>
                        </div>
                      </div>

                      <div className={styles.contacts}>
                        <p className={styles.eyebrow}>Office contacts</p>
                        <div className={styles.phoneList}>
                          {office.phones.map((phone) => (
                            <div className={styles.phoneRow} key={phone}>
                              <span className={styles.rowIcon}><PersonIcon /></span>
                              <a href={`tel:${phone.replace(/[^+\d]/g, "")}`}>{phone}</a>
                            </div>
                          ))}
                        </div>
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
                      className={styles.actionButton}
                      text={isMapOpen ? "Hide Map" : "Show Map"}
                      type="button"
                      aria-expanded={isMapOpen}
                      onClick={() => setOpenMap(isMapOpen ? null : office.title)}
                    />
                    <ActionButton
                      className={styles.actionButton}
                      text="Directions"
                      href={directionsUrl}
                      target="_blank"
                      rel="noreferrer"
                    />
                    <IconButton
                      className={styles.copyButton}
                      type="button"
                      onClick={() => void copyCoordinates(office)}
                      ariaLabel={copiedOffice === office.title ? "Coordinates copied" : `Copy ${office.title} coordinates`}
                      title={copiedOffice === office.title ? "Coordinates copied" : "Copy coordinates"}
                      icon={copiedOffice === office.title ? <span aria-hidden="true">✓</span> : <CopyIcon />}
                    />
                  </div>
                </div>
              </article>
            );
            })}
          </div>
        </div>
      </section>
    </main>
  );
}
