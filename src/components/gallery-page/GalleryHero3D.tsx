"use client";

import React, { useRef, useState, useEffect, useMemo, useCallback } from "react";
import Image from "next/image";
import * as THREE from "three";
import { Canvas, useFrame, useThree, type RootState } from "@react-three/fiber";
import { RoundedBox } from "@react-three/drei";
import styles from "./GalleryHero3D.module.css";

import {
  DEFAULT_GALLERY_PHOTOS, WALL_SLOTS, type GalleryPhotoItem, type WallSlotConfig,
} from "./galleryWallFrames";

export { DEFAULT_GALLERY_PHOTOS, WALL_SLOTS } from "./galleryWallFrames";
export type { GalleryPhotoItem, WallSlotConfig } from "./galleryWallFrames";

// ─── PROCEDURAL MODERN WALL TEXTURE ──────────────────────────────────
// Subtle, fine architectural plaster stipple for plain modern house walls

function createModernWallTexture(): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    return new THREE.CanvasTexture(canvas);
  }

  // Base warm modern neutral
  ctx.fillStyle = "#ece7df";
  ctx.fillRect(0, 0, 512, 512);

  // Micro plaster grain / architectural stipple
  for (let i = 0; i < 12000; i++) {
    const x = Math.random() * 512;
    const y = Math.random() * 512;
    const alpha = 0.015 + Math.random() * 0.035;
    const shade = Math.random() > 0.5 ? 255 : 40;
    ctx.fillStyle = `rgba(${shade}, ${shade}, ${shade}, ${alpha})`;
    ctx.fillRect(x, y, 1.5, 1.5);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(4, 3);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

// Warm clay / limewash plaster for the front feature wall only.
function createFeatureWallTexture(): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = 512;
  const ctx = canvas.getContext("2d");
  if (ctx) {
    ctx.fillStyle = "#c99c82";
    ctx.fillRect(0, 0, 512, 512);
    // Low-contrast mottling, wrapped at the edges for a seamless repeat.
    for (let i = 0; i < 125; i++) {
      const x = Math.random() * 512;
      const y = Math.random() * 512;
      const radius = 18 + Math.random() * 75;
      const color = Math.random() > 0.5 ? "255, 235, 213" : "104, 66, 45";
      const alpha = 0.025 + Math.random() * 0.055;
      for (const dx of [-512, 0, 512]) {
        for (const dy of [-512, 0, 512]) {
          const px = x + dx, py = y + dy;
          if (px + radius < 0 || px - radius > 512 || py + radius < 0 || py - radius > 512) continue;
          const cloud = ctx.createRadialGradient(px, py, 0, px, py, radius);
          cloud.addColorStop(0, `rgba(${color}, ${alpha})`);
          cloud.addColorStop(1, `rgba(${color}, 0)`);
          ctx.fillStyle = cloud;
          ctx.fillRect(px - radius, py - radius, radius * 2, radius * 2);
        }
      }
    }
    for (let i = 0; i < 9000; i++) {
      const shade = Math.random() > 0.5 ? 255 : 60;
      ctx.fillStyle = `rgba(${shade}, ${shade}, ${shade}, 0.07)`;
      ctx.fillRect(Math.random() * 512, Math.random() * 512, 1, 1);
    }
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(4, 2);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 4;
  return texture;
}

// Fine woven fabric normal-height pattern for the sofa upholstery.
function createFabricTexture(): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = 256;
  const ctx = canvas.getContext("2d");
  if (ctx) {
    ctx.fillStyle = "#808080";
    ctx.fillRect(0, 0, 256, 256);
    for (let y = 0; y < 256; y += 4) {
      for (let x = 0; x < 256; x += 4) {
        ctx.fillStyle = (x / 4 + y / 4) % 2 ? "#a0a0a0" : "#646464";
        ctx.fillRect(x, y, 3, 2);
      }
    }
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(5, 5);
  texture.anisotropy = 4;
  return texture;
}

// ─── PROCEDURAL NATURAL WOOD GRAIN TEXTURE ────────────────────────────
// Natural oak / warm walnut grain for picture frames and furniture accents

function createNaturalWoodTexture(): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    return new THREE.CanvasTexture(canvas);
  }

  // Base warm walnut / natural oak gradient
  const grad = ctx.createLinearGradient(0, 0, 512, 0);
  grad.addColorStop(0.0, "#5a3a22");
  grad.addColorStop(0.25, "#754c2d");
  grad.addColorStop(0.5, "#633f25");
  grad.addColorStop(0.75, "#7a5030");
  grad.addColorStop(1.0, "#5a3a22");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 512, 512);

  // Fine organic grain fibers
  for (let x = 0; x < 512; x += 2) {
    const darkness = 0.05 + Math.random() * 0.12;
    ctx.fillStyle = `rgba(35, 18, 8, ${darkness})`;
    ctx.fillRect(x, 0, 1 + Math.random() * 1.5, 512);
  }

  // Soft wood rings
  ctx.lineWidth = 1.4;
  for (let y = 0; y < 512; y += 12) {
    const darkness = 0.06 + Math.random() * 0.1;
    ctx.strokeStyle = `rgba(45, 22, 10, ${darkness})`;
    ctx.beginPath();
    ctx.moveTo(0, y);
    for (let x = 0; x <= 512; x += 32) {
      const wave = Math.sin(x * 0.02 + y * 0.04) * 4;
      ctx.lineTo(x, y + wave);
    }
    ctx.stroke();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(2, 2);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

// ─── LARGE-FORMAT GREIGE STONE PORCELAIN TILES ──────────────────────
function createFloorTilesTexture(): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = 1024;
  const ctx = canvas.getContext("2d");
  if (!ctx) return new THREE.CanvasTexture(canvas);

  const tileSize = 256;
  const grout = 8;
  const tones = ["#b6aa9b", "#a89b8c", "#c0b4a4", "#9f9385", "#c6b9aa", "#ab9d8d"];

  ctx.fillStyle = "#766b61";
  ctx.fillRect(0, 0, 1024, 1024);

  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 4; col++) {
      const x = col * tileSize;
      const y = row * tileSize;
      ctx.save();
      ctx.beginPath();
      ctx.rect(x + grout / 2, y + grout / 2, tileSize - grout, tileSize - grout);
      ctx.clip();
      ctx.fillStyle = tones[(row * 4 + col) % tones.length];
      ctx.fillRect(x, y, tileSize, tileSize);

      for (let i = 0; i < 25; i++) {
        const px = x + Math.random() * tileSize;
        const py = y + Math.random() * tileSize;
        const r = 16 + Math.random() * 54;
        const cloud = ctx.createRadialGradient(px, py, 0, px, py, r);
        const tint = Math.random() > 0.45 ? "255, 243, 227" : "97, 80, 63";
        cloud.addColorStop(0, `rgba(${tint}, 0.14)`);
        cloud.addColorStop(1, `rgba(${tint}, 0)`);
        ctx.fillStyle = cloud;
        ctx.fillRect(px - r, py - r, r * 2, r * 2);
      }

      for (let i = 0; i < 8; i++) {
        const offset = 12 + Math.random() * (tileSize - 24);
        ctx.beginPath();
        ctx.moveTo(x - 8, y + offset);
        ctx.bezierCurveTo(x + 48, y + offset - 12, x + 150, y + offset + 18, x + tileSize + 10, y + offset - 4);
        ctx.lineWidth = 0.45 + Math.random() * 1.1;
        ctx.strokeStyle = i % 2 === 0 ? "rgba(74, 61, 50, 0.14)" : "rgba(250, 239, 222, 0.16)";
        ctx.stroke();
      }

      for (let i = 0; i < 900; i++) {
        ctx.fillStyle = i % 2 ? "rgba(255,255,255,0.08)" : "rgba(45,36,28,0.06)";
        ctx.fillRect(x + Math.random() * tileSize, y + Math.random() * tileSize, 1, 1);
      }

      ctx.strokeStyle = "rgba(255,255,255,0.18)";
      ctx.lineWidth = 1;
      ctx.strokeRect(x + 3, y + 3, tileSize - 6, tileSize - 6);
      ctx.restore();
    }
  }

  // Decorative inlay drawings for a premium gallery floor feeling.
  ctx.save();
  ctx.strokeStyle = "rgba(123, 94, 66, 0.46)";
  ctx.lineWidth = 6;
  ctx.strokeRect(170, 170, 684, 684);
  ctx.strokeStyle = "rgba(232, 218, 196, 0.33)";
  ctx.lineWidth = 2.5;
  ctx.strokeRect(205, 205, 614, 614);

  ctx.translate(512, 512);
  ctx.strokeStyle = "rgba(120, 88, 58, 0.42)";
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.arc(0, 0, 148, 0, Math.PI * 2);
  ctx.stroke();

  ctx.strokeStyle = "rgba(235, 223, 205, 0.28)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(0, 0, 118, 0, Math.PI * 2);
  ctx.stroke();

  for (let i = 0; i < 8; i++) {
    const angle = (Math.PI * 2 * i) / 8;
    const x = Math.cos(angle);
    const y = Math.sin(angle);
    ctx.beginPath();
    ctx.moveTo(x * 28, y * 28);
    ctx.lineTo(x * 136, y * 136);
    ctx.strokeStyle = i % 2 === 0 ? "rgba(116, 86, 59, 0.36)" : "rgba(226, 209, 188, 0.26)";
    ctx.lineWidth = i % 2 === 0 ? 4 : 2;
    ctx.stroke();
  }

  ctx.rotate(Math.PI / 4);
  ctx.strokeStyle = "rgba(117, 89, 61, 0.32)";
  ctx.lineWidth = 3;
  ctx.strokeRect(-95, -95, 190, 190);
  ctx.restore();

  // Stronger grout lines for better visibility.
  ctx.fillStyle = "rgba(88, 78, 69, 0.9)";
  for (let i = 0; i <= 4; i++) {
    const pos = i * tileSize;
    ctx.fillRect(pos - grout / 2, 0, grout, 1024);
    ctx.fillRect(0, pos - grout / 2, 1024, grout);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  // Larger visible floor tiles than before.
  texture.repeat.set(4.5, 4.5);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 8;
  return texture;
}

