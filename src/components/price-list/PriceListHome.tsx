import Link from "next/link";
import { ActionButton } from "@/components/buttons";
import { priceListData } from "@/data/priceList";
import styles from "./PriceListHome.module.css";

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
      className={styles.iconSvg}
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
      className={styles.infoIcon}
    >
      <path d="M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 1 1 14 0Z" />
      <circle cx="12" cy="10" r="2.25" />
    </svg>
  );
}

function StackIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={styles.infoIcon}
    >
      <path d="M12 2 2 7l10 5 10-5-10-5Z" />
      <path d="m2 17 10 5 10-5" />
      <path d="m2 12 10 5 10-5" />
    </svg>
  );
}

export function PriceListHome() {
  return (
    <section className={styles.section} aria-labelledby="locations-heading">
      <div className={styles.container}>
        {/* Header Row: Heading on Left, Description on Right */}
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <h2 id="locations-heading" className={styles.heading}>
              Choose Your Location
            </h2>
          </div>
          <p className={styles.description}>
            Select a branch to view the complete price list, construction specifications, and staged milestone payment plans.
          </p>
        </div>

        <div className={styles.grid}>
          {priceListData.locations.map((loc) => {
            const slug = loc.location.toLowerCase();
            return (
              <article key={slug} className={styles.card}>
                {/* Overlay link to make whole card clickable */}
                <Link
                  href={`/price-list/${slug}`}
                  className={styles.cardOverlayLink}
                  aria-label={`View ${loc.location} Price Details`}
                  tabIndex={-1}
                />

                <div className={styles.cardHeader}>
                  <div className={styles.iconBadge}>
                    <BuildingIcon />
                  </div>
                  <div className={styles.headerText}>
                    <span className={styles.cardTag}>Nepal Branch</span>
                    <h3 className={styles.cardTitle}>{loc.location} Township</h3>
                  </div>
                </div>

                <div className={styles.cardBody}>
                  <div className={styles.infoGroup}>
                    <span className={styles.infoLabel}>Site Address</span>
                    <div className={styles.infoRow}>
                      <span className={styles.infoIconWrap}>
                        <PinIcon />
                      </span>
                      <p className={styles.infoText}>{loc.siteAddress}</p>
                    </div>
                  </div>

                  <div className={styles.infoGroup}>
                    <span className={styles.infoLabel}>Available Models</span>
                    <div className={styles.infoRow}>
                      <span className={styles.infoIconWrap}>
                        <StackIcon />
                      </span>
                      <p className={styles.infoText}>
                        {loc.models.length} property models with pricing and specifications
                      </p>
                    </div>
                  </div>
                </div>

                <div className={styles.cardFooter}>
                  <ActionButton
                    text="View Price Details"
                    href={`/price-list/${slug}`}
                  />
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
