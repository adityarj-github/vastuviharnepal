import type { Metadata } from "next";
import { PageHero } from "@/components/common/PageHero";
import styles from "@/components/legal/LegalPage.module.css";

export const metadata: Metadata = {
  title: "Privacy Policy | Vastu Vihar Nepal",
  description:
    "Learn how Vastu Vihar Nepal collects, protects, and utilizes your personal information and inquiry data across our planned townships and bungalow models.",
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
                Effective Date: November 2026. This policy outlines how Vastu Vihar Nepal collects, protects, and processes your personal data.
              </p>
            </header>

            <div className={styles.content}>
              <section className={styles.block}>
                <h2 className={styles.blockTitle}>1. Introduction &amp; Commitment</h2>
                <p className={styles.text}>
                  Vastu Vihar Nepal (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) is committed to safeguarding the privacy and personal data of our prospective homeowners, investors, visitors, and clients. We adhere to high ethical and legal standards regarding the confidentiality and protection of personal details collected through our website, site offices, and customer support desks.
                </p>
              </section>

              <section className={styles.block}>
                <h2 className={styles.blockTitle}>2. Information We Collect</h2>
                <p className={styles.text}>
                  When you submit inquiries, book site visits, or express interest in our bungalow models and townships, we may collect:
                </p>
                <ul className={styles.list}>
                  <li className={styles.listItem}><strong>Contact Information:</strong> Full name, phone number, email address, and residential city.</li>
                  <li className={styles.listItem}><strong>Property Preferences:</strong> Preferred bungalow model (e.g., Pashupati, Kanchanjunga, Sagarmatha, Suryodaya), intended budget range, and timeline.</li>
                  <li className={styles.listItem}><strong>Communication History:</strong> Records of your inquiries, site visit bookings, and feedback submitted through our contact forms.</li>
                  <li className={styles.listItem}><strong>Technical Data:</strong> Basic device parameters, browser type, and anonymous analytics to improve website accessibility and user experience.</li>
                </ul>
              </section>

              <section className={styles.block}>
                <h2 className={styles.blockTitle}>3. How We Use Your Information</h2>
                <p className={styles.text}>
                  We use the information collected exclusively for legitimate real estate advisory and customer service purposes:
                </p>
                <ul className={styles.list}>
                  <li className={styles.listItem}>To contact you with requested pricing, brochure downloads, floor plans, and township site visit schedules.</li>
                  <li className={styles.listItem}>To verify customer identity during booking registration and land title document preparation.</li>
                  <li className={styles.listItem}>To send transactional alerts, appointment confirmations, and important project construction milestones via call, SMS, or WhatsApp.</li>
                  <li className={styles.listItem}>To improve our architectural models, amenities, and residential services based on homeowner feedback.</li>
                </ul>
              </section>

              <div className={styles.callout}>
                <strong>No Third-Party Data Selling:</strong> Vastu Vihar Nepal never sells, rents, trades, or commercially distributes your personal contact information to external advertisers or unsolicited third-party brokers.
              </div>

              <section className={styles.block}>
                <h2 className={styles.blockTitle}>4. Consent &amp; Communication Preferences</h2>
                <p className={styles.text}>
                  By ticking our consent checkbox and submitting an inquiry on our models or contact page, you explicitly grant consent for our housing advisors to contact you. You may withdraw your consent or opt out of promotional communications at any time by notifying our support desk via email or phone.
                </p>
              </section>

              <section className={styles.block}>
                <h2 className={styles.blockTitle}>5. Data Security &amp; Retention</h2>
                <p className={styles.text}>
                  We implement robust technical and organizational security protocols to shield your personal records from unauthorized access, alteration, or disclosure. Personal inquiry data is securely stored and retained only for as long as necessary to facilitate your housing inquiry, transaction, and legal compliance under applicable laws of Nepal.
                </p>
              </section>

              <section className={styles.block}>
                <h2 className={styles.blockTitle}>6. Your Rights</h2>
                <p className={styles.text}>
                  You retain the right to review, update, correct, or request the deletion of your personal records from our databases. For any data subject requests, please contact our privacy compliance desk using the details below.
                </p>
              </section>

              <footer className={styles.contactBox}>
                <h2 className={styles.blockTitle}>Privacy &amp; Data Protection Desk</h2>
                <p className={styles.text}>
                  If you have questions about this Privacy Policy or wish to exercise your data rights, please contact us:
                </p>
                <div className={styles.contactGrid}>
                  <div className={styles.contactItem}>
                    <span className={styles.contactItemLabel}>Email Support</span>
                    <a href="mailto:info@vastuvihar.org" className={styles.contactItemValue}>
                      info@vastuvihar.org
                    </a>
                  </div>
                  <div className={styles.contactItem}>
                    <span className={styles.contactItemLabel}>Direct Phone</span>
                    <a href="tel:+9779705191815" className={styles.contactItemValue}>
                      +977 - 97051-91815
                    </a>
                  </div>
                  <div className={styles.contactItem}>
                    <span className={styles.contactItemLabel}>Office Location</span>
                    <span className={styles.contactItemValue}>
                      Mukti Chowk, Birtamode, Jhapa
                    </span>
                  </div>
                </div>
              </footer>
            </div>
          </article>
        </div>
      </section>
    </main>
  );
}
