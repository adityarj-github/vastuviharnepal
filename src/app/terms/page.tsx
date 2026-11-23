import type { Metadata } from "next";
import { PageHero } from "@/components/common/PageHero";
import styles from "@/components/legal/LegalPage.module.css";

export const metadata: Metadata = {
  title: "Terms & Conditions | Vastu Vihar Nepal",
  description:
    "Review the terms and conditions governing property inquiries, site visits, architectural specifications, and booking agreements with Vastu Vihar Nepal.",
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
                Effective Date: November 2026. These terms govern your use of the Vastu Vihar Nepal website, inquiry forms, site visits, and booking reservations.
              </p>
            </header>

            <div className={styles.content}>
              <section className={styles.block}>
                <h2 className={styles.blockTitle}>1. Agreement to Terms</h2>
                <p className={styles.text}>
                  By accessing the Vastu Vihar Nepal website, submitting an inquiry, scheduling a township visit, or reserving a bungalow model, you agree to be bound by these Terms &amp; Conditions. If you do not agree with any part of these terms, please discontinue your use of our platform and services.
                </p>
              </section>

              <section className={styles.block}>
                <h2 className={styles.blockTitle}>2. Architectural Visuals &amp; Specifications</h2>
                <p className={styles.text}>
                  All 3D perspectives, elevation renders, layout sketches, and interior imagery displayed on this website are conceptual representations intended to guide perspective homeowners:
                </p>
                <ul className={styles.list}>
                  <li className={styles.listItem}>Actual dimensions, room orientations, and structural specifications are governed by the registered architectural drawing schedule executed in your formal allotment agreement.</li>
                  <li className={styles.listItem}>Vastu compliance configurations (e.g., Ishanya, Agneya alignments) are meticulously incorporated according to classical Vedic principles and verified civil engineering codes.</li>
                  <li className={styles.listItem}>Furniture, decor, vehicles, and landscaped plantings shown in photographs or digital renders are for illustrative purposes and are not included in base bungalow handovers unless explicitly agreed in writing.</li>
                </ul>
              </section>

              <section className={styles.block}>
                <h2 className={styles.blockTitle}>3. Booking, Allotment &amp; Land Ownership</h2>
                <p className={styles.text}>
                  Vastu Vihar Nepal ensures 100% legal transparency throughout the acquisition process:
                </p>
                <ul className={styles.list}>
                  <li className={styles.listItem}><strong>Expressions of Interest:</strong> Online inquiry submissions do not constitute an allotment or sale agreement. Allotments are confirmed only after execution of formal paperwork and verification of receipt of earnest booking deposit.</li>
                  <li className={styles.listItem}><strong>Title &amp; Registration:</strong> Land deeds and bungalow titles are transferred directly to the buyer upon completion and clearance of financial commitments under the land registry laws of Nepal (Malpot Karyalaya).</li>
                  <li className={styles.listItem}><strong>Payment Milestones:</strong> All payments must be remitted strictly through designated bank channels against official receipt acknowledgments.</li>
                </ul>
              </section>

              <div className={styles.callout}>
                <strong>Anti-Seismic &amp; Quality Guarantee:</strong> Every residential unit in Vastu Vihar Nepal townships is engineered with monolithic raft foundations, anti-seismic ductile detailing, and premium grade structural materials designed to withstand regional seismic risks.
              </div>

              <section className={styles.block}>
                <h2 className={styles.blockTitle}>4. Site Visits &amp; Safety Protocols</h2>
                <p className={styles.text}>
                  Visitors requesting accompanied visits to our township locations (such as Birgunj, Jhapa, and regional sites) must comply with on-site safety directives, visitor check-in procedures, and engineer guidance while touring active construction zones.
                </p>
              </section>

              <section className={styles.block}>
                <h2 className={styles.blockTitle}>5. Intellectual Property Rights</h2>
                <p className={styles.text}>
                  The name &quot;Vastu Vihar,&quot; our registered insignia, logos, architectural layouts, model designs (including Pashupati, Kanchanjunga, Sagarmatha, and Suryodaya), blueprints, and digital content are the exclusive intellectual property of Vastu Vihar Nepal. No reproduction, scraping, or commercial exploitation is permitted without prior written consent.
                </p>
              </section>

              <section className={styles.block}>
                <h2 className={styles.blockTitle}>6. Governing Law &amp; Dispute Resolution</h2>
                <p className={styles.text}>
                  These Terms &amp; Conditions are governed by and construed in accordance with the laws of Nepal. Any dispute, claim, or controversy arising out of or relating to your use of this platform or property reservations shall be subject to the exclusive jurisdiction of the competent courts in Nepal.
                </p>
              </section>

              <footer className={styles.contactBox}>
                <h2 className={styles.blockTitle}>Legal &amp; Allotment Inquiries</h2>
                <p className={styles.text}>
                  For questions concerning terms, booking agreements, or official land documentation, reach out to our legal liaison team:
                </p>
                <div className={styles.contactGrid}>
                  <div className={styles.contactItem}>
                    <span className={styles.contactItemLabel}>Official Email</span>
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
                    <span className={styles.contactItemLabel}>Head Office</span>
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
