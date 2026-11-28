"use client";

import React from "react";
import * as THREE from "three";
import { GALLERY_DIMS, GALLERY_PALETTE } from "./constants";
import type { GalleryTextureSet } from "./textures";

interface GalleryFloorProps {
  textures: GalleryTextureSet | null;
  isMobile: boolean;
}

/**
 * Polished warm-grey marble circular floor with restrained reflections
 * and concentric champagne-bronze & warm LED floor inlay rings.
 */
export function GalleryFloor({ textures, isMobile }: GalleryFloorProps) {
  const segments = isMobile ? 64 : 96;

  return (
    <group position={[0, 0, 0]}>
      {/* Main Circular Marble Floor Slab */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <circleGeometry args={[GALLERY_DIMS.outerRadius, segments]} />
        <meshStandardMaterial
          color={textures ? "#FFFFFF" : GALLERY_PALETTE.marbleFloor}
          map={textures?.marbleFloor ?? null}
          roughness={0.26}
          metalness={0.14}
        />
      </mesh>

      {/* Outer Warm LED / Champagne Floor Inlay Ring (R = 5.4 m) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.004, 0]}>
        <ringGeometry args={[5.36, 5.42, segments]} />
        <meshStandardMaterial
          color={GALLERY_PALETTE.warmLed}
          emissive={GALLERY_PALETTE.warmLedEmissive}
          emissiveIntensity={1.6}
          toneMapped={false}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Subtle Outer Bronze Trim Ring (R = 8.4 m) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.003, 0]}>
        <ringGeometry args={[8.38, 8.43, segments]} />
        <meshStandardMaterial
          color={GALLERY_PALETTE.champagneBronze}
          roughness={0.4}
          metalness={0.65}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
}
