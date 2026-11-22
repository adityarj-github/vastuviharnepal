"use client";

import { useState } from "react";
import type { SiteData } from "@/data/site";
import { ContactBreadcrumb } from "../shared/ContactBreadcrumb";
import { ActionButton, IconButton } from "@/components/buttons";
import cardStyles from "../office/OfficeContact.module.css";
import styles from "./SiteContact.module.css";

function PinIcon() {
  return <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 1 1 14 0Z" /><circle cx="12" cy="10" r="2.25" /></svg>;
}

function MailIcon() {
  return <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="1.5" /><path d="m4 7 8 6 8-6" /></svg>;
}

function PersonIcon() {
  return <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="12" cy="7" r="3.5" /><path d="M4.5 21v-2a7.5 7.5 0 0 1 15 0v2" /></svg>;
}

function CopyIcon() {
  return <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="8" y="8" width="12" height="13" rx="2" /><path d="M16 8V5a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h2" /></svg>;
}

function BuildingIcon() {
  return <svg viewBox="0 0 48 48" fill="none" aria-hidden="true"><path d="M8 40V17l16-9v32M24 40V22l16-7v25M4 40h40" /><path d="M14 19h3M14 25h3M14 31h3M29 25h3M37 22h3M29 31h3M37 29h3M20 40v-7h8v7" /></svg>;
}

export function SiteContactClient({ site, email }: { site: SiteData; email: string }) {
  const [copied, setCopied] = useState(false);
  const [isMapOpen, setIsMapOpen] = useState(false);
  const query = encodeURIComponent(site.coordinates);
  const embedUrl = `https://maps.google.com/maps?q=${query}&output=embed`;
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${query}`;

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
    <main className={cardStyles.page}>
      <section className={cardStyles.intro} aria-labelledby="site-heading">
        <div className={cardStyles.introInner}>
          <h1 id="site-heading">Site contact</h1>
          <ContactBreadcrumb current="Site Contact" />
        </div>
      </section>

      <section className={cardStyles.directorySurface} aria-label="Site location">
        <div className={cardStyles.directory}>
          <div className={cardStyles.directoryHeading}>
            <h2>Site location</h2>
            <p>1 site</p>
          </div>

          <div className={`${cardStyles.officeList} ${styles.siteList}`}>
          <article className={cardStyles.officeShell}>
            <div className={cardStyles.shellHeader}>
              <span className={cardStyles.buildingTile}><BuildingIcon /></span>
              <h3>{site.name}</h3>
            </div>

            <div className={cardStyles.office}>
              <div className={cardStyles.officeBody}>
                <div className={cardStyles.officeInfoGrid}>
                  <div className={cardStyles.locationDetails}>
                    <p className={cardStyles.eyebrow}>Site details</p>
                    <div className={cardStyles.infoRow}>
                      <span className={cardStyles.rowIcon}><PinIcon /></span>
                      <p>{site.address}</p>
                    </div>
                    <div className={cardStyles.infoRow}>
                      <span className={cardStyles.rowIcon}><MailIcon /></span>
                      <a href={`mailto:${email}`}>{email}</a>
                    </div>
                  </div>

                  <div className={cardStyles.contacts}>
                    <p className={cardStyles.eyebrow}>Site contacts</p>
                    <div className={cardStyles.phoneList}>
                      {site.phones.map((phone) => (
                        <div className={cardStyles.phoneRow} key={phone}>
                          <span className={cardStyles.rowIcon}><PersonIcon /></span>
                          <a href={`tel:${phone.replace(/[^+\d]/g, "")}`}>{phone}</a>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {isMapOpen && (
                <div className={cardStyles.mapFrame}>
                  <iframe title={`Map showing ${site.name}`} src={embedUrl} loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
                </div>
              )}

              <div className={cardStyles.actions}>
                <ActionButton
                  className={cardStyles.actionButton}
                  text={isMapOpen ? "Hide Map" : "Show Map"}
                  type="button"
                  aria-expanded={isMapOpen}
                  onClick={() => setIsMapOpen(!isMapOpen)}
                />
                <ActionButton
                  className={cardStyles.actionButton}
                  text="Directions"
                  href={directionsUrl}
                  target="_blank"
                  rel="noreferrer"
                />
                <IconButton
                  className={cardStyles.copyButton}
                  type="button"
                  onClick={() => void copyCoordinates()}
                  ariaLabel={copied ? "Coordinates copied" : `Copy ${site.name} coordinates`}
                  title={copied ? "Coordinates copied" : "Copy coordinates"}
                  icon={copied ? <span aria-hidden="true">✓</span> : <CopyIcon />}
                />
              </div>
            </div>
          </article>
          </div>
        </div>
      </section>
    </main>
  );
}
