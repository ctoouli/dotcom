# Scroll-driven 3D scene

This folder implements a portfolio with a **scroll-driven 3D scene**: a torus knot, a ring around it, project orbs and decorative orbs on orbital rings, and project cards that stick to the active orb. Scroll position drives which orb is in front; past the last project, the scene scrolls off upward and a contact section appears.

## High-level flow

1. **No physical scroll of the canvas** – The page is full viewport; the 3D canvas is fixed. Only scroll **state** (from `@react-three/drei` `ScrollControls`) changes. The scrollable area has height `PAGES * 100vh` so the user scrolls through “pages.”
2. **Scroll offset (0..1)** – `ScrollControls` provides `scroll.offset`: 0 at top, 1 at bottom over `PAGES` pages.
3. **Two phases of scroll**
   - **Projects (offset 0 → CONTACT_THRESHOLD):** Offset is normalized to project range; the carousel rotates around Y so the “active” orb comes to the front; project cards are revealed on the active orb (opacity).
   - **Contact (offset CONTACT_THRESHOLD → 1):** The 3D group moves up (positive Y) in lockstep with scroll; a fullscreen “Contact me” overlay fades in.

## Key files and roles

| File | Role |
|------|------|
| **Scene.tsx** | Canvas (cream background, fog, ACES tone mapping), lights (ambient + spot), `ScrollControls` with `pages={PAGES}`, carousel group (TorusKnot + Orbs + DecorativeOrbs), Rig, ContactOverlay. |
| **sceneConstants.ts** | `N` (project count), `PAGES = N + 1`, `CONTACT_THRESHOLD = N / PAGES`, and `projectOffset(offset)` to map full scroll range to project range 0..1. |
| **scrollPause.ts** | `scrollOffsetToDisplayT(offset, n)` – maps 0..1 to display index 0..n−1 with a “pause” in the middle of each segment so the scene holds on each orb while the user scrolls. |
| **Rig.tsx** | `useFrame`: if offset &lt; small threshold → idle orbit; else rotation from `scrollOffsetToDisplayT(projectOffset(offset), N)`. Applies `rotation.y` only (orbit in XZ). In contact zone, `position.y` is driven directly by scroll so the scene moves up with scroll. |
| **Orbs.tsx** | Renders one `ProjectOrb` per project. Uses `useScrollOffset()` so React re-renders when scroll changes. Project orbs on a single ring at radius 2.5 (see orbPose). |
| **ProjectOrb.tsx** | Icosahedron mesh (radius 0.05) + card. `strength = 1 - |activeT - index|`; card is **always mounted** and revealed with opacity when `showProjectCard && strength > STRENGTH_THRESHOLD` (avoids first-view blur). Card is solid background, no glass. `<Html portal={portalRef}>` inside `<Billboard>`. |
| **DecorativeOrbs.tsx** | Extra orbs (icosahedrons, same size) on **multiple orbital rings** at different radii (2–4) and inclinations; no project cards. All orbit with the carousel. |
| **ContactOverlay.tsx** | Renders only when offset ≥ CONTACT_THRESHOLD. Fullscreen “Get in touch” via `<Html portal={portalRef}>` with fixed positioning; opacity fades in over the contact range. |
| **ScrollPortalContext.tsx** | Creates a fixed, full-viewport div on `document.body` and provides its ref. All `<Html portal={portalRef}>` (project cards + contact) render into this div so overlays don’t scroll with the virtual scroll. |
| **useScrollOffset.ts** | Hook that returns current scroll offset and updates state in `useFrame` so components re-render when scroll changes (drei’s scroll object is mutated in place). |
| **orbPose.ts** | `orbitPosition(angle, radius, inclination)` – position on a circular orbit; angle 0 = +Z (front). inclination 0 = XZ plane; non-zero tilts the ring for decorative orbs. `orbPose(i, n, radius, inclination)` uses it for project orbs (inclination 0). |
| **TorusKnot.tsx** | Knot (1.2, 0.3, p=2 q=3) with glass `MeshPhysicalMaterial`; thin black ring (2.5, 0.02) tilted; both in a group with slow Y rotation. |

## Proportions and visuals

- **Background:** Cream `#F0F0EB`; fog; black/white only for orbs and ring.
- **Knot:** Radius 1.2, tube 0.3; ring at 2.5, tube 0.02. Camera at z=8, fov 45.
- **Project orbs:** Radius 2.5 ring, orb size 0.05 (icosahedron). Decorative orbs same size, radii 2–4 on multiple inclined planes.
- **Project cards:** Solid background (`#F5F5F3`), no backdrop blur; always mounted, visibility by opacity; `.project-card-orb` in `globals.css` for crisp text.

## Scroll math

- **Pages:** `PAGES = N + 1` (N project “stops” + 1 contact page). Total scroll height = `PAGES * 100vh`.
- **Project range:** `projectOffset(offset) = min(1, offset * PAGES / N)` so when `offset ∈ [0, CONTACT_THRESHOLD]`, `projectOffset(offset) ∈ [0, 1]`.
- **Contact threshold:** `CONTACT_THRESHOLD = N / PAGES`. When `offset ≥ CONTACT_THRESHOLD` we’re in the contact zone; project cards are hidden and the scene moves up.

## Display T and “pause” (scrollPause.ts)

`scrollOffsetToDisplayT(offset, n)` turns a continuous 0..1 offset into a continuous “display index” 0..n−1. Each project gets a segment of length `1/n` with a **pause** in the middle so the scene holds on that orb. The last segment always returns `n − 1` so there’s no jump back when entering the final segment.

## Why the scroll portal

`ScrollControls` creates an invisible scrollable div; the 3D canvas is a sibling. By rendering `<Html>` into a **fixed viewport portal** on `document.body`, the cards and contact overlay stay fixed on screen and only their visibility changes with scroll. The Rig moves the 3D scene; the overlays stay put.

## Changing behavior

- **Number of projects:** Edit `src/content/projects.ts`. `N`, `PAGES`, and `CONTACT_THRESHOLD` are derived in `sceneConstants.ts`.
- **Pause feel:** Adjust `PAUSE_HALF` in `scrollPause.ts` (larger = longer hold per orb).
- **Scene scroll-off distance:** Change `SCENE_OFF_Y` in `Rig.tsx` (positive = scene moves up).
- **Contact content:** Edit `ContactOverlay.tsx` (copy and mailto link).
- **Proportions:** Knot/ring in `TorusKnot.tsx` (KNOT_RADIUS, KNOT_TUBE, RING_*); project orb radius in `Orbs.tsx` (RADIUS) and `ProjectOrb.tsx` (ORB_RADIUS); decorative orbits in `DecorativeOrbs.tsx` (ORBITS, ORB_RADIUS).
