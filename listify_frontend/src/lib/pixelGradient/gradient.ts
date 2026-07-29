export type RGB = readonly [number, number, number];

export function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

export function gradientAt(stops: readonly RGB[], t: number) {

  t = Math.max(0, Math.min(1, t));

  const seg = t * (stops.length - 1);
  let i = Math.floor(seg);
  let f = seg - i;

  if (i >= stops.length - 1) {
    i = stops.length - 2;
    f = 1;
  }

  const [r1, g1, b1] = stops[i];
  const [r2, g2, b2] = stops[i + 1];

  return `rgb(${Math.round(lerp(r1, r2, f))},${Math.round(
    lerp(g1, g2, f)
  )},${Math.round(lerp(b1, b2, f))})`;
}