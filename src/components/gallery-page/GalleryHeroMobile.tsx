"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  DEFAULT_GALLERY_PHOTOS,
  WALL_SLOTS,
  type GalleryPhotoItem,
} from "./galleryWallFrames";
import hero from "./GalleryHero3D.module.css";
import styles from "./GalleryHeroMobile.module.css";

const walls = [
  { id: "left", label: "Left wall" },
  { id: "center", label: "Center wall" },
  { id: "right", label: "Right wall" },
] as const;

export function GalleryHeroMobile({ items }: { items?: GalleryPhotoItem[] }) {
  const track = useRef<HTMLDivElement>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const [active, setActive] = useState(1);
  const [selected, setSelected] = useState<GalleryPhotoItem | null>(null);

  useLayoutEffect(() => {
    const scroller = track.current;
    if (scroller) scroller.scrollLeft = scroller.clientWidth;
  }, []);

  useEffect(() => {
    const modal = dialog.current;
    if (selected && modal && !modal.open) modal.showModal();
  }, [selected]);

  function goToWall(index: number) {
    const scroller = track.current;
    if (!scroller) return;

    scroller.scrollTo({
      left: index * scroller.clientWidth,
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "auto"
        : "smooth",
    });
  }

  return (
    <div className={hero.heroWrapper}>
      <section
        className={`${hero.heroContainer} ${styles.mobileHero}`}
        aria-label="Vastu Vihar Nepal Gallery Walls"
      >
        <div
          ref={track}
          className={styles.track}
          aria-label="Swipe to browse gallery walls"
          tabIndex={0}
          onScroll={(event) => {
            const { clientWidth, scrollLeft } = event.currentTarget;
            if (clientWidth) {
              setActive(Math.min(2, Math.max(0, Math.round(scrollLeft / clientWidth))));
            }
          }}
        >
          {walls.map(({ id, label }) => (
            <section key={id} className={styles.wall} aria-label={label}>
              <div className={`${styles.frames} ${id === "center" ? styles.centerWall : ""}`}>
                {WALL_SLOTS.map((slot, index) => {
                  const photo = items?.[index] ?? DEFAULT_GALLERY_PHOTOS[index];
                  if (slot.wall !== id || !photo) return null;

                  return (
                    <button
                      key={slot.id}
                      type="button"
                      className={styles.frame}
                      style={{ aspectRatio: (slot.size[0] - 0.16) / (slot.size[1] - 0.16) }}
                      aria-label={`Enlarge ${photo.title}`}
                      onClick={() => setSelected(photo)}
                    >
                      <span className={styles.mat}>
                        <Image
                          src={photo.url}
                          alt={photo.title}
                          fill
                          sizes={
                            slot.isHero
                              ? "(max-width: 767px) 34vw, 300px"
                              : "(max-width: 767px) 26vw, 230px"
                          }
                          unoptimized={photo.url.startsWith("/api/files/")}
                        />
                      </span>
                    </button>
                  );
                })}
              </div>
            </section>
          ))}
        </div>
        <div className={hero.topVignette} aria-hidden="true" />

        <nav className={styles.controls} aria-label="Choose a gallery wall">
          {walls.map(({ id, label }, index) => (
            <button
              key={id}
              type="button"
              aria-pressed={active === index}
              onClick={() => goToWall(index)}
            >
              {label}
            </button>
          ))}
        </nav>

        <dialog
          ref={dialog}
          className={styles.dialog}
          aria-label={selected?.title ?? "Gallery photo"}
          onClose={() => setSelected(null)}
          onClick={(event) => {
            if (event.target === event.currentTarget) event.currentTarget.close();
          }}
        >
          {selected && (
            <div className={styles.lightbox}>
              <button
                type="button"
                className={hero.closeButton}
                aria-label="Close image"
                onClick={() => dialog.current?.close()}
              >
                ×
              </button>
              <Image
                src={selected.url}
                alt={selected.title}
                fill
                sizes="(max-width: 767px) 92vw, 900px"
                unoptimized={selected.url.startsWith("/api/files/")}
              />
            </div>
          )}
        </dialog>
      </section>
    </div>
  );
}
