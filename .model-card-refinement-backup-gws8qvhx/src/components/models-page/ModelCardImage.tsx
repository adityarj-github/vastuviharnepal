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
  const zoomSource = useRef("");

  useEffect(() => () => cancelAnimationFrame(frame.current), []);

  function move(event: PointerEvent<HTMLDivElement>) {
    if (event.pointerType !== "mouse") return;
    zoomPreference ??= window.matchMedia(zoomMedia);
    if (!zoomPreference.matches) return;

    pointer.current = { x: event.clientX, y: event.clientY };
    if (frame.current) return;

    frame.current = requestAnimationFrame(() => {
      frame.current = 0;
      const photo = image.current;
      const layer = surface.current;
      if (!photo?.complete || !photo.naturalWidth || !layer) return;

      const bounds = layer.getBoundingClientRect();
      if (!bounds.width || !bounds.height) return;

      const x = Math.max(0, Math.min(1, (pointer.current.x - bounds.left) / bounds.width));
      const y = Math.max(0, Math.min(1, (pointer.current.y - bounds.top) / bounds.height));
      const source = photo.currentSrc || photo.src;

      if (source !== zoomSource.current) {
        layer.style.setProperty("--card-zoom-source", `url(${JSON.stringify(source)})`);
        zoomSource.current = source;
      }

      layer.style.setProperty("--card-zoom-x", `${x * 100}%`);
      layer.style.setProperty("--card-zoom-y", `${y * 100}%`);
      if (!layer.hasAttribute("data-card-zoom")) layer.setAttribute("data-card-zoom", "");
    });
  }

  function stop() {
    cancelAnimationFrame(frame.current);
    frame.current = 0;
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
