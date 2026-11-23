"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import type { FooterData, FooterSocialLink } from "@/data/footer";
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
  const [year, setYear] = useState(currentYear);

  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  const handleBackToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className={styles.wrapper}>
      <footer className={styles.footer} aria-label="Site Footer">
        {/* Top Row: Brand + Social Round Buttons | 3 Link Sections */}
        <div className={styles.topGrid}>
          <div className={styles.brandCol}>
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
                sizes="180px"
                className={styles.logo}
              />
            </Link>

            <p className={styles.tagline}>{data.tagline}</p>

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
          </div>

          {data.linkSections.map((section) => (
            <div key={section.title} className={styles.linkCol}>
              <h2 className={styles.colHeading}>{section.title}</h2>
              <ul className={styles.linkList}>
                {section.links.map((item) => (
                  <li key={item.label}>
                    <Link href={item.href} className={styles.link}>
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Row: Copyright (Left) & Back to Top (Right) */}
        <div className={styles.bottomGrid}>
          {/* Left: Email + Copyright */}
          <div className={styles.contactCol}>
            <a href={`mailto:${data.email}`} className={styles.emailLink}>
              {data.email}
            </a>
            <div className={styles.copyright}>
              <span>{data.brandName}</span>
              <span>{year} &copy; All rights reserved</span>
            </div>
          </div>

          {/* Right: Back to Top Pill */}
          <div>
            <button
              type="button"
              onClick={handleBackToTop}
              className={styles.backToTop}
            >
              <span>Back to top</span>
              <span className={styles.backToTopCircle}>
                <ArrowUpIcon />
              </span>
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}