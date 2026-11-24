import { PageHero } from "@/components/common/PageHero";
import { ActionButton } from "@/components/buttons";
import styles from "./NotFoundContent.module.css";

export function NotFoundContent() {
  return (
    <main>
      <PageHero
        location="404 Error"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "404 Error" },
        ]}
        bgImage="/hero/404-hero.webp"
        bgImageAlt="404 - Page Not Found"
        headingLine1="404,"
        headingLine2="Page Not Found"
      />

      <section className={styles.section} aria-label="404 error details">
        <div className="container">
          <div className={styles.card}>
            <div className={styles.badgeWrap}>
              <span className={styles.badge}>Status 404</span>
              <span className={styles.watermark} aria-hidden="true">
                404
              </span>
            </div>

            <h2 className={styles.title}>
              We couldn&apos;t find the page you were looking for
            </h2>

            <p className={styles.description}>
              The link you followed may be incorrect, broken, or the page may have been
              relocated. Explore our bungalow models or return to our homepage.
            </p>

            <div className={styles.actions}>
              <ActionButton text="Return Home" href="/" />
              <ActionButton text="Explore Models" href="/models" />
              <ActionButton text="Contact Support" href="/contact" />
            </div>

            <div className={styles.helpBlock}>
              <div className={styles.helpItem}>
                <span className={styles.helpLabel}>Direct Desk:</span>
                <a href="tel:+9779705191815" className={styles.helpLink}>
                  +977 - 97051-91815
                </a>
              </div>
              <div className={styles.helpDivider} aria-hidden="true" />
              <div className={styles.helpItem}>
                <span className={styles.helpLabel}>Email:</span>
                <a href="mailto:info@vastuvihar.org" className={styles.helpLink}>
                  info@vastuvihar.org
                </a>
              </div>
              <div className={styles.helpDivider} aria-hidden="true" />
              <div className={styles.helpItem}>
                <span className={styles.helpLabel}>Office:</span>
                <span className={styles.helpText}>Mukti Chowk, Birtamode, Jhapa</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
