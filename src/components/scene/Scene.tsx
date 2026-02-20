"use client";

import { useRef, useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import { ScrollControls } from "@react-three/drei";
import * as THREE from "three";
import TorusKnot from "./TorusKnot";
import Orbs from "./Orbs";
import DecorativeOrbs from "./DecorativeOrbs";
import Rig from "./Rig";
import ContactOverlay from "./ContactOverlay";
import { ScrollPortalProvider } from "./ScrollPortalContext";
import { PAGES } from "./sceneConstants";

const CREAM = 0xf0f0eb;

export default function Scene() {
  const carouselRef = useRef<THREE.Group>(null);
  const fog = useMemo(() => new THREE.FogExp2(CREAM, 0.02), []);

  return (
    <Canvas
      gl={{
        antialias: true,
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.2,
      }}
      camera={{ position: [0, 0, 8], fov: 45 }}
      style={{ position: "fixed", inset: 0 }}
    >
      <color attach="background" args={[CREAM]} />
      <primitive object={fog} attach="fog" />
      <ambientLight color={0xffffff} intensity={0.6} />
      <spotLight position={[5, 5, 5]} intensity={20} castShadow />
      <ScrollPortalProvider>
        <ScrollControls pages={PAGES} damping={0.15}>
          <group ref={carouselRef}>
            <TorusKnot />
            <Orbs />
            <DecorativeOrbs />
          </group>
          <Rig groupRef={carouselRef} />
          <ContactOverlay />
        </ScrollControls>
      </ScrollPortalProvider>
    </Canvas>
  );
}
