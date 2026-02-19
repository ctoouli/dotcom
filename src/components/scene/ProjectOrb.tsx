"use client";

import React, { memo } from "react";
import { Billboard, Html } from "@react-three/drei";
import type { Project } from "@/content/projects";
import { useScrollPortal } from "./ScrollPortalContext";

export interface ProjectOrbProps {
  index: number;
  position: [number, number, number];
  project: Project;
  activeT: number;
  showProjectCard: boolean;
}

const STRENGTH_THRESHOLD = 0.2;
const SCALE_ACTIVE = 0.2;

function ProjectOrbInner({
  index,
  position,
  project,
  activeT,
  showProjectCard,
}: ProjectOrbProps) {
  const portalRef = useScrollPortal();
  const strength = Math.max(0, 1 - Math.abs(activeT - index));
  const scale = 1 + SCALE_ACTIVE * strength;
  const show = showProjectCard && strength > STRENGTH_THRESHOLD;
  const forwardOffset = strength * 0.5;
  const opacity = strength <= STRENGTH_THRESHOLD ? 0 : Math.min(1, (strength - STRENGTH_THRESHOLD) / (1 - STRENGTH_THRESHOLD));

  return (
    <group position={[position[0], position[1], position[2] + forwardOffset]}>
      <mesh scale={scale}>
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshStandardMaterial
          color="#64748b"
          metalness={0.2}
          roughness={0.8}
          emissive="#475569"
          emissiveIntensity={0.2 + strength * 0.4}
        />
      </mesh>
      {show ? (
        <Billboard>
          <Html
            portal={portalRef ? (portalRef as React.RefObject<HTMLElement>) : undefined}
            center
            transform
            pointerEvents={opacity > 0.5 ? "auto" : "none"}
          >
            <div
              className="min-w-[180px] rounded-lg bg-zinc-900/90 px-3 py-2 text-left text-zinc-100 shadow-lg dark:bg-white/10 dark:text-zinc-50"
              style={{ opacity }}
            >
            <h3 className="font-semibold text-sm">{project.title}</h3>
            {project.href ? (
              <a
                href={project.href}
                className="mt-1 inline-block text-xs font-medium text-sky-400 hover:underline"
              >
                View
              </a>
            ) : null}
          </div>
          </Html>
        </Billboard>
      ) : null}
    </group>
  );
}

export const ProjectOrb = memo(ProjectOrbInner);
