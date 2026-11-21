import Image from "next/image";
import { amenitiesData } from "@/data/amenities";
import styles from "./AmenitiesMarquee.module.css";

export function AmenitiesMarquee() {
  return (
    <section className={styles.section} aria-label="Township Amenities">
      <div className={styles.viewport}>
        <div className={styles.track}>
          {/* Track Copy 1 */}
          <div className={styles.group}>
            {amenitiesData.map((item) => (
              <div key={item.src} className={styles.item}>
                <Image
                  src={item.src}
                  alt={item.alt}
                  width={0}
                  height={0}
                  sizes="200px"
                  className={styles.icon}
                />
              </div>
            ))}
          </div>

          {/* Track Copy 2 (Seamless Loop) */}
          <div className={styles.group} aria-hidden="true">
            {amenitiesData.map((item) => (
              <div key={`${item.src}-dup`} className={styles.item}>
                <Image
                  src={item.src}
                  alt=""
                  width={0}
                  height={0}
                  sizes="200px"
                  className={styles.icon}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}