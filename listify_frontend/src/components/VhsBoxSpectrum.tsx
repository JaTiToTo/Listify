import { useId, useMemo } from "react";
import PixelGrid from "../lib/pixelGradient/PixelGrid";
import { createPixelGrid } from "../lib/pixelGradient/grid";
import { RGB } from "../lib/pixelGradient/gradient";

const COLOR_STOPS: readonly RGB[] = [
  [13, 26, 30],
  [22, 58, 74],
  [51, 135, 185],
  [40, 120, 90],
  [36, 184, 31],
] as const;

interface VhsBoxSpectrumProps {
  className?: string;

  /** Width in pixels. Height scales automatically. */
  width?: number;

  /** Large title at the top */
  title?: string;
  titleFontSize?: number;

  /** Green sticker text */
  label?: string;

  /** Bottom handwritten text */
  duration?: string;

  footerLeft?: string;
  footerRight?: string;
}

export default function VhsBoxSpectrum({
  className = "",
  width = 300,
  title = "Mixtape",
  label = "AUTO MIX",
  titleFontSize = 38,
  duration = "60m",
  footerLeft = "STEREO",
  footerRight = "PLAYLIST GENERATOR",
}: VhsBoxSpectrumProps) {
  const VIEWBOX_HEIGHT = 420;
  const VIEWBOX_WIDTH = 260;
  const titleMaxWidth = VIEWBOX_WIDTH - 50; // padding on each side

  const height = width * (VIEWBOX_HEIGHT / VIEWBOX_WIDTH);

  const cols = 24;
  const rows = 40;

  const cellW = 240 / cols;
  const cellH = 360 / rows;

  const clipId = useId();

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
      const yBase = 110 + i * 10;

      let d = `M 24 ${yBase}`;

      for (let px = 24; px <= 230; px += 8) {
        const amp = 4 + Math.sin(px / 12 + i) * 3;

        d += ` L ${px} ${yBase + Math.sin(px / 10 + i * 2) * amp}`;
      }

      return {
        d,
        opacity: 0.55 - i * 0.12,
      };
    });
  }, []);

  return (
    <svg
      className={className}
      width={width}
      height={height}
      viewBox={`0 0 ${VIEWBOX_WIDTH} ${VIEWBOX_HEIGHT}`}
      role="img"
      aria-label={`${title} cassette cover`}
    >
      {/* Outer sleeve */}
      <rect
        x="0"
        y="0"
        width={VIEWBOX_WIDTH}
        height={VIEWBOX_HEIGHT}
        rx="8"
        fill="#f3ede0"
      />
      {/* Artwork */}
      <rect x="10" y="10" width="240" height="360" fill="#0d1a1e" />
      <clipPath id={clipId}>
        <rect x="10" y="10" width="240" height="360" />
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
            strokeWidth={1.2}
            fill="none"
          />
        ))}
      </g>
      {/* Folded corner */}
      <polygon points="250,10 250,80 218,10" fill="#1e1e1e" />

      {/* Main title */}
      <text
        x="25"
        y="60"
        textLength={titleMaxWidth}
        lengthAdjust="spacingAndGlyphs"
        fontSize={titleFontSize}
        fontWeight="800"
        fontStyle="italic"
        fill="#f3ede0"
        fontFamily="Georgia, serif"
      >
        {title}
      </text>

      <text
        x="27"
        y="60"
        textLength={titleMaxWidth}
        lengthAdjust="spacingAndGlyphs"
        fontSize={titleFontSize}
        fontWeight="800"
        fontStyle="italic"
        fill="none"
        stroke="#1e1e1e"
        strokeWidth="0.8"
        fontFamily="Georgia, serif"
      >
        {title}
      </text>

      {/* Sticker */}
      <rect x="24" y="72" width="150" height="30" fill="#24b81f" />
      <text
        x="34"
        y="93"
        fontSize="18"
        fontWeight="800"
        fill="#0d1a1e"
        fontFamily="Arial Black, sans-serif"
      >
        {label}
      </text>

      {/* Bottom strip */}
      <rect x="10" y="370" width="240" height="40" fill="#3387b9" />
      <rect x="10" y="370" width="82" height="40" fill="#0d1a1e" />
      <text x="26" y="394" fontSize="12" fontWeight="700" fill="#f3ede0">
        {footerLeft}
      </text>
      <text
        x="238"
        y="394"
        textAnchor="end"
        fontSize="10"
        fontWeight="700"
        fill="#0d1a1e"
      >
        {footerRight}
      </text>
      {/* Handwritten duration */}
      <text
        x="175"
        y="340"
        textAnchor="middle"
        fontSize="46"
        fontWeight="800"
        fontStyle="italic"
        fill="#c94f2e"
        fontFamily="Georgia, serif"
        transform="rotate(-6 175 340)"
      >
        {duration}
      </text>
    </svg>
  );
}
