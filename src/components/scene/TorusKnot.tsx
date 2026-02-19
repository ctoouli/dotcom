"use client";

import { memo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

const ROTATION_SPEED = 0.15;
const MOBILE_WIDTH = 768;

function TorusKnotInner() {
  const meshRef = useRef<THREE.Mesh>(null);
  const { size } = useThree();
  const isMobile = size.width < MOBILE_WIDTH;
  const tubularSegments = isMobile ? 32 : 64;
  const radialSegments = isMobile ? 8 : 16;

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * ROTATION_SPEED;
    }
  });

  return (
    <mesh ref={meshRef}>
      <torusKnotGeometry args={[1.2, 0.4, tubularSegments, radialSegments]} />
      <meshStandardMaterial
        color="#334155"
        metalness={0.4}
        roughness={0.6}
        emissive="#1e293b"
        emissiveIntensity={0.1}
      />
    </mesh>
  );
}

export default memo(TorusKnotInner);