// ─── PHOTO CANVAS TEXTURE ─────────────────────────────────────────────

function PhotoTexturePlane({
  url,
  width,
  height,
}: {
  url: string;
  width: number;
  height: number;
}) {
  const [texture, setTexture] = useState<THREE.Texture | null>(null);

  useEffect(() => {
    let active = true;
    let owned: THREE.Texture | null = null;
    const loader = new THREE.TextureLoader();
    loader.crossOrigin = "anonymous";

    loader.load(url, (source) => {
      if (!active) { source.dispose(); return; }
      let next: THREE.Texture = source;
      const img = source.image as HTMLImageElement;
      const maxSize = 1280;
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
      next.colorSpace = THREE.SRGBColorSpace;
      next.generateMipmaps = true;
      next.minFilter = THREE.LinearMipmapLinearFilter;
      next.anisotropy = 4;
      owned = next;
      setTexture(next);
    }, undefined, (err) => {
      if (active) console.warn(`[GalleryHero3D] Texture load failed for ${url}:`, err);
    });

    return () => {
      active = false;
      owned?.dispose();
    };
  }, [url]);

  return (
    <mesh position={[0, 0, 0.025]}>
      <planeGeometry args={[width, height]} />
      {texture ? (
        <meshBasicMaterial map={texture} toneMapped={false} />
      ) : (
        <meshStandardMaterial color="#2c1e15" roughness={0.8} />
      )}
    </mesh>
  );
}

// ─── REALISTIC WOODEN PICTURE FRAME AROUND IMAGES ─────────────────────
// 4 beveled natural wood frame bars + inner cream mat board + flush photo

