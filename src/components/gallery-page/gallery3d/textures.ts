import * as THREE from "three";

export interface GalleryTextureSet {
  limestone: THREE.CanvasTexture;
  limestoneRoughness: THREE.CanvasTexture;
  walnut: THREE.CanvasTexture;
  marbleFloor: THREE.CanvasTexture;
  fabricBump: THREE.CanvasTexture;
  dispose: () => void;
}

/**
 * Generates warm champagne limestone / travertine texture with subtle horizontal
 * stone bedding, gentle tonal variation, and natural mineral pores.
 */
function createLimestoneTextures(): {
  map: THREE.CanvasTexture;
  roughnessMap: THREE.CanvasTexture;
} {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext("2d");

  const roughCanvas = document.createElement("canvas");
  roughCanvas.width = 512;
  roughCanvas.height = 512;
  const rCtx = roughCanvas.getContext("2d");

  if (ctx && rCtx) {
    // Richer warm champagne base (#D8C5A7)
    ctx.fillStyle = "#D4C0A1";
    ctx.fillRect(0, 0, 512, 512);

    rCtx.fillStyle = "#CCCCCC"; // ~0.80 base roughness
    rCtx.fillRect(0, 0, 512, 512);

    // Subtle horizontal travertine bedding bands
    for (let y = 0; y < 512; y += 6) {
      const bandAlpha = 0.025 + Math.random() * 0.045;
      const warm = Math.random() > 0.45 ? "233, 221, 201" : "169, 148, 125";
      ctx.fillStyle = `rgba(${warm}, ${bandAlpha})`;
      ctx.fillRect(0, y, 512, 3 + Math.random() * 5);

      const rShade = Math.random() > 0.5 ? 225 : 185;
      rCtx.fillStyle = `rgba(${rShade}, ${rShade}, ${rShade}, 0.25)`;
      rCtx.fillRect(0, y, 512, 4);
    }

    // Soft natural stone clouding wrapped seamlessly
    for (let i = 0; i < 110; i++) {
      const x = Math.random() * 512;
      const y = Math.random() * 512;
      const r = 22 + Math.random() * 72;
      const tint = Math.random() > 0.48 ? "233, 221, 201" : "169, 148, 125";
      const alpha = 0.045 + Math.random() * 0.065;
      for (const dx of [-512, 0, 512]) {
        for (const dy of [-512, 0, 512]) {
          const px = x + dx;
          const py = y + dy;
          if (px + r < 0 || px - r > 512 || py + r < 0 || py - r > 512) continue;
          const grad = ctx.createRadialGradient(px, py, 0, px, py, r);
          grad.addColorStop(0, `rgba(${tint}, ${alpha})`);
          grad.addColorStop(1, `rgba(${tint}, 0)`);
          ctx.fillStyle = grad;
          ctx.fillRect(px - r, py - r, r * 2, r * 2);
        }
      }
    }

    // Fine travertine pores & mineral stipple
    for (let i = 0; i < 9500; i++) {
      const shade = Math.random() > 0.5 ? 248 : 96;
      ctx.fillStyle = `rgba(${shade}, ${shade - 8}, ${shade - 18}, 0.055)`;
      ctx.fillRect(Math.random() * 512, Math.random() * 512, 2, 1.2);
    }
  }

  const map = new THREE.CanvasTexture(canvas);
  map.wrapS = THREE.RepeatWrapping;
  map.wrapT = THREE.RepeatWrapping;
  // ExtrudeGeometry uses world meters for side UVs (~61m circumference x 3.8m height)
  map.repeat.set(0.35, 0.35);
  map.colorSpace = THREE.SRGBColorSpace;
  map.anisotropy = 4;

  const roughnessMap = new THREE.CanvasTexture(roughCanvas);
  roughnessMap.wrapS = THREE.RepeatWrapping;
  roughnessMap.wrapT = THREE.RepeatWrapping;
  roughnessMap.repeat.set(0.35, 0.35);
  roughnessMap.anisotropy = 4;

  return { map, roughnessMap };
}

/**
 * Generates dark walnut wood grain texture for vertical slat panels and frame borders.
 */
function createWalnutTexture(): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 512;
  const ctx = canvas.getContext("2d");

  if (ctx) {
    const grad = ctx.createLinearGradient(0, 0, 256, 0);
    grad.addColorStop(0, "#4A3224");
    grad.addColorStop(0.35, "#5C3F2D");
    grad.addColorStop(0.7, "#4F3627");
    grad.addColorStop(1, "#553B2B");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 256, 512);

    for (let x = 0; x < 256; x += 2) {
      const alpha = 0.06 + Math.random() * 0.12;
      ctx.fillStyle = `rgba(24, 13, 7, ${alpha})`;
      ctx.fillRect(x, 0, 1 + Math.random(), 512);
    }
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(1, 2);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  return tex;
}

/**
 * Generates polished warm grey marble tile texture for the circular exhibition floor.
 */
function createMarbleFloorTexture(): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext("2d");

  if (ctx) {
    const tileSize = 256;
    const grout = 4;
    const tones = ["#A9A39B", "#B2ABA2", "#9F9990", "#ACA59C", "#B6AFA6", "#A49E95"];

    ctx.fillStyle = "#7D766E";
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

        // Soft marble clouding
        for (let i = 0; i < 16; i++) {
          const px = x + Math.random() * tileSize;
          const py = y + Math.random() * tileSize;
          const r = 20 + Math.random() * 55;
          const tint = Math.random() > 0.45 ? "245, 240, 232" : "105, 98, 90";
          const cloud = ctx.createRadialGradient(px, py, 0, px, py, r);
          cloud.addColorStop(0, `rgba(${tint}, 0.12)`);
          cloud.addColorStop(1, `rgba(${tint}, 0)`);
          ctx.fillStyle = cloud;
          ctx.fillRect(px - r, py - r, r * 2, r * 2);
        }

        // Delicate marble veins
        for (let i = 0; i < 5; i++) {
          const offset = 16 + Math.random() * (tileSize - 32);
          ctx.beginPath();
          ctx.moveTo(x - 6, y + offset);
          ctx.bezierCurveTo(
            x + 64,
            y + offset - 14,
            x + 170,
            y + offset + 16,
            x + tileSize + 8,
            y + offset - 4
          );
          ctx.lineWidth = 0.6 + Math.random() * 0.9;
          ctx.strokeStyle =
            i % 2 === 0 ? "rgba(75, 68, 60, 0.14)" : "rgba(248, 244, 238, 0.18)";
          ctx.stroke();
        }
        ctx.restore();
      }
    }
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(5, 5);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  return tex;
}

/**
 * Generates subtle woven taupe fabric bump texture for the circular bench.
 */
function createFabricBumpTexture(): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext("2d");

  if (ctx) {
    ctx.fillStyle = "#808080";
    ctx.fillRect(0, 0, 256, 256);
    for (let y = 0; y < 256; y += 4) {
      for (let x = 0; x < 256; x += 4) {
        ctx.fillStyle = (x / 4 + y / 4) % 2 ? "#9A9A9A" : "#6A6A6A";
        ctx.fillRect(x, y, 3, 2);
      }
    }
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(10, 4);
  tex.anisotropy = 4;
  return tex;
}

export function createGalleryTextureSet(): GalleryTextureSet {
  const { map: limestone, roughnessMap: limestoneRoughness } =
    createLimestoneTextures();
  const walnut = createWalnutTexture();
  const marbleFloor = createMarbleFloorTexture();
  const fabricBump = createFabricBumpTexture();

  return {
    limestone,
    limestoneRoughness,
    walnut,
    marbleFloor,
    fabricBump,
    dispose: () => {
      limestone.dispose();
      limestoneRoughness.dispose();
      walnut.dispose();
      marbleFloor.dispose();
      fabricBump.dispose();
    },
  };
}
