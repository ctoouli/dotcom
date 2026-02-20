"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useScroll } from "@react-three/drei";
import { N, CONTACT_THRESHOLD, projectOffset } from "./sceneConstants";
import { scrollOffsetToDisplayT } from "./scrollPause";

const LERP_FACTOR = 0.08;
const ORBIT_SPEED = 0.15;
const ORBIT_THRESHOLD = 0.005;
const SCENE_OFF_Y = 18;

interface RigProps {
  groupRef: React.RefObject<THREE.Group | null>;
}

export default function Rig({ groupRef }: RigProps) {
  const scroll = useScroll();
  const currentAngleRef = useRef(0);

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    const offset = scroll?.offset ?? 0;
    const inOrbit = offset < ORBIT_THRESHOLD;
    const inContact = offset >= CONTACT_THRESHOLD;

    if (inOrbit) {
      currentAngleRef.current += delta * ORBIT_SPEED;
    } else {
      const proj = projectOffset(offset);
      const displayT = scrollOffsetToDisplayT(proj, N);
      const targetAngle = -(displayT / N) * Math.PI * 2;
      currentAngleRef.current += (targetAngle - currentAngleRef.current) * LERP_FACTOR;
    }

    groupRef.current.rotation.y = currentAngleRef.current;

    // Move scene off-screen in lockstep with scroll (no lerp) so it feels like normal scrolling
    if (inContact) {
      const contactProgress = (offset - CONTACT_THRESHOLD) / (1 - CONTACT_THRESHOLD);
      groupRef.current.position.y = contactProgress * SCENE_OFF_Y;
    } else {
      groupRef.current.position.y = 0;
    }
  });

  return null;
}
