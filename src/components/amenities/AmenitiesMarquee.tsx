import { amenitiesData } from "@/data/amenities";
import styles from "./AmenitiesMarquee.module.css";

export function AmenitiesMarquee() {
  return (
    <section className={styles.section} aria-label="Township Amenities">
      <div className={styles.viewport}>
        <div className={styles.track}>
          {/* Track Copy 1 */}
          <div className={styles.group}>
            {amenitiesData.map((item, idx) => (
              <div key={`amenity-${idx}`} className={styles.item}>
                <span className={styles.text}>{item.name}</span>
                <span className={styles.separator} aria-hidden="true" />
              </div>
            ))}
          </div>

          {/* Track Copy 2 (Seamless Loop) */}
          <div className={styles.group} aria-hidden="true">
            {amenitiesData.map((item, idx) => (
              <div key={`amenity-dup-${idx}`} className={styles.item}>
                <span className={styles.text}>{item.name}</span>
                <span className={styles.separator} aria-hidden="true" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
