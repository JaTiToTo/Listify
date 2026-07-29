import { useMemo } from "react";
import PixelGrid from "../../lib/pixelGradient/PixelGrid";
import { createPixelGrid } from "../../lib/pixelGradient/grid";

const COLOR_STOPS = [
  [13, 26, 30],
  [22, 58, 74],
  [51, 135, 185],
  [40, 120, 90],
  [36, 184, 31],
] as const;

interface GradientWaveCircleLogoProps {
  className?: string;
  size?: number;
  ring?: boolean;
  ringColor?: string;
}

export default function GradientWaveCircleLogo({
  className = "",
  size = 200,
  ring = false,
  ringColor = "#1e1e1e",
}: GradientWaveCircleLogoProps) {
  const cols = 20;
  const rows = 20;

  const cellW = size / cols;
  const cellH = size / rows;

  const cells = useMemo(
    () =>
      createPixelGrid({
        cols,
        rows,
        noise: 0.06,
      }),
    [],
  );

  const waves = useMemo(() => {
    return [0, 1, 2].map((i) => {
      const yBase = size * 0.42 + i * (size * 0.08);

      let d = `M 0 ${yBase}`;

      for (let px = 0; px <= size; px += 6) {
        const amp = size * 0.03 + Math.sin(px / 12 + i) * (size * 0.02);

        d += ` L ${px} ${yBase + Math.sin(px / 10 + i * 2) * amp}`;
      }

      return {
        d,
        opacity: 0.55 - i * 0.12,
      };
    });
  }, [size]);

  const clipId = useMemo(
    () => `gwc-${Math.random().toString(36).slice(2, 9)}`,
    [],
  );

  const r = size / 2;

  return (
    <svg
      viewBox={`0 0 ${size} ${size}`}
      width={size}
      height={size}
      className={className}
      role="img"
      aria-label="Gradient waveform badge"
    >
      {ring && (
        <circle
          cx={r}
          cy={r}
          r={r - 1}
          fill="none"
          stroke={ringColor}
          strokeWidth={2}
        />
      )}

      <clipPath id={clipId}>
        <circle cx={r} cy={r} r={ring ? r - 4 : r} />
      </clipPath>

      <g clipPath={`url(#${clipId})`}>
        <PixelGrid
          cells={cells}
          cellWidth={cellW}
          cellHeight={cellH}
          gradient={COLOR_STOPS}
        />

        {waves.map((wave, i) => (
          <path
            key={i}
            d={wave.d}
            stroke="#f3ede0"
            strokeOpacity={wave.opacity}
            strokeWidth={1.4}
            fill="none"
          />
        ))}
      </g>
    </svg>
  );
}
