"use client";

import { ActionButton } from "@/components/buttons";
import type {
  LocationPriceList,
  SpecificationItem,
  PaymentSchedule,
  PriceListNote,
} from "@/data/priceList";
import styles from "./PriceList.module.css";

interface PriceListClientProps {
  locationData: LocationPriceList;
  specifications: SpecificationItem[];
  specDisclaimer: string;
  paymentSchedules: PaymentSchedule[];
  notes: PriceListNote[];
}

function ArrowLeftIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={styles.backIcon}
    >
      <path d="m15 18-6-6 6-6" />
    </svg>
  );
}

function PinIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={styles.metaIcon}
    >
      <path d="M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 1 1 14 0Z" />
      <circle cx="12" cy="10" r="2.25" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={styles.metaIcon}
    >
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.12.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.58 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  );
}

function ButtonPhoneIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      width="16"
      height="16"
      aria-hidden="true"
    >
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.12.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.58 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  );
}

function BuildingIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={styles.metaIcon}
    >
      <path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z" />
      <path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2" />
      <path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2" />
      <path d="M10 6h4" />
      <path d="M10 10h4" />
      <path d="M10 14h4" />
      <path d="M10 18h4" />
    </svg>
  );
}

function formatCurrency(amount: number): string {
  return amount.toLocaleString("en-IN");
}

