import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";

export const ThreeDText: React.FC<{
  text?: string;
  color?: string;
  depth?: number;
  delay?: number;
}> = ({ text = "DEPTH", color = "#6429cd", depth = 8, delay = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const delayFrames = Math.round(delay * fps);

  const enter = spring({ frame: frame - delayFrames, fps, config: { damping: 14, stiffness: 100 } });
  const depthAnim = spring({ frame: frame - delayFrames - 5, fps, config: { damping: 14, stiffness: 100 } });

  const currentDepth = Math.round(interpolate(depthAnim, [0, 1], [0, depth]));

  const shadows = Array.from({ length: currentDepth })
    .map((_, i) => {
      const shade = interpolate(i, [0, depth], [0.3, 0.7]);
      return `${i + 1}px ${i + 1}px 0px rgba(0,0,0,${shade})`;
    })
    .join(", ");

  return (
    <div
      style={{
        fontFamily: "Inter, sans-serif",
        fontSize: 72,
        fontWeight: 900,
        color,
        textShadow: shadows || "none",
        letterSpacing: 4,
        transform: `scale(${interpolate(enter, [0, 1], [0.8, 1])}) translateY(${interpolate(enter, [0, 1], [20, 0])}px)`,
        opacity: interpolate(enter, [0, 0.2], [0, 1]),
      }}
    >
      {text}
    </div>
  );
};
