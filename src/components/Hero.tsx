import Image from "next/image";
import Link from "next/link";
import { ActionButton, IconButton } from "@/components/buttons";
import { heroData } from "@/data/hero";
import { navigationData, type SocialLink } from "@/data/navigation";
import styles from "./Hero.module.css";

function SocialIcon({ platform }: { platform: SocialLink["platform"] }) {
  if (platform === "facebook") {
    return (
      <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16" aria-hidden="true">
        <path d="M14 13.5h2.5l1-4H14v-2c0-1.03 0-2 2-2h1.5V2.14c-.326-.043-1.557-.14-2.857-.14C11.928 2 10 3.657 10 6.7v2.8H7v4h3V22h4v-8.5Z" />
      </svg>
    );
  }
  if (platform === "instagram") {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16" aria-hidden="true">
        <rect width="20" height="20" x="2" y="2" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16" aria-hidden="true">
      <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2 31.4 31.4 0 0 0 0 12a31.4 31.4 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1A31.4 31.4 0 0 0 24 12a31.4 31.4 0 0 0-.5-5.8ZM9.6 15.6V8.4l6.3 3.6-6.3 3.6Z" />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" width="15" height="15" aria-hidden="true">
      <path d="M5 12h14" />
      <path d="m13 6 6 6-6 6" />
    </svg>
  );
}

export function Hero() {
  const { heading, description, backgroundImage, cta, highlight } = heroData;

  return (
    <section className={styles.hero}>
      {/* Background Image + Gradient Overlay */}
      <div className={styles.bgWrap} aria-hidden="true">
        <Image
          src={backgroundImage.src}
          alt={backgroundImage.alt}
          fill
          priority
          sizes="100vw"
          className={styles.bgImage}
        />
        <div className={styles.overlay} />
      </div>

      <div className={`container ${styles.inner}`}>
        {/* Main Hero Copy & CTA */}
        <div className={styles.content}>
          <h1 className={styles.heading}>{heading}</h1>
          <p className={styles.description}>{description}</p>
          <div className={styles.ctaWrap}>
            <ActionButton text={cta.label} href={cta.href} />
          </div>
        </div>

        {/* Bottom Row: Social IconButtons (Left) + Highlight Block (Right) */}
        <div className={styles.bottomRow}>
          <div className={styles.socialGroup}>
            {navigationData.socials.map((social) => (
              <IconButton
                key={social.label}
                ariaLabel={social.label}
                href={social.href}
                className={styles.socialBtn}
                icon={<SocialIcon platform={social.platform} />}
              />
            ))}
          </div>

          <div className={styles.highlight}>
            <p className={styles.smallHeading}>{highlight.smallHeading}</p>
            <div className={styles.highlightRow}>
              <div className={styles.avatarStack}>
                {highlight.images.map((img) => (
                  <div key={img.src} className={styles.avatarWrap}>
                    <Image
                      src={img.src}
                      alt={img.alt}
                      fill
                      sizes="44px"
                      className={styles.avatarImg}
                    />
                  </div>
                ))}
              </div>

              <div className={styles.highlightMeta}>
                <span className={styles.highlightLine}>{highlight.line}</span>
                <Link href={highlight.linkHref} className={styles.highlightLink}>
                  <span>{highlight.linkLabel}</span>
                  <span className={styles.linkArrow}>
                    <ArrowIcon />
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}