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
const ORB_RADIUS = 0.05;

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
      <mesh scale={scale} castShadow>
        <icosahedronGeometry args={[ORB_RADIUS, 0]} />
        <meshStandardMaterial
          color={0x0a0a0a}
          metalness={0.4}
          roughness={0.5}
        />
      </mesh>
      {/* Always mount the card so it's painted from load — reveal with opacity to avoid first-view blur */}
      <Billboard>
        <Html
          portal={portalRef ? (portalRef as React.RefObject<HTMLElement>) : undefined}
          center
          transform
          distanceFactor={6}
          pointerEvents={show && opacity > 0.5 ? "auto" : "none"}
          style={{ width: "max-content" }}
        >
          <div
            className="project-card-orb"
            style={{
              opacity: show ? opacity : 0,
              minWidth: 200,
              padding: "12px 14px",
              borderRadius: 12,
              border: "1px solid rgba(15, 15, 15, 0.12)",
              background: "#F5F5F3",
              boxShadow: "0 4px 24px rgba(0, 0, 0, 0.06), 0 1px 2px rgba(0, 0, 0, 0.04)",
              WebkitFontSmoothing: "antialiased",
              transform: "translateZ(0)",
              transition: "opacity 0.15s ease-out",
            }}
          >
            <h3
              className="font-semibold text-[#0F0F0F]"
              style={{ fontSize: 15, letterSpacing: "-0.01em", margin: 0, lineHeight: 1.3 }}
            >
              {project.title}
            </h3>
            {project.href ? (
              <a
                href={project.href}
                className="mt-1 inline-block text-[#0F0F0F] hover:underline"
                style={{ fontSize: 13, fontWeight: 500, marginTop: 6 }}
              >
                View project →
              </a>
            ) : null}
          </div>
        </Html>
      </Billboard>
    </group>
  );
}

export const ProjectOrb = memo(ProjectOrbInner);
