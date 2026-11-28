import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import styles from "./NavyCtaCard.module.css";

interface NavyCtaCardProps {
  titleId: string;
  title: string;
  description: string;
  eyebrow?: string;
  primary: { label: string; href: string; download?: boolean };
  children?: ReactNode;
}

export function NavyCtaCard({ titleId, title, description, eyebrow, primary, children }: NavyCtaCardProps) {
  const PrimaryLink = primary.download ? "a" : Link;

  return (
    <div className={styles.card} data-site-reveal="group">
      <div className={styles.content}>
        {eyebrow && <p className={styles.eyebrow}>{eyebrow}</p>}
        <h2 id={titleId}>{title}</h2>
        <p className={styles.description}>{description}</p>
        <div className={styles.actions}>
          <PrimaryLink className={styles.primary} href={primary.href} download={primary.download}>
            <span>{primary.label}</span>
            <span className={styles.arrow} aria-hidden="true">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                {primary.download
                  ? <path d="M12 3v12m-5-5 5 5 5-5M5 16v4h14v-4" />
                  : <path d="M5 12h14m-6-6 6 6-6 6" />}
              </svg>
            </span>
          </PrimaryLink>
          {children}
        </div>
      </div>
      <div className={styles.corner} aria-hidden="true">
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          {primary.download
            ? <path d="M6 3h9l3 3v15H6zM14 3v4h4M9 12h6m-6 4h6" />
            : <path d="M3 7h18v13H3zM8 7V4h8v3M3 12h18" />}
        </svg>
      </div>
      <div className={styles.art} aria-hidden="true">
        <Image src="/suyoday.png" alt="" fill sizes="(max-width: 360px) 100vw, (max-width: 760px) 320px, (max-width: 950px) 53vw, 464px" className={styles.image} />
      </div>
    </div>
  );
}
