/**
 * Orbit in XZ plane (like reference: x = r*cos(angle), z = r*sin(angle) in their animate).
 * We use angle 0 = +Z (front toward camera). inclination tilts the ring out of XZ for decorative orbs.
 */
export function orbitPosition(
  angle: number,
  radius: number,
  inclination: number
): [number, number, number] {
  const x = Math.sin(angle) * radius;
  const z = Math.cos(angle) * radius;
  if (inclination === 0) {
    return [x, 0, z];
  }
  const y = -Math.cos(angle) * Math.sin(inclination) * radius;
  const zTilted = Math.cos(angle) * Math.cos(inclination) * radius;
  return [x, y, zTilted];
}

export function orbPose(
  i: number,
  n: number,
  radius = 6,
  inclination = 0
): { position: [number, number, number]; lookAt: [number, number, number] } {
  const a = (i / n) * Math.PI * 2;
  return {
    position: orbitPosition(a, radius, inclination),
    lookAt: [0, 0, 0],
  };
}