function WoodenPictureFrame({
  slot,
  item,
  onSelect,
  woodTexture,
}: {
  slot: WallSlotConfig;
  item: GalleryPhotoItem;
  onSelect: (item: GalleryPhotoItem) => void;
  woodTexture: THREE.CanvasTexture | null;
}) {
  const [hovered, setHovered] = useState(false);
  const canvasElement = useThree((state) => state.gl.domElement);
  useEffect(() => {
    if (!hovered) return;
    canvasElement.style.cursor = "pointer";
    return () => { canvasElement.style.cursor = ""; };
  }, [hovered, canvasElement]);
  const [w, h] = slot.size;

  const frameThickness = 0.065;
  const frameDepth = 0.055;
  const imageW = w - 0.16;
  const imageH = h - 0.16;
  const matW = w - 0.03;
  const matH = h - 0.03;

  const frameWoodColor = hovered ? "#82502c" : "#5d3b20";

  return (
    <group
      position={slot.position}
      rotation={slot.rotation}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(item);
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
      }}
      onPointerOut={() => {
        setHovered(false);
      }}
    >
      {/* ── Soft Drop Shadow onto Wooden Wall ── */}
      <mesh position={[0, -0.025, -0.015]}>
        <planeGeometry args={[w + 0.16, h + 0.16]} />
        <meshBasicMaterial
          color="#000000"
          transparent
          opacity={hovered ? 0.55 : 0.38}
        />
      </mesh>

      {/* ── 4 Solid Wooden Frame Bars (Surrounding the image) ── */}
      {/* Top Bar */}
      <mesh position={[0, h / 2, frameDepth / 2]}>
        <boxGeometry args={[w + frameThickness, frameThickness, frameDepth]} />
        <meshStandardMaterial
          color={frameWoodColor}
          map={woodTexture || undefined}
          roughness={0.42}
          metalness={0.08}
        />
      </mesh>
      {/* Bottom Bar */}
      <mesh position={[0, -h / 2, frameDepth / 2]}>
        <boxGeometry args={[w + frameThickness, frameThickness, frameDepth]} />
        <meshStandardMaterial
          color={frameWoodColor}
          map={woodTexture || undefined}
          roughness={0.42}
          metalness={0.08}
        />
      </mesh>
      {/* Left Bar */}
      <mesh position={[-w / 2, 0, frameDepth / 2]}>
        <boxGeometry args={[frameThickness, h + frameThickness, frameDepth]} />
        <meshStandardMaterial
          color={frameWoodColor}
          map={woodTexture || undefined}
          roughness={0.42}
          metalness={0.08}
        />
      </mesh>
      {/* Right Bar */}
      <mesh position={[w / 2, 0, frameDepth / 2]}>
        <boxGeometry args={[frameThickness, h + frameThickness, frameDepth]} />
        <meshStandardMaterial
          color={frameWoodColor}
          map={woodTexture || undefined}
          roughness={0.42}
          metalness={0.08}
        />
      </mesh>

      {/* ── Inner Museum Mat Board (Warm off-white) ── */}
      <mesh position={[0, 0, 0.01]}>
        <planeGeometry args={[matW, matH]} />
        <meshStandardMaterial color="#f2eee8" roughness={0.88} />
      </mesh>

      {/* ── Image Canvas ── */}
      <group position={[0, 0, 0.01]}>
        <PhotoTexturePlane key={item.url} url={item.url} width={imageW} height={imageH} />
      </group>
    </group>
  );
}

// ─── COMPLETE 3D ARCHITECTURAL ROOM (Plain Modern Walls, Realistic Ceiling & Tile Floor) ─

