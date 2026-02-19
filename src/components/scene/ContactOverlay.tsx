"use client";

import { Html } from "@react-three/drei";
import { useScrollOffset } from "./useScrollOffset";
import { useScrollPortal } from "./ScrollPortalContext";
import { CONTACT_THRESHOLD } from "./sceneConstants";
import React from "react";

export default function ContactOverlay() {
  const offset = useScrollOffset();
  const portalRef = useScrollPortal();
  const inContact = offset >= CONTACT_THRESHOLD;
  const blend = inContact ? (offset - CONTACT_THRESHOLD) / (1 - CONTACT_THRESHOLD) : 0;
  const opacity = Math.min(1, blend * 2);

  if (!inContact) return null;

  return (
    <group position={[0, 0, 0]}>
      <Html
        portal={portalRef ? (portalRef as React.RefObject<HTMLElement>) : undefined}
        transform={false}
        style={{
          position: "fixed",
          left: 0,
          top: 0,
          right: 0,
          bottom: 0,
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          pointerEvents: opacity > 0.5 ? "auto" : "none",
          opacity,
          transition: "opacity 0.2s ease-out",
        }}
      >
        <div className="flex flex-col items-center gap-6 text-center text-zinc-100">
          <h2 className="text-2xl font-semibold tracking-tight">Get in touch</h2>
          <p className="max-w-sm text-zinc-400">
            Have a project in mind or want to say hi? I’d love to hear from you.
          </p>
          <a
            href="mailto:hello@example.com"
            className="rounded-full bg-zinc-100 px-6 py-3 text-sm font-medium text-zinc-900 transition-colors hover:bg-zinc-200"
          >
            Contact me
          </a>
        </div>
      </Html>
    </group>
  );
}
