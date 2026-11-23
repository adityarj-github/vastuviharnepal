import type { Metadata } from "next";
import { PageHero } from "@/components/common/PageHero";
import styles from "@/components/legal/LegalPage.module.css";

export const metadata: Metadata = {
  title: "Privacy Policy | Vastu Vihar Nepal",
  description:
    "Vastu Vihar respects your privacy and is committed to protecting the personal information you share with us.",
};

export default function PrivacyPolicyPage() {
  return (
    <main>
      <PageHero
        location="Privacy Policy"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Privacy Policy" },
        ]}
        bgImage="/brand-bg.webp"
        bgImageAlt="Privacy Policy Vastu Vihar Nepal"
        headingLine1="Privacy,"
        headingLine2="Policy"
      />

      <section className={styles.section} aria-label="Privacy Policy document">
        <div className="container">
          <article className={styles.article}>
            <header className={styles.header}>
              <h1 className={styles.title}>Privacy Policy</h1>
              <p className={styles.subtitle}>
                Vastu Vihar respects your privacy and is committed to protecting the personal information you share with us. This Privacy Policy explains what we collect, how we use it, and how we protect it.
              </p>
            </header>

            <div className={styles.content}>
              <section className={styles.block}>
                <h2 className={styles.blockTitle}>1. Information We Collect</h2>
                <ul className={styles.list}>
                  <li className={styles.listItem}>Personal details you submit via forms (e.g., name, phone number, email address, city)</li>
                  <li className={styles.listItem}>Inquiry and communication details (messages, call requests, feedback)</li>
                  <li className={styles.listItem}>Basic usage data (device/browser info, pages visited) for analytics and security</li>
                </ul>
              </section>

              <section className={styles.block}>
                <h2 className={styles.blockTitle}>2. How We Use Your Information</h2>
                <ul className={styles.list}>
                  <li className={styles.listItem}>To respond to inquiries and provide requested information</li>
                  <li className={styles.listItem}>To contact you regarding projects, visits, documentation, or support</li>
                  <li className={styles.listItem}>To improve website performance and user experience</li>
                  <li className={styles.listItem}>To comply with legal and regulatory requirements</li>
                </ul>
              </section>

              <section className={styles.block}>
                <h2 className={styles.blockTitle}>3. Data Sharing</h2>
                <p className={styles.text}>
                  We do not sell your personal information. We may share information only when necessary:
                </p>
                <ul className={styles.list}>
                  <li className={styles.listItem}>With internal teams or authorized partners for service fulfillment</li>
                  <li className={styles.listItem}>With legal/regulatory authorities when required by law</li>
                </ul>
              </section>

              <section className={styles.block}>
                <h2 className={styles.blockTitle}>4. Cookies</h2>
                <p className={styles.text}>
                  Our website may use cookies to enhance your browsing experience. You can modify cookie preferences through your browser settings.
                </p>
              </section>

              <section className={styles.block}>
                <h2 className={styles.blockTitle}>5. Data Security</h2>
                <p className={styles.text}>
                  We use reasonable administrative and technical safeguards to protect your information. However, no method of transmission over the internet is 100% secure.
                </p>
              </section>

              <section className={styles.block}>
                <h2 className={styles.blockTitle}>6. Your Choices</h2>
                <ul className={styles.list}>
                  <li className={styles.listItem}>You may request correction of your information if inaccurate.</li>
                  <li className={styles.listItem}>You may opt out of promotional communications by contacting us.</li>
                </ul>
              </section>

              <section className={styles.block}>
                <h2 className={styles.blockTitle}>7. Contact</h2>
                <p className={styles.text}>
                  For privacy-related questions, contact:{" "}
                  <a href="mailto:info@vastuvihar.org" className={styles.contactItemValue}>
                    info@vastuvihar.org
                  </a>
                </p>
              </section>
            </div>
          </article>
        </div>
      </section>
    </main>
  );
}