function ModernArchitecturalRoom({
  wallTexture,
  featureWallTexture,
  floorTilesTexture,
}: {
  wallTexture: THREE.CanvasTexture | null;
  featureWallTexture: THREE.CanvasTexture | null;
  floorTilesTexture: THREE.CanvasTexture | null;
}) {
  // Grid of modern recessed ceiling downlights
  const downlightPositions: [number, number][] = [
    // Left side row (washing towards left wall)
    [-4.8, -2.6],
    [-4.8, -0.85],
    [-4.8, 1.05],
    [-4.8, 2.9],
    // Right side row (washing towards right wall)
    [4.8, -2.6],
    [4.8, -0.85],
    [4.8, 1.05],
    [4.8, 2.9],
    // Center row
    [0, -2.5],
    [0, 0.0],
    [0, 2.5],
  ];

  return (
    <group>
      {/* ════════════════════════════════════════════════════════════════
          1. THREE PLAIN MODERN WALLS (Slightly Orangish Front Wall & Modern Neutral Sides)
         ════════════════════════════════════════════════════════════════ */}
      {/* ── Front / Center Wall (Back, wide plain wall in warm slightly orangish tone) ── */}
      <mesh position={[0, 1.55, -4.12]}>
        <boxGeometry args={[15.2, 7.2, 0.2]} />
        <meshStandardMaterial
          color={featureWallTexture ? "#ffffff" : "#c99c82"}
          map={featureWallTexture || undefined}
          bumpMap={featureWallTexture || undefined}
          bumpScale={0.035}
          roughness={0.94}
          metalness={0}
        />
      </mesh>

      {/* ── Left Wall (Plain Modern Wall) ── */}
      <mesh position={[-7.5, 1.55, 1.0]}>
        <boxGeometry args={[0.2, 7.2, 10.4]} />
        <meshStandardMaterial
          color="#eae5dc"
          map={wallTexture || undefined}
          roughness={0.88}
          metalness={0.02}
        />
      </mesh>

      {/* ── Right Wall (Plain Modern Wall) ── */}
      <mesh position={[7.5, 1.55, 1.0]}>
        <boxGeometry args={[0.2, 7.2, 10.4]} />
        <meshStandardMaterial
          color="#eae5dc"
          map={wallTexture || undefined}
          roughness={0.88}
          metalness={0.02}
        />
      </mesh>

      {/* ════════════════════════════════════════════════════════════════
          2. MINIMALIST MODERN SKIRTING / BASEBOARDS (Non-overlapping, No Z-fighting)
         ════════════════════════════════════════════════════════════════ */}
      {/* Center Wall Skirting */}
      <mesh position={[0, -1.785, -4.01]}>
        <boxGeometry args={[14.72, 0.14, 0.04]} />
        <meshStandardMaterial color="#2d2925" roughness={0.65} metalness={0.1} />
      </mesh>
      {/* Left Wall Skirting */}
      <mesh position={[-7.41, -1.785, 1.05]}>
        <boxGeometry args={[0.04, 0.14, 10.08]} />
        <meshStandardMaterial color="#2d2925" roughness={0.65} metalness={0.1} />
      </mesh>
      {/* Right Wall Skirting */}
      <mesh position={[7.41, -1.785, 1.05]}>
        <boxGeometry args={[0.04, 0.14, 10.08]} />
        <meshStandardMaterial color="#2d2925" roughness={0.65} metalness={0.1} />
      </mesh>
      {/* Mitered Corner Blocks (Clean geometric transition eliminating bottom corner flickering) */}
      <mesh position={[-7.41, -1.785, -4.01]}>
        <boxGeometry args={[0.04, 0.14, 0.04]} />
        <meshStandardMaterial color="#2d2925" roughness={0.65} metalness={0.1} />
      </mesh>
      <mesh position={[7.41, -1.785, -4.01]}>
        <boxGeometry args={[0.04, 0.14, 0.04]} />
        <meshStandardMaterial color="#2d2925" roughness={0.65} metalness={0.1} />
      </mesh>

      {/* ════════════════════════════════════════════════════════════════
          3. REALISTIC PLAIN MODERN CEILING WITH RECESSED DOWNLIGHTS
         ════════════════════════════════════════════════════════════════ */}
      {/* Flat Seamless Drywall Ceiling Surface */}
      <mesh position={[0, 5.15, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[22, 22]} />
        <meshStandardMaterial color="#faf8f4" roughness={0.92} />
      </mesh>

      {/* Perimeter Architectural Shadow Reveal Gap (3cm dark negative detail) */}
      <mesh position={[0, 5.08, -3.98]}>
        <boxGeometry args={[15.0, 0.03, 0.04]} />
        <meshBasicMaterial color="#1a1a1a" />
      </mesh>
      <mesh position={[-7.38, 5.08, 1.0]}>
        <boxGeometry args={[0.04, 0.03, 10.2]} />
        <meshBasicMaterial color="#1a1a1a" />
      </mesh>
      <mesh position={[7.38, 5.08, 1.0]}>
        <boxGeometry args={[0.04, 0.03, 10.2]} />
        <meshBasicMaterial color="#1a1a1a" />
      </mesh>

      {/* Modern Flush Architectural Recessed Pot Lights (Downlights) */}
      {downlightPositions.map(([posX, posZ], idx) => (
        <group key={`downlight-${idx}`} position={[posX, 5.14, posZ]}>
          {/* Outer Trim Ring */}
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.08, 0.08, 0.015, 24]} />
            <meshStandardMaterial color="#ffffff" roughness={0.4} />
          </mesh>
          {/* Inner Recessed Dark Baffle */}
          <mesh position={[0, -0.01, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.06, 0.06, 0.015, 24]} />
            <meshStandardMaterial color="#222222" roughness={0.7} />
          </mesh>
          {/* Warm Glowing LED Downlight Lens */}
          <mesh position={[0, -0.018, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <circleGeometry args={[0.045, 24]} />
            <meshStandardMaterial
              color="#fff3dc"
              emissive="#ffe2a8"
              emissiveIntensity={1.5}
            />
          </mesh>
        </group>
      ))}

      {/* ════════════════════════════════════════════════════════════════
          4. MODERN LARGE-FORMAT TILED FLOOR (SATIN FINISH)
         ════════════════════════════════════════════════════════════════ */}
      <mesh receiveShadow position={[0, -1.86, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[22, 22]} />
        <meshStandardMaterial
          color={floorTilesTexture ? "#ffffff" : "#a99d8f"}
          map={floorTilesTexture || undefined}
          roughness={0.68}
          metalness={0.02}
        />
      </mesh>
    </group>
  );
}

// ─── SHORT BROWN TABLE LAMP ON A WALNUT BOX ─────────────────────────
const LAMP_TABLE_HEIGHT = 0.50;

function WoodenLampTable({ position, woodTexture }: {
  position: [number, number, number];
  woodTexture: THREE.CanvasTexture | null;
}) {
  return (
    <group position={position}>
      <RoundedBox args={[0.62, 0.07, 0.62]} radius={0.025} smoothness={4}
        position={[0, 0.035, 0]} castShadow receiveShadow>
        <meshStandardMaterial color="#36241a" roughness={0.8} />
      </RoundedBox>
      <RoundedBox args={[0.72, 0.40, 0.72]} radius={0.025} smoothness={4}
        position={[0, 0.27, 0]} castShadow receiveShadow>
        <meshStandardMaterial color={woodTexture ? "#d9c1a8" : "#755035"}
          map={woodTexture || undefined} roughness={0.62} />
      </RoundedBox>
      <RoundedBox args={[0.76, 0.03, 0.76]} radius={0.012} smoothness={4}
        position={[0, 0.485, 0]} castShadow receiveShadow>
        <meshStandardMaterial color={woodTexture ? "#e2cdb6" : "#825d40"}
          map={woodTexture || undefined} roughness={0.52} />
      </RoundedBox>
      <ModernTableLamp position={[0, LAMP_TABLE_HEIGHT, 0]} />
    </group>
  );
}

function ModernTableLamp({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {/* Compact dark-brown base and tapered stem. */}
      <mesh position={[0, 0.025, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.145, 0.16, 0.05, 32]} />
        <meshStandardMaterial color="#513423" roughness={0.45} metalness={0.16} />
      </mesh>
      <mesh position={[0, 0.205, 0]} castShadow>
        <cylinderGeometry args={[0.025, 0.055, 0.31, 32]} />
        <meshStandardMaterial color="#69452e" roughness={0.5} metalness={0.12} />
      </mesh>
      <mesh position={[0, 0.365, 0]}>
        <cylinderGeometry args={[0.045, 0.035, 0.045, 24]} />
        <meshStandardMaterial color="#79523a" roughness={0.4} metalness={0.22} />
      </mesh>
      {/* Open cocoa-brown shade: warm interior light, brown exterior. */}
      <mesh position={[0, 0.49, 0]} castShadow>
        <cylinderGeometry args={[0.16, 0.225, 0.29, 48, 1, true]} />
        <meshStandardMaterial color="#80583c" roughness={0.9}
          emissive="#713b17" emissiveIntensity={0.12} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[0, 0.635, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.16, 0.009, 8, 48]} />
        <meshStandardMaterial color="#523723" roughness={0.65} />
      </mesh>
      <mesh position={[0, 0.345, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.225, 0.009, 8, 48]} />
        <meshStandardMaterial color="#523723" roughness={0.65} />
      </mesh>
      <mesh position={[0, 0.48, 0]}>
        <sphereGeometry args={[0.045, 16, 16]} />
        <meshStandardMaterial color="#ffdfaa" emissive="#ffb65c" emissiveIntensity={2} />
      </mesh>
      <pointLight position={[0, 0.32, 0]} color="#ffd4a0" intensity={5.5}
        distance={2.7} decay={2} />
    </group>
  );
}

// ─── MODULAR UPHOLSTERED SOFA (LOCAL FRONT = +Z) ────────────────────
function FloorInlayArtwork() {
  const lineMaterial = (
    color: string,
    roughness = 0.58,
    metalness = 0.04,
    emissive?: string,
    emissiveIntensity?: number
  ) => ({ color, roughness, metalness, emissive, emissiveIntensity });

  return (
    <group position={[0, -1.848, 0]}>
      {/* Long rectangular inlay framing the main viewing zone. */}
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[4.12, 4.25, 4, 1, Math.PI / 4]} />
        <meshStandardMaterial {...lineMaterial("#8e6a49", 0.6)} side={THREE.DoubleSide} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.02, 1.10, 48]} />
        <meshStandardMaterial {...lineMaterial("#dac4a8", 0.54)} side={THREE.DoubleSide} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.38, 1.46, 48]} />
        <meshStandardMaterial {...lineMaterial("#8b6746", 0.58)} side={THREE.DoubleSide} />
      </mesh>
      {Array.from({ length: 8 }, (_, i) => {
        const angle = (Math.PI * 2 * i) / 8;
        const length = 1.22;
        return (
          <mesh key={`floor-ray-${i}`} position={[Math.cos(angle) * 0.63, 0, Math.sin(angle) * 0.63]} rotation={[-Math.PI / 2, angle, 0]}>
            <planeGeometry args={[0.06, length]} />
            <meshStandardMaterial
              color={i % 2 === 0 ? "#8b6746" : "#dcc8af"}
              roughness={0.55}
              metalness={0.04}
              side={THREE.DoubleSide}
            />
          </mesh>
        );
      })}
    </group>
  );
}

