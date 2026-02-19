# Scroll-driven 3D scene

This folder implements a portfolio with a **scroll-driven 3D scene**: a torus knot, orbs on a ring, and project cards that stick to the active orb. Scroll position drives which orb is in front; past the last project, the scene scrolls off upward and a contact section appears.

## High-level flow

1. **No physical scroll of the canvas** – The page is full viewport; the 3D canvas is fixed. Only scroll **state** (from `@react-three/drei` `ScrollControls`) changes. The scrollable area has height `PAGES * 100vh` so the user scrolls through “pages.”
2. **Scroll offset (0..1)** – `ScrollControls` provides `scroll.offset`: 0 at top, 1 at bottom over `PAGES` pages.
3. **Two phases of scroll**
   - **Projects (offset 0 → CONTACT_THRESHOLD):** Offset is normalized to project range; the carousel rotates so the “active” orb comes to the front; project cards show on the active orb.
   - **Contact (offset CONTACT_THRESHOLD → 1):** The 3D group moves up (positive Y) in lockstep with scroll; a fullscreen “Contact me” overlay fades in.

## Key files and roles

| File | Role |
|------|------|
| **Scene.tsx** | Canvas, lights, `ScrollControls` with `pages={PAGES}`, carousel group (TorusKnot + Orbs), Rig, ContactOverlay. |
| **sceneConstants.ts** | `N` (project count), `PAGES = N + 1`, `CONTACT_THRESHOLD = N / PAGES`, and `projectOffset(offset)` to map full scroll range to project range 0..1. |
| **scrollPause.ts** | `scrollOffsetToDisplayT(offset, n)` – maps 0..1 to display index 0..n−1 with a “pause” in the middle of each segment so the scene holds on each orb while the user scrolls. |
| **Rig.tsx** | `useFrame`: if offset &lt; small threshold → idle orbit; else rotation from `scrollOffsetToDisplayT(projectOffset(offset), N)`; in contact zone, `position.y` is driven directly by scroll (no lerp) so the scene moves up with scroll. |
| **Orbs.tsx** | Renders one `ProjectOrb` per project. Uses `useScrollOffset()` so React re-renders when scroll changes. Computes `activeT` and `showProjectCard` from offset (and hides cards when offset ≥ CONTACT_THRESHOLD). |
| **ProjectOrb.tsx** | Sphere + optional card. `strength = 1 - |activeT - index|`; card shows when `showProjectCard && strength > STRENGTH_THRESHOLD`. Card is `<Html portal={portalRef}>` inside `<Billboard>` so it stays in a fixed viewport portal and faces the camera. |
| **ContactOverlay.tsx** | Renders only when offset ≥ CONTACT_THRESHOLD. Renders a fullscreen “Get in touch” block via `<Html portal={portalRef}>` with fixed positioning; opacity fades in over the contact range. |
| **ScrollPortalContext.tsx** | Creates a fixed, full-viewport div on `document.body` and provides its ref. All `<Html portal={portalRef}>` (project cards + contact) render into this div so overlays don’t scroll with the virtual scroll and stay correctly layered. |
| **useScrollOffset.ts** | Hook that returns current scroll offset and updates state in `useFrame` so components re-render when scroll changes (drei’s scroll object is mutated in place and doesn’t trigger React updates). |
| **orbPose.ts** | Ring layout: orb `i` of `n` at angle `(i/n)*2π`; positions on a circle in XZ with slight Y variation. |
| **TorusKnot.tsx** | Decorative mesh in the center; memoized, slow Y rotation. |

## Scroll math

- **Pages:** `PAGES = N + 1` (N project “stops” + 1 contact page). Total scroll height = `PAGES * 100vh`.
- **Project range:** For project-related logic (rotation, which card to show), we use a normalized offset so the last project still maps to index N−1 as scroll goes 0 → CONTACT_THRESHOLD:
  - `projectOffset(offset) = min(1, offset * PAGES / N)`  
  So when `offset ∈ [0, CONTACT_THRESHOLD]`, `projectOffset(offset) ∈ [0, 1]`.
- **Contact threshold:** `CONTACT_THRESHOLD = N / PAGES`. When `offset ≥ CONTACT_THRESHOLD` we’re in the contact zone; project cards are hidden and the scene moves up.

## Display T and “pause” (scrollPause.ts)

`scrollOffsetToDisplayT(offset, n)` turns a continuous 0..1 offset into a continuous “display index” 0..n−1. Each project gets a segment of length `1/n`. Within each segment we want a **pause** in the middle so the scene holds on that orb while the user scrolls:

- Start of segment: ramp from previous orb to current.
- Middle: hold at current orb (pause).
- End of segment: ramp to next orb.

So the rotation doesn’t jump; it eases in, holds, then eases out. The last segment (`i >= n - 1`) always returns `n - 1` so there’s no jump back when entering the final segment.

## Why the scroll portal

`ScrollControls` creates an invisible scrollable div; the 3D canvas is a sibling. If we rendered `<Html>` without a portal, the card DOM would be inside that scroll div and would move with the virtual scroll. By rendering into a **fixed viewport portal** (a div with `position: fixed; inset: 0` on `document.body`), the cards and contact overlay stay fixed on screen and only their visibility/content change with scroll. The Rig moves the 3D scene; the overlays stay put.

## Changing behavior

- **Number of projects:** Edit `src/content/projects.ts`. `N`, `PAGES`, and `CONTACT_THRESHOLD` are derived in `sceneConstants.ts`.
- **Pause feel:** Adjust `PAUSE_HALF` in `scrollPause.ts` (larger = longer hold per orb).
- **Scene scroll-off distance:** Change `SCENE_OFF_Y` in `Rig.tsx` (positive = scene moves up).
- **Contact content:** Edit `ContactOverlay.tsx` (copy and mailto link).
