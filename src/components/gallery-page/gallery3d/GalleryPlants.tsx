"use client";

import React, { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { GALLERY_PALETTE } from "./constants";

interface GalleryPlantsProps {
  isMobile: boolean;
}

/**
 * Generates an arched Areca/Kentia palm frond geometry for instanced tall indoor palms.
 */
function createPalmFrondGeometry(): THREE.BufferGeometry {
  const length = 1.18;
  const width = 0.24;
  const geom = new THREE.PlaneGeometry(width, length, 2, 8);
  const pos = geom.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const t = THREE.MathUtils.clamp((pos.getY(i) + length / 2) / length, 0, 1);
    const y = t * length;
    const taper = Math.sin(Math.pow(t, 0.68) * Math.PI);
    pos.setX(i, x * taper);
    // Graceful outward & downward palm arch
    const archZ = Math.pow(t, 1.4) * 0.72;
    const droopY = y - Math.pow(t, 2.3) * 0.42;
    pos.setY(i, droopY);
    pos.setZ(i, archZ);
  }
  geom.computeVertexNormals();
  return geom;
}

// Placed beside the 5 walnut-slat / pier transitions (R = 8.95 m), clear of all photos & camera paths
const PLANT_AZIMUTHS = [-0.76, 0.76, -1.58, -2.8, 1.98];

/**
 * 5 tall architectural Areca/Kentia palms in fluted dark-bronze planters
 * positioned at key bay transitions using instanced stems and fronds.
 */
export function GalleryPlants({ isMobile }: GalleryPlantsProps) {
  const potRef = useRef<THREE.InstancedMesh>(null);
  const rimRef = useRef<THREE.InstancedMesh>(null);
  const soilRef = useRef<THREE.InstancedMesh>(null);
  const stemRef = useRef<THREE.InstancedMesh>(null);
  const frondRef = useRef<THREE.InstancedMesh>(null);

  const frondsPerPlant = isMobile ? 10 : 14;
  const stemsPerPlant = 3;
  const frondGeom = useMemo(() => createPalmFrondGeometry(), []);

  useEffect(() => {
    return () => {
      frondGeom.dispose();
    };
  }, [frondGeom]);

  useEffect(() => {
    const pot = potRef.current;
    const rim = rimRef.current;
    const soil = soilRef.current;
    const stem = stemRef.current;
    const frond = frondRef.current;
    if (!pot || !rim || !soil || !stem || !frond) return;

    const dummy = new THREE.Object3D();
    const r = 8.95;
    let stemIdx = 0;
    let frondIdx = 0;

    PLANT_AZIMUTHS.forEach((phi, plantIdx) => {
      const px = Math.sin(phi) * r;
      const pz = -Math.cos(phi) * r;

      // Dark bronze planter pot (height 0.56 m)
      dummy.position.set(px, 0.28, pz);
      dummy.rotation.set(0, phi, 0);
      dummy.scale.set(1, 1, 1);
      dummy.updateMatrix();
      pot.setMatrixAt(plantIdx, dummy.matrix);

      // Champagne-bronze top rim
      dummy.position.set(px, 0.56, pz);
      dummy.rotation.set(Math.PI / 2, 0, 0);
      dummy.updateMatrix();
      rim.setMatrixAt(plantIdx, dummy.matrix);

      // Soil disc
      dummy.position.set(px, 0.52, pz);
      dummy.rotation.set(0, 0, 0);
      dummy.updateMatrix();
      soil.setMatrixAt(plantIdx, dummy.matrix);

      // 3 slender palm canes per planter
      for (let s = 0; s < stemsPerPlant; s++) {
        const sa = phi + (s * Math.PI * 2) / stemsPerPlant;
        const sx = px + Math.cos(sa) * 0.055;
        const sz = pz + Math.sin(sa) * 0.055;
        const stemH = 0.85 + s * 0.14;
        dummy.position.set(sx, 0.5 + stemH / 2, sz);
        dummy.rotation.set(Math.sin(sa) * 0.08, sa, -Math.cos(sa) * 0.08);
        dummy.scale.set(1, stemH, 1);
        dummy.updateMatrix();
        stem.setMatrixAt(stemIdx++, dummy.matrix);
      }

      // Layered palm fronds radiating from crown
      for (let f = 0; f < frondsPerPlant; f++) {
        const fa = phi + (f * Math.PI * 2) / frondsPerPlant + plantIdx * 0.4;
        const tier = f % 2;
        const baseY = 1.25 + tier * 0.22;
        const scale = 0.82 + tier * 0.18;
        dummy.position.set(px, baseY, pz);
        dummy.rotation.set(0.24 + (1 - tier) * 0.2, fa, 0);
        dummy.scale.set(scale, scale, scale);
        dummy.updateMatrix();
        frond.setMatrixAt(frondIdx++, dummy.matrix);
      }
    });

    pot.instanceMatrix.needsUpdate = true;
    rim.instanceMatrix.needsUpdate = true;
    soil.instanceMatrix.needsUpdate = true;
    stem.instanceMatrix.needsUpdate = true;
    frond.instanceMatrix.needsUpdate = true;
  }, [frondsPerPlant]);

  const plantCount = PLANT_AZIMUTHS.length;

  return (
    <group>
      {/* Dark Bronze Planters */}
      <instancedMesh
        ref={potRef}
        args={[undefined, undefined, plantCount]}
        castShadow
        receiveShadow
      >
        <cylinderGeometry args={[0.29, 0.22, 0.56, 24]} />
        <meshStandardMaterial
          color={GALLERY_PALETTE.darkBronze}
          roughness={0.42}
          metalness={0.52}
        />
      </instancedMesh>

      {/* Champagne-Bronze Planter Rim */}
      <instancedMesh ref={rimRef} args={[undefined, undefined, plantCount]}>
        <torusGeometry args={[0.29, 0.016, 8, 24]} />
        <meshStandardMaterial color="#C8A66A" roughness={0.32} metalness={0.74} />
      </instancedMesh>

      {/* Soil Beds */}
      <instancedMesh ref={soilRef} args={[undefined, undefined, plantCount]}>
        <cylinderGeometry args={[0.27, 0.27, 0.04, 18]} />
        <meshStandardMaterial color="#281D16" roughness={0.95} />
      </instancedMesh>

      {/* Palm Canes */}
      <instancedMesh
        ref={stemRef}
        args={[undefined, undefined, plantCount * stemsPerPlant]}
        castShadow
      >
        <cylinderGeometry args={[0.018, 0.026, 1, 8]} />
        <meshStandardMaterial color="#586942" roughness={0.8} />
      </instancedMesh>

      {/* Arched Palm Fronds */}
      <instancedMesh
        ref={frondRef}
        args={[frondGeom, undefined, plantCount * frondsPerPlant]}
        castShadow
      >
        <meshStandardMaterial
          color="#3A6331"
          roughness={0.62}
          metalness={0.04}
          side={THREE.DoubleSide}
        />
      </instancedMesh>
    </group>
  );
}
