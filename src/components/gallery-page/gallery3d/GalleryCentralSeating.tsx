"use client";

import React, { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { GALLERY_DIMS, GALLERY_PALETTE } from "./constants";
import type { GalleryTextureSet } from "./textures";

interface GalleryCentralSeatingProps {
  textures: GalleryTextureSet | null;
  isMobile: boolean;
}

/**
 * Creates a natural curved botanical leaf blade geometry (arched along +Z/+Y)
 * so instanced foliage looks organic rather than spiky.
 */
function createCurvedLeafGeometry(length: number, width: number): THREE.BufferGeometry {
  const geom = new THREE.PlaneGeometry(width, length, 2, 6);
  const pos = geom.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const t = THREE.MathUtils.clamp((pos.getY(i) + length / 2) / length, 0, 1);
    const y = t * length;
    // Taper width smoothly toward base and tip
    const taper = Math.sin(Math.pow(t, 0.72) * Math.PI);
    pos.setX(i, x * taper);
    // Arch outward along +Z as leaf rises
    const archZ = Math.pow(t, 1.8) * (length * 0.45);
    const liftY = y - Math.pow(t, 2.4) * (length * 0.22);
    pos.setY(i, liftY);
    pos.setZ(i, archZ);
  }
  geom.computeVertexNormals();
  return geom;
}

/** Deterministic pseudo-random helper in [0, 1) for natural leaf variation. */
function seededRand(seed: number): number {
  const x = Math.sin(seed * 12.9898 + 78.233) * 43758.5453;
  return x - Math.floor(x);
}

/**
 * 5m-diameter circular upholstered exhibition bench with segmented cushion
 * detailing, champagne-bronze trim, concealed under-seat warm LED ring,
 * and dense, layered natural foliage in the central circular planter.
 */
export function GalleryCentralSeating({
  textures,
  isMobile,
}: GalleryCentralSeatingProps) {
  const segments = isMobile ? 48 : 72;
  const broadLeafRef = useRef<THREE.InstancedMesh>(null);
  const accentLeafRef = useRef<THREE.InstancedMesh>(null);
  const frondLeafRef = useRef<THREE.InstancedMesh>(null);
  const broadCount = isMobile ? 64 : 110;
  const accentCount = isMobile ? 32 : 55;
  const frondCount = isMobile ? 48 : 85;
  const seamCount = 24;

  const broadLeafGeom = useMemo(() => createCurvedLeafGeometry(0.5, 0.18), []);
  const accentLeafGeom = useMemo(() => createCurvedLeafGeometry(0.58, 0.13), []);
  const frondLeafGeom = useMemo(() => createCurvedLeafGeometry(0.72, 0.085), []);

  // Main circular upholstered ring body (outer R=2.5m, inner R=1.15m)
  const benchBodyGeom = useMemo(() => {
    const shape = new THREE.Shape();
    shape.absarc(0, 0, GALLERY_DIMS.seatingOuterRadius, 0, Math.PI * 2, false);
    const hole = new THREE.Path();
    hole.absarc(0, 0, GALLERY_DIMS.seatingInnerRadius, 0, Math.PI * 2, true);
    shape.holes.push(hole);

    const geom = new THREE.ExtrudeGeometry(shape, {
      depth: 0.38,
      bevelEnabled: true,
      bevelThickness: 0.055,
      bevelSize: 0.055,
      bevelSegments: 4,
      curveSegments: segments,
    });
    geom.rotateX(-Math.PI / 2);
    geom.computeVertexNormals();
    return geom;
  }, [segments]);

  useEffect(() => {
    return () => {
      benchBodyGeom.dispose();
      broadLeafGeom.dispose();
      accentLeafGeom.dispose();
      frondLeafGeom.dispose();
    };
  }, [benchBodyGeom, broadLeafGeom, accentLeafGeom, frondLeafGeom]);

  // Populate dense, multi-layered tropical foliage across the entire circular planter
  useEffect(() => {
    const broad = broadLeafRef.current;
    const accent = accentLeafRef.current;
    const frond = frondLeafRef.current;
    if (!broad || !accent || !frond) return;
    const dummy = new THREE.Object3D();
    const maxR = GALLERY_DIMS.seatingInnerRadius - 0.16;

    for (let i = 0; i < broadCount; i++) {
      const jitterAngle = (seededRand(i + 1) - 0.5) * 0.45;
      const goldenAngle = i * 2.3999632 + jitterAngle;
      const rNorm = Math.sqrt((i + 0.35) / broadCount);
      const r = THREE.MathUtils.clamp(
        rNorm * maxR + (seededRand(i + 101) - 0.5) * 0.12,
        0.04,
        maxR
      );
      const x = Math.cos(goldenAngle) * r;
      const z = Math.sin(goldenAngle) * r;
      const scale = 0.72 + seededRand(i + 201) * 0.48 + (1 - rNorm) * 0.2;

      dummy.position.set(x, 0.48 + seededRand(i + 301) * 0.05, z);
      dummy.rotation.set(
        0.22 + rNorm * 0.48 + seededRand(i + 401) * 0.18,
        -goldenAngle + Math.PI / 2,
        (seededRand(i + 501) - 0.5) * 0.28
      );
      dummy.scale.set(scale, scale, scale);
      dummy.updateMatrix();
      broad.setMatrixAt(i, dummy.matrix);
    }

    for (let i = 0; i < accentCount; i++) {
      const jitterAngle = (seededRand(i + 601) - 0.5) * 0.5;
      const goldenAngle = i * 2.3999632 + 0.65 + jitterAngle;
      const rNorm = Math.sqrt((i + 0.3) / accentCount) * 0.88;
      const r = THREE.MathUtils.clamp(rNorm * maxR, 0.03, maxR * 0.92);
      const x = Math.cos(goldenAngle) * r;
      const z = Math.sin(goldenAngle) * r;
      const scale = 0.78 + seededRand(i + 701) * 0.45 + (1 - rNorm) * 0.25;

      dummy.position.set(x, 0.5 + seededRand(i + 801) * 0.05, z);
      dummy.rotation.set(
        0.16 + rNorm * 0.38 + seededRand(i + 901) * 0.16,
        -goldenAngle + Math.PI / 2,
        (seededRand(i + 1001) - 0.5) * 0.24
      );
      dummy.scale.set(scale, scale, scale);
      dummy.updateMatrix();
      accent.setMatrixAt(i, dummy.matrix);
    }

    for (let i = 0; i < frondCount; i++) {
      const jitterAngle = (seededRand(i + 1101) - 0.5) * 0.48;
      const goldenAngle = i * 2.3999632 + 1.25 + jitterAngle;
      const rNorm = Math.sqrt((i + 0.25) / frondCount) * 0.78;
      const r = THREE.MathUtils.clamp(rNorm * maxR, 0.02, maxR * 0.82);
      const x = Math.cos(goldenAngle) * r;
      const z = Math.sin(goldenAngle) * r;
      const scale = 0.8 + seededRand(i + 1201) * 0.42 + (1 - rNorm) * 0.32;

      dummy.position.set(x, 0.52 + seededRand(i + 1301) * 0.04, z);
      dummy.rotation.set(
        0.12 + rNorm * 0.32 + seededRand(i + 1401) * 0.15,
        -goldenAngle + Math.PI / 2,
        (seededRand(i + 1501) - 0.5) * 0.22
      );
      dummy.scale.set(scale, scale, scale);
      dummy.updateMatrix();
      frond.setMatrixAt(i, dummy.matrix);
    }

    broad.instanceMatrix.needsUpdate = true;
    accent.instanceMatrix.needsUpdate = true;
    frond.instanceMatrix.needsUpdate = true;
  }, [broadCount, accentCount, frondCount]);

  const seamAngles = useMemo(
    () => Array.from({ length: seamCount }, (_, i) => (Math.PI * 2 * i) / seamCount),
    []
  );

  return (
    <group position={[0, 0, 0]}>
      {/* Recessed Dark Bronze Plinth */}
      <mesh position={[0, 0.05, 0]} castShadow receiveShadow>
        <cylinderGeometry
          args={[
            GALLERY_DIMS.seatingOuterRadius - 0.14,
            GALLERY_DIMS.seatingOuterRadius - 0.18,
            0.1,
            segments,
          ]}
        />
        <meshStandardMaterial
          color={GALLERY_PALETTE.seatingPlinth}
          roughness={0.5}
          metalness={0.32}
        />
      </mesh>

      {/* Concealed Under-Seat Warm LED Ring */}
      <mesh position={[0, 0.035, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[GALLERY_DIMS.seatingOuterRadius - 0.12, 0.02, 8, segments]} />
        <meshStandardMaterial
          color={GALLERY_PALETTE.warmLed}
          emissive={GALLERY_PALETTE.warmLedEmissive}
          emissiveIntensity={2.6}
          toneMapped={false}
        />
      </mesh>

      {/* Subtle Champagne-Bronze Lower Cushion Trim */}
      <mesh position={[0, 0.115, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[GALLERY_DIMS.seatingOuterRadius - 0.04, 0.01, 8, segments]} />
        <meshStandardMaterial color="#C8A66A" roughness={0.34} metalness={0.72} />
      </mesh>

      {/* Upholstered Circular Cushion Body (Top at y = 0.55 m) */}
      <mesh
        geometry={benchBodyGeom}
        position={[0, 0.115, 0]}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial
          color="#B5A594"
          bumpMap={textures?.fabricBump ?? null}
          bumpScale={0.014}
          roughness={0.88}
          metalness={0.02}
        />
      </mesh>

      {/* Subtle Radial Cushion Seam Piping */}
      {seamAngles.map((theta, idx) => {
        const midR =
          (GALLERY_DIMS.seatingOuterRadius + GALLERY_DIMS.seatingInnerRadius) / 2;
        const len =
          GALLERY_DIMS.seatingOuterRadius - GALLERY_DIMS.seatingInnerRadius - 0.04;
        return (
          <mesh
            key={`seam-${idx}`}
            position={[Math.cos(theta) * midR, 0.551, Math.sin(theta) * midR]}
            rotation={[0, -theta, 0]}
          >
            <boxGeometry args={[len, 0.006, 0.01]} />
            <meshStandardMaterial color="#8A7A6A" roughness={0.9} />
          </mesh>
        );
      })}

      {/* Central Planter Dark Bronze & Champagne Rim */}
      <mesh position={[0, 0.56, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[GALLERY_DIMS.seatingInnerRadius, 0.032, 10, segments]} />
        <meshStandardMaterial
          color={GALLERY_PALETTE.darkBronze}
          roughness={0.4}
          metalness={0.58}
        />
      </mesh>

      {/* Planter Soil Bed */}
      <mesh position={[0, 0.48, 0]}>
        <cylinderGeometry
          args={[
            GALLERY_DIMS.seatingInnerRadius - 0.02,
            GALLERY_DIMS.seatingInnerRadius - 0.02,
            0.08,
            32,
          ]}
        />
        <meshStandardMaterial color="#2A1F18" roughness={0.95} />
      </mesh>

      {/* Layered Natural Planter Foliage (Broad Tropical + Mid Accent + Slender Fronds) */}
      <instancedMesh
        ref={broadLeafRef}
        args={[broadLeafGeom, undefined, broadCount]}
        castShadow
      >
        <meshStandardMaterial
          color="#2D5026"
          roughness={0.68}
          metalness={0.04}
          side={THREE.DoubleSide}
        />
      </instancedMesh>
      <instancedMesh
        ref={accentLeafRef}
        args={[accentLeafGeom, undefined, accentCount]}
        castShadow
      >
        <meshStandardMaterial
          color="#395F2E"
          roughness={0.65}
          metalness={0.04}
          side={THREE.DoubleSide}
        />
      </instancedMesh>
      <instancedMesh
        ref={frondLeafRef}
        args={[frondLeafGeom, undefined, frondCount]}
        castShadow
      >
        <meshStandardMaterial
          color="#4E7940"
          roughness={0.62}
          metalness={0.04}
          side={THREE.DoubleSide}
        />
      </instancedMesh>
    </group>
  );
}
