import { gradientAt, RGB } from "./gradient";
import { PixelCell } from "./grid";

interface PixelGridProps {
  cells: PixelCell[];
  cellWidth: number;
  cellHeight: number;
  gradient: readonly RGB[];
}

export default function PixelGrid({
  cells,
  cellWidth,
  cellHeight,
  gradient,
}: PixelGridProps) {
  return (
    <>
      {cells.map(({ x, y, t }, i) => (
        <rect
          key={i}
          x={x * cellWidth}
          y={y * cellHeight}
          width={cellWidth + 0.5}
          height={cellHeight + 0.5}
          fill={gradientAt(gradient, t)}
        />
      ))}
    </>
  );
}
