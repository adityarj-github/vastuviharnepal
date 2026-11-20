"use client";

import { useEffect, useRef, type ReactNode } from "react";

interface HeroScrollShellProps {
  className?: string;
  maxRadius?: number;
  children: ReactNode;
}

export function HeroScrollShell({
  className = "",
  maxRadius = 50,
  children,
}: HeroScrollShellProps) {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    let rafId = 0;

    const updateRadius = () => {
      const scrollY = window.scrollY;
      // Smoothly reaches 50px over the first 35% of the viewport height
      const progress = Math.min(Math.max(scrollY / (window.innerHeight * 0.35), 0), 1);
      el.style.setProperty("--hero-radius", `${(progress * maxRadius).toFixed(1)}px`);
      rafId = 0;
    };

    const onScroll = () => {
      if (!rafId) {
        rafId = requestAnimationFrame(updateRadius);
      }
    };

    updateRadius();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [maxRadius]);

  return (
    <section ref={sectionRef} className={className}>
      {children}
    </section>
  );
}