import { useMemo } from "react";
import PixelGrid from "../..//lib/pixelGradient/PixelGrid";
import { createPixelGrid } from "../..//lib/pixelGradient/grid";
import { cornerMask, Corner } from "../../lib/pixelGradient/cornerMask";

const BACKGROUND_STOPS = [
  [247, 249, 239],
  [51, 135, 185],
  [36, 184, 31],
] as const;

interface Props {
  className?: string;
  cols?: number;
  rows?: number;
  opacity?: number;
  corner?: Corner;
}

export default function BackgroundPixelWash({
  className = "",
  cols = 24,
  rows = 14,
  opacity = 0.5,
  corner = "top-right",
}: Props) {
  const cells = useMemo(
    () =>
      createPixelGrid({
        cols,
        rows,
        noise: 0.05,
      }),
    [cols, rows],
  );

  return (
    <svg
      className={className}
      viewBox={`0 0 ${cols} ${rows}`}
      preserveAspectRatio="xMax yMin meet"
      aria-hidden="true"
    >
      <g opacity={opacity}>
        <PixelGrid
          cells={cells}
          cellWidth={1}
          cellHeight={1}
          gradient={BACKGROUND_STOPS}
        />
      </g>
    </svg>
  );
}
