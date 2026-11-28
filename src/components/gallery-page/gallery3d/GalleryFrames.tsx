"use client";

import React, { useEffect, useMemo, useState } from "react";
import * as THREE from "three";
import { useThree } from "@react-three/fiber";
import { WALL_SLOTS, type GalleryPhotoItem } from "../galleryWallFrames";
import { GALLERY_DIMS } from "./constants";
import type { GalleryTextureSet } from "./textures";

export type FrameStyle = "large" | "medium" | "small";
export type FrameFinish = "bronze" | "walnut" | "matteBlack";

export interface CircularFrameSlot {
  id: string;
  zone: "main" | "awards" | "events" | "community" | "media";
  /** Angle around the circular wall in radians (0 = -Z front center, +clockwise viewed from top). */
  angle: number;
  /** Vertical center height in meters. */
  height: number;
  /** [width, height] in meters. */
  size: [number, number];
  style: FrameStyle;
  finish: FrameFinish;
}

interface FrameStyleSpec {
  outerWidth: number;
  outerDepth: number;
  bevelInset: number;
  trimWidth: number;
  ledThickness: number;
  recessDepth: number;
  hasSconce: boolean;
}

const FRAME_SPECS: Record<FrameStyle, FrameStyleSpec> = {
  large: {
    outerWidth: 0.085,
    outerDepth: 0.095,
    bevelInset: 0.018,
    trimWidth: 0.018,
    ledThickness: 0.012,
    recessDepth: 0.032,
    hasSconce: true,
  },
  medium: {
    outerWidth: 0.065,
    outerDepth: 0.075,
    bevelInset: 0.014,
    trimWidth: 0.014,
    ledThickness: 0.01,
    recessDepth: 0.025,
    hasSconce: true,
  },
  small: {
    outerWidth: 0.048,
    outerDepth: 0.058,
    bevelInset: 0.01,
    trimWidth: 0.011,
    ledThickness: 0.008,
    recessDepth: 0.02,
    hasSconce: false,
  },
};

interface BayColumnItem {
  id: string;
  height: number;
  size: [number, number];
  style: FrameStyle;
  finish: FrameFinish;
}

interface BaySpec {
  zone: CircularFrameSlot["zone"];
  /** Usable azimuth range [phiStart, phiEnd] clear of piers, slats, and title plaque. */
  phiStart: number;
  phiEnd: number;
  columns: BayColumnItem[][];
}

/**
 * Computes evenly spaced, non-overlapping angular positions for each column
 * inside a curved exhibition bay using its actual arc length at frameMountRadius.
 */
function buildCircularBaySlots(bays: BaySpec[]): CircularFrameSlot[] {
  const slots: CircularFrameSlot[] = [];
  const r = GALLERY_DIMS.frameMountRadius;

  for (const bay of bays) {
    const colWidthsRad = bay.columns.map((col) => {
      const maxW = Math.max(...col.map((item) => item.size[0]));
      return maxW / r;
    });
    const totalFramesRad = colWidthsRad.reduce((sum, w) => sum + w, 0);
    const usableSpan = bay.phiEnd - bay.phiStart;
    const gapRad = Math.max(
      0.025,
      (usableSpan - totalFramesRad) / (bay.columns.length + 1)
    );

    let cursor = bay.phiStart + gapRad;
    bay.columns.forEach((col, colIdx) => {
      const colW = colWidthsRad[colIdx];
      const angle = cursor + colW / 2;
      for (const item of col) {
        slots.push({
          id: item.id,
          zone: bay.zone,
          angle,
          height: item.height,
          size: item.size,
          style: item.style,
          finish: item.finish,
        });
      }
      cursor += colW + gapRad;
    });
  }

  return slots;
}

const EXHIBITION_BAYS: BaySpec[] = [
  // ── Bay 1: Main Achievement Wall (symmetric between Pier A [-0.595] & Pier B [+0.595])
  {
    zone: "main",
    phiStart: -0.52,
    phiEnd: 0.52,
    columns: [
      [
        { id: "main-accent-left", height: 1.82, size: [1.28, 2.05], style: "medium", finish: "bronze" },
      ],
      [
        { id: "center-left-top", height: 2.38, size: [1.65, 1.08], style: "medium", finish: "walnut" },
        { id: "center-left-bottom", height: 1.16, size: [1.65, 1.08], style: "medium", finish: "walnut" },
      ],
      [
        { id: "center-hero", height: 1.82, size: [2.35, 2.55], style: "large", finish: "bronze" },
      ],
      [
        { id: "center-right-top", height: 2.38, size: [1.65, 1.08], style: "medium", finish: "walnut" },
        { id: "center-right-bottom", height: 1.16, size: [1.65, 1.08], style: "medium", finish: "walnut" },
      ],
      [
        { id: "main-accent-1", height: 1.82, size: [1.28, 2.05], style: "medium", finish: "bronze" },
      ],
    ],
  },

  // ── Bay 2: Awards & Recognition (clear of Slat B [+0.845] & Pier E [+1.835])
  {
    zone: "awards",
    phiStart: 0.89,
    phiEnd: 1.79,
    columns: [
      [
        { id: "right-1", height: 1.82, size: [1.65, 2.25], style: "large", finish: "bronze" },
      ],
      [
        { id: "right-2", height: 2.38, size: [1.65, 1.06], style: "medium", finish: "walnut" },
        { id: "right-3", height: 1.16, size: [1.65, 1.06], style: "medium", finish: "walnut" },
      ],
      [
        { id: "right-4", height: 1.82, size: [1.55, 2.2], style: "large", finish: "bronze" },
      ],
      [
        { id: "awards-5", height: 2.36, size: [1.45, 0.98], style: "small", finish: "matteBlack" },
        { id: "awards-6", height: 1.18, size: [1.45, 0.98], style: "small", finish: "matteBlack" },
      ],
    ],
  },

  // ── Bay 3: Events & Celebrations (clear of Slat E [+2.085] & Pier D [+3.438])
  {
    zone: "events",
    phiStart: 2.13,
    phiEnd: 3.38,
    columns: [
      [
        { id: "left-2", height: 2.38, size: [1.7, 1.08], style: "medium", finish: "walnut" },
        { id: "left-3", height: 1.16, size: [1.7, 1.08], style: "medium", finish: "walnut" },
      ],
      [
        { id: "left-1", height: 1.82, size: [1.9, 2.25], style: "large", finish: "bronze" },
      ],
      [
        { id: "events-4", height: 2.38, size: [1.75, 1.08], style: "medium", finish: "bronze" },
        { id: "events-5", height: 1.16, size: [1.75, 1.08], style: "medium", finish: "bronze" },
      ],
      [
        { id: "events-6", height: 1.82, size: [1.75, 2.25], style: "large", finish: "walnut" },
      ],
      [
        { id: "events-7", height: 2.36, size: [1.55, 1.02], style: "small", finish: "matteBlack" },
        { id: "events-8", height: 1.18, size: [1.55, 1.02], style: "small", finish: "matteBlack" },
      ],
    ],
  },

  // ── Bay 4: Community & Sports (clear of Pier D [-2.675] & Slat C [-1.685])
  {
    zone: "community",
    phiStart: -2.63,
    phiEnd: -1.73,
    columns: [
      [
        { id: "community-1", height: 2.38, size: [1.65, 1.08], style: "medium", finish: "walnut" },
        { id: "community-2", height: 1.16, size: [1.65, 1.08], style: "medium", finish: "walnut" },
      ],
      [
        { id: "left-4", height: 1.82, size: [1.85, 2.25], style: "large", finish: "bronze" },
      ],
      [
        { id: "community-3", height: 2.36, size: [1.55, 1.02], style: "small", finish: "matteBlack" },
        { id: "community-4", height: 1.18, size: [1.55, 1.02], style: "small", finish: "matteBlack" },
      ],
      [
        { id: "community-5", height: 1.82, size: [1.45, 2.05], style: "medium", finish: "bronze" },
      ],
    ],
  },

  // ── Bay 5: Media & Press (clear of Pier C slat [-1.3615] & Slat A [-0.845])
  {
    zone: "media",
    phiStart: -1.36,
    phiEnd: -0.89,
    columns: [
      [
        { id: "media-1", height: 1.82, size: [1.5, 2.1], style: "large", finish: "bronze" },
      ],
      [
        { id: "media-2", height: 2.38, size: [1.65, 1.06], style: "medium", finish: "walnut" },
        { id: "media-3", height: 1.16, size: [1.65, 1.06], style: "medium", finish: "walnut" },
      ],
    ],
  },
];

/**
 * 29 exhibition frames distributed across all 5 curved exhibition bays
 * using the actual inner wall arc geometry.
 */
export const CIRCULAR_FRAME_SLOTS: CircularFrameSlot[] =
  buildCircularBaySlots(EXHIBITION_BAYS);

interface SharedFrameResources {
  unitBox: THREE.BoxGeometry;
  unitPlane: THREE.PlaneGeometry;
  sconceCylinder: THREE.CylinderGeometry;
  sconceArm: THREE.BoxGeometry;
  glowTexture: THREE.CanvasTexture;
  materials: {
    bronze: THREE.MeshStandardMaterial;
    walnut: THREE.MeshStandardMaterial;
    matteBlack: THREE.MeshStandardMaterial;
    champagneGold: THREE.MeshStandardMaterial;
    champagneGoldHover: THREE.MeshStandardMaterial;
    ledStrip: THREE.MeshStandardMaterial;
    ledStripHover: THREE.MeshStandardMaterial;
    backGlow: THREE.MeshBasicMaterial;
    backGlowHover: THREE.MeshBasicMaterial;
    recessBacking: THREE.MeshStandardMaterial;
    glass: THREE.MeshStandardMaterial;
    shadow: THREE.MeshBasicMaterial;
  };
  dispose: () => void;
}

function createBacklightGlowTexture(): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext("2d");

  if (ctx) {
    ctx.clearRect(0, 0, 256, 256);
    // Soft multi-pass rectangular shadow halo fading smoothly to 0 at edges
    const pad = 42;
    const size = 256 - pad * 2;
    ctx.save();
    ctx.fillStyle = "rgba(255, 240, 205, 0.9)";
    ctx.shadowColor = "rgba(255, 210, 122, 0.95)";
    ctx.shadowBlur = 32;
    for (let i = 0; i < 3; i++) {
      ctx.beginPath();
      ctx.roundRect(pad, pad, size, size, 12);
      ctx.fill();
    }
    ctx.restore();
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function createSharedFrameResources(
  textures: GalleryTextureSet | null
): SharedFrameResources {
  const unitBox = new THREE.BoxGeometry(1, 1, 1);
  const unitPlane = new THREE.PlaneGeometry(1, 1);
  const sconceCylinder = new THREE.CylinderGeometry(0.022, 0.026, 0.055, 14);
  const sconceArm = new THREE.BoxGeometry(0.014, 0.014, 0.09);
  const glowTexture = createBacklightGlowTexture();

  const materials = {
    bronze: new THREE.MeshStandardMaterial({
      color: "#49372D",
      roughness: 0.36,
      metalness: 0.58,
    }),
    walnut: new THREE.MeshStandardMaterial({
      color: "#FFFFFF",
      map: textures?.walnut ?? null,
      roughness: 0.5,
      metalness: 0.08,
    }),
    matteBlack: new THREE.MeshStandardMaterial({
      color: "#252525",
      roughness: 0.64,
      metalness: 0.2,
    }),
    champagneGold: new THREE.MeshStandardMaterial({
      color: "#C8A66A",
      roughness: 0.28,
      metalness: 0.78,
    }),
    champagneGoldHover: new THREE.MeshStandardMaterial({
      color: "#DEC089",
      roughness: 0.24,
      metalness: 0.82,
      emissive: "#FFF0D6",
      emissiveIntensity: 0.22,
    }),
    ledStrip: new THREE.MeshStandardMaterial({
      color: "#FFF0D6",
      emissive: "#FFE2AE",
      emissiveIntensity: 1.35,
      toneMapped: false,
    }),
    ledStripHover: new THREE.MeshStandardMaterial({
      color: "#FFF6E5",
      emissive: "#FFE8BE",
      emissiveIntensity: 1.9,
      toneMapped: false,
    }),
    backGlow: new THREE.MeshBasicMaterial({
      map: glowTexture,
      color: "#FFD27A",
      transparent: true,
      opacity: 0.66,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      toneMapped: false,
    }),
    backGlowHover: new THREE.MeshBasicMaterial({
      map: glowTexture,
      color: "#FFE099",
      transparent: true,
      opacity: 0.88,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      toneMapped: false,
    }),
    recessBacking: new THREE.MeshStandardMaterial({
      color: "#1B1714",
      roughness: 0.9,
    }),
    glass: new THREE.MeshStandardMaterial({
      color: "#FFFFFF",
      transparent: true,
      opacity: 0.055,
      roughness: 0.08,
      metalness: 0.92,
      depthWrite: false,
    }),
    shadow: new THREE.MeshBasicMaterial({
      color: "#000000",
      transparent: true,
      opacity: 0.34,
      depthWrite: false,
    }),
  };

  if (!textures?.walnut) {
    materials.walnut.color.set("#553B2B");
  }

  return {
    unitBox,
    unitPlane,
    sconceCylinder,
    sconceArm,
    glowTexture,
    materials,
    dispose: () => {
      unitBox.dispose();
      unitPlane.dispose();
      sconceCylinder.dispose();
      sconceArm.dispose();
      glowTexture.dispose();
      Object.values(materials).forEach((m) => m.dispose());
    },
  };
}

function PhotoDisplayPlane({
  url,
  width,
  height,
  zPos,
  unitPlane,
}: {
  url: string;
  width: number;
  height: number;
  zPos: number;
  unitPlane: THREE.PlaneGeometry;
}) {
  const [texture, setTexture] = useState<THREE.Texture | null>(null);
  const invalidate = useThree((state) => state.invalidate);

  useEffect(() => {
    let active = true;
    let owned: THREE.Texture | null = null;
    const loader = new THREE.TextureLoader();
    loader.crossOrigin = "anonymous";

    loader.load(
      url,
      (source) => {
        if (!active) {
          source.dispose();
          return;
        }
        let next: THREE.Texture = source;
        const img = source.image as HTMLImageElement;
        const maxSize = 1024;
        const longest = Math.max(img.width, img.height);
        if (longest > maxSize) {
          const ratio = maxSize / longest;
          const canvas = document.createElement("canvas");
          canvas.width = Math.max(1, Math.round(img.width * ratio));
          canvas.height = Math.max(1, Math.round(img.height * ratio));
          const ctx = canvas.getContext("2d");
          if (ctx) {
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            next = new THREE.CanvasTexture(canvas);
            source.dispose();
          }
        }

        // Preserve original photograph aspect ratio (cover-fit without stretching)
        const imgAspect = img.width / Math.max(1, img.height);
        const frameAspect = width / Math.max(0.01, height);
        if (imgAspect > frameAspect) {
          const uScale = frameAspect / imgAspect;
          next.repeat.set(uScale, 1);
          next.offset.set((1 - uScale) / 2, 0);
        } else if (imgAspect < frameAspect) {
          const vScale = imgAspect / frameAspect;
          next.repeat.set(1, vScale);
          next.offset.set(0, (1 - vScale) / 2);
        }

        next.colorSpace = THREE.SRGBColorSpace;
        next.generateMipmaps = true;
        next.minFilter = THREE.LinearMipmapLinearFilter;
        next.anisotropy = 4;
        owned = next;
        setTexture(next);
        invalidate();
      },
      undefined,
      (err) => {
        if (active) console.warn(`[GalleryFrames] Texture load failed for ${url}:`, err);
      }
    );

    return () => {
      active = false;
      owned?.dispose();
    };
  }, [url, width, height, invalidate]);

  return (
    <mesh
      geometry={unitPlane}
      position={[0, 0, zPos]}
      scale={[width, height, 1]}
    >
      {texture ? (
        <meshBasicMaterial map={texture} toneMapped={false} />
      ) : (
        <meshStandardMaterial color="#2C221B" roughness={0.82} />
      )}
    </mesh>
  );
}

/**
 * Reusable 4-bar frame perimeter builder using shared unitBox geometry.
 */
function FramePerimeterBars({
  spanW,
  spanH,
  barThickness,
  barDepth,
  zCenter,
  geometry,
  material,
}: {
  spanW: number;
  spanH: number;
  barThickness: number;
  barDepth: number;
  zCenter: number;
  geometry: THREE.BoxGeometry;
  material: THREE.Material;
}) {
  const halfW = spanW / 2 - barThickness / 2;
  const halfH = spanH / 2 - barThickness / 2;

  return (
    <>
      {/* Top */}
      <mesh
        geometry={geometry}
        material={material}
        position={[0, halfH, zCenter]}
        scale={[spanW, barThickness, barDepth]}
      />
      {/* Bottom */}
      <mesh
        geometry={geometry}
        material={material}
        position={[0, -halfH, zCenter]}
        scale={[spanW, barThickness, barDepth]}
      />
      {/* Left */}
      <mesh
        geometry={geometry}
        material={material}
        position={[-halfW, 0, zCenter]}
        scale={[barThickness, spanH - barThickness * 2, barDepth]}
      />
      {/* Right */}
      <mesh
        geometry={geometry}
        material={material}
        position={[halfW, 0, zCenter]}
        scale={[barThickness, spanH - barThickness * 2, barDepth]}
      />
    </>
  );
}

function ExhibitionFrame({
  slot,
  item,
  index,
  onSelect,
  resources,
}: {
  slot: CircularFrameSlot;
  item: GalleryPhotoItem;
  index: number;
  onSelect: (item: GalleryPhotoItem, index: number) => void;
  resources: SharedFrameResources;
}) {
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    if (!hovered) return;
    document.body.style.cursor = "pointer";
    return () => {
      document.body.style.cursor = "";
    };
  }, [hovered]);

  const spec = FRAME_SPECS[slot.style];
  const [w, h] = slot.size;

  // Inner dimensions preserving exact photo aspect ratio inside the recessed frame
  const innerW = w - spec.outerWidth * 2;
  const innerH = h - spec.outerWidth * 2;
  const trimSpanW = innerW;
  const trimSpanH = innerH;
  const photoW = innerW - spec.trimWidth * 2;
  const photoH = innerH - spec.trimWidth * 2;

  // Position along the curved inner exhibition wall (0 rad = -Z)
  const r = GALLERY_DIMS.frameMountRadius;
  const x = Math.sin(slot.angle) * r;
  const z = -Math.cos(slot.angle) * r;
  const rotY = Math.atan2(-x, -z);

  const outerMaterial = resources.materials[slot.finish];
  const trimMaterial = hovered
    ? resources.materials.champagneGoldHover
    : resources.materials.champagneGold;
  const ledMaterial = hovered
    ? resources.materials.ledStripHover
    : resources.materials.ledStrip;

  const photoZ = spec.outerDepth - spec.recessDepth;
  const glowPad =
    slot.style === "large" ? 0.36 : slot.style === "medium" ? 0.3 : 0.24;
  const backGlowMaterial = hovered
    ? resources.materials.backGlowHover
    : resources.materials.backGlow;

  return (
    <group
      position={[x, slot.height, z]}
      rotation={[0, rotY, 0]}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(item, index);
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
      }}
      onPointerOut={() => {
        setHovered(false);
      }}
    >
      {/* 1. Soft Wall Contact Shadow */}
      <mesh
        geometry={resources.unitPlane}
        material={resources.materials.shadow}
        position={[0, -0.025, -0.015]}
        scale={[w + 0.14, h + 0.14, 1]}
      />

      {/* 1b. Concealed Warm Golden Backlight Halo (#FFD27A) */}
      <mesh
        geometry={resources.unitPlane}
        material={backGlowMaterial}
        position={[0, 0, -0.004]}
        scale={[w + glowPad, h + glowPad, 1]}
      />

      {/* 2. Rear Mounting Spacer (grounds frame flush to curved wall) */}
      <mesh
        geometry={resources.unitBox}
        material={resources.materials.recessBacking}
        position={[0, 0, -0.025]}
        scale={[w - 0.06, h - 0.06, 0.05]}
      />

      {/* 3. Outer Stepped Border (Bronze / Walnut / Matte Black) */}
      <FramePerimeterBars
        spanW={w}
        spanH={h}
        barThickness={spec.outerWidth}
        barDepth={spec.outerDepth}
        zCenter={spec.outerDepth / 2}
        geometry={resources.unitBox}
        material={outerMaterial}
      />

      {/* 4. Inner Champagne-Gold Metallic Trim (#C8A66A) */}
      <FramePerimeterBars
        spanW={trimSpanW}
        spanH={trimSpanH}
        barThickness={spec.trimWidth}
        barDepth={spec.outerDepth - 0.008}
        zCenter={(spec.outerDepth - 0.008) / 2}
        geometry={resources.unitBox}
        material={trimMaterial}
      />

      {/* 5. Subtle Warm LED Inner-Perimeter Backlight */}
      <FramePerimeterBars
        spanW={photoW + spec.ledThickness * 0.6}
        spanH={photoH + spec.ledThickness * 0.6}
        barThickness={spec.ledThickness}
        barDepth={0.01}
        zCenter={photoZ + 0.006}
        geometry={resources.unitBox}
        material={ledMaterial}
      />

      {/* 6. Recessed Dark Backing & Actual Vastu Vihar Photograph */}
      <mesh
        geometry={resources.unitBox}
        material={resources.materials.recessBacking}
        position={[0, 0, photoZ / 2]}
        scale={[photoW + 0.02, photoH + 0.02, photoZ]}
      />
      <PhotoDisplayPlane
        key={item.url}
        url={item.url}
        width={photoW}
        height={photoH}
        zPos={photoZ + 0.004}
        unitPlane={resources.unitPlane}
      />

      {/* 7. Subtle Glass Protection Layer */}
      <mesh
        geometry={resources.unitPlane}
        material={resources.materials.glass}
        position={[0, 0, spec.outerDepth - 0.012]}
        scale={[photoW, photoH, 1]}
      />

      {/* 8. Architectural Picture-Light Sconce above Large & Medium Frames */}
      {spec.hasSconce && (
        <group position={[0, h / 2 + 0.09, 0.05]}>
          <mesh
            geometry={resources.sconceArm}
            material={resources.materials.bronze}
            position={[0, 0.01, -0.025]}
          />
          <mesh
            geometry={resources.sconceCylinder}
            material={resources.materials.bronze}
            position={[0, 0, 0.025]}
            rotation={[0.25, 0, 0]}
          />
          <mesh
            geometry={resources.unitPlane}
            material={ledMaterial}
            position={[0, -0.028, 0.02]}
            rotation={[Math.PI / 2, 0, 0]}
            scale={[0.04, 0.04, 1]}
          />
        </group>
      )}
    </group>
  );
}

interface GalleryFramesProps {
  photos: GalleryPhotoItem[];
  onSelectPhoto: (item: GalleryPhotoItem, index: number) => void;
  textures: GalleryTextureSet | null;
}

export function GalleryFrames({
  photos,
  onSelectPhoto,
  textures,
}: GalleryFramesProps) {
  const resources = useMemo(
    () => createSharedFrameResources(textures),
    [textures]
  );

  useEffect(() => {
    return () => {
      resources.dispose();
    };
  }, [resources]);

  const frameItems = useMemo(() => {
    const primaryBySlotId = new Map<string, { photo: GalleryPhotoItem; index: number }>();
    WALL_SLOTS.forEach((wallSlot, idx) => {
      if (photos[idx]) {
        primaryBySlotId.set(wallSlot.id, { photo: photos[idx], index: idx });
      }
    });

    let nextExtraIndex = WALL_SLOTS.length;
    return CIRCULAR_FRAME_SLOTS.map((slot) => {
      const primary = primaryBySlotId.get(slot.id);
      if (primary) {
        return { slot, photo: primary.photo, index: primary.index };
      }
      const idx = nextExtraIndex < photos.length ? nextExtraIndex++ : nextExtraIndex++ % photos.length;
      return { slot, photo: photos[idx], index: idx };
    });
  }, [photos]);

  return (
    <group>
      {frameItems.map(({ slot, photo, index }) => (
        <ExhibitionFrame
          key={slot.id}
          slot={slot}
          item={photo}
          index={index}
          onSelect={onSelectPhoto}
          resources={resources}
        />
      ))}
    </group>
  );
}
