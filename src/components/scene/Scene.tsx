"use client";

import { useRef, useMemo, useEffect } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { ScrollControls, Effects } from "@react-three/drei";
import { EffectComposer, GammaCorrectionShader } from "three-stdlib";
import * as THREE from "three";
import TorusKnot from "./TorusKnot";
import Orbs from "./Orbs";
import DecorativeOrbs from "./DecorativeOrbs";
import Rig from "./Rig";
import ContactOverlay from "./ContactOverlay";
import { ScrollPortalProvider } from "./ScrollPortalContext";
import { PAGES } from "./sceneConstants";
import { DitherPass } from "./DitherPass";

function EffectsWithDither() {
  const composerRef = useRef<EffectComposer | null>(null);
  const ditherPassRef = useRef<DitherPass | null>(null);
  const { size, viewport } = useThree();

  useEffect(() => {
    const composer = composerRef.current;
    if (!composer) return;
    const pass = new DitherPass();
    ditherPassRef.current = pass;
    composer.insertPass(pass, 1);
    const w = size.width * viewport.dpr;
    const h = size.height * viewport.dpr;
    pass.setSize(w, h);
    return () => {
      const p = ditherPassRef.current;
      if (composer?.passes && p) {
        composer.removePass(p);
      }
    };
  }, []);

  return (
    <Effects ref={composerRef} disableGamma>
      <shaderPass args={[GammaCorrectionShader]} />
    </Effects>
  );
}

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
      <EffectsWithDither />
    </Canvas>
  );
}
