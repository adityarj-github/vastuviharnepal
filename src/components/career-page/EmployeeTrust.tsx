import Image from "next/image";
import { StatCounter } from "@/components/home/StatCounter";
import styles from "./EmployeeTrust.module.css";

const TEAM_AVATARS = [
  { src: "/member/1.png", pos: "50% 20%", alt: "Vastu Vihar team member" },
  { src: "/member/2.png", pos: "50% 20%", alt: "Vastu Vihar engineer" },
  { src: "/member/3.png", pos: "50% 20%", alt: "Vastu Vihar architect" },
  { src: "/member/4.png", pos: "50% 20%", alt: "Vastu Vihar site lead" },
  { src: "/member/5.png", pos: "50% 20%", alt: "Vastu Vihar planner" },
  { src: "/member/6.png", pos: "50% 20%", alt: "Vastu Vihar advisor" },
  { src: "/member/7.png", pos: "50% 20%", alt: "Vastu Vihar designer" },
  { src: "/member/8.png", pos: "50% 20%", alt: "Vastu Vihar supervisor" },
];

function SparkleIcon() {
  return (
    <svg data-career-draw
      viewBox="0 0 24 24"
      width="22"
      height="22"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <path pathLength={1} d="M12 2v20" />
      <path pathLength={1} d="M2 12h20" />
      <path pathLength={1} d="m4.93 4.93 14.14 14.14" />
      <path pathLength={1} d="m19.07 4.93-14.14 14.14" />
    </svg>
  );
}

function LaurelBadge() {
  const laurel = (
    <>
      <path pathLength={1} d="M129 232C64 215 17 153 35 28" fill="none" stroke="currentColor" strokeWidth="4.3" strokeLinecap="round"/>
      <path data-career-fill d="M120 223C118 212 101 205 93 206C96 214 109 225 120 223Z
        M100 207C98 196 81 189 73 190C76 198 89 210 100 207Z
        M100 207C110 202 114 183 112 175C105 180 96 196 100 207Z
        M83 186C81 175 64 168 56 169C59 177 72 189 83 186Z
        M83 186C93 181 97 162 95 154C88 159 79 175 83 186Z
        M68 164C66 153 49 146 41 147C44 155 57 166 68 164Z
        M68 164C78 159 82 140 80 132C73 137 64 153 68 164Z
        M56 140C54 129 37 122 29 123C32 131 45 143 56 140Z
        M56 140C66 135 70 116 68 108C61 113 52 129 56 140Z
        M46 114C44 103 27 96 19 97C22 105 35 117 46 114Z
        M46 114C56 109 60 90 58 82C51 87 42 103 46 114Z
        M39 89C37 78 20 71 12 72C15 80 28 92 39 89Z
        M39 89C49 84 53 65 51 57C44 62 35 78 39 89Z
        M36 63C34 52 17 45 9 46C12 54 25 66 36 63Z
        M36 63C46 58 50 39 48 31C41 36 32 52 36 63Z
        M36 39C34 30 21 25 14 25C17 32 27 41 36 39Z
        M36 39C44 35 47 20 46 13C40 17 33 31 36 39Z"/>
    </>
  );
  return (
    <svg data-career-draw data-career-award role="img" aria-label="Trusted Employer Nepal" className={styles.awardBadge} width="125" height="64" viewBox="0 0 500 256">
      <title>Trusted Employer Nepal</title>

      <g color="#fff" fill="currentColor">
        {laurel}
        <g transform="translate(500 0) scale(-1 1)">{laurel}</g>
        <g data-career-fill textAnchor="middle" fontFamily="Arial, Helvetica, sans-serif" fontWeight="800">
          <text x="250" y="52" fontSize="23" letterSpacing="3">VASTU VIHAR</text>
          <text x="250" y="110" fontSize="53" letterSpacing="1">TRUSTED</text>
          <text x="250" y="156" fontSize="47" letterSpacing="1">EMPLOYER</text>
          <text x="250" y="229" fontSize="30" letterSpacing="4">NEPAL</text>
        </g>
        <path data-career-fill d="M0-10 2.9-3.2 10-2.6 4.6 2 6.2 9 0 5.2-6.2 9-4.6 2-10-2.6-2.9-3.2Z" transform="translate(186 184)"/>
        <path data-career-fill d="M0-10 2.9-3.2 10-2.6 4.6 2 6.2 9 0 5.2-6.2 9-4.6 2-10-2.6-2.9-3.2Z" transform="translate(218 184)"/>
        <path data-career-fill d="M0-10 2.9-3.2 10-2.6 4.6 2 6.2 9 0 5.2-6.2 9-4.6 2-10-2.6-2.9-3.2Z" transform="translate(250 184)"/>
        <path data-career-fill d="M0-10 2.9-3.2 10-2.6 4.6 2 6.2 9 0 5.2-6.2 9-4.6 2-10-2.6-2.9-3.2Z" transform="translate(282 184)"/>
        <path data-career-fill d="M0-10 2.9-3.2 10-2.6 4.6 2 6.2 9 0 5.2-6.2 9-4.6 2-10-2.6-2.9-3.2Z" transform="translate(314 184)"/>
        <path pathLength={1} d="M146 219h31m146 0h31" fill="none" stroke="currentColor" strokeWidth="2"/>
      </g>
    </svg>
  );
}

