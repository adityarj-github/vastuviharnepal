"use client";

import React, { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { GALLERY_DIMS, GALLERY_PALETTE } from "./constants";
import type { GalleryTextureSet } from "./textures";

interface GalleryRoomProps {
  textures: GalleryTextureSet | null;
  isMobile: boolean;
}

/**
 * Helper to create a curved ring or arc wall segment using ExtrudeGeometry
 * with clean inner/outer surfaces, top/bottom caps, and inward-facing normals.
 */
function createArcWallGeometry(
  innerR: number,
  outerR: number,
  height: number,
  startAngle: number,
  endAngle: number,
  curveSegments: number
): THREE.ExtrudeGeometry {
  const shape = new THREE.Shape();
  shape.absarc(0, 0, outerR, startAngle, endAngle, false);
  shape.lineTo(Math.cos(endAngle) * innerR, Math.sin(endAngle) * innerR);
  shape.absarc(0, 0, innerR, endAngle, startAngle, true);
  shape.closePath();

  const geom = new THREE.ExtrudeGeometry(shape, {
    depth: height,
    bevelEnabled: false,
    curveSegments,
  });
  // Extrude is along +Z; rotate -PI/2 on X so it stands vertically along +Y from y=0
  geom.rotateX(-Math.PI / 2);
  geom.computeVertexNormals();
  return geom;
}

/**
 * Soft elliptical radial golden light-spread texture (#FFF0CD -> #FFD682 -> #F2BC62 -> 0)
 * matching the wide, diffused wall-wash glow around architectural pillars.
 */
function createSlatBacklightTexture(): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext("2d");

  if (ctx) {
    ctx.clearRect(0, 0, 256, 256);
    const grad = ctx.createRadialGradient(128, 128, 6, 128, 128, 126);
    grad.addColorStop(0.0, "rgba(255, 240, 205, 0.92)");
    grad.addColorStop(0.28, "rgba(255, 214, 130, 0.68)");
    grad.addColorStop(0.62, "rgba(242, 188, 98, 0.26)");
    grad.addColorStop(1.0, "rgba(242, 188, 98, 0.0)");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 256, 256);
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

/**
 * Continuous 360° circular exhibition room with recessed display bays,
 * raised limestone pilasters, instanced walnut slat dividers, bronze strips,
 * and warm architectural LED cove lighting.
 */
export function GalleryRoom({ textures, isMobile }: GalleryRoomProps) {
  const segments = isMobile ? 64 : 96;
  const slatMeshRef = useRef<THREE.InstancedMesh>(null);
  const slatGlowMeshRef = useRef<THREE.InstancedMesh>(null);
  const slatGlowTexture = useMemo(() => createSlatBacklightTexture(), []);

  // 1. Continuous 360° outer structural wall (20 m outer, 19.52 m inner)
  const outerWallGeom = useMemo(() => {
    const shape = new THREE.Shape();
    shape.absarc(0, 0, GALLERY_DIMS.outerRadius, 0, Math.PI * 2, false);
    const hole = new THREE.Path();
    hole.absarc(0, 0, GALLERY_DIMS.innerRadius, 0, Math.PI * 2, true);
    shape.holes.push(hole);

    const geom = new THREE.ExtrudeGeometry(shape, {
      depth: GALLERY_DIMS.wallHeight,
      bevelEnabled: false,
      curveSegments: segments,
    });
    geom.rotateX(-Math.PI / 2);
    geom.computeVertexNormals();
    return geom;
  }, [segments]);

  // 2. Dark bronze baseboard & top crown ring (360°)
  const baseboardGeom = useMemo(() => {
    const shape = new THREE.Shape();
    shape.absarc(0, 0, GALLERY_DIMS.innerRadius + 0.01, 0, Math.PI * 2, false);
    const hole = new THREE.Path();
    hole.absarc(0, 0, GALLERY_DIMS.innerRadius - 0.14, 0, Math.PI * 2, true);
    shape.holes.push(hole);

    const geom = new THREE.ExtrudeGeometry(shape, {
      depth: 0.14,
      bevelEnabled: false,
      curveSegments: segments,
    });
    geom.rotateX(-Math.PI / 2);
    return geom;
  }, [segments]);

  const crownRingGeom = useMemo(() => {
    const shape = new THREE.Shape();
    shape.absarc(0, 0, GALLERY_DIMS.innerRadius + 0.01, 0, Math.PI * 2, false);
    const hole = new THREE.Path();
    hole.absarc(0, 0, GALLERY_DIMS.innerRadius - 0.16, 0, Math.PI * 2, true);
    shape.holes.push(hole);

    const geom = new THREE.ExtrudeGeometry(shape, {
      depth: 0.16,
      bevelEnabled: false,
      curveSegments: segments,
    });
    geom.rotateX(-Math.PI / 2);
    return geom;
  }, [segments]);

  // 3. Recessed exhibition bay headers/footers & raised architectural pilasters
  // 5 divider piers around the 360° circle (creating 5 exhibition zones)
  const pierAngles = useMemo(() => {
    // Place piers between the 5 exhibition zones; center zone spans roughly -38° to +38° around -Z (angle = PI/2 in XY -> -Z after rotateX)
    // Note: After rotateX(-PI/2), angle theta in XY maps to (R*cos(theta), 0, -R*sin(theta)).
    // So -Z (front center) is theta = +PI/2.
    return [
      Math.PI * 0.5 - 0.68, // Right of Main Achievement
      Math.PI * 0.5 + 0.68, // Left of Main Achievement (near Title Plaque)
      Math.PI * 0.5 + 1.52, // Between Title/Awards and Events
      Math.PI * 0.5 + 2.76, // Between Events and Sports/Community
      Math.PI * 0.5 - 1.92, // Between Media/Press and Community
    ];
  }, []);

  const pierGeometries = useMemo(() => {
    const halfSpan = 0.085;
    return pierAngles.map((a) =>
      createArcWallGeometry(
        GALLERY_DIMS.innerRadius - 0.22,
        GALLERY_DIMS.innerRadius + 0.01,
        GALLERY_DIMS.wallHeight,
        a - halfSpan,
        a + halfSpan,
        12
      )
    );
  }, [pierAngles]);

  // Recessed exhibition bay upper soffit & lower ledge (creates the framed recessed bay look)
  const baySoffitGeom = useMemo(() => {
    const shape = new THREE.Shape();
    shape.absarc(0, 0, GALLERY_DIMS.innerRadius + 0.01, 0, Math.PI * 2, false);
    const hole = new THREE.Path();
    hole.absarc(0, 0, GALLERY_DIMS.innerRadius - 0.18, 0, Math.PI * 2, true);
    shape.holes.push(hole);
    const geom = new THREE.ExtrudeGeometry(shape, {
      depth: 0.42,
      bevelEnabled: false,
      curveSegments: segments,
    });
    geom.rotateX(-Math.PI / 2);
    return geom;
  }, [segments]);

  const bayLedgeGeom = useMemo(() => {
    const shape = new THREE.Shape();
    shape.absarc(0, 0, GALLERY_DIMS.innerRadius + 0.01, 0, Math.PI * 2, false);
    const hole = new THREE.Path();
    hole.absarc(0, 0, GALLERY_DIMS.innerRadius - 0.18, 0, Math.PI * 2, true);
    shape.holes.push(hole);
    const geom = new THREE.ExtrudeGeometry(shape, {
      depth: 0.26,
      bevelEnabled: false,
      curveSegments: segments,
    });
    geom.rotateX(-Math.PI / 2);
    return geom;
  }, [segments]);

  // 4. Instanced vertical walnut wood slats flanking both sides of every pier (all 5 walls symmetrical)
  const slatCountPerCluster = isMobile ? 7 : 10;
  const slatClusters = useMemo(
    () => pierAngles.flatMap((a) => [a - 0.1, a + 0.1]),
    [pierAngles]
  );
  const totalSlats = slatClusters.length * slatCountPerCluster;

  useEffect(() => {
    const mesh = slatMeshRef.current;
    const glowMesh = slatGlowMeshRef.current;
    if (!mesh || !glowMesh) return;
    const dummy = new THREE.Object3D();
    const r = GALLERY_DIMS.innerRadius - 0.13;
    let idx = 0;

    slatClusters.forEach((baseAngle, clusterIdx) => {
      for (let i = 0; i < slatCountPerCluster; i++) {
        const offset = (i - (slatCountPerCluster - 1) / 2) * 0.013;
        const theta = baseAngle + offset;
        const x = Math.cos(theta) * r;
        const z = -Math.sin(theta) * r;
        dummy.position.set(x, GALLERY_DIMS.wallHeight / 2, z);
        // Face inward toward room center
        dummy.lookAt(0, GALLERY_DIMS.wallHeight / 2, 0);
        dummy.updateMatrix();
        mesh.setMatrixAt(idx++, dummy.matrix);
      }

      // Curved arc backlight hugging the inner wall (R = 9.735 m) without edge clipping
      const phi = Math.PI / 2 - baseAngle;
      dummy.position.set(0, 1.89, 0);
      dummy.rotation.set(0, -phi, 0);
      dummy.updateMatrix();
      glowMesh.setMatrixAt(clusterIdx, dummy.matrix);
    });

    mesh.instanceMatrix.needsUpdate = true;
    glowMesh.instanceMatrix.needsUpdate = true;
  }, [slatClusters, slatCountPerCluster]);

  // Dispose procedural geometries & textures on unmount
  useEffect(() => {
    return () => {
      outerWallGeom.dispose();
      baseboardGeom.dispose();
      crownRingGeom.dispose();
      baySoffitGeom.dispose();
      bayLedgeGeom.dispose();
      pierGeometries.forEach((g) => g.dispose());
      slatGlowTexture.dispose();
    };
  }, [
    outerWallGeom,
    baseboardGeom,
    crownRingGeom,
    baySoffitGeom,
    bayLedgeGeom,
    pierGeometries,
    slatGlowTexture,
  ]);

  return (
    <group>
      {/* Continuous 360° Curved Limestone Exhibition Wall */}
      <mesh geometry={outerWallGeom} receiveShadow>
        <meshStandardMaterial
          color={textures ? "#FFFFFF" : GALLERY_PALETTE.mainWall}
          map={textures?.limestone ?? null}
          roughnessMap={textures?.limestoneRoughness ?? null}
          bumpMap={textures?.limestone ?? null}
          bumpScale={0.022}
          roughness={0.84}
          metalness={0.03}
        />
      </mesh>

      {/* Recessed Bay Upper Soffit & Lower Architectural Ledge (Warm Sandstone) */}
      <mesh geometry={baySoffitGeom} position={[0, GALLERY_DIMS.wallHeight - 0.42, 0]}>
        <meshStandardMaterial
          color="#CEBA9E"
          roughness={0.78}
          metalness={0.05}
        />
      </mesh>
      <mesh geometry={bayLedgeGeom} position={[0, 0.14, 0]}>
        <meshStandardMaterial
          color="#C9B599"
          roughness={0.78}
          metalness={0.05}
        />
      </mesh>

      {/* Champagne-Bronze Architectural Trim Strips along Bay Soffit & Ledge */}
      <mesh position={[0, GALLERY_DIMS.wallHeight - 0.415, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[GALLERY_DIMS.innerRadius - 0.18, 0.012, 8, segments]} />
        <meshStandardMaterial color="#C8A66A" roughness={0.32} metalness={0.74} />
      </mesh>
      <mesh position={[0, 0.398, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[GALLERY_DIMS.innerRadius - 0.18, 0.012, 8, segments]} />
        <meshStandardMaterial color="#C8A66A" roughness={0.32} metalness={0.74} />
      </mesh>

      {/* Dark Bronze Baseboard & Top Crown Ring */}
      <mesh geometry={baseboardGeom} position={[0, 0, 0]}>
        <meshStandardMaterial
          color={GALLERY_PALETTE.darkBronze}
          roughness={0.48}
          metalness={0.45}
        />
      </mesh>
      <mesh geometry={crownRingGeom} position={[0, GALLERY_DIMS.wallHeight - 0.16, 0]}>
        <meshStandardMaterial
          color={GALLERY_PALETTE.darkBronze}
          roughness={0.48}
          metalness={0.45}
        />
      </mesh>

      {/* Warm Recessed LED Cove Strips (Upper & Lower Bay Wash) */}
      <mesh position={[0, GALLERY_DIMS.wallHeight - 0.43, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[GALLERY_DIMS.innerRadius - 0.16, 0.014, 8, segments]} />
        <meshStandardMaterial
          color={GALLERY_PALETTE.warmLed}
          emissive={GALLERY_PALETTE.warmLedEmissive}
          emissiveIntensity={2.2}
          toneMapped={false}
        />
      </mesh>
      <mesh position={[0, 0.405, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[GALLERY_DIMS.innerRadius - 0.16, 0.012, 8, segments]} />
        <meshStandardMaterial
          color={GALLERY_PALETTE.warmLed}
          emissive={GALLERY_PALETTE.warmLedEmissive}
          emissiveIntensity={1.8}
          toneMapped={false}
        />
      </mesh>

      {/* Architectural Zone Divider Piers with Subtle Walnut Center Inlay */}
      {pierGeometries.map((geom, i) => {
        const theta = pierAngles[i];
        const inlayR = GALLERY_DIMS.innerRadius - 0.225;
        const ix = Math.cos(theta) * inlayR;
        const iz = -Math.sin(theta) * inlayR;
        const iRotY = Math.atan2(-ix, -iz);
        return (
          <group key={`pier-${i}`}>
            <mesh geometry={geom} castShadow receiveShadow>
              <meshStandardMaterial
                color="#C6B196"
                roughness={0.76}
                metalness={0.05}
              />
            </mesh>
            {/* Slim dark walnut architectural inlay */}
            <mesh position={[ix, GALLERY_DIMS.wallHeight / 2, iz]} rotation={[0, iRotY, 0]}>
              <boxGeometry args={[0.16, GALLERY_DIMS.wallHeight - 0.56, 0.025]} />
              <meshStandardMaterial
                color="#FFFFFF"
                map={textures?.walnut ?? null}
                roughness={0.52}
                metalness={0.08}
              />
            </mesh>
            {/* Champagne-bronze vertical accent bead */}
            <mesh position={[ix, GALLERY_DIMS.wallHeight / 2, iz]} rotation={[0, iRotY, 0]}>
              <boxGeometry args={[0.018, GALLERY_DIMS.wallHeight - 0.52, 0.032]} />
              <meshStandardMaterial color="#C8A66A" roughness={0.3} metalness={0.76} />
            </mesh>
          </group>
        );
      })}

      {/* Wide Curved Warm Golden Backlighting Behind All Vertical Walnut Slat Panels */}
      <instancedMesh
        ref={slatGlowMeshRef}
        args={[undefined, undefined, slatClusters.length]}
      >
        <cylinderGeometry
          args={[
            GALLERY_DIMS.innerRadius - 0.025,
            GALLERY_DIMS.innerRadius - 0.025,
            3.2,
            16,
            1,
            true,
            Math.PI - 0.145,
            0.29,
          ]}
        />
        <meshBasicMaterial
          map={slatGlowTexture}
          color="#FFD682"
          transparent
          opacity={0.78}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          toneMapped={false}
          side={THREE.DoubleSide}
        />
      </instancedMesh>

      {/* Instanced Vertical Walnut Slats (Single Draw Call) */}
      <instancedMesh
        ref={slatMeshRef}
        args={[undefined, undefined, totalSlats]}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[0.055, GALLERY_DIMS.wallHeight - 0.28, 0.08]} />
        <meshStandardMaterial
          color="#FFFFFF"
          map={textures?.walnut ?? null}
          roughness={0.55}
          metalness={0.08}
        />
      </instancedMesh>
    </group>
  );
}
