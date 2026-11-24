import type { Metadata } from "next";
import { PageHero } from "@/components/common/PageHero";
import styles from "@/components/legal/LegalPage.module.css";

export const metadata: Metadata = {
  title: "Terms & Conditions | Vastu Vihar Nepal",
  description:
    "Review the terms and conditions governing your use of the Vastu Vihar Nepal website and services.",
};

export default function TermsPage() {
  return (
    <main>
      <PageHero
        location="Terms & Conditions"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Terms & Conditions" },
        ]}
        bgImage="/brand-bg.webp"
        bgImageAlt="Terms and Conditions Vastu Vihar Nepal"
        headingLine1="Terms &,"
        headingLine2="Conditions"
      />

      <section className={styles.section} aria-label="Terms and Conditions document">
        <div className="container">
          <article className={styles.article}>
            <header className={styles.header}>
              <h1 className={styles.title}>Terms &amp; Conditions</h1>
              <p className={styles.subtitle}>
                Welcome to vastuviharnepal.netlify.app. By accessing or using this website, you agree to comply with and be bound by the following Terms &amp; Conditions. If you do not agree, please do not use the website.
              </p>
            </header>

            <div className={styles.callout}>
              <strong>Notice:</strong> By submitting our webform, you agree to receive calls on the number shared, and such calls and SMS would be coming from a third-party platform.
            </div>

            <div className={styles.content}>
              <section className={styles.block}>
                <h2 className={styles.blockTitle}>1. Website Use</h2>
                <ul className={styles.list}>
                  <li className={styles.listItem}>You agree to use this website only for lawful purposes.</li>
                  <li className={styles.listItem}>You must not attempt to disrupt, damage, or gain unauthorized access to the website or its systems.</li>
                </ul>
              </section>

              <section className={styles.block}>
                <h2 className={styles.blockTitle}>2. Information Accuracy</h2>
                <ul className={styles.list}>
                  <li className={styles.listItem}>Website content is for general informational purposes and may change without notice.</li>
                  <li className={styles.listItem}>Project details, pricing, availability, specifications, and timelines are subject to revisions and approvals.</li>
                </ul>
              </section>

              <section className={styles.block}>
                <h2 className={styles.blockTitle}>3. Intellectual Property</h2>
                <p className={styles.text}>
                  All content on this website (text, images, logos, graphics, layout, and design) is the property of Vastu Vihar / Technoculture and may not be copied, reproduced, or distributed without written permission.
                </p>
              </section>

              <section className={styles.block}>
                <h2 className={styles.blockTitle}>4. Third-Party Links</h2>
                <p className={styles.text}>
                  This website may contain links to third-party websites. Vastu Vihar is not responsible for the content, policies, or practices of external sites.
                </p>
              </section>

              <section className={styles.block}>
                <h2 className={styles.blockTitle}>5. Limitation of Liability</h2>
                <p className={styles.text}>
                  Vastu Vihar shall not be liable for any indirect, incidental, or consequential damages arising from the use of this website. Use of the website is at your own risk.
                </p>
              </section>

              <section className={styles.block}>
                <h2 className={styles.blockTitle}>6. Governing Law</h2>
                <p className={styles.text}>
                  These Terms &amp; Conditions are governed by the laws of India. Any disputes shall be subject to the jurisdiction of the competent courts in India.
                </p>
              </section>

              <section className={styles.block}>
                <h2 className={styles.blockTitle}>7. Contact</h2>
                <p className={styles.text}>
                  For questions about these Terms &amp; Conditions, contact:{" "}
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
