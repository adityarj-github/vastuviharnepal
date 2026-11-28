"use client";

import { useEffect, useId, useRef, type CSSProperties } from "react";
import { ActionButton } from "@/components/buttons";
import type { QualityTechItem } from "@/data/quality";
import styles from "./QualitySection.module.css";

interface Diagram {
  lines: string[];
  circles?: [number, number, number][];
}

const diagrams: Record<string, Diagram> = {
  "calcifying-microbe": {
    lines: [
      "M10 41a21 26 0 0 1 42 0",
      "M10 41a14 18 0 0 1 28 0",
      "M10 41a7 9 0 0 1 14 0",
      "M24 41a21 24 0 0 0 42 0",
      "M38 41a7 12 0 0 0 14 0",
      "M66 41a7 9 0 0 1 14 0",
    ],
    circles: [[10, 41, 3.8], [24, 41, 3.8], [38, 41, 3.8], [52, 41, 3.8], [66, 41, 3.8], [80, 41, 3.8]],
  },
  "insulated-walls": {
    lines: ["m38 41 14 13m-15-8 12 11m-13-7 9 8m-3-20 12 11m-8-13 9 8"],
    circles: [[44, 30, 19], [32, 50, 19], [56, 50, 19]],
  },
  "welded-wire-girder": {
    lines: [
      "M19 37V16h59v50H59V39L25 59 10 50l35-23H19",
      "M10 50v14l15 9 34-20m-34 6v14m34-21h19m-59-36v11",
    ],
  },
  "green-energy": {
    lines: ["m15 45 11-16m6 1 9 17m9 6h9m11-6 8-8m-9 21 9 8"],
    circles: [[11, 51, 8], [29, 21, 8], [43, 54, 8], [65, 53, 8], [81, 33, 7], [81, 72, 7]],
  },
  "insulated-roofs": {
    lines: [
      "M7 35 43 12l36 23M15 38l28-17 28 17v20H15z",
      "M15 46h56M25 46v12m12-12v12m12-12v12m12-12v12",
    ],
  },
  "prefab-roofs": {
    lines: [
      "m10 53 25-31h44L55 53zm10-1 24-30m-12 30 24-30M44 52l24-30",
      "M66 56c0 5-6 9-6 14a6 6 0 0 0 12 0c0-5-6-9-6-14z",
    ],
  },
  "voc-free": {
    lines: ["M10 31h44c13 0 13-15 3-15m-47 26h64c11 0 11 14 1 14M10 53h34c11 0 11 15 1 15"],
  },
  "bio-sanitation": {
    lines: [
      "M44 9C35 24 20 36 20 51a24 24 0 0 0 48 0C68 36 53 24 44 9Z",
      "M34 51c0 7 4 12 10 13",
    ],
    circles: [[50, 42, 4], [56, 53, 3]],
  },
};

function QualityDrawing({ id }: { id: string }) {
  const diagram = diagrams[id];
  if (!diagram) return null;

  return (
    <svg className={styles.drawing} viewBox="0 0 88 80" aria-hidden="true" focusable="false">
      {diagram.lines.map((line) => <path key={line} d={line} pathLength={1} />)}
      {diagram.circles?.map(([cx, cy, r]) => (
        <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r={r} pathLength={1} />
      ))}
    </svg>
  );
}

interface QualitySectionClientProps {
  smallHeading: string;
  boldDescription: string;
  cta?: { label: string; href: string };
  technologies: QualityTechItem[];
  showInnovations: boolean;
}

export function QualitySectionClient({
  smallHeading, boldDescription, cta, technologies, showInnovations,
}: QualitySectionClientProps) {
  const headingId = useId();
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || !("IntersectionObserver" in window)) return;
    if (!window.matchMedia("(prefers-reduced-motion: no-preference)").matches) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(({ target, isIntersecting }) => {
        if (!isIntersecting) return;
        target.setAttribute("data-shown", "");
        observer.unobserve(target);
      });
    }, { threshold: 0.15 });

    section.setAttribute("data-motion", "");
    section.querySelectorAll("[data-enter]").forEach((item) => observer.observe(item));
    return () => {
      observer.disconnect();
      section.removeAttribute("data-motion");
    };
  }, []);

  return (
    <section ref={sectionRef} className={styles.section} aria-labelledby={headingId}>
      <div className={`container ${styles.frame}`}>
        <div className={styles.intro} data-enter>
          <h2 id={headingId}>{smallHeading}</h2>
          <div className={styles.introCopy}>
            <p>{boldDescription}</p>
            {cta && <ActionButton className={styles.action} text={cta.label} href={cta.href} />}
          </div>
        </div>
        <ul className={styles.grid} role="list">
          {technologies.map((tech, index) => (
            <li className={styles.card} key={tech.id}>
              <div
                className={styles.cardBody}
                data-enter
                style={{ "--quality-delay": `${(index % 4) * 70}ms` } as CSSProperties}
              >
                <div>
                  <QualityDrawing id={tech.id} />
                  <h3>{tech.shortTitle}</h3>
                </div>
                <p>{showInnovations ? tech.summary : tech.shortSummary ?? tech.summary}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
