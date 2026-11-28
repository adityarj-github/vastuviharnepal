"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

const scope = 'main, footer, [data-site-motion="admin"]';
const headings = "h1, h2, h3, h4";
const groups = "article, figure, details, li, [data-site-reveal]";
const counts = "[data-site-count]";
const targets = `${headings}, ${groups}, ${counts}, p, img`;
const blocked = 'form, table, nav, dialog, [role="dialog"], [role="alert"], [role="status"], [aria-hidden="true"]';
const ownsMotion = '[data-site-motion="off"]';

function isGroup(element: Element) {
  return element.matches(groups) && !element.querySelector("article, section, form, table, canvas, iframe, dialog");
}

function canReveal(element: HTMLElement) {
  if (element.closest(ownsMotion)) return false;
  if (element.closest('[data-site-motion="admin"]')) {
    return element.matches(`${headings}, [data-site-reveal]`);
  }

  if (element.matches(groups) && !isGroup(element)) return false;
  for (let parent = element.parentElement; parent; parent = parent.parentElement) {
    if (parent.matches(scope)) break;
    if (isGroup(parent)) return false;
  }
  return true;
}

interface Count {
  value: string;
  target: number;
  output: HTMLElement;
  prefix: string;
  suffix: string;
  duration: number;
  decimals: number;
  start: number;
}

function runMotion(completed: WeakSet<Element>) {
  if (!("IntersectionObserver" in window) || !("MutationObserver" in window)) return;

  const pending = new Set<HTMLElement>();
  const queued = new Set<Element>();
  const reveals = new Map<HTMLElement, Animation>();
  const counters = new Map<HTMLElement, Count>();
  let scanFrame = 0;
  let counterFrame = 0;

  function finishCount(element: HTMLElement) {
    const count = counters.get(element);
    if (count) count.output.textContent = "";
    element.removeAttribute("data-site-counting");
    counters.delete(element);
  }

  function tick(now: number) {
    for (const [element, count] of counters) {
      if (!element.isConnected || element.dataset.siteCount !== count.value) {
        finishCount(element);
        continue;
      }

      const progress = Math.min(1, (now - count.start) / count.duration);
      if (progress >= 1) {
        finishCount(element);
        continue;
      }

      const value = count.target * (1 - (1 - progress) ** 3);
      const text = `${count.prefix}${value.toFixed(count.decimals)}${count.suffix}`;
      if (count.output.textContent !== text) count.output.textContent = text;
    }
    counterFrame = counters.size ? requestAnimationFrame(tick) : 0;
  }

  function startCount(element: HTMLElement) {
    const value = element.dataset.siteCount ?? "";
    const target = Number(value);
    const output = element.querySelector<HTMLElement>(".site-count-digits");
    if (!output || !Number.isFinite(target) || target === 0) return;

    const prefix = element.dataset.sitePrefix ?? "";
    const suffix = element.dataset.siteSuffix ?? "";
    const decimals = Math.min(value.split(".")[1]?.length ?? 0, 10);
    const duration = Math.max(160, Math.min(3000, Number(element.dataset.siteDuration) || 1050));

    output.textContent = `${prefix}${(0).toFixed(decimals)}${suffix}`;
    element.setAttribute("data-site-counting", "");
    counters.set(element, {
      value, target, output, prefix, suffix, decimals, duration, start: performance.now(),
    });
    if (!counterFrame) counterFrame = requestAnimationFrame(tick);
  }

  function reveal(element: HTMLElement, index: number) {
    if (!element.animate || element.contains(document.activeElement) || element.getAnimations().length) return;
    const { opacity, position } = getComputedStyle(element);
    if (opacity !== "1" || position === "fixed" || position === "sticky") return;

    const admin = Boolean(element.closest('[data-site-motion="admin"]'));
    const animation = element.animate(
      [
        { opacity: admin ? 0.88 : 0.72, translate: admin ? "0 4px" : "0 12px" },
        { opacity: 1, translate: "0 0" },
      ],
      {
        id: "site-entry",
        duration: admin ? 240 : 460,
        delay: (index % 4) * 35,
        easing: "cubic-bezier(.22,1,.36,1)",
        fill: "backwards",
      },
    );
    reveals.set(element, animation);
    animation.onfinish = animation.oncancel = () => { reveals.delete(element); };
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(({ target, isIntersecting }, index) => {
      if (!isIntersecting || !(target instanceof HTMLElement) || !target.isConnected) return;
      observer.unobserve(target);
      pending.delete(target);
      if (!target.matches(counts) || Number(target.dataset.siteCount)) completed.add(target);
      if (target.matches(counts)) startCount(target);
      else reveal(target, index);
    });
  }, { threshold: 0.12 });

  function queueTarget(element: Element) {
    if (!(element instanceof HTMLElement) || completed.has(element) || pending.has(element)) return;
    if (!element.closest(scope) || element.closest(blocked)) return;
    if (!element.matches(counts) && !canReveal(element)) return;
    pending.add(element);
    observer.observe(element);
  }

  function scan(root: Element) {
    if (root.matches(targets)) queueTarget(root);
    root.querySelectorAll(targets).forEach(queueTarget);
  }

  function flush() {
    scanFrame = 0;
    for (const element of pending) {
      if (element.isConnected) continue;
      observer.unobserve(element);
      pending.delete(element);
    }
    queued.forEach((root) => { if (root.isConnected) scan(root); });
    queued.clear();
  }

  document.querySelectorAll(scope).forEach(scan);
  const changes = new MutationObserver((records) => {
    let removedElement = false;
    for (const record of records) {
      if (record.type === "attributes" && record.target instanceof Element) queued.add(record.target);
      record.addedNodes.forEach((node) => { if (node instanceof Element) queued.add(node); });
      record.removedNodes.forEach((node) => { if (node instanceof Element) removedElement = true; });
    }
    if (!scanFrame && (queued.size || removedElement)) scanFrame = requestAnimationFrame(flush);
  });
  changes.observe(document.body, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ["data-site-count"],
  });

  return () => {
    changes.disconnect();
    observer.disconnect();
    cancelAnimationFrame(scanFrame);
    cancelAnimationFrame(counterFrame);
    reveals.forEach((animation) => animation.cancel());
    counters.forEach((_, element) => finishCount(element));
  };
}

export function SiteMotion() {
  const pathname = usePathname();
  const completed = useRef(new WeakSet<Element>());

  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    let stop: (() => void) | undefined;
    const update = () => {
      stop?.();
      stop = preference.matches ? undefined : runMotion(completed.current);
    };
    update();
    preference.addEventListener("change", update);
    return () => {
      preference.removeEventListener("change", update);
      stop?.();
    };
  }, [pathname]);

  return null;
}
