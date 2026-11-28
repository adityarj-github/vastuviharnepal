"use client";

import { useState } from "react";
import { ActionButton } from "@/components/buttons";
import type {
  LocationPriceList,
  SpecificationItem,
  PaymentSchedule,
  PriceListNote,
} from "@/data/priceList";
import type { PdfTemplate, PriceListProject } from "@/lib/priceListTypes";
import styles from "./PriceList.module.css";

interface PriceListClientProps {
  locationData: LocationPriceList;
  specifications: SpecificationItem[];
  specDisclaimer?: string;
  paymentSchedules: PaymentSchedule[];
  notes: PriceListNote[];
  project?: PriceListProject | null;
  pdfTemplate?: PdfTemplate | null;
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
      className={styles.detailIcon}
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
      className={styles.detailIcon}
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
      className={styles.detailIcon}
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

function DownloadIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={styles.downloadIcon}
      aria-hidden="true"
    >
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  );
}

function formatCurrency(amount: number): string {
  return amount.toLocaleString("en-IN");
}

function locationDataToProject(
  loc: LocationPriceList,
  specs: SpecificationItem[],
  schedules: PaymentSchedule[],
  noteItems: PriceListNote[]
): PriceListProject {
  const cleanSlug = loc.location.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  return {
    slug: cleanSlug,
    projectName:
      loc.location.includes("Township") || loc.location.includes("Phase")
        ? loc.location
        : `${loc.location} Township`,
    citySlug: cleanSlug,
    phaseLabel: "Phase 1",
    effectiveDate: `${loc.effectiveFrom} to ${loc.effectiveTo}`,
    officeAddress: loc.officeAddress,
    siteAddress: loc.siteAddress,
    contactPhones: loc.phone,
    email: "info@vastuvihar.org",
    bookingStatus: "Booking Open",
    footerMessage: "Thanks For Visiting Vastu Vihar Nepal",
    bungalows: loc.models.map((m) => ({
      name: m.name,
      model: m.config,
      carpetArea: String(m.carpetArea),
      builtUpArea: String(m.builtupArea),
      landArea: String(m.landArea),
      luxuryPrice: (m.luxuryCost || 0).toLocaleString("en-IN"),
      deluxePrice: (m as any).deluxeCost
        ? ((m as any).deluxeCost as number).toLocaleString("en-IN")
        : undefined,
    })),
    flats: [],
    shops: [],
    parking: [
      {
        name: "Reserved Bungalow Parking",
        size: "12x18 Ft",
        price: "Included in Villa",
      },
    ],
    paymentSchedules: schedules.map((ps) => ({
      title: ps.type,
      steps: ps.steps.map((s) => s.description),
    })),
    specifications: specs.map((s) => ({
      particular: s.particular,
      deluxe: s.luxury,
      luxury: s.luxury,
    })),
    specificationNote:
      "Specifications are subject to standard architectural tolerances. High earthquake-resistant standards.",
    notes: noteItems.map((n) => n.text),
  };
}

export function PriceListClient({
  locationData,
  specifications,
  paymentSchedules,
  notes,
  project,
  pdfTemplate,
}: PriceListClientProps) {
  const [downloading, setDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState<string | null>(null);

  const hasDeluxe = locationData.models.some(
    (m) => typeof (m as any).deluxeCost === "number" && (m as any).deluxeCost > 0
  );

  const handleDownloadPdf = async () => {
    setDownloading(true);
    setDownloadError(null);
    try {
      const { downloadPriceListPdf } = await import("@/lib/priceListPdf");
      const targetProject =
        project ||
        locationDataToProject(
          locationData,
          specifications,
          paymentSchedules,
          notes
        );
      await downloadPriceListPdf(targetProject, pdfTemplate || undefined);
    } catch (err) {
      console.error("Price list PDF generation failed:", err);
      setDownloadError("Could not generate PDF. Please try again.");
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        {/* Branch Details Row: Outside any card, no border, no box shadow */}
        <div className={styles.branchDetails}>
          <div className={styles.detailItem}>
            <span className={styles.detailIconWrap}>
              <PinIcon />
            </span>
            <div className={styles.detailContent}>
              <span className={styles.detailLabel}>Site Address</span>
              <p className={styles.detailText}>{locationData.siteAddress}</p>
            </div>
          </div>

          <div className={styles.detailItem}>
            <span className={styles.detailIconWrap}>
              <BuildingIcon />
            </span>
            <div className={styles.detailContent}>
              <span className={styles.detailLabel}>Office Address</span>
              <p className={styles.detailText}>{locationData.officeAddress}</p>
            </div>
          </div>

          <div className={styles.detailItem}>
            <span className={styles.detailIconWrap}>
              <PhoneIcon />
            </span>
            <div className={styles.detailContent}>
              <span className={styles.detailLabel}>Contact Phone</span>
              <p className={styles.detailText}>
                <a href={`tel:+977${locationData.phone}`}>
                  +977 {locationData.phone}
                </a>
              </p>
            </div>
          </div>
        </div>

        {/* Content Sections: No Outer Card, No Outer Border, No Box Shadow */}
        <div className={styles.contentWrap}>
          {/* Pricing Table Section */}
          <section className={styles.tableSection} aria-labelledby="table-title">
            <div className={styles.sectionHeadingRow}>
              <div className={styles.headingLeft}>
                <h3 id="table-title" className={styles.sectionTitle}>
                  Price List of Duplex &amp; Bungalow
                </h3>
                <p className={styles.sectionSubtitle}>
                  Effective Date From {locationData.effectiveFrom}{" "}
                  {locationData.effectiveTo ? `to ${locationData.effectiveTo}` : ""}
                </p>
                {downloadError && (
                  <p className={styles.downloadErrorText} role="alert">
                    {downloadError}
                  </p>
                )}
              </div>
              <div className={styles.headingRight}>
                <span className={styles.currencyBadge}>All prices in NPR</span>
                <button
                  type="button"
                  onClick={handleDownloadPdf}
                  disabled={downloading}
                  className={styles.downloadBtn}
                  aria-label="Download Price List PDF"
                >
                  <DownloadIcon />
                  <span>
                    {downloading ? "Preparing PDF..." : "Download Price List (PDF)"}
                  </span>
                </button>
              </div>
            </div>

            <div className={styles.scrollHint}>
              <span aria-hidden="true">
                ⇄ Scroll horizontally to view full price list
              </span>
            </div>

            <div className={styles.tableWrapper}>
              <table className={styles.priceTable}>
                <thead>
                  <tr>
                    <th scope="col">Model Bungalow</th>
                    <th scope="col">Land Area (Sq.Ft.)</th>
                    <th scope="col">Carpet Area (Sq.Ft.)</th>
                    <th scope="col">B.U.A. (Sq.Ft.)</th>
                    {hasDeluxe && (
                      <th scope="col" className={styles.priceCol}>
                        Deluxe Cost (NPR)
                      </th>
                    )}
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
                      {hasDeluxe && (
                        <td className={styles.priceValue}>
                          {typeof (model as any).deluxeCost === "number" &&
                            (model as any).deluxeCost > 0
                            ? `रु ${formatCurrency((model as any).deluxeCost)}`
                            : "—"}
                        </td>
                      )}
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

          {/* Optional Flats Table Section */}
          {project?.flats && project.flats.length > 0 && (
            <section
              className={styles.tableSection}
              aria-labelledby="flats-table-title"
            >
              <div className={styles.sectionHeadingRow}>
                <div className={styles.headingLeft}>
                  <h3 id="flats-table-title" className={styles.sectionTitle}>
                    Price List of Apartment &amp; Flat Units
                  </h3>
                  <p className={styles.sectionSubtitle}>
                    Modern multi-storey residential configurations with full amenities.
                  </p>
                </div>
              </div>
              <div className={styles.tableWrapper}>
                <table className={styles.priceTable}>
                  <thead>
                    <tr>
                      <th scope="col">Apartment Unit</th>
                      <th scope="col">Model / Type</th>
                      <th scope="col">Carpet Area (Sq.Ft.)</th>
                      <th scope="col">B.U.A. (Sq.Ft.)</th>
                      <th scope="col" className={styles.priceCol}>
                        Deluxe Cost (NPR)
                      </th>
                      <th scope="col" className={styles.priceCol}>
                        Luxury Cost (NPR)
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {project.flats.map((flat, idx) => (
                      <tr key={`${flat.name}-${idx}`}>
                        <th scope="row" className={styles.modelNameCell}>
                          <span className={styles.modelNameText}>
                            {flat.name}
                          </span>
                        </th>
                        <td>{flat.model || "—"}</td>
                        <td>{flat.carpetArea || "—"}</td>
                        <td>{flat.builtUpArea || "—"}</td>
                        <td className={styles.priceValue}>
                          {flat.deluxePrice ? `रु ${flat.deluxePrice}` : "—"}
                        </td>
                        <td className={styles.priceValue}>
                          {flat.luxuryPrice ? `रु ${flat.luxuryPrice}` : "—"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {/* Optional Commercial Shops Table Section */}
          {project?.shops && project.shops.length > 0 && (
            <section
              className={styles.tableSection}
              aria-labelledby="shops-table-title"
            >
              <div className={styles.sectionHeadingRow}>
                <div className={styles.headingLeft}>
                  <h3 id="shops-table-title" className={styles.sectionTitle}>
                    Commercial &amp; Shop Units
                  </h3>
                  <p className={styles.sectionSubtitle}>
                    Integrated retail opportunities positioned along the township frontage.
                  </p>
                </div>
              </div>
              <div className={styles.tableWrapper}>
                <table className={styles.priceTable}>
                  <thead>
                    <tr>
                      <th scope="col">Shop Unit</th>
                      <th scope="col">Model / Type</th>
                      <th scope="col">Carpet Area (Sq.Ft.)</th>
                      <th scope="col">Built-Up Area (Sq.Ft.)</th>
                      <th scope="col" className={styles.priceCol}>
                        Rate / Price (NPR)
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {project.shops.map((shop, idx) => (
                      <tr key={`${shop.name}-${idx}`}>
                        <th scope="row" className={styles.modelNameCell}>
                          <span className={styles.modelNameText}>
                            {shop.name}
                          </span>
                        </th>
                        <td>{shop.model || "Commercial"}</td>
                        <td>{shop.carpetArea || "—"}</td>
                        <td>{shop.builtUpArea || "—"}</td>
                        <td className={styles.priceValue}>
                          {shop.luxuryPrice || shop.deluxePrice
                            ? `रु ${shop.luxuryPrice || shop.deluxePrice}`
                            : "—"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {/* Specifications Section */}
          <section
            className={styles.specSection}
            aria-labelledby="spec-heading"
          >
            <div className={styles.sectionHeadingRow}>
              <div className={styles.headingLeft}>
                <h3 id="spec-heading" className={styles.sectionTitle}>
                  Specification (Luxury)
                </h3>
              </div>
              <p className={styles.sectionSubtitle}>
                Standard premium materials and finishes included in every residence.
              </p>
            </div>

            <dl className={styles.specGrid}>
              {specifications.map((item) => (
                <div key={item.particular} className={styles.specItem} data-site-reveal="group">
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
              <div className={styles.sectionHeadingRow}>
                <div className={styles.headingLeft}>
                  <h3 id="payment-heading" className={styles.sectionTitle}>
                    Payment Schedules
                  </h3>
                </div>
                <p className={styles.sectionSubtitle}>
                  Staged milestone payments linked to construction progress.
                </p>
              </div>

              <div className={styles.scheduleGrid}>
                {paymentSchedules.map((schedule) => (
                  <div key={schedule.type} className={styles.scheduleCard} data-site-reveal="group">
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
              <div className={styles.sectionHeadingRow}>
                <div className={styles.headingLeft}>
                  <h3 id="notes-heading" className={styles.sectionTitle}>
                    Important Notes &amp; Terms
                  </h3>
                </div>
                <p className={styles.sectionSubtitle}>
                  Key operational policies, taxation, and legal jurisdiction.
                </p>
              </div>

              <ol className={styles.notesList}>
                {notes.map((note) => (
                  <li key={note.id} className={styles.noteItem}>
                    <span>{note.text}</span>
                  </li>
                ))}
              </ol>
            </section>
          </div>

          {/* CTA Cards Section: Plain #f4f4f4 background, with Site Visit, Regional Call & PDF Download */}
          <section
            className={styles.ctaSection}
            aria-label="Next steps and enquiries"
          >
            <div className={styles.ctaCards}>
              <article className={styles.ctaCard}>
                <div className={styles.ctaMeta}>
                  <span className={styles.ctaTag}>Printable Brochure</span>
                  <span className={styles.ctaCategory}>Offline Reference</span>
                </div>
                <h4 className={styles.ctaTitle}>
                  Download Official Price List PDF
                </h4>
                <p className={styles.ctaDescription}>
                  Save a digital copy of the complete {locationData.location} pricing flyer,
                  including floor plans, milestone payment schedules, and luxury material specifications.
                </p>
                <div className={styles.ctaActionWrapper}>
                  <button
                    type="button"
                    onClick={handleDownloadPdf}
                    disabled={downloading}
                    className={styles.downloadBtn}
                    style={{
                      width: "100%",
                      justifyContent: "center",
                      height: "44px",
                      borderRadius: "12px",
                      fontSize: "0.88rem",
                    }}
                  >
                    <DownloadIcon />
                    <span>
                      {downloading ? "Preparing PDF..." : "Download Price List (PDF)"}
                    </span>
                  </button>
                </div>
              </article>

              <article className={styles.ctaCard}>
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
                    text="Book Site Visit"
                    href={`tel:+977${locationData.phone}`}
                    icon={<ButtonPhoneIcon />}
                    className={styles.ctaActionBtn}
                  />
                </div>
              </article>

              <article className={styles.ctaCard}>
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
                  <ActionButton
                    text="Call Regional Desk"
                    href={`tel:+977${locationData.phone}`}
                    icon={<ButtonPhoneIcon />}
                    className={styles.ctaActionBtn}
                  />
                </div>
              </article>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

export default PriceListClient;
