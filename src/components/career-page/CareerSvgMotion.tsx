"use client";

import { useEffect, useRef, type ReactNode } from "react";
import styles from "./CareerPage.module.css";

export function CareerSvgMotion({ children }: { children: ReactNode }) {
  const main = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!main.current || !("IntersectionObserver" in window) || !Element.prototype.animate) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const active = new Set<Animation>();
    const easing = "cubic-bezier(.22, 1, .36, 1)";

    function animate(element: Element, frames: Keyframe[], id: string, duration: number, delay: number) {
      const animation = element.animate(frames, { id, duration, delay, easing, fill: "backwards" });
      active.add(animation);
      animation.onfinish = animation.oncancel = () => { active.delete(animation); };
    }

    function cancel() {
      active.forEach((animation) => animation.cancel());
      active.clear();
    }

    const observer = new IntersectionObserver((entries) => {
      let visibleIndex = 0;
      for (const { target, intersectionRatio } of entries) {
        if (intersectionRatio < 0.65) continue;
        observer.unobserve(target);
        target.removeAttribute("data-career-pending");
        if (reducedMotion.matches || target.closest("a:focus, button:focus")) continue;

        const delay = (visibleIndex++ % 4) * 42;
        const award = target.hasAttribute("data-career-award");
        const paths = target.querySelectorAll("[pathLength]");
        const fills = target.querySelectorAll("[data-career-fill]");

        animate(target, [
          { translate: "0 3px", opacity: 0.72 },
          { translate: "0 0", opacity: 1 },
        ], "career-svg-enter", 460, delay);

        paths.forEach((path, index) => {
          animate(path, [
            { strokeDasharray: "1 1", strokeDashoffset: "1" },
            { strokeDasharray: "1 1", strokeDashoffset: "0" },
          ], "career-svg-stroke", award ? 720 : 580, delay + (award ? 0 : index * 30));
        });

        fills.forEach((shape, index) => {
          animate(shape, [{ opacity: 0 }, { opacity: 1 }],
            "career-svg-fill", 430, delay + 290 + index * 35);
        });
      }
    }, { threshold: 0.65, rootMargin: "-48px 0px" });

    const icons = Array.from(main.current.querySelectorAll("svg[data-career-draw]"));
    const belowViewport = icons.filter((icon) => icon.getBoundingClientRect().top >= window.innerHeight);
    belowViewport.forEach((icon) => icon.setAttribute("data-career-pending", ""));

    const initialScrollY = window.scrollY;
    function startOnScroll() {
      if (Math.abs(window.scrollY - initialScrollY) < 1) return;
      window.removeEventListener("scroll", startOnScroll);
      icons.forEach((icon) => observer.observe(icon));
    }
    window.addEventListener("scroll", startOnScroll, { passive: true });
    const sync = () => { if (reducedMotion.matches) cancel(); };
    reducedMotion.addEventListener("change", sync);

    return () => {
      window.removeEventListener("scroll", startOnScroll);
      observer.disconnect();
      icons.forEach((icon) => icon.removeAttribute("data-career-pending"));
      reducedMotion.removeEventListener("change", sync);
      cancel();
    };
  }, []);

  return <main ref={main} className={styles.svgMotion}>{children}</main>;
}
