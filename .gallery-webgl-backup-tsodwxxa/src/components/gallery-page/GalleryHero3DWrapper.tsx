"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import type { GalleryPhotoItem } from "./galleryWallFrames";
import { GalleryHeroMobile } from "./GalleryHeroMobile";
import styles from "./GalleryHero3D.module.css";

function GalleryHeroLoading() {
  return (
    <div className={styles.heroWrapper}>
      <div className={styles.skeletonContainer} aria-hidden="true">
        <div className={styles.skeletonSpinner} />
      </div>
    </div>
  );
}

const GalleryHero3D = dynamic(() => import("./GalleryHero3D"), {
  ssr: false,
  loading: GalleryHeroLoading,
});

export function GalleryHero3DWrapper({ items }: { items?: GalleryPhotoItem[] }) {
  const [mobile, setMobile] = useState<boolean | null>(null);

  useEffect(() => {
    const viewport = window.matchMedia(
      "(max-width: 767px), (hover: none) and (pointer: coarse)",
    );
    const update = () => setMobile(viewport.matches);

    update();
    viewport.addEventListener("change", update);
    return () => viewport.removeEventListener("change", update);
  }, []);

  if (mobile === null) return <GalleryHeroLoading />;
  if (mobile) return <GalleryHeroMobile items={items} />;
  return <GalleryHero3D items={items} />;
}

export default GalleryHero3DWrapper;