export function EmployeeTrust() {
  return (
    <section
      className={styles.section} data-site-motion="off"
      aria-labelledby="employee-trust-heading"
    >
      <div className="container">
        <div className={styles.frame}>
          {/* Left Column */}
          <div className={styles.leftCol} data-site-reveal="group">
            <div className={styles.headingRow}>
              <h2 id="employee-trust-heading" className={styles.heading}>
                Trusted by
                <br />
                750+ Team
                <br />
                Members
                <br />
                Across Nepal
              </h2>
              <span className={styles.sparkle}>
                <SparkleIcon />
              </span>
            </div>

            <p className={styles.description}>
              Every township we deliver is powered by engineers, architects, and
              advisors who build long-term, rewarding careers with Vastu Vihar
              Nepal.
            </p>
          </div>

          {/* Right Cards */}
          <div className={styles.cardsGrid}>
            {/* Card 1: Light Card with 4x2 Team Grid + 750+ Employees */}
            <article
              className={styles.lightCard} data-site-reveal="group"
            >
              <div className={styles.avatarGrid}>
                {TEAM_AVATARS.map((avatar, idx) => (
                  <div
                    key={idx}
                    className={styles.avatarWrap} data-site-reveal="group"
                  >
                    <Image
                      src={avatar.src}
                      alt={avatar.alt}
                      fill
                      sizes="60px"
                      className={styles.avatarImg}
                      style={{ objectPosition: avatar.pos }}
                    />
                  </div>
                ))}
              </div>

              <div className={styles.lightCardFooter}>
                <StatCounter target={750} suffix="+" className={styles.bigStat} />
                <span className={styles.statCaption}>
                  Dedicated
                  <br />
                  Employees
                </span>
              </div>
            </article>

            {/* Card 2: Trust Card with 32+ Years of Trust + Laurel */}
            <article
              className={styles.darkCard} data-site-reveal="group"
            >
              <div className={styles.darkCardTop}>
                <div>
                  <StatCounter target={32} suffix="+" className={styles.darkStat} />
                  <span className={styles.darkStatLabel}>Years of Trust</span>
                </div>
                <LaurelBadge />
              </div>

              <p className={styles.darkCardDesc}>
                Building lasting careers through monolithic engineering,
                mentorship, and 20k+ homes delivered across 2 countries.
              </p>
            </article>

            {/* Card 3: Portrait Image Card */}
            <div className={styles.photoCard} data-site-reveal="group">
              <Image
                src="/career/4.webp"
                alt="Vastu Vihar Nepal team member on site"
                fill
                sizes="(max-width: 900px) 100vw, 220px"
                className={styles.photoImg}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
