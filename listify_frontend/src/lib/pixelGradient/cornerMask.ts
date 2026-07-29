export type Corner =
  | "top-left"
  | "top-right"
  | "bottom-left"
  | "bottom-right";

export function cornerMask(
  x: number,
  y: number,
  cols: number,
  rows: number,
  corner: Corner
) {
  const xNorm = corner.includes("right") ? x / cols : 1 - x / cols;
  const yNorm = corner.includes("top") ? y / rows : 1 - y / rows;

  const distFromCorner = xNorm * 0.6 + (1 - yNorm) * 0.4;

  return distFromCorner >= 0.35;
}