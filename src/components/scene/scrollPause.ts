/**
 * Maps raw scroll offset (0..1) to display T (0..n-1) with a "pause" in the
 * middle of each orb so the scene holds still while the user keeps scrolling.
 */
const PAUSE_HALF = 0.35;

export function scrollOffsetToDisplayT(offset: number, n: number): number {
  if (n <= 1) return 0;
  const segment = offset * n;
  const i = Math.floor(segment);
  const f = segment - i;
  const inStart = (1 - PAUSE_HALF) / 2;
  const inEnd = (1 + PAUSE_HALF) / 2;

  if (i === 0) {
    if (f < inEnd) return 0;
    return (f - inEnd) / (1 - inEnd);
  }
  if (i >= n - 1) return n - 1;
  if (f < inStart) return i;
  if (f < inEnd) return i;
  return i + (f - inEnd) / (1 - inEnd);
}
