"use client";

import { projects } from "@/content/projects";
import { orbPose } from "./orbPose";
import { ProjectOrb } from "./ProjectOrb";
import { scrollOffsetToDisplayT } from "./scrollPause";
import { useScrollOffset } from "./useScrollOffset";
import { N, CONTACT_THRESHOLD, projectOffset } from "./sceneConstants";

const RADIUS = 6;
const SCROLL_START_THRESHOLD = 0.005;

export default function Orbs() {
  const offset = useScrollOffset();
  const proj = projectOffset(offset);
  const activeT = scrollOffsetToDisplayT(proj, N);
  const showProjects = offset > SCROLL_START_THRESHOLD && offset < CONTACT_THRESHOLD;

  return (
    <>
      {projects.map((project, i) => {
        const pose = orbPose(i, N, RADIUS);
        return (
          <ProjectOrb
            key={project.id}
            index={i}
            position={pose.position}
            project={project}
            activeT={activeT}
            showProjectCard={showProjects}
          />
        );
      })}
    </>
  );
}