function ModernSofa({ position, rotation, seats = 2, width = 2.65, fabricTexture }: {
  position: [number, number, number];
  rotation: [number, number, number];
  seats?: number;
  width?: number;
  fabricTexture: THREE.CanvasTexture | null;
}) {
  const armWidth = 0.24;
  const seatArea = width - armWidth * 2 - 0.05;
  const seatWidth = seatArea / seats;
  const cushionCenters = Array.from({ length: seats }, (_, i) => -seatArea / 2 + seatWidth * (i + 0.5));
  const fabric = { roughness: 0.92, bumpMap: fabricTexture || undefined, bumpScale: 0.012 };
  const frameColor = "#665e56";
  const cushionColor = "#80766c";
  const legXs = width > 3.5 ? [-width / 2 + 0.19, 0, width / 2 - 0.19] : [-width / 2 + 0.19, width / 2 - 0.19];
  return (
    <group position={position} rotation={rotation}>
      {/* Recessed plinth and grounded tapered walnut feet. */}
      <RoundedBox args={[width - 0.18, 0.10, 0.84]} radius={0.045} smoothness={4}
        position={[0, 0.14, 0]} castShadow receiveShadow>
        <meshStandardMaterial color="#38291e" roughness={0.65} />
      </RoundedBox>
      {legXs.flatMap((x) => [-0.34, 0.34].map((z) => (
        <mesh key={`${x}-${z}`} position={[x, 0.06, z]} castShadow>
          <cylinderGeometry args={[0.039, 0.028, 0.12, 20]} />
          <meshStandardMaterial color="#4a3425" roughness={0.55} />
        </mesh>
      )))}
      {/* Fully rounded upholstered outer body. */}
      <RoundedBox args={[width, 0.25, 1.02]} radius={0.11} smoothness={4}
        position={[0, 0.295, 0]} castShadow receiveShadow>
        <meshStandardMaterial color={frameColor} {...fabric} />
      </RoundedBox>
      <RoundedBox args={[width - 0.08, 0.64, 0.24]} radius={0.11} smoothness={4}
        position={[0, 0.64, -0.39]} castShadow receiveShadow>
        <meshStandardMaterial color={frameColor} {...fabric} />
      </RoundedBox>
      {cushionCenters.map((x, i) => (
        <group key={`cushion-${i}`}>
          <RoundedBox args={[seatWidth - 0.025, 0.20, 0.72]} radius={0.09} smoothness={4}
            position={[x, 0.46, 0.095]} castShadow receiveShadow>
            <meshStandardMaterial color={cushionColor} {...fabric} />
          </RoundedBox>
          <RoundedBox args={[seatWidth - 0.035, 0.46, 0.25]} radius={0.11} smoothness={4}
            position={[x, 0.73, -0.265]} rotation={[-0.13, 0, 0]} castShadow receiveShadow>
            <meshStandardMaterial color={cushionColor} {...fabric} />
          </RoundedBox>
        </group>
      ))}
      {/* Sculpted armrests with soft corners, not sharp rectangular blocks. */}
      {[-1, 1].map((side) => (
        <RoundedBox key={side} args={[armWidth, 0.40, 0.98]} radius={0.115} smoothness={4}
          position={[side * (width / 2 - armWidth / 2), 0.50, 0]} castShadow receiveShadow>
          <meshStandardMaterial color={frameColor} {...fabric} />
        </RoundedBox>
      ))}
      {[-1, 1].map((side) => (
        <RoundedBox key={`pillow-${side}`} args={[0.36, 0.35, 0.15]} radius={0.07} smoothness={4}
          position={[side * (seatArea / 2 - 0.23), 0.71, -0.065]}
          rotation={[-0.19, side * 0.14, side * -0.23]} castShadow receiveShadow>
          <meshStandardMaterial color={side < 0 ? "#ae7654" : "#c9baaa"} {...fabric} />
        </RoundedBox>
      ))}
    </group>
  );
}

// ─── CAMERA RIG (Organic Damped Panning) ───────────────────────────────

type AngleRef = { readonly current: number };
type FollowPointerRef = { current: boolean };

function CameraRig({ targetAngle, followPointer, isMobile }: {
  targetAngle: AngleRef;
  followPointer: FollowPointerRef;
  isMobile: boolean;
}) {
  const currentAngle = useRef(targetAngle.current);
  const reducedMotion = useRef(false);
  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => { reducedMotion.current = query.matches; };
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  useFrame((state, delta) => {
    const target = targetAngle.current;
    // Limit the first delta after an idle period to prevent a camera jump.
    const dt = Math.min(delta, 1 / 30);
    const direct = followPointer.current || reducedMotion.current;
    followPointer.current = false;
    const next = direct ? target : THREE.MathUtils.damp(
      currentAngle.current, target, 9, dt
    );
    const moving = Math.abs(next - target) > 0.00015;
    const angle = moving ? next : target;
    currentAngle.current = angle;
    const sin = Math.sin(angle);
    const cos = Math.cos(angle);
    state.camera.position.set(
      -sin * (isMobile ? 2.2 : 3.0),
      1.45,
      (isMobile ? 7.2 : 6.1) + (cos - 1) * 1.9
    );
    state.camera.lookAt(sin * 6.8, 1.17, -4 + (1 - cos) * 4.4);
    if (moving) state.invalidate();
  }, -1);
  return null;
}

// ─── SCENE SETUP WITH FULL ARCHITECTURAL ILLUMINATION ─────────────────

const Scene = React.memo(function Scene({
  items,
  onSelectPhoto,
  targetAngle,
  followPointer,
  isMobile,
  wallTexture,
  woodTexture,
  floorTilesTexture,
  featureWallTexture,
  fabricTexture,
}: {
  items: GalleryPhotoItem[];
  onSelectPhoto: (item: GalleryPhotoItem) => void;
  targetAngle: AngleRef;
  followPointer: FollowPointerRef;
  isMobile: boolean;
  wallTexture: THREE.CanvasTexture | null;
  woodTexture: THREE.CanvasTexture | null;
  floorTilesTexture: THREE.CanvasTexture | null;
  featureWallTexture: THREE.CanvasTexture | null;
  fabricTexture: THREE.CanvasTexture | null;
}) {
  const slotItems = useMemo(() => {
    return WALL_SLOTS.map((slot, index) => {
      const match =
        items[index] ||
        DEFAULT_GALLERY_PHOTOS[index] || {
          id: slot.id,
          url: `/gallery/event/image-${(index % 10) + 1}.webp`,
          title: `Vastu Vihar Gallery Card ${index + 1}`,
          category: "Gallery",
        };
      return { slot, item: match };
    });
  }, [items]);

  return (
    <>
      {/* ── Bright Warm Ambient Illumination (Airy modern residence lighting) ── */}
      <ambientLight color="#fdf8f0" intensity={2.2} />

      {/* ── Directional Warm Ceiling Wash ── */}
      <directionalLight
        position={[0, 8, 4]}
        target-position={[0, 1.5, -2]}
        color="#fff7ee"
        intensity={2.2}
        castShadow
        shadow-mapSize-width={isMobile ? 512 : 1024}
        shadow-mapSize-height={isMobile ? 512 : 1024}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={9}
        shadow-camera-bottom={-9}
        shadow-camera-near={0.5}
        shadow-camera-far={25}
        shadow-normalBias={0.025}
        shadow-bias={-0.0001}
      />

      {/* ── Center Wall Soft Spotlights ── */}
      <spotLight
        position={[0, 4.8, 1.8]}
        target-position={[0, 1.87, -3.92]}
        color="#fff5e4"
        intensity={60}
        angle={0.88}
        penumbra={0.6}
        decay={1.0}
      />
      <spotLight
        position={[-3.0, 4.6, 1.5]}
        target-position={[-2.95, 2.0, -3.92]}
        color="#fff5e4"
        intensity={48}
        angle={0.75}
        penumbra={0.6}
        decay={1.0}
      />
      <spotLight
        position={[3.0, 4.6, 1.5]}
        target-position={[2.95, 2.0, -3.92]}
        color="#fff5e4"
        intensity={48}
        angle={0.75}
        penumbra={0.6}
        decay={1.0}
      />

      {/* ── Center Wall Soft Fill Point Lights ── */}
      <pointLight
        position={[-3.0, 2.4, -3.2]}
        color="#ffe2b8"
        intensity={14}
        distance={6.0}
        decay={1.5}
      />
      <pointLight
        position={[0, 2.7, -3.2]}
        color="#ffe2b8"
        intensity={16}
        distance={6.0}
        decay={1.5}
      />
      <pointLight
        position={[3.0, 2.4, -3.2]}
        color="#ffe2b8"
        intensity={14}
        distance={6.0}
        decay={1.5}
      />

      {/* ── Left Wall Warm Spotlights for 4 Framed Artworks ── */}
      <spotLight
        position={[-3.6, 4.6, -1.8]}
        target-position={[-7.4, 1.55, -1.8]}
        color="#fff6e8"
        intensity={55}
        angle={0.78}
        penumbra={0.6}
        decay={1.0}
      />
      <spotLight
        position={[-3.6, 4.6, 1.8]}
        target-position={[-7.4, 1.55, 1.8]}
        color="#fff6e8"
        intensity={55}
        angle={0.78}
        penumbra={0.6}
        decay={1.0}
      />

      {/* ── Right Wall Warm Spotlights for 4 Framed Artworks ── */}
      <spotLight
        position={[3.6, 4.6, -1.8]}
        target-position={[7.4, 1.55, -1.8]}
        color="#fff6e8"
        intensity={55}
        angle={0.78}
        penumbra={0.6}
        decay={1.0}
      />
      <spotLight
        position={[3.6, 4.6, 1.8]}
        target-position={[7.4, 1.55, 1.8]}
        color="#fff6e8"
        intensity={55}
        angle={0.78}
        penumbra={0.6}
        decay={1.0}
      />

      {/* ── Complete Architectural Room (Plain Modern House Walls, Ceiling & Floor Tiles) ── */}
      <ModernArchitecturalRoom
        wallTexture={wallTexture}
        featureWallTexture={featureWallTexture}
        floorTilesTexture={floorTilesTexture}
      />
      <FloorInlayArtwork />

      {/* Four walnut box side tables: lamp bottoms rest exactly on the tabletops. */}
      <WoodenLampTable position={[-6.55, -1.86, -1.90]} woodTexture={woodTexture} />
      <WoodenLampTable position={[-6.55, -1.86, 2.25]} woodTexture={woodTexture} />
      <WoodenLampTable position={[6.55, -1.86, -1.90]} woodTexture={woodTexture} />
      <WoodenLampTable position={[6.55, -1.86, 2.25]} woodTexture={woodTexture} />

      {/* Left sofa faces the right gallery wall; right sofa faces the left. */}
      <ModernSofa position={[-6.65, -1.86, 0.15]} rotation={[0, Math.PI / 2, 0]}
        fabricTexture={fabricTexture} />
      <ModernSofa position={[6.65, -1.86, 0.15]} rotation={[0, -Math.PI / 2, 0]}
        fabricTexture={fabricTexture} />
      {/* Four individual cushions, against the front wall beneath the frames. */}
      <ModernSofa position={[0, -1.86, -3.34]} rotation={[0, 0, 0]}
        seats={4} width={4.50} fabricTexture={fabricTexture} />

      {/* ── Wooden Framed Photos (4 on Left, 5 on Center, 4 on Right) ── */}
      {slotItems.map(({ slot, item }) => (
        <WoodenPictureFrame
          key={slot.id}
          slot={slot}
          item={item}
          onSelect={onSelectPhoto}
          woodTexture={woodTexture}
        />
      ))}

      {/* ── Dynamic Camera Rig ── */}
      <CameraRig targetAngle={targetAngle} followPointer={followPointer} isMobile={isMobile} />
    </>
  );
});

