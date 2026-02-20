"use client";

import { memo } from "react";
import { orbitPosition } from "./orbPose";
import { useDarkMode } from "./SceneThemeContext";

const ORB_RADIUS = 0.05;
const ORB_LIGHT = 0x0a0a0a;
const ORB_DARK = 0xffffff;

/**
 * Multiple orbital rings at different inclinations (different planes). Radii 2–4
 * to match reference proportions (ring at 2.5, orbs in 2–4).
 */
const ORBITS: { radius: number; inclination: number; count: number }[] = [
  { radius: 2, inclination: 0, count: 6 },
  { radius: 2.4, inclination: 0.5, count: 6 },
  { radius: 2.8, inclination: 1.0, count: 6 },
  { radius: 3.2, inclination: 1.5, count: 6 },
  { radius: 3.5, inclination: 0.3, count: 5 },
  { radius: 3.8, inclination: 0.9, count: 5 },
  { radius: 4, inclination: 1.8, count: 5 },
];

function DecorativeOrb({
  position,
  color,
  isDark,
}: {
  position: [number, number, number];
  color: number;
  isDark: boolean;
}) {
  return (
    <mesh position={position} castShadow>
      <icosahedronGeometry args={[ORB_RADIUS, 0]} />
      <meshStandardMaterial
        color={color}
        emissive={isDark ? 0xffffff : 0x000000}
        emissiveIntensity={isDark ? 0.7 : 0}
        metalness={0.4}
        roughness={0.5}
      />
    </mesh>
  );
}

function DecorativeOrbsInner() {
  const isDark = useDarkMode();
  const orbColor = isDark ? ORB_DARK : ORB_LIGHT;
  let key = 0;
  return (
    <>
      {ORBITS.flatMap(({ radius, inclination, count }) =>
        Array.from({ length: count }, (_, i) => {
          const a = (i / count) * Math.PI * 2;
          return (
            <DecorativeOrb
              key={key++}
              position={orbitPosition(a, radius, inclination)}
              color={orbColor}
              isDark={isDark}
            />
          );
        })
      )}
    </>
  );
}

export default memo(DecorativeOrbsInner);
