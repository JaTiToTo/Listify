import { useMemo } from "react";

const COLOR_STOPS: [number, number, number][] = [
  [13, 26, 30],
  [22, 58, 74],
  [51, 135, 185],
  [40, 120, 90],
  [36, 184, 31],
];

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

function colorAt(t: number): string {
  t = Math.max(0, Math.min(1, t));
  const seg = t * (COLOR_STOPS.length - 1);
  let i = Math.floor(seg);
  let f = seg - i;
  if (i >= COLOR_STOPS.length - 1) {
    i = COLOR_STOPS.length - 2;
    f = 1;
  }
  const [r1, g1, b1] = COLOR_STOPS[i];
  const [r2, g2, b2] = COLOR_STOPS[i + 1];
  return `rgb(${Math.round(lerp(r1, r2, f))},${Math.round(lerp(g1, g2, f))},${Math.round(lerp(b1, b2, f))})`;
}

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

  const cells = useMemo(() => {
    const out: { x: number; y: number; t: number }[] = [];
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        const diag = (x / cols) * 0.5 + (y / rows) * 0.5;
        const noise = (((x * 7 + y * 13) % 5) / 5) * 0.06 - 0.03;
        out.push({ x, y, t: diag + noise });
      }
    }
    return out;
  }, [cols, rows]);

  const waves = useMemo(() => {
    return [0, 1, 2].map((i) => {
      const yBase = size * 0.42 + i * (size * 0.08);
      let d = `M 0 ${yBase}`;
      for (let px = 0; px <= size; px += 6) {
        const amp = size * 0.03 + Math.sin(px / 12 + i) * (size * 0.02);
        d += ` L ${px} ${yBase + Math.sin(px / 10 + i * 2) * amp}`;
      }
      return { d, opacity: 0.55 - i * 0.12 };
    });
  }, [size]);

  const clipId = useMemo(
    () => `gwc-clip-${Math.random().toString(36).slice(2, 9)}`,
    []
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
        <circle cx={r} cy={r} r={r - 1} fill="none" stroke={ringColor} strokeWidth={2} />
      )}
      <clipPath id={clipId}>
        <circle cx={r} cy={r} r={ring ? r - 4 : r} />
      </clipPath>
      <g clipPath={`url(#${clipId})`}>
        {cells.map(({ x, y, t }, i) => (
          <rect
            key={i}
            x={x * cellW}
            y={y * cellH}
            width={cellW + 0.5}
            height={cellH + 0.5}
            fill={colorAt(t)}
          />
        ))}
        {waves.map((w, i) => (
          <path
            key={i}
            d={w.d}
            stroke="#f3ede0"
            strokeOpacity={w.opacity}
            strokeWidth={1.4}
            fill="none"
          />
        ))}
      </g>
    </svg>
  );
}