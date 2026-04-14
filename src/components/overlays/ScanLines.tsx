import React from "react";
import {AbsoluteFill, useCurrentFrame} from "remotion";

export interface ScanLinesProps {
  /** Line spacing in px */
  spacing?: number;
  /** Line opacity: 0.03-0.06 subtle, 0.1+ visible */
  opacity?: number;
  /** Line color */
  color?: string;
  /** Animate scan lines scrolling */
  animated?: boolean;
  /** Scroll speed (px per frame) */
  speed?: number;
}

/**
 * CRT/retro scan lines overlay. Adds subtle horizontal lines.
 * Great for tech/hacker/cyberpunk aesthetics.
 */
export const ScanLines: React.FC<ScanLinesProps> = ({
  spacing = 4,
  opacity = 0.05,
  color = "0,0,0",
  animated = true,
  speed = 0.5,
}) => {
  const frame = useCurrentFrame();
  const offset = animated ? (frame * speed) % spacing : 0;

  return (
    <AbsoluteFill
      style={{
        pointerEvents: "none",
        backgroundImage: `repeating-linear-gradient(
          0deg,
          rgba(${color},${opacity}) 0px,
          rgba(${color},${opacity}) 1px,
          transparent 1px,
          transparent ${spacing}px
        )`,
        backgroundPosition: `0 ${offset}px`,
        zIndex: 996,
      }}
    />
  );
};
