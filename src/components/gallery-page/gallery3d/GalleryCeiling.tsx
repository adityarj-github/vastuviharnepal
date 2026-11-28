"use client";

import React, { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { GALLERY_DIMS, GALLERY_PALETTE } from "./constants";

interface GalleryCeilingProps {
  isMobile: boolean;
}

/**
 * Contemporary circular ceiling with a 5m central skylight opening,
 * concentric recessed warm LED rings, and a 12m dark-bronze track ring
 * with instanced adjustable directional spotlights.
 */
export function GalleryCeiling({ isMobile }: GalleryCeilingProps) {
  const segments = isMobile ? 64 : 96;
  const spotHousingRef = useRef<THREE.InstancedMesh>(null);
  const spotLensRef = useRef<THREE.InstancedMesh>(null);
  const spotCount = isMobile ? 16 : 24;

  // Main ceiling slab with 5m central skylight cutout
  const ceilingSlabGeom = useMemo(() => {
    const shape = new THREE.Shape();
    shape.absarc(0, 0, GALLERY_DIMS.outerRadius, 0, Math.PI * 2, false);
    const hole = new THREE.Path();
    hole.absarc(0, 0, GALLERY_DIMS.skylightRadius, 0, Math.PI * 2, true);
    shape.holes.push(hole);

    const geom = new THREE.ExtrudeGeometry(shape, {
      depth: 0.22,
      bevelEnabled: false,
      curveSegments: segments,
    });
    geom.rotateX(-Math.PI / 2);
    return geom;
  }, [segments]);

  // Skylight recessed drum collar (vertical cylinder wall around the 5m opening)
  useEffect(() => {
    return () => {
      ceilingSlabGeom.dispose();
    };
  }, [ceilingSlabGeom]);

  // Position instanced track spotlights along the 12m (R = 6m) dark bronze track ring
  useEffect(() => {
    const housing = spotHousingRef.current;
    const lens = spotLensRef.current;
    if (!housing || !lens) return;

    const dummy = new THREE.Object3D();
    const r = GALLERY_DIMS.trackRingRadius;
    const y = GALLERY_DIMS.ceilingHeight - 0.14;

    for (let i = 0; i < spotCount; i++) {
      const theta = (Math.PI * 2 * i) / spotCount;
      const x = Math.cos(theta) * r;
      const z = Math.sin(theta) * r;
      // Aim spotlight outward & downward toward the exhibition wall at y = 1.85
      const targetX = Math.cos(theta) * GALLERY_DIMS.innerRadius;
      const targetZ = Math.sin(theta) * GALLERY_DIMS.innerRadius;

      dummy.position.set(x, y, z);
      dummy.lookAt(targetX, 1.85, targetZ);
      dummy.rotateX(Math.PI / 2);
      dummy.updateMatrix();
      housing.setMatrixAt(i, dummy.matrix);

      dummy.position.set(x, y, z);
      dummy.lookAt(targetX, 1.85, targetZ);
      dummy.rotateX(Math.PI / 2);
      dummy.translateY(0.065);
      dummy.updateMatrix();
      lens.setMatrixAt(i, dummy.matrix);
    }

    housing.instanceMatrix.needsUpdate = true;
    lens.instanceMatrix.needsUpdate = true;
  }, [spotCount]);

  const ceilingY = GALLERY_DIMS.ceilingHeight;

  return (
    <group>
      {/* Main Circular Ceiling Structure with Central Skylight Opening */}
      <mesh geometry={ceilingSlabGeom} position={[0, ceilingY, 0]} receiveShadow>
        <meshStandardMaterial
          color="#D6CEC2"
          roughness={0.85}
          metalness={0.04}
        />
      </mesh>

      {/* Skylight Architectural Drum Collar */}
      <mesh position={[0, ceilingY + 0.35, 0]}>
        <cylinderGeometry
          args={[
            GALLERY_DIMS.skylightRadius,
            GALLERY_DIMS.skylightRadius,
            0.7,
            segments,
            1,
            true,
          ]}
        />
        <meshStandardMaterial
          color="#EAE4DA"
          roughness={0.78}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Warm Champagne Skylight Glow Dome above Skylight */}
      <mesh position={[0, ceilingY + 0.7, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <circleGeometry args={[GALLERY_DIMS.skylightRadius + 0.1, segments]} />
        <meshBasicMaterial color="#F5E7D0" />
      </mesh>

      {/* Inner Skylight Trim & Warm LED Ring (R = 2.52 m) */}
      <mesh position={[0, ceilingY - 0.01, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[GALLERY_DIMS.skylightRadius + 0.02, 0.035, 10, segments]} />
        <meshStandardMaterial
          color="#FFF2DA"
          emissive="#FFE2B0"
          emissiveIntensity={2.2}
          toneMapped={false}
        />
      </mesh>

      {/* Middle Concentric Recessed Warm LED Ring (R = 4.25 m) */}
      <mesh position={[0, ceilingY - 0.01, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[4.25, 0.038, 10, segments]} />
        <meshStandardMaterial
          color="#FFF2DA"
          emissive="#FFE2B0"
          emissiveIntensity={2.35}
          toneMapped={false}
        />
      </mesh>

      {/* Dark Bronze Circular Track Lighting Ring (12 m diameter -> R = 6.0 m) */}
      <mesh position={[0, ceilingY - 0.06, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[GALLERY_DIMS.trackRingRadius, 0.035, 10, segments]} />
        <meshStandardMaterial
          color="#261D17"
          roughness={0.42}
          metalness={0.65}
        />
      </mesh>

      {/* Instanced Adjustable Track Spotlights */}
      <instancedMesh ref={spotHousingRef} args={[undefined, undefined, spotCount]}>
        <cylinderGeometry args={[0.045, 0.052, 0.13, 12]} />
        <meshStandardMaterial color="#1F1814" roughness={0.45} metalness={0.6} />
      </instancedMesh>
      <instancedMesh ref={spotLensRef} args={[undefined, undefined, spotCount]}>
        <cylinderGeometry args={[0.038, 0.038, 0.01, 12]} />
        <meshStandardMaterial
          color={GALLERY_PALETTE.warmLed}
          emissive={GALLERY_PALETTE.warmLedEmissive}
          emissiveIntensity={2.4}
          toneMapped={false}
        />
      </instancedMesh>
    </group>
  );
}
