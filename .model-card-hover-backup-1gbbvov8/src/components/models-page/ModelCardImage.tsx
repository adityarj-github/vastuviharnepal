"use client";

import Image from "next/image";
import { useEffect, useRef, type PointerEvent, type ReactNode } from "react";
import styles from "./ModelCardImage.module.css";

const zoomMedia = "(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)";
let zoomPreference: MediaQueryList | undefined;

interface ModelCardImageProps {
  src: string;
  alt: string;
  sizes: string;
  className: string;
  imageClassName: string;
  children?: ReactNode;
}

export function ModelCardImage({
  src, alt, sizes, className, imageClassName, children,
}: ModelCardImageProps) {
  const image = useRef<HTMLImageElement>(null);
  const surface = useRef<HTMLDivElement>(null);
  const frame = useRef(0);
  const pointer = useRef({ x: 0, y: 0 });
  const lens = useRef<{ x: number; y: number } | null>(null);
  const lastFrame = useRef(0);
  const zoomSource = useRef("");

  useEffect(() => () => cancelAnimationFrame(frame.current), []);

  function drawLens(now: number) {
    frame.current = 0;
    const photo = image.current;
    const layer = surface.current;
    if (!photo?.complete || !photo.naturalWidth || !layer || !zoomPreference?.matches) return;

    const bounds = layer.getBoundingClientRect();
    if (!bounds.width || !bounds.height) return;

    const target = pointer.current;
    const previous = lens.current ?? target;
    const dx = target.x - previous.x;
    const dy = target.y - previous.y;
    const distance = Math.hypot(dx, dy);
    const settled = distance < 0.75;
    const elapsed = lastFrame.current ? Math.min(now - lastFrame.current, 32) : 16;
    const follow = 1 - Math.exp(-elapsed / 58);
    const center = settled ? target : { x: previous.x + dx * follow, y: previous.y + dy * follow };
    lens.current = center;

    const source = photo.currentSrc || photo.src;
    if (source !== zoomSource.current) {
      layer.style.setProperty("--card-zoom-source", `url(${JSON.stringify(source)})`);
      zoomSource.current = source;
    }

    const x = center.x - bounds.left;
    const y = center.y - bounds.top;
    const radiusX = Math.min(88, bounds.width * 0.195);
    const radiusY = Math.min(78, bounds.height * 0.22);
    const stretch = settled ? 0 : Math.min(1, distance / 85);
    const tailX = Math.max(-22, Math.min(22, dx * 0.22));
    const tailY = Math.max(-18, Math.min(18, dy * 0.22));

    layer.style.setProperty("--card-zoom-x", `${x}px`);
    layer.style.setProperty("--card-zoom-y", `${y}px`);
    layer.style.setProperty("--card-zoom-rx", `${radiusX + Math.min(radiusX * 0.24, Math.abs(dx) * 0.15)}px`);
    layer.style.setProperty("--card-zoom-ry", `${radiusY + Math.min(radiusY * 0.24, Math.abs(dy) * 0.15)}px`);
    layer.style.setProperty("--card-tail-x", `${x - tailX}px`);
    layer.style.setProperty("--card-tail-y", `${y - tailY}px`);
    layer.style.setProperty("--card-tail-rx", `${radiusX * stretch * 0.76}px`);
    layer.style.setProperty("--card-tail-ry", `${radiusY * stretch * 0.68}px`);
    layer.style.setProperty("--card-zoom-scale", String(1.15 + stretch * 0.045));
    if (!layer.hasAttribute("data-card-zoom")) layer.setAttribute("data-card-zoom", "");

    lastFrame.current = settled ? 0 : now;
    if (!settled) frame.current = requestAnimationFrame(drawLens);
  }

  function move(event: PointerEvent<HTMLDivElement>) {
    if (event.pointerType !== "mouse") return;
    zoomPreference ??= window.matchMedia(zoomMedia);
    if (!zoomPreference.matches) return;
    pointer.current = { x: event.clientX, y: event.clientY };
    if (!frame.current) frame.current = requestAnimationFrame(drawLens);
  }

  function stop() {
    cancelAnimationFrame(frame.current);
    frame.current = 0;
    lastFrame.current = 0;
    lens.current = null;
    surface.current?.removeAttribute("data-card-zoom");
  }

  return (
    <div
      className={className}
      onPointerEnter={move}
      onPointerMove={move}
      onPointerLeave={stop}
      onPointerCancel={stop}
    >
      <div ref={surface} className={`${styles.surface} ${imageClassName}`}>
        <Image ref={image} src={src} alt={alt} fill sizes={sizes} className={styles.photo} />
        <div className={styles.feather} aria-hidden="true">
          <div className={styles.zoom} />
        </div>
      </div>
      {children}
    </div>
  );
}
