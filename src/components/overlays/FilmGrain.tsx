import React from "react";
import {AbsoluteFill, useCurrentFrame} from "remotion";

export interface FilmGrainProps {
  /** Grain intensity: 0.03-0.05 subtle, 0.06-0.10 visible, 0.12+ stylized */
  opacity?: number;
  /** Grain size: higher = finer. 0.5-0.8 for film, 0.9+ for digital noise */
  baseFrequency?: number;
  /** Texture complexity: 2-4. Higher = more natural */
  numOctaves?: number;
  /** Blend mode: 'overlay' for balanced, 'soft-light' for subtle, 'multiply' for dark */
  blendMode?: React.CSSProperties["mixBlendMode"];
  /** Animate grain per frame (true) or static (false) */
  animated?: boolean;
}

/**
 * Cinematic film grain overlay using SVG feTurbulence.
 * Changing seed per frame creates animated grain like real film stock.
 * Place as the LAST layer in AbsoluteFill for proper compositing.
 */
export const FilmGrain: React.FC<FilmGrainProps> = ({
  opacity = 0.06,
  baseFrequency = 0.65,
  numOctaves = 3,
  blendMode = "overlay",
  animated = true,
}) => {
  const frame = useCurrentFrame();
  const seed = animated ? frame : 0;

  return (
    <AbsoluteFill
      style={{
        pointerEvents: "none",
        mixBlendMode: blendMode,
        opacity,
        zIndex: 999,
      }}
    >
      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <filter id={`grain-${seed}`}>
          <feTurbulence
            type="fractalNoise"
            baseFrequency={baseFrequency}
            numOctaves={numOctaves}
            seed={seed}
            stitchTiles="stitch"
          />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect
          width="100%"
          height="100%"
          filter={`url(#grain-${seed})`}
        />
      </svg>
    </AbsoluteFill>
  );
};
