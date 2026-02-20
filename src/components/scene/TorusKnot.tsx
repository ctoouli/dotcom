"use client";

import { memo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

const ROTATION_SPEED = 0.15;
const MOBILE_WIDTH = 768;
const KNOT_RADIUS = 1.2;
const KNOT_TUBE = 0.3;
const RING_RADIUS = 2.5;
const RING_TUBE = 0.02;

function TorusKnotInner() {
  const groupRef = useRef<THREE.Group>(null);
  const { size } = useThree();
  const isMobile = size.width < MOBILE_WIDTH;
  const tubularSegments = isMobile ? 64 : 150;
  const radialSegments = isMobile ? 12 : 20;

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * ROTATION_SPEED;
    }
  });

  return (
    <group ref={groupRef}>
      <mesh castShadow>
        <torusKnotGeometry args={[KNOT_RADIUS, KNOT_TUBE, tubularSegments, radialSegments, 2, 3]} />
        <meshPhysicalMaterial
          color={0xffffff}
          metalness={0.1}
          roughness={0.05}
          transmission={0.95}
          thickness={1.5}
          ior={1.7}
          dispersion={0.4}
          clearcoat={1}
        />
      </mesh>
      <mesh rotation={[Math.PI / 1.8, 0, 0]} castShadow>
        <torusGeometry args={[RING_RADIUS, RING_TUBE, 16, 100]} />
        <meshStandardMaterial color={0x0a0a0a} metalness={0.6} roughness={0.3} />
      </mesh>
    </group>
  );
}

export default memo(TorusKnotInner);
