import Image from "next/image";
import Link from "next/link";
import { ActionButton, IconButton } from "@/components/buttons";
import { heroData } from "@/data/hero";
import { navigationData, type SocialLink } from "@/data/navigation";
import styles from "./Hero.module.css";
import { HeroScrollShell } from "./HeroScrollShell";

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
  if (platform === "linkedin") {
    return (
      <svg viewBox="0 0 24 24" fill="currentColor" width="15" height="15" aria-hidden="true">
        <path d="M6.94 5a2 2 0 1 1-4-.002 2 2 0 0 1 4 .002ZM7 8.48H3V21h4V8.48Zm6.32 0H9.34V21h3.94v-6.57c0-3.66 4.77-4 4.77 0V21H22v-7.93c0-6.17-7.06-5.94-8.72-2.91l.04-1.68Z" />
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
    <HeroScrollShell className={styles.hero} maxRadius={0}>
      {/* Background Image + Black Dark Fade */}
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
        {/* Vertically Centered Copy & CTA */}
        <div className={styles.content}>
          <div className={styles.revealMask}>
            <h1 className={`${styles.heading} ${styles.revealUp} ${styles.delay1}`}>
              {heading}
            </h1>
          </div>

          <div className={styles.revealMask}>
            <p className={`${styles.description} ${styles.revealUp} ${styles.delay2}`}>
              {description}
            </p>
          </div>

          <div className={`${styles.ctaWrap} ${styles.revealFromLeft} ${styles.delay3}`}>
            <ActionButton text={cta.label} href={cta.href} />
          </div>
        </div>

        {/* Bottom Row: Socials (Left) + Plain 2-Col Highlight (Right) */}
        <div className={styles.bottomRow}>
          <div className={`${styles.socialGroup} ${styles.revealFromLeft} ${styles.delay4}`}>
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
            <div className={styles.revealMask}>
              <p className={`${styles.smallHeading} ${styles.revealUp} ${styles.delay3}`}>
                {highlight.smallHeading}
              </p>
            </div>

            <div className={styles.highlightGrid}>
              {/* Column 1: Overlapping Round Images */}
              <div className={`${styles.avatarStack} ${styles.revealFromRight} ${styles.delay4}`}>
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

              {/* Column 2: Text + Link with Arrow */}
              <div className={styles.highlightCol2}>
                <div className={styles.revealMask}>
                  <span className={`${styles.highlightLine} ${styles.revealUp} ${styles.delay4}`}>
                    {highlight.line}
                  </span>
                </div>

                <Link
                  href={highlight.linkHref}
                  className={`${styles.highlightLink} ${styles.revealFromRight} ${styles.delay5}`}
                >
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
    </HeroScrollShell>
  );
}