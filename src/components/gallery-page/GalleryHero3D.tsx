"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import * as THREE from "three";
import { Canvas, type RootState } from "@react-three/fiber";
import styles from "./GalleryHero3D.module.css";
import {
  DEFAULT_GALLERY_PHOTOS,
  type GalleryPhotoItem,
} from "./galleryWallFrames";
import { CAMERA_STOPS, type CameraStop } from "./gallery3d/constants";
import { createGalleryTextureSet, type GalleryTextureSet } from "./gallery3d/textures";
import { GalleryRoom } from "./gallery3d/GalleryRoom";
import { GalleryFloor } from "./gallery3d/GalleryFloor";
import { GalleryCeiling } from "./gallery3d/GalleryCeiling";
import { GalleryCentralSeating } from "./gallery3d/GalleryCentralSeating";
import { CIRCULAR_FRAME_SLOTS, GalleryFrames } from "./gallery3d/GalleryFrames";
import { GalleryLighting } from "./gallery3d/GalleryLighting";
import { GalleryPlants } from "./gallery3d/GalleryPlants";
import { GalleryCamera, type CameraTargetState } from "./gallery3d/GalleryCamera";
import { GalleryFallback } from "./gallery3d/GalleryFallback";

export { DEFAULT_GALLERY_PHOTOS, WALL_SLOTS } from "./galleryWallFrames";
export type { GalleryPhotoItem, WallSlotConfig } from "./galleryWallFrames";

const Scene = React.memo(function Scene({
  photos,
  onSelectPhoto,
  targetRef,
  followPointerRef,
  isMobile,
  textures,
}: {
  photos: GalleryPhotoItem[];
  onSelectPhoto: (item: GalleryPhotoItem, index: number) => void;
  targetRef: { readonly current: CameraTargetState };
  followPointerRef: { current: boolean };
  isMobile: boolean;
  textures: GalleryTextureSet | null;
}) {
  return (
    <>
      <color attach="background" args={["#1A1511"]} />
      <GalleryLighting isMobile={isMobile} />
      <GalleryRoom textures={textures} isMobile={isMobile} />
      <GalleryFloor textures={textures} isMobile={isMobile} />
      <GalleryCeiling isMobile={isMobile} />
      <GalleryCentralSeating textures={textures} isMobile={isMobile} />
      <GalleryPlants isMobile={isMobile} />
      <GalleryFrames
        photos={photos}
        onSelectPhoto={onSelectPhoto}
        textures={textures}
      />
      <GalleryCamera
        targetRef={targetRef}
        followPointerRef={followPointerRef}
        isMobile={isMobile}
      />
    </>
  );
});

export function GalleryHeroSkeleton() {
  return (
    <div className={styles.heroWrapper}>
      <div className={styles.skeletonContainer}>
        <div className={styles.skeletonSpinner} />
      </div>
    </div>
  );
}

interface GalleryHero3DProps {
  items?: GalleryPhotoItem[];
  extraPhotos?: GalleryPhotoItem[];
  isMobile?: boolean;
}

function checkWebGLSupport(): boolean {
  try {
    const canvas = document.createElement("canvas");
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext("webgl2") || canvas.getContext("webgl"))
    );
  } catch {
    return false;
  }
}

