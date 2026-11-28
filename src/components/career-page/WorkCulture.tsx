import Image from "next/image";
import styles from "./WorkCulture.module.css";

function TeamIcon() {
  return (
    <svg data-career-draw
      viewBox="0 0 24 24"
      width="22"
      height="22"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle pathLength={1} cx="12" cy="7.5" r="2.75" />
      <path pathLength={1} d="M8 19.5v-1.25a4 4 0 0 1 8 0v1.25" />
      <circle pathLength={1} cx="5.5" cy="9.5" r="2" />
      <path pathLength={1} d="M2.5 19.5v-.75a3 3 0 0 1 3.75-2.9" />
      <circle pathLength={1} cx="18.5" cy="9.5" r="2" />
      <path pathLength={1} d="M21.5 19.5v-.75a3 3 0 0 0-3.75-2.9" />
    </svg>
  );
}

function GrowthIcon() {
  return (
    <svg data-career-draw
      viewBox="0 0 24 24"
      width="22"
      height="22"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path pathLength={1} d="M7 20V10" />
      <path pathLength={1} d="M7 14c-2.5 0-4-1.5-4-4 2.5 0 4 1.5 4 4Z" />
      <path pathLength={1} d="M7 11c0-3 2-5 5-5 0 3-2 5-5 5Z" />
      <path pathLength={1} d="M13 17l5-5" />
      <path pathLength={1} d="M14 12h4v4" />
    </svg>
  );
}

function BalanceIcon() {
  return (
    <svg data-career-draw
      viewBox="0 0 24 24"
      width="22"
      height="22"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path pathLength={1} d="M12 3v17" />
      <path pathLength={1} d="M8 20h8" />
      <path pathLength={1} d="M4 7h16" />
      <path pathLength={1} d="M4 7 2 13h4L4 7Z" />
      <path pathLength={1} d="M20 7l-2 6h4l-2-6Z" />
      <path pathLength={1} d="M2 13a2 2 0 0 0 4 0" />
      <path pathLength={1} d="M18 13a2 2 0 0 0 4 0" />
    </svg>
  );
}

function RecognitionIcon() {
  return (
    <svg data-career-draw
      viewBox="0 0 24 24"
      width="22"
      height="22"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle pathLength={1} cx="12" cy="9" r="5.5" />
      <path pathLength={1} d="m12 6.2.85 1.75 1.93.28-1.4 1.36.33 1.92L12 10.6l-1.71.91.33-1.92-1.4-1.36 1.93-.28L12 6.2Z" />
      <path pathLength={1} d="M8.8 13.8 7.5 21l4.5-2.25L16.5 21l-1.3-7.2" />
    </svg>
  );
}

const CULTURE_PILLARS = [
  {
    id: "collaborative-teams",
    title: "Collaborative Teams",
    description: "Work with passionate and supportive people.",
    Icon: TeamIcon,
  },
  {
    id: "continuous-growth",
    title: "Continuous Growth",
    description: "Learn, upskill and build a long-term career.",
    Icon: GrowthIcon,
  },
  {
    id: "work-life-balance",
    title: "Work-Life Balance",
    description: "A flexible and healthy work environment.",
    Icon: BalanceIcon,
  },
  {
    id: "recognition-rewards",
    title: "Recognition & Rewards",
    description: "Your efforts are seen, valued and celebrated.",
    Icon: RecognitionIcon,
  },
];

export function WorkCulture() {
  return (
    <section
      className={styles.section} data-site-motion="off"
      aria-labelledby="work-culture-heading"
    >
      <div className="container">
        <div className={styles.layout}>
          {/* Left Column: Intro + 2x2 Culture Grid */}
          <div className={styles.leftCol}>
            <h2
              id="work-culture-heading"
              className={styles.heading} data-site-reveal="group"
            >
              Our Work Culture at{" "}
              <span className={styles.heading}>Vastu Vihar</span>
            </h2>

            <p
              className={styles.description} data-site-reveal="group"
            >
              A people-first, growth-driven and collaborative environment where
              ideas are valued, learning is continuous and every contribution
              makes a real impact.
            </p>

            <div className={styles.pillarsGrid}>
              {CULTURE_PILLARS.map(({ id, title, description, Icon }) => (
                <div
                  key={id}
                  className={styles.pillarItem} data-site-reveal="group"
                >
                  <span className={styles.iconBox}>
                    <Icon />
                  </span>
                  <div className={styles.pillarText}>
                    <h3 className={styles.pillarTitle}>{title}</h3>
                    <p className={styles.pillarDesc}>{description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Slanted 3-Image Collage */}
          <div className={styles.collage}>
            <div className={`${styles.photoCard} ${styles.photoTop}`} data-site-reveal="group">
              <Image
                src="/career/2.webp"
                alt="Vastu Vihar Nepal team collaborating around plans"
                fill
                sizes="(max-width: 1024px) 100vw, 52vw"
                className={styles.photo}
              />
            </div>

            <div className={`${styles.photoCard} ${styles.photoBottomLeft}`} data-site-reveal="group">
              <Image
                src="/career/3.webp"
                alt="Relaxed and collaborative studio space at Vastu Vihar Nepal"
                fill
                sizes="(max-width: 1024px) 50vw, 26vw"
                className={styles.photo}
              />
            </div>

            <div className={`${styles.photoCard} ${styles.photoBottomRight}`} data-site-reveal="group">
              <Image
                src="/career/4.webp"
                alt="On-site teamwork and quality supervision at Vastu Vihar Nepal"
                fill
                sizes="(max-width: 1024px) 50vw, 26vw"
                className={styles.photo}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
