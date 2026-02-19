"use client";

import { useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { ScrollControls } from "@react-three/drei";
import * as THREE from "three";
import TorusKnot from "./TorusKnot";
import Orbs from "./Orbs";
import Rig from "./Rig";
import ContactOverlay from "./ContactOverlay";
import { ScrollPortalProvider } from "./ScrollPortalContext";
import { PAGES } from "./sceneConstants";

export default function Scene() {
  const carouselRef = useRef<THREE.Group>(null);

  return (
    <Canvas
      gl={{ antialias: true }}
      camera={{ position: [0, 0, 12], fov: 50 }}
      style={{ position: "fixed", inset: 0 }}
    >
      <color attach="background" args={["#0a0a0a"]} />
      <ambientLight intensity={0.4} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <pointLight position={[-10, -10, 5]} intensity={0.5} />
      <ScrollPortalProvider>
        <ScrollControls pages={PAGES} damping={0.15}>
          <group ref={carouselRef}>
            <TorusKnot />
            <Orbs />
          </group>
          <Rig groupRef={carouselRef} />
          <ContactOverlay />
        </ScrollControls>
      </ScrollPortalProvider>
    </Canvas>
  );
}
