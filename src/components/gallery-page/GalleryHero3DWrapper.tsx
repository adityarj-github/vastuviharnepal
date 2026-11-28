"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import type { GalleryPhotoItem } from "./galleryWallFrames";
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

export function GalleryHero3DWrapper({
  items,
  extraPhotos,
}: {
  items?: GalleryPhotoItem[];
  extraPhotos?: GalleryPhotoItem[];
}) {
  const [mobile, setMobile] = useState<boolean | null>(null);

  useEffect(() => {
    const query = window.matchMedia("(max-width: 767px), (hover: none) and (pointer: coarse)");
    const update = () => setMobile(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  if (mobile === null) return <GalleryHeroLoading />;
  return <GalleryHero3D items={items} extraPhotos={extraPhotos} isMobile={mobile} />;
}

export default GalleryHero3DWrapper;
