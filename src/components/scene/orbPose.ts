export function orbPose(
  i: number,
  n: number,
  radius = 6
): { position: [number, number, number]; lookAt: [number, number, number] } {
  const a = (i / n) * Math.PI * 2;
  return {
    position: [
      Math.sin(a) * radius,
      Math.sin(a) * 0.5,
      Math.cos(a) * radius,
    ] as [number, number, number],
    lookAt: [0, 0, 0],
  };
}
