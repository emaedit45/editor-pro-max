import React from "react";
import {AbsoluteFill, useCurrentFrame, interpolate} from "remotion";

export interface ChromaticAberrationProps {
  /** Pixel offset for RGB split: 2-4 subtle, 6-10 visible, 12+ extreme */
  offset?: number;
  /** Animate the offset with subtle pulsing */
  animated?: boolean;
  /** Opacity of the effect */
  opacity?: number;
}

/**
 * Chromatic aberration (RGB split) overlay.
 * Creates that modern tech/glitch look by offsetting color channels.
 * Uses CSS box-shadow trick for performance.
 */
export const ChromaticAberration: React.FC<ChromaticAberrationProps> = ({
  offset = 3,
  animated = true,
  opacity = 0.4,
}) => {
  const frame = useCurrentFrame();

  const currentOffset = animated
    ? offset * interpolate(frame % 120, [0, 60, 120], [0.6, 1, 0.6])
    : offset;

  return (
    <AbsoluteFill
      style={{
        pointerEvents: "none",
        zIndex: 997,
      }}
    >
      {/* Red channel offset */}
      <AbsoluteFill
        style={{
          background: "transparent",
          boxShadow: `${currentOffset}px 0 0 rgba(255,0,0,${opacity}) inset, ${-currentOffset}px 0 0 rgba(255,0,0,${opacity}) inset`,
          mixBlendMode: "screen",
        }}
      />
      {/* Cyan channel offset (opposite direction) */}
      <AbsoluteFill
        style={{
          background: "transparent",
          boxShadow: `${-currentOffset}px 0 0 rgba(0,255,255,${opacity}) inset, ${currentOffset}px 0 0 rgba(0,255,255,${opacity}) inset`,
          mixBlendMode: "screen",
        }}
      />
    </AbsoluteFill>
  );
};
