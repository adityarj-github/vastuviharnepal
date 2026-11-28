from pathlib import Path

folder = Path("src/components/career-page")
motion = folder / "CareerSvgMotion.tsx"
stylesheet = folder / "CareerPage.module.css"

if not motion.is_file() or not stylesheet.is_file():
    raise SystemExit("Run from the project root after applying the Career SVG animation update.")


def replace_once(source, before, after):
    if after in source:
        return source
    if source.count(before) != 1:
        raise ValueError(f"Could not find {before.splitlines()[0]!r}")
    return source.replace(before, after, 1)


try:
    js = motion.read_text(encoding="utf-8")
    js = replace_once(
        js,
        'import { useEffect, useRef, type ReactNode } from "react";',
        'import { useEffect, useRef, type ReactNode } from "react";\nimport styles from "./CareerPage.module.css";',
    )
    js = replace_once(
        js,
        """      for (const { target, isIntersecting } of entries) {
        if (!isIntersecting) continue;
        observer.unobserve(target);""",
        """      for (const { target, intersectionRatio } of entries) {
        if (intersectionRatio < 0.65) continue;
        observer.unobserve(target);
        target.removeAttribute("data-career-pending");""",
    )
    js = replace_once(
        js,
        '''    }, { threshold: 0.3 });

    main.current.querySelectorAll("svg[data-career-draw]").forEach((svg) => observer.observe(svg));''',
        '''    }, { threshold: 0.65, rootMargin: "-48px 0px" });

    const icons = Array.from(main.current.querySelectorAll("svg[data-career-draw]"));
    const belowViewport = icons.filter((icon) => icon.getBoundingClientRect().top >= window.innerHeight);
    belowViewport.forEach((icon) => icon.setAttribute("data-career-pending", ""));

    const initialScrollY = window.scrollY;
    function startOnScroll() {
      if (Math.abs(window.scrollY - initialScrollY) < 1) return;
      window.removeEventListener("scroll", startOnScroll);
      icons.forEach((icon) => observer.observe(icon));
    }
    window.addEventListener("scroll", startOnScroll, { passive: true });''',
    )
    js = replace_once(
        js,
        "    return () => {\n      observer.disconnect();",
        '''    return () => {
      window.removeEventListener("scroll", startOnScroll);
      observer.disconnect();
      icons.forEach((icon) => icon.removeAttribute("data-career-pending"));''',
    )
    js = replace_once(js, '<main ref={main}>', '<main ref={main} className={styles.svgMotion}>')

    css = stylesheet.read_text(encoding="utf-8")
    css = replace_once(
        css,
        """  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: clamp(1.25rem, 2.5vw, 2rem);
  align-items: stretch;""",
        """  --job-grid-gap: clamp(1.25rem, 2.5vw, 2rem);
  grid-template-columns: repeat(
    auto-fill,
    minmax(min(100%, max(17rem, calc((100% - 3 * var(--job-grid-gap)) / 4))), 1fr)
  );
  gap: var(--job-grid-gap);
  align-items: stretch;""",
    )
    compact = """@media (900px < width < 1024px) {
  .jobCard {
    padding-inline: 1.125rem;
  }
}

"""
    css = css.replace(compact, "", 1)

    pending = """
@media (prefers-reduced-motion: no-preference) {
  .svgMotion [data-career-pending] [pathLength] {
    stroke-dasharray: 1 1;
    stroke-dashoffset: 1;
  }

  .svgMotion [data-career-pending] [data-career-fill] {
    opacity: 0;
  }
}
"""
    if pending not in css:
        css = css.rstrip() + "\n" + pending
except (OSError, ValueError) as error:
    raise SystemExit(f"No project files changed. {error}") from error

for path, source in ((motion, js), (stylesheet, css)):
    if path.read_text(encoding="utf-8") != source:
        path.write_text(source, encoding="utf-8")
        print(f"Updated {path}")
