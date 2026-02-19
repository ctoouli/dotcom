"use client";

import dynamic from "next/dynamic";

const sceneLoadingFallback = (
  <div
    className="fixed inset-0 flex items-center justify-center bg-[#0a0a0a] text-zinc-500"
    aria-label="Loading 3D scene"
  >
    Loading…
  </div>
);

const Scene = dynamic(() => import("@/components/scene/Scene"), {
  ssr: false,
  loading: () => sceneLoadingFallback,
});

export default function SceneLoader() {
  return <Scene />;
}
