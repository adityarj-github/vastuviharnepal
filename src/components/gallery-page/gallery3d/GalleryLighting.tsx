"use client";

import React, { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { GALLERY_DIMS } from "./constants";

interface GalleryLightingProps {
  isMobile: boolean;
}

interface BaySpotlightProps {
  position: [number, number, number];
  target: [number, number, number];
  intensity: number;
  angle?: number;
  penumbra?: number;
  distance?: number;
  color?: string;
}

/**
 * Lightweight non-shadow-casting spotlight aimed accurately at an exhibition bay or centerpiece.
 */
function AimedSpotLight({
  position,
  target,
  intensity,
  angle = 0.78,
  penumbra = 0.82,
  distance = 12,
  color = "#FFE4BA",
}: BaySpotlightProps) {
  const lightRef = useRef<THREE.SpotLight>(null);
  const targetObj = useMemo(() => new THREE.Object3D(), []);

  useEffect(() => {
    targetObj.position.set(target[0], target[1], target[2]);
    targetObj.updateMatrixWorld();
    if (lightRef.current) {
      lightRef.current.target = targetObj;
    }
  }, [target, targetObj]);

  return (
    <>
      <primitive object={targetObj} />
      <spotLight
        ref={lightRef}
        position={position}
        color={color}
        intensity={intensity}
        angle={angle}
        penumbra={penumbra}
        distance={distance}
        decay={1.6}
      />
    </>
  );
}

// 5 Exhibition Bay azimuths (matching CAMERA_STOPS 0%..80%)
const BAY_SPOT_ANGLES = [
  { phi: 0, intensity: 44 }, // Bay 1: Main Achievement (strongest focal)
  { phi: 1.34, intensity: 36 }, // Bay 2: Awards & Recognition
  { phi: 2.74, intensity: 38 }, // Bay 3: Events & Celebrations
  { phi: -2.17, intensity: 36 }, // Bay 4: Community & Sports
  { phi: -1.14, intensity: 34 }, // Bay 5: Media & Press
];

// 5 Pier / Walnut Slat transition azimuths for dynamic golden light spill
const SLAT_ZONE_ANGLES = [0.68, -0.68, -1.52, -2.76, 1.92];

/**
 * Warm 2700K-3200K museum-grade architectural lighting system:
 * - Restrained warm ambient & skylight hemisphere bounce for natural contrast
 * - Single soft shadow-casting skylight directional key light
 * - Focused ceiling-track spotlights aimed at all 5 exhibition bays
 * - Warm central skylight pool & concealed under-seating floor glow
 */
export function GalleryLighting({ isMobile }: GalleryLightingProps) {
  const trackR = GALLERY_DIMS.trackRingRadius;
  const trackY = GALLERY_DIMS.ceilingHeight - 0.16;
  const wallR = GALLERY_DIMS.frameMountRadius;

  return (
    <>
      {/* Restrained warm ambient (2800K) so architectural depth & shadows read clearly */}
      <ambientLight color="#F5E4CA" intensity={0.42} />

      {/* Warm champagne skylight top / warm umber floor bounce */}
      <hemisphereLight
        args={["#FFF2DC", "#4B3C2E", 0.48]}
        position={[0, GALLERY_DIMS.ceilingHeight + 1, 0]}
      />

      {/* Primary Skylight Key Light (single soft shadow caster) */}
      <directionalLight
        position={[1.6, 8.8, 2.2]}
        color="#FFF3DF"
        intensity={1.7}
        castShadow
        shadow-mapSize-width={isMobile ? 512 : 1024}
        shadow-mapSize-height={isMobile ? 512 : 1024}
        shadow-radius={4}
        shadow-camera-left={-11}
        shadow-camera-right={11}
        shadow-camera-top={11}
        shadow-camera-bottom={-11}
        shadow-camera-near={1}
        shadow-camera-far={22}
        shadow-normalBias={0.025}
        shadow-bias={-0.0001}
      />

      {/* Warm Skylight Pool onto Central Seating & Planter */}
      <AimedSpotLight
        position={[0, GALLERY_DIMS.ceilingHeight + 0.4, 0]}
        target={[0, 0.55, 0]}
        intensity={26}
        angle={0.74}
        penumbra={0.88}
        distance={8}
        color="#FFF0D4"
      />

      {/* Concealed Under-Seating Warm Amber Floor Glow */}
      <pointLight
        position={[0, 0.12, 0]}
        color="#FFD99E"
        intensity={7.5}
        distance={7.5}
        decay={1.8}
      />

      {/* 5 Focused Ceiling-Track Spotlights + Soft Wall-Wash Fill per Exhibition Bay */}
      {BAY_SPOT_ANGLES.map(({ phi, intensity }, idx) => {
        const sx = Math.sin(phi) * trackR;
        const sz = -Math.cos(phi) * trackR;
        const tx = Math.sin(phi) * wallR;
        const tz = -Math.cos(phi) * wallR;
        const fx = Math.sin(phi) * 7.0;
        const fz = -Math.cos(phi) * 7.0;

        return (
          <React.Fragment key={`bay-light-${idx}`}>
            <AimedSpotLight
              position={[sx, trackY, sz]}
              target={[tx, 1.82, tz]}
              intensity={intensity}
              angle={0.82}
              penumbra={0.85}
              distance={11}
              color="#FFE5BC"
            />
            <pointLight
              position={[fx, 2.65, fz]}
              color="#FFE2B5"
              intensity={13}
              distance={10.5}
              decay={1.65}
            />
          </React.Fragment>
        );
      })}

      {/* Dynamic Warm Golden Light Spill from Concealed Slat Backlights */}
      {SLAT_ZONE_ANGLES.map((phi, idx) => {
        const lx = Math.sin(phi) * 9.05;
        const lz = -Math.cos(phi) * 9.05;
        return (
          <pointLight
            key={`slat-spill-${idx}`}
            position={[lx, 1.85, lz]}
            color="#FFD27A"
            intensity={12}
            distance={5.8}
            decay={2.0}
          />
        );
      })}
    </>
  );
}