export function PriceListClient({
  locationData,
  specifications,
  paymentSchedules,
  notes,
}: PriceListClientProps) {
  return (
    <div className={styles.page}>
      <div className={styles.container}>

        <article className={styles.mainCard}>
          <div className={styles.cardHeader}>
            <div className={styles.branchHeaderTop}>
            </div>

            <div className={styles.infoCardsGrid}>
              <div className={styles.infoCard}>
                <div className={styles.infoCardHeader}>
                  <span className={styles.iconWrap}>
                    <PinIcon />
                  </span>
                  <strong className={styles.infoCardTitle}>Site Address</strong>
                </div>
                <p className={styles.infoCardText}>{locationData.siteAddress}</p>
              </div>

              <div className={styles.infoCard}>
                <div className={styles.infoCardHeader}>
                  <span className={styles.iconWrap}>
                    <BuildingIcon />
                  </span>
                  <strong className={styles.infoCardTitle}>Office Address</strong>
                </div>
                <p className={styles.infoCardText}>{locationData.officeAddress}</p>
              </div>

              <div className={styles.infoCard}>
                <div className={styles.infoCardHeader}>
                  <span className={styles.iconWrap}>
                    <PhoneIcon />
                  </span>
                  <strong className={styles.infoCardTitle}>Contact Phone</strong>
                </div>
                <p className={styles.infoCardText}>
                  <a href={`tel:+977${locationData.phone}`}>
                    +977 {locationData.phone}
                  </a>
                </p>
              </div>
            </div>
          </div>

          {/* Pricing Table Section */}
          <section className={styles.tableSection} aria-labelledby="table-title">
            <div className={styles.sectionHeadingRow}>
              <div>
                <h3 id="table-title" className={styles.sectionTitle}>
                  Price List of Duplex &amp; Bungalow
                </h3>
                <p className={styles.sectionSubtitle}>
                  Effective Date From {locationData.effectiveFrom} to{" "}
                  {locationData.effectiveTo}
                </p>
              </div>
              <span className={styles.currencyBadge}>All prices in NPR</span>
            </div>

            <div className={styles.tableWrapper}>
              <table className={styles.priceTable}>
                <thead>
                  <tr>
                    <th scope="col">Model Bungalow</th>
                    <th scope="col">Land Area (Sq.Ft.)</th>
                    <th scope="col">Carpet Area (Sq.Ft.)</th>
                    <th scope="col">B.U.A. (Sq.Ft.)</th>
                    <th scope="col" className={styles.priceCol}>
                      Luxury Cost (NPR)
                    </th>
                    <th scope="col" className={styles.ooeCol}>
                      O.O.E. (NPR)
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {locationData.models.map((model) => (
                    <tr key={model.name}>
                      <th scope="row" className={styles.modelNameCell}>
                        <span className={styles.modelNameText}>
                          {model.name}
                        </span>
                        {model.config && (
                          <span className={styles.modelBadge}>
                            {model.config}
                          </span>
                        )}
                      </th>
                      <td>{model.landArea.toLocaleString()}</td>
                      <td>{model.carpetArea.toLocaleString()}</td>
                      <td>{model.builtupArea.toLocaleString()}</td>
                      <td className={styles.priceValue}>
                        रु {formatCurrency(model.luxuryCost)}
                      </td>
                      <td className={styles.ooeValue}>
                        रु {formatCurrency(model.ooe)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className={styles.ooeNote}>
              * O.O.E.: Other Operating Expenses extra.
            </p>
          </section>

          {/* Specifications Section */}
          <section
            className={styles.specSection}
            aria-labelledby="spec-heading"
          >
            <h3 id="spec-heading" className={styles.sectionTitle}>
              Specification (Luxury)
            </h3>
            <p className={styles.sectionSubtitle}>
              Standard premium materials and finishes included in every residence.
            </p>

            <dl className={styles.specGrid}>
              {specifications.map((item) => (
                <div key={item.particular} className={styles.specItem}>
                  <dt className={styles.specParticular}>{item.particular}</dt>
                  <dd className={styles.specValue}>{item.luxury}</dd>
                </div>
              ))}
            </dl>
          </section>

          {/* Bottom Grid: Payment Schedules & Notes */}
          <div className={styles.bottomGrid}>
            {/* Payment Schedules */}
            <section
              className={styles.paymentSection}
              aria-labelledby="payment-heading"
            >
              <h3 id="payment-heading" className={styles.sectionTitle}>
                Payment Schedules
              </h3>
              <p className={styles.sectionSubtitle}>
                Staged milestone payments linked to construction progress.
              </p>

              <div className={styles.scheduleGrid}>
                {paymentSchedules.map((schedule) => (
                  <div key={schedule.type} className={styles.scheduleCard}>
                    <h4 className={styles.scheduleType}>{schedule.type}</h4>
                    <ol className={styles.scheduleList}>
                      {schedule.steps.map((step) => (
                        <li key={step.step} className={styles.scheduleStep}>
                          {step.description}
                        </li>
                      ))}
                    </ol>
                  </div>
                ))}
              </div>
            </section>

            {/* Notes Section */}
            <section
              className={styles.notesSection}
              aria-labelledby="notes-heading"
            >
              <h3 id="notes-heading" className={styles.sectionTitle}>
                Important Notes &amp; Terms
              </h3>
              <p className={styles.sectionSubtitle}>
                Key operational policies, taxation, and legal jurisdiction.
              </p>

              <ol className={styles.notesList}>
                {notes.map((note) => (
                  <li key={note.id} className={styles.noteItem}>
                    <span>{note.text}</span>
                  </li>
                ))}
              </ol>
            </section>
          </div>

          {/* CTA Cards Section */}
          <section
            className={styles.ctaSection}
            aria-label="Next steps and enquiries"
          >
            <div className={styles.ctaCards}>
              <article className={`${styles.ctaCard} ${styles.siteVisitCard}`}>
                <div className={styles.ctaMeta}>
                  <span className={styles.ctaTag}>On-Site Tour</span>
                  <span className={styles.ctaCategory}>Direct Consultation</span>
                </div>
                <h4 className={styles.ctaTitle}>
                  Schedule an In-Person Site Visit
                </h4>
                <p className={styles.ctaDescription}>
                  Tour our {locationData.location} township, inspect
                  earthquake-resistant raft foundations first-hand, and select
                  your preferred bungalow plot with our on-site team.
                </p>
                <div className={styles.ctaActionWrapper}>
                  <ActionButton
                    text="Book Now"
                    href={`tel:+977${locationData.phone}`}
                    icon={<ButtonPhoneIcon />}
                    className={styles.ctaActionBtn}
                  />
                </div>
              </article>

              <article className={`${styles.ctaCard} ${styles.branchCtaCard}`}>
                <div className={styles.ctaMeta}>
                  <span className={styles.ctaTag}>Branch Offices</span>
                  <span className={styles.ctaCategory}>Regional Desks</span>
                </div>
                <h4 className={styles.ctaTitle}>
                  Connect With Regional Branches
                </h4>
                <p className={styles.ctaDescription}>
                  Speak directly with our regional teams for official booking
                  procedures, documentation, and pricing confirmations.
                </p>
                <div className={styles.ctaActionWrapper}>
                  <div className={styles.branchBtnsGroup}>
                    <ActionButton
                      text="Book Now (Birtamode)"
                      href="tel:+9779705191816"
                      icon={<ButtonPhoneIcon />}
                      className={styles.ctaActionBtn}
                    />
                    <ActionButton
                      text="Book Now (Birgunj)"
                      href="tel:+9779802591815"
                      icon={<ButtonPhoneIcon />}
                      className={styles.ctaActionBtn}
                    />
                  </div>
                </div>
              </article>
            </div>
          </section>
        </article>
      </div>
    </div>
  );
}

export default PriceListClient;
