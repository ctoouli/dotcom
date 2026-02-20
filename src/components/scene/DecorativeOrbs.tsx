"use client";

import { memo } from "react";
import { orbitPosition } from "./orbPose";

const ORB_RADIUS = 0.05;

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

function DecorativeOrb({ position }: { position: [number, number, number] }) {
  return (
    <mesh position={position} castShadow>
      <icosahedronGeometry args={[ORB_RADIUS, 0]} />
      <meshStandardMaterial color={0x0a0a0a} metalness={0.4} roughness={0.5} />
    </mesh>
  );
}

function DecorativeOrbsInner() {
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
            />
          );
        })
      )}
    </>
  );
}

export default memo(DecorativeOrbsInner);
