export interface PixelCell {
  x: number;
  y: number;
  t: number;
}

interface CreatePixelGridOptions {
  cols: number;
  rows: number;
  noise?: number;
  filter?: (x: number, y: number) => boolean;
}

export function createPixelGrid({
  cols,
  rows,
  noise = 0.05,
  filter,
}: CreatePixelGridOptions): PixelCell[] {
  const out: PixelCell[] = [];

  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      if (filter && !filter(x, y)) continue;

      const diag = (x / cols + y / rows) * 0.5;
      const n = (((x * 7 + y * 13) % 5) / 5) * noise - noise / 2;

      out.push({
        x,
        y,
        t: diag + n,
      });
    }
  }

  return out;
}