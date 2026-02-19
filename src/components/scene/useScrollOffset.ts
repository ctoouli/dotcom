"use client";

import { useState } from "react";
import { useFrame } from "@react-three/fiber";
import { useScroll } from "@react-three/drei";

/**
 * Returns scroll offset (0..1) that updates every frame so React components
 * re-render when scroll changes. useScroll().offset is mutated in useFrame
 * and does not trigger re-renders by itself.
 */
export function useScrollOffset(): number {
  const scroll = useScroll();
  const [offset, setOffset] = useState(0);

  useFrame(() => {
    const o = scroll?.offset ?? 0;
    setOffset((prev) => (Math.abs(o - prev) > 0.001 ? o : prev));
  });

  return offset;
}
