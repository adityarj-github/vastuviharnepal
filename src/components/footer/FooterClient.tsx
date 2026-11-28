"use client";

import { motionScrollBehavior } from "@/components/animation/motionPreference";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { FooterData, FooterSocialLink } from "@/data/footer";
import { ActionButton } from "@/components/buttons";
import styles from "./Footer.module.css";

interface FooterClientProps {
  data: FooterData;
  currentYear: number;
}

function ArrowUpIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      width="16"
      height="16"
      aria-hidden="true"
    >
      <path d="M12 19V5" />
      <path d="m6 11 6-6 6 6" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      width="15"
      height="15"
      aria-hidden="true"
    >
      <rect width="20" height="16" x="2" y="4" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  );
}

function SocialIcon({ platform }: { platform: FooterSocialLink["platform"] }) {
  switch (platform) {
    case "facebook":
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16" aria-hidden="true">
          <path d="M14 13.5h2.5l1-4H14v-2c0-1.03 0-2 2-2h1.5V2.14c-.326-.043-1.557-.14-2.857-.14C11.928 2 10 3.657 10 6.7v2.8H7v4h3V22h4v-8.5Z" />
        </svg>
      );
    case "instagram":
      return (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.9"
          strokeLinecap="round"
          strokeLinejoin="round"
          width="16"
          height="16"
          aria-hidden="true"
        >
          <rect x="2" y="2" width="20" height="20" rx="5" />
          <circle cx="12" cy="12" r="4" />
          <circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" stroke="none" />
        </svg>
      );
    case "youtube":
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16" aria-hidden="true">
          <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2 31.4 31.4 0 0 0 0 12a31.4 31.4 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1A31.4 31.4 0 0 0 24 12a31.4 31.4 0 0 0-.5-5.8ZM9.6 15.6V8.4l6.3 3.6-6.3 3.6Z" />
        </svg>
      );
    case "linkedin":
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" width="15" height="15" aria-hidden="true">
          <path d="M6.94 5a2 2 0 1 1-4-.002 2 2 0 0 1 4 .002ZM7 8.48H3V21h4V8.48Zm6.32 0H9.34V21h3.94v-6.57c0-3.66 4.77-4 4.77 0V21H22v-7.93c0-6.17-7.06-5.94-8.72-2.91l.04-1.68Z" />
        </svg>
      );
  }
}

export function FooterClient({ data, currentYear }: FooterClientProps) {
  const pathname = usePathname();
  const [year, setYear] = useState(currentYear);

  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  if (pathname?.startsWith("/admin")) {
    return null;
  }

  const handleBackToTop = () => {
    window.scrollTo({ top: 0, behavior: motionScrollBehavior() });
  };

  const handleOpenCookiePreferences = () => {
    if (typeof window !== "undefined") {
      if (typeof (window as any).__openCookieConsent === "function") {
        (window as any).__openCookieConsent();
      }
      window.dispatchEvent(new CustomEvent("open-cookie-preferences"));
      document.dispatchEvent(new CustomEvent("open-cookie-preferences"));
    }
  };

  // Separate regular columns (e.g. Company, Residences, Get in Touch) from Legal links
  const mainLinkSections = data.linkSections.filter(
    (section) => section.title.toLowerCase() !== "legal"
  );
  const legalSection = data.linkSections.find(
    (section) => section.title.toLowerCase() === "legal"
  );
  const legalLinks = legalSection?.links ?? [
    { label: "Terms & Conditions", href: "/terms" },
    { label: "Privacy Policy", href: "/privacy-policy" },
  ];

  const leadCard = data.leadCard ?? {
    eyebrow: "Consultation & Visits",
    title: "Planning Your Next Home?",
    description:
      "Speak directly with our property advisors to explore bungalow models, request floor plans, or schedule a private site visit.",
    buttonText: "Schedule a Visit",
    buttonHref: "/contact/site",
  };

  return (
    <div className={styles.wrapper}>
      <footer className={styles.footer} aria-label="Site Footer">
        {/* Top Header Row: Logo (Left) & Back to Top (Right) */}
        <div className={styles.footerHeader} data-site-reveal="group">
          <Link
            href="/"
            className={styles.logoLink}
            aria-label={data.brandName}
          >
            <Image
              src={data.logo}
              alt={data.brandName}
              width={0}
              height={0}
              sizes="200px"
              className={styles.logo}
            />
          </Link>

          <button
            type="button"
            onClick={handleBackToTop}
            className={styles.backToTopBtn}
            aria-label="Back to top of page"
          >
            <span className={styles.backToTopText}>Back to top</span>
            <span className={styles.backToTopCircle}>
              <ArrowUpIcon />
            </span>
          </button>
        </div>

        {/* Main Grid: Brand (Left) | 3 Link Sections (Center) | Lead / Contact Column (Right) */}
        <div className={styles.topGrid}>
          {/* Brand Tagline, Socials & Email */}
          <div className={styles.brandCol} data-site-reveal="group">
            <p className={styles.tagline}>{data.tagline}</p>

            {/* Social Buttons */}
            <div className={styles.socialRow}>
              {data.socialLinks.map((social) => (
                <a
                  key={social.platform}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className={styles.socialBtn}
                >
                  <SocialIcon platform={social.platform} />
                </a>
              ))}
            </div>

            {/* Email below social links */}
            <a href={`mailto:${data.email}`} className={styles.emailLink}>
              <MailIcon />
              <span>{data.email}</span>
            </a>
          </div>

          {/* 3 Main Link Sections: Company, Residences, Get in Touch */}
          <div className={styles.linksGrid}>
            {mainLinkSections.map((section) => (
              <div key={section.title} className={styles.linkCol} data-site-reveal="group">
                <h2 className={styles.colHeading}>{section.title}</h2>
                <ul className={styles.linkList}>
                  {section.links.map((item) => (
                    <li key={item.label}>
                      <Link href={item.href} className={styles.link} data-motion-underline>
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Lead / Contact Column */}
          <div className={styles.leadCol} data-site-reveal="group">
            <h2 className={styles.leadHeading}>{leadCard.title}</h2>
            <p className={styles.leadDesc}>{leadCard.description}</p>
            <div className={styles.leadBtnWrap}>
              <ActionButton
                text={leadCard.buttonText}
                href={leadCard.buttonHref}
              />
            </div>
          </div>
        </div>

        {/* Bottom Row: Copyright (Left) & Legal Links in a Single Line (Right) */}
        <div className={styles.bottomGrid} data-site-reveal="group">
          <div className={styles.copyright}>
            <span>{data.brandName} {year} &copy; All rights reserved</span>
          </div>

          {/* Legal Links in Single Line */}
          <div className={styles.legalRow}>
            {legalLinks.map((item, idx) => (
              <span key={item.label} className={styles.legalItem}>
                {idx > 0 && <span className={styles.legalDot} aria-hidden="true">•</span>}
                <Link href={item.href} className={styles.legalLink} data-motion-underline>
                  {item.label}
                </Link>
              </span>
            ))}
            <span className={styles.legalItem}>
              <span className={styles.legalDot} aria-hidden="true">•</span>
              <button
                type="button"
                onClick={handleOpenCookiePreferences}
                className={styles.cookieConsentBtn}
              >
                Cookie Preferences
              </button>
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
