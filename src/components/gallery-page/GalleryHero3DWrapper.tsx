"use client";

import React from "react";
import dynamic from "next/dynamic";
import type { GalleryPhotoItem } from "./GalleryHero3D";
import { GalleryHeroSkeleton } from "./GalleryHero3D";

const GalleryHero3D = dynamic(() => import("./GalleryHero3D"), {
  ssr: false,
  loading: () => <GalleryHeroSkeleton />,
});

export function GalleryHero3DWrapper({ items }: { items?: GalleryPhotoItem[] }) {
  return <GalleryHero3D items={items} />;
}

export default GalleryHero3DWrapper;