export default function GalleryHero3D({
  items,
  extraPhotos,
  isMobile = false,
}: GalleryHero3DProps) {
  const initialStop = CAMERA_STOPS[0];
  const targetRef = useRef<CameraTargetState>({
    angle: initialStop.angle,
    radius: initialStop.radius,
    height: initialStop.height,
    lookRadius: initialStop.lookRadius,
    lookHeight: initialStop.lookHeight,
  });
  const followPointer = useRef(false);
  const invalidateRef = useRef<(() => void) | null>(null);
  const heroRef = useRef<HTMLElement>(null);
  const manualOverrideRef = useRef(false);
  const suppressClick = useRef(false);

  const pointer = useRef<{
    id: number;
    x: number;
    y: number;
    dragging: boolean;
    fast: boolean;
    radiansPerPixel: number;
  } | null>(null);

  const [activeStopIndex, setActiveStopIndex] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [canvasReady, setCanvasReady] = useState(false);
  const [showTutorial, setShowTutorial] = useState(true);
  const [webglSupported] = useState(() => checkWebGLSupport());
  const textures = useMemo(
    () => (webglSupported ? createGalleryTextureSet() : null),
    [webglSupported]
  );

  // Merge primary 13 admin-editable slots with additional real Vastu Vihar photos for 360° coverage
  const exhibitionPhotos = useMemo(() => {
    const primary = items && items.length > 0 ? items : DEFAULT_GALLERY_PHOTOS;
    const seenUrls = new Set(primary.map((p) => p.url));
    const extras = (extraPhotos ?? []).filter((p) => {
      if (seenUrls.has(p.url)) return false;
      seenUrls.add(p.url);
      return true;
    });
    const combined = [...primary, ...extras];
    return combined.slice(0, CIRCULAR_FRAME_SLOTS.length);
  }, [items, extraPhotos]);

  const selectedPhoto =
    selectedIndex !== null ? exhibitionPhotos[selectedIndex] ?? null : null;

  useEffect(() => {
    return () => {
      textures?.dispose();
    };
  }, [textures]);

  const onCreated = useCallback((state: RootState) => {
    invalidateRef.current = state.invalidate;
    setCanvasReady(true);
  }, []);

  const tutorialReady = canvasReady && !!textures;
  useEffect(() => {
    if (!tutorialReady || !showTutorial) return;
    const timeout = window.setTimeout(() => setShowTutorial(false), 8000);
    return () => window.clearTimeout(timeout);
  }, [tutorialReady, showTutorial]);

  const applyStop = useCallback((stop: CameraStop, index: number) => {
    targetRef.current = {
      angle: stop.angle,
      radius: stop.radius,
      height: stop.height,
      lookRadius: stop.lookRadius,
      lookHeight: stop.lookHeight,
    };
    followPointer.current = false;
    setActiveStopIndex(index);
    invalidateRef.current?.();
  }, []);

  const jumpToStop = useCallback(
    (index: number) => {
      manualOverrideRef.current = true;
      setShowTutorial(false);
      const clamped = (index + CAMERA_STOPS.length) % CAMERA_STOPS.length;
      applyStop(CAMERA_STOPS[clamped], clamped);
    },
    [applyStop]
  );

  // Subtle scroll-driven camera tour while scrolling past the hero (before manual drag/click)
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const handleScroll = () => {
      if (manualOverrideRef.current || !heroRef.current) return;
      const rect = heroRef.current.getBoundingClientRect();
      const total = Math.max(1, rect.height * 0.85);
      const progress = THREE.MathUtils.clamp(-rect.top / total, 0, 1);
      if (progress <= 0.01) return;

      const tourAngle = progress * Math.PI * 0.72;
      targetRef.current = {
        ...targetRef.current,
        angle: -tourAngle,
      };
      followPointer.current = false;
      invalidateRef.current?.();
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const setAzimuthAngle = useCallback((angle: number, direct = false) => {
    targetRef.current = {
      ...targetRef.current,
      angle,
    };
    followPointer.current = direct;
    invalidateRef.current?.();
  }, []);

  const selectPhoto = useCallback((_photo: GalleryPhotoItem, index: number) => {
    if (suppressClick.current) return;
    setShowTutorial(false);
    setSelectedIndex(index);
  }, []);

  const navigateLightbox = useCallback(
    (delta: number) => {
      setSelectedIndex((prev) => {
        if (prev === null || exhibitionPhotos.length === 0) return prev;
        return (prev + delta + exhibitionPhotos.length) % exhibitionPhotos.length;
      });
    },
    [exhibitionPhotos.length]
  );

  // Lightbox keyboard navigation
  useEffect(() => {
    if (selectedIndex === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedIndex(null);
      else if (e.key === "ArrowRight") navigateLightbox(1);
      else if (e.key === "ArrowLeft") navigateLightbox(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selectedIndex, navigateLightbox]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        jumpToStop(activeStopIndex - 1);
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        jumpToStop(activeStopIndex + 1);
      } else if (e.key === "Home") {
        e.preventDefault();
        jumpToStop(0);
      }
    },
    [activeStopIndex, jumpToStop]
  );

  const handlePointerDown = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (!e.isPrimary || (e.pointerType === "mouse" && e.button !== 0)) return;
      suppressClick.current = false;
      const fast = isMobile || e.pointerType === "touch";
      const swipeSpan = Math.max(60, e.currentTarget.clientWidth * 0.25);
      pointer.current = {
        id: e.pointerId,
        x: e.clientX,
        y: e.clientY,
        dragging: false,
        fast,
        radiansPerPixel: fast ? Math.PI / swipeSpan : 0.0032,
      };
    },
    [isMobile]
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      const p = pointer.current;
      if (!p || p.id !== e.pointerId) return;
      const dx = e.clientX - p.x;
      const dy = e.clientY - p.y;
      if (!p.dragging) {
        const threshold = p.fast ? 5 : 8;
        if (Math.abs(dy) > threshold && Math.abs(dy) > Math.abs(dx)) {
          pointer.current = null;
          return;
        }
        if (Math.abs(dx) < threshold) return;
        p.dragging = true;
        suppressClick.current = true;
        manualOverrideRef.current = true;
        setShowTutorial(false);
        e.currentTarget.setPointerCapture(e.pointerId);
      }
      setAzimuthAngle(targetRef.current.angle - dx * p.radiansPerPixel, p.fast);
      p.x = e.clientX;
    },
    [setAzimuthAngle]
  );

  const handlePointerUp = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (e.type === "lostpointercapture" && e.target !== e.currentTarget) return;
      const p = pointer.current;
      if (!p || p.id !== e.pointerId) return;
      if (e.type === "pointerup" && p.fast && p.dragging) {
        const remaining = e.clientX - p.x;
        setAzimuthAngle(targetRef.current.angle - remaining * p.radiansPerPixel, true);
      }
      pointer.current = null;
      if (e.currentTarget.hasPointerCapture(e.pointerId)) {
        e.currentTarget.releasePointerCapture(e.pointerId);
      }
    },
    [setAzimuthAngle]
  );

  const camera = useMemo(
    () => ({
      position: [0, initialStop.height, initialStop.radius] as [
        number,
        number,
        number,
      ],
      fov: isMobile ? 54 : 46,
      near: 0.35,
      far: 45,
    }),
    [isMobile, initialStop.height, initialStop.radius]
  );

  const gl = useMemo(
    () => ({
      antialias: true,
      alpha: false,
      powerPreference: "high-performance" as const,
      toneMapping: THREE.ACESFilmicToneMapping,
      toneMappingExposure: 1.05,
    }),
    []
  );

  const dpr = useMemo<[number, number]>(
    () => [1, isMobile ? 1.25 : 1.5],
    [isMobile]
  );

  return (
    <div className={styles.heroWrapper}>
      <section
        ref={heroRef}
        className={styles.heroContainer}
        aria-label="Vastu Vihar Nepal 360° Contemporary Exhibition Gallery"
        data-site-motion="off"
      >
        <div className={styles.topVignette} />
        <div className={styles.bottomVignette} />

        {webglSupported ? (
          <div
            className={styles.canvasWrapper}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
            onLostPointerCapture={handlePointerUp}
            onPointerLeave={(e) => {
              if (!pointer.current?.dragging) handlePointerUp(e);
            }}
            onKeyDown={handleKeyDown}
            tabIndex={0}
            aria-label="Explore 360-degree exhibition gallery using drag or arrow keys"
          >
            <Canvas
              onCreated={onCreated}
              frameloop="demand"
              shadows
              camera={camera}
              gl={gl}
              dpr={dpr}
            >
              <Scene
                photos={exhibitionPhotos}
                onSelectPhoto={selectPhoto}
                targetRef={targetRef}
                followPointerRef={followPointer}
                isMobile={isMobile}
                textures={textures}
              />
            </Canvas>
          </div>
        ) : (
          <GalleryFallback
            photos={exhibitionPhotos}
            onSelectPhoto={selectPhoto}
          />
        )}

        {/* Eight-second drag hint */}
        {webglSupported && tutorialReady && showTutorial && !selectedPhoto && (
          <div className={styles.dragTutorial} role="status">
            <svg
              className={styles.tutorialGesture}
              viewBox="0 0 64 32"
              width="64"
              height="32"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M5 16h10M5 16l4-4M5 16l4 4M59 16H49M59 16l-4-4M59 16l-4 4"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <g
                className={styles.tutorialHand}
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M27 16V6a2 2 0 0 1 4 0v8-3a2 2 0 0 1 4 0v3-1a2 2 0 0 1 4 0v3a2 2 0 0 1 4 0v4c0 6-4 9-9 9h-2c-3 0-5-2-7-5l-4-5a2 2 0 0 1 3-3l3 3" />
              </g>
            </svg>
            <span>
              {isMobile ? "Swipe 360° to explore" : "Drag 360° to explore"}
            </span>
          </div>
        )}

        {/* Full-Screen Exhibition Lightbox with Prev/Next & Metadata */}
        {selectedPhoto && selectedIndex !== null && (
          <div
            className={styles.lightboxBackdrop}
            onClick={() => setSelectedIndex(null)}
            role="dialog"
            aria-modal="true"
            aria-label={selectedPhoto.title}
          >
            <div
              className={styles.lightboxCard}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                className={styles.closeButton}
                onClick={() => setSelectedIndex(null)}
                aria-label="Close image"
              >
                <svg
                  viewBox="0 0 24 24"
                  width="18"
                  height="18"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  fill="none"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>

              <button
                type="button"
                className={`${styles.lightboxNavBtn} ${styles.lightboxPrev}`}
                onClick={() => navigateLightbox(-1)}
                aria-label="Previous photograph"
              >
                <svg
                  viewBox="0 0 24 24"
                  width="20"
                  height="20"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  fill="none"
                >
                  <polyline points="15 18 9 12 15 6" />
                </svg>
              </button>

              <button
                type="button"
                className={`${styles.lightboxNavBtn} ${styles.lightboxNext}`}
                onClick={() => navigateLightbox(1)}
                aria-label="Next photograph"
              >
                <svg
                  viewBox="0 0 24 24"
                  width="20"
                  height="20"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  fill="none"
                >
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </button>

              <div className={styles.lightboxImageWrapper}>
                <Image
                  src={selectedPhoto.url}
                  unoptimized={selectedPhoto.url.startsWith("/api/files/")}
                  alt={selectedPhoto.title}
                  width={1200}
                  height={800}
                  className={styles.lightboxImage}
                  priority
                />
              </div>

              <div className={styles.lightboxFooter}>
                <div>
                  {selectedPhoto.category && (
                    <span className={styles.lightboxCategory}>
                      {selectedPhoto.category}
                    </span>
                  )}
                  <h2 className={styles.lightboxTitle}>{selectedPhoto.title}</h2>
                </div>
                <span className={styles.lightboxCounter}>
                  {selectedIndex + 1} / {exhibitionPhotos.length}
                </span>
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
