import { PageHero } from "@/components/common/PageHero";
import { ActionButton } from "@/components/buttons";
import { priceListData } from "@/data/priceList";
import styles from "./PriceListHome.module.css";

function PinIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className={styles.infoIcon}
    >
      <path
        d="M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 1 1 14 0Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle
        cx="12"
        cy="10"
        r="2.25"
        stroke="currentColor"
        strokeWidth="1.8"
      />
    </svg>
  );
}

function StackIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className={styles.infoIcon}
    >
      <path
        d="M12 2 2 7l10 5 10-5-10-5Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="m2 17 10 5 10-5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="m2 12 10 5 10-5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function PriceListHome() {
  return (
    <main>
      <PageHero
        location="Price List"
        bgImage="/Images/price-list-hero.webp"
        bgImageAlt="Vastu Vihar Nepal Residential Townships Price List"
        headingLine1="Transparent Pricing,"
        headingLine2="For Every Family"
        description="Explore clear, transparent pricing, carpet area details, milestone payment schedules, and luxury specifications for our residential townships in Nepal."
      />

      <section className={styles.section} aria-labelledby="locations-heading">
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <h2 id="locations-heading" className={styles.heading}>
              Choose Your Location
            </h2>
            <p className={styles.subtext}>
              Select a branch to view the full price list, construction
              specifications, and payment plans.
            </p>
          </div>

          <div className={styles.grid}>
            {priceListData.locations.map((loc) => {
              const slug = loc.location.toLowerCase();
              return (
                <article key={slug} className={styles.card}>
                  {/* Decorative wave */}
                  <div className={styles.wave} aria-hidden="true" />

                  <div className={styles.cardBody}>
                    {/* Accent bar */}
                    <span className={styles.accentBar} aria-hidden="true" />

                    <p className={styles.branch}>Nepal Branch</p>
                    <h3 className={styles.locationName}>{loc.location}</h3>

                    <div className={styles.infoRows}>
                      <div className={styles.infoRow}>
                        <span className={styles.infoIconWrap}>
                          <PinIcon />
                        </span>
                        <p>{loc.siteAddress}</p>
                      </div>
                      <div className={styles.infoRow}>
                        <span className={styles.infoIconWrap}>
                          <StackIcon />
                        </span>
                        <p>
                          {loc.models.length} property models with pricing and
                          specifications
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className={styles.cardFooter}>
                    <ActionButton
                      text="View Price Details"
                      href={`/price-list/${slug}`}
                      className={styles.actionBtn}                    />
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>
    </main>
  );
}
