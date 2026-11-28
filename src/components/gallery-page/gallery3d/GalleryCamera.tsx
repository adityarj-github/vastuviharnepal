"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";

export interface CameraTargetState {
  angle: number;
  radius: number;
  height: number;
  lookRadius: number;
  lookHeight: number;
}

interface GalleryCameraProps {
  targetRef: { readonly current: CameraTargetState };
  followPointerRef: { current: boolean };
  isMobile: boolean;
}

/**
 * 360° circular museum camera rig with damped orbital movement
 * and demand-driven frame invalidation.
 */
export function GalleryCamera({
  targetRef,
  followPointerRef,
  isMobile,
}: GalleryCameraProps) {
  const current = useRef<CameraTargetState | null>(null);
  const reducedMotion = useRef(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => {
      reducedMotion.current = query.matches;
    };
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  useFrame((state, delta) => {
    const target = targetRef.current;
    if (!current.current) {
      current.current = { ...target };
    }
    const dt = Math.min(delta, 1 / 30);
    const direct = followPointerRef.current || reducedMotion.current;
    followPointerRef.current = false;

    const dampFactor = 6.5;
    // Shortest angular path across +/-PI so 40% -> 60% transitions smoothly
    const angleDelta = Math.atan2(
      Math.sin(target.angle - current.current.angle),
      Math.cos(target.angle - current.current.angle)
    );
    const shortestTargetAngle = current.current.angle + angleDelta;

    const nextAngle = direct
      ? target.angle
      : THREE.MathUtils.damp(current.current.angle, shortestTargetAngle, dampFactor, dt);
    const nextRadius = direct
      ? target.radius
      : THREE.MathUtils.damp(current.current.radius, target.radius, dampFactor, dt);
    const nextHeight = direct
      ? target.height
      : THREE.MathUtils.damp(current.current.height, target.height, dampFactor, dt);
    const nextLookRadius = direct
      ? target.lookRadius
      : THREE.MathUtils.damp(
          current.current.lookRadius,
          target.lookRadius,
          dampFactor,
          dt
        );
    const nextLookHeight = direct
      ? target.lookHeight
      : THREE.MathUtils.damp(
          current.current.lookHeight,
          target.lookHeight,
          dampFactor,
          dt
        );

    const moving =
      Math.abs(nextAngle - shortestTargetAngle) > 0.0002 ||
      Math.abs(nextRadius - target.radius) > 0.001 ||
      Math.abs(nextHeight - target.height) > 0.001 ||
      Math.abs(nextLookRadius - target.lookRadius) > 0.001 ||
      Math.abs(nextLookHeight - target.lookHeight) > 0.001;

    current.current = moving
      ? {
          angle: nextAngle,
          radius: nextRadius,
          height: nextHeight,
          lookRadius: nextLookRadius,
          lookHeight: nextLookHeight,
        }
      : { ...target };

    const { angle, radius, height, lookRadius, lookHeight } = current.current;
    const sin = Math.sin(angle);
    const cos = Math.cos(angle);

    // Slight pull-back on mobile so wide exhibition bays stay framed
    const effectiveRadius = isMobile ? Math.min(radius + 0.65, 7.8) : radius;

    state.camera.position.set(-sin * effectiveRadius, height, cos * effectiveRadius);
    state.camera.lookAt(sin * lookRadius, lookHeight, -cos * lookRadius);

    if (moving) state.invalidate();
  }, -1);

  return null;
}