// ─── SKELETON LOADER (Matches Hero Size & Exact Radii) ─────────────────

export function GalleryHeroSkeleton() {
  return (
    <div className={styles.heroWrapper}>
      <div className={styles.skeletonContainer}>
        <div className={styles.skeletonSpinner} />
      </div>
    </div>
  );
}

// ─── MAIN HERO EXPORT ─────────────────────────────────────────────────

interface GalleryHero3DProps {
  items?: GalleryPhotoItem[];
  isMobile?: boolean;
}

export default function GalleryHero3D({ items, isMobile = false }: GalleryHero3DProps) {
  const targetAngle = useRef(0);
  const followPointer = useRef(false);
  const invalidateRef = useRef<(() => void) | null>(null);
  const pointer = useRef<{
    id: number;
    x: number;
    y: number;
    dragging: boolean;
    fast: boolean;
    radiansPerPixel: number;
  } | null>(null);
  const suppressClick = useRef(false);
  const onCreated = useCallback((state: RootState) => {
    invalidateRef.current = state.invalidate;
    setCanvasReady(true);
  }, []);
  const [selectedPhoto, setSelectedPhoto] = useState<GalleryPhotoItem | null>(
    null
  );
  const [canvasReady, setCanvasReady] = useState(false);
  const [showTutorial, setShowTutorial] = useState(true);
  const [wallTexture, setWallTexture] = useState<THREE.CanvasTexture | null>(
    null
  );
  const [woodTexture, setWoodTexture] = useState<THREE.CanvasTexture | null>(
    null
  );
  const [floorTilesTexture, setFloorTilesTexture] =
    useState<THREE.CanvasTexture | null>(null);

  const [featureWallTexture, setFeatureWallTexture] = useState<THREE.CanvasTexture | null>(null);
  const [fabricTexture, setFabricTexture] = useState<THREE.CanvasTexture | null>(null);


  // Initialize realistic procedural textures on mount
  useEffect(() => {
    const wallTex = createModernWallTexture();
    const woodTex = createNaturalWoodTexture();
    const floorTex = createFloorTilesTexture();
    const featureTex = createFeatureWallTexture();
    const fabricTex = createFabricTexture();
    setWallTexture(wallTex);
    setWoodTexture(woodTex);
    setFloorTilesTexture(floorTex);
    setFeatureWallTexture(featureTex);
    setFabricTexture(fabricTex);
    return () => {
      wallTex.dispose();
      woodTex.dispose();
      floorTex.dispose();
      featureTex.dispose();
      fabricTex.dispose();
    };
  }, []);

  // Brief, non-blocking tutorial, timed from canvas and texture readiness.
  const tutorialReady = canvasReady && !!floorTilesTexture && !!wallTexture;
  useEffect(() => {
    if (!tutorialReady || !showTutorial) return;
    const timeout = window.setTimeout(() => setShowTutorial(false), 8000);
    return () => window.clearTimeout(timeout);
  }, [tutorialReady, showTutorial]);

  const setAngle = useCallback((angle: number, direct = false) => {
    const next = THREE.MathUtils.clamp(angle, -0.72, 0.72);
    if (next === targetAngle.current) return;
    targetAngle.current = next;
    followPointer.current = direct;
    invalidateRef.current?.();
  }, []);

  const jumpToWall = useCallback((wall: "left" | "center" | "right") => {
    setShowTutorial(false);
    setAngle(wall === "left" ? -0.68 : wall === "right" ? 0.68 : 0);
  }, [setAngle]);

  const selectPhoto = useCallback((photo: GalleryPhotoItem) => {
    if (suppressClick.current) return;
    setShowTutorial(false);
    setSelectedPhoto(photo);
  }, []);

  // Keep keyboard navigation local to the focused gallery; Escape closes its modal.
  useEffect(() => {
    if (!selectedPhoto) return;
    const close = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedPhoto(null);
    };
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, [selectedPhoto]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "ArrowLeft" || e.key === "ArrowRight" || e.key === "ArrowUp" || e.key === "ArrowDown") {
      e.preventDefault();
      jumpToWall(e.key === "ArrowLeft" ? "left" : e.key === "ArrowRight" ? "right" : "center");
    }
  }, [jumpToWall]);

  const handlePointerDown = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (!e.isPrimary || (e.pointerType === "mouse" && e.button !== 0)) return;
    suppressClick.current = false;
    const fast = isMobile || e.pointerType === "touch";
    // Roughly one fifth of the gallery width pans from the center to a side.
    const swipeSpan = Math.max(48, e.currentTarget.clientWidth * 0.2);
    pointer.current = {
      id: e.pointerId,
      x: e.clientX,
      y: e.clientY,
      dragging: false,
      fast,
      radiansPerPixel: fast ? 0.72 / swipeSpan : 0.0026,
    };
  }, [isMobile]);

  const handlePointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    const p = pointer.current;
    if (!p || p.id !== e.pointerId) return;
    const dx = e.clientX - p.x;
    const dy = e.clientY - p.y;
    if (!p.dragging) {
      const threshold = p.fast ? 5 : 8;
      if (Math.abs(dy) > threshold && Math.abs(dy) > Math.abs(dx)) {
        pointer.current = null; // allow natural vertical scrolling
        return;
      }
      if (Math.abs(dx) < threshold) return;
      p.dragging = true;
      suppressClick.current = true;
      setShowTutorial(false);
      e.currentTarget.setPointerCapture(e.pointerId);
    }
    setAngle(targetAngle.current + dx * p.radiansPerPixel, p.fast);
    p.x = e.clientX;
  }, [setAngle]);

  const handlePointerUp = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    // Capture transfers from the touched canvas to this wrapper.
    if (e.type === "lostpointercapture" && e.target !== e.currentTarget) return;
    const p = pointer.current;
    if (!p || p.id !== e.pointerId) return;
    if (e.type === "pointerup" && p.fast && p.dragging) {
      const remaining = e.clientX - p.x;
      setAngle(targetAngle.current + remaining * p.radiansPerPixel, true);
    }
    pointer.current = null;
    if (e.currentTarget.hasPointerCapture(e.pointerId)) e.currentTarget.releasePointerCapture(e.pointerId);
  }, [setAngle]);

  const camera = useMemo(() => ({
    position: [0, 1.45, isMobile ? 7.2 : 6.1] as [number, number, number],
    fov: isMobile ? 54 : 48, near: 0.4, far: 50,
  }), [isMobile]);
  const gl = useMemo(() => ({
    antialias: true,
    alpha: false,
    powerPreference: "high-performance" as const,
  }), []);
  const dpr = useMemo<[number, number]>(
    () => [1, isMobile ? 1.25 : 1.5],
    [isMobile],
  );

  return (
    <div className={styles.heroWrapper}>
      <section
        className={styles.heroContainer}
        aria-label="Vastu Vihar Nepal 3D Virtual Gallery"
      >
        {/* Subtle top vignette for clean navbar blending */}
        <div className={styles.topVignette} />

        {/* 3D Canvas with enhanced near plane to prevent corner z-fighting */}
        <div
          className={styles.canvasWrapper}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          onLostPointerCapture={handlePointerUp}
          onPointerLeave={(e) => { if (!pointer.current?.dragging) handlePointerUp(e); }}
          onKeyDown={handleKeyDown}
          tabIndex={0}
          aria-label="Explore gallery using drag or arrow keys"
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
              items={items || DEFAULT_GALLERY_PHOTOS}
              onSelectPhoto={selectPhoto}
              targetAngle={targetAngle}
              followPointer={followPointer}
              isMobile={isMobile}
              wallTexture={wallTexture}
              woodTexture={woodTexture}
              floorTilesTexture={floorTilesTexture}
              featureWallTexture={featureWallTexture}
              fabricTexture={fabricTexture}
            />
          </Canvas>
        </div>

        {/* Eight-second drag hint; dismisses on meaningful interaction. */}
        {tutorialReady && showTutorial && !selectedPhoto && (
          <div className={styles.dragTutorial} role="status">
            <svg className={styles.tutorialGesture} viewBox="0 0 64 32"
              width="64" height="32" fill="none" aria-hidden="true">
              <path d="M5 16h10M5 16l4-4M5 16l4 4M59 16H49M59 16l-4-4M59 16l-4 4"
                stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              <g className={styles.tutorialHand} stroke="currentColor" strokeWidth="1.5"
                strokeLinecap="round" strokeLinejoin="round">
                <path d="M27 16V6a2 2 0 0 1 4 0v8-3a2 2 0 0 1 4 0v3-1a2 2 0 0 1 4 0v3a2 2 0 0 1 4 0v4c0 6-4 9-9 9h-2c-3 0-5-2-7-5l-4-5a2 2 0 0 1 3-3l3 3" />
              </g>
            </svg>
            <span>{isMobile ? "Swipe to explore" : "Drag to explore"}</span>
          </div>
        )}

        {/* Clean Lightbox Modal */}
        {selectedPhoto && (
          <div
            className={styles.lightboxBackdrop}
            onClick={() => setSelectedPhoto(null)}
            role="dialog"
            aria-modal="true"
          >
            <div
              className={styles.lightboxCard}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                className={styles.closeButton}
                onClick={() => setSelectedPhoto(null)}
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
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
