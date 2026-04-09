import React from "react";
import {
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from "remotion";

interface UnderlineSwooshProps {
  width?: number;
  color?: string;
  strokeWidth?: number;
  style?: "wavy" | "straight";
  delay?: number;
}

export const UnderlineSwoosh: React.FC<UnderlineSwooshProps> = ({
  width = 400,
  color = "#ff6b35",
  strokeWidth = 4,
  style: lineStyle = "wavy",
  delay = 0,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const delayFrames = Math.round(delay * fps);
  const adjustedFrame = Math.max(0, frame - delayFrames);

  const padding = 10;
  const viewWidth = width + padding * 2;
  const viewHeight = 40 + padding * 2;
  const cy = viewHeight / 2;

  // Build path
  let pathD: string;
  let pathLength: number;

  if (lineStyle === "wavy") {
    const waveCount = 4;
    const segmentWidth = width / waveCount;
    const amplitude = 8;
    let d = `M ${padding} ${cy}`;
    for (let i = 0; i < waveCount; i++) {
      const x0 = padding + i * segmentWidth;
      const x1 = x0 + segmentWidth;
      const cpOffset = segmentWidth * 0.4;
      const direction = i % 2 === 0 ? -1 : 1;
      d += ` C ${x0 + cpOffset} ${cy + direction * amplitude}, ${
        x1 - cpOffset
      } ${cy + direction * amplitude}, ${x1} ${cy}`;
    }
    pathD = d;
    // Approximate wavy path length
    pathLength = width * 1.15;
  } else {
    // Straight with subtle curve for organic feel
    pathD = `M ${padding} ${cy} Q ${padding + width * 0.5} ${
      cy - 3
    } ${padding + width} ${cy}`;
    pathLength = width * 1.01;
  }

  // Draw animation: fast swoosh from left to right
  const drawProgress = interpolate(adjustedFrame, [0, 18], [0, 1], {
    extrapolateRight: "clamp",
  });
  const dashOffset = pathLength * (1 - drawProgress);

  // Glow after drawn
  const glowProgress = spring({
    frame: adjustedFrame - 16,
    fps,
    config: { damping: 14, stiffness: 100 },
  });
  const glowOpacity = interpolate(glowProgress, [0, 1], [0, 0.35]);

  // Slight thickness variation for premium feel
  const thicknessBoost = interpolate(
    adjustedFrame,
    [8, 14],
    [0, strokeWidth * 0.3],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return (
    <svg
      viewBox={`0 0 ${viewWidth} ${viewHeight}`}
      style={{
        width: viewWidth,
        height: viewHeight,
        overflow: "visible",
      }}
    >
      {/* Glow layer */}
      <path
        d={pathD}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth + 10}
        strokeLinecap="round"
        strokeDasharray={pathLength}
        strokeDashoffset={dashOffset}
        opacity={glowOpacity}
      />

      {/* Main underline */}
      <path
        d={pathD}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth + thicknessBoost}
        strokeLinecap="round"
        strokeDasharray={pathLength}
        strokeDashoffset={dashOffset}
      />

      {/* Highlight overlay */}
      <path
        d={pathD}
        fill="none"
        stroke="#ffffff"
        strokeWidth={strokeWidth * 0.25}
        strokeLinecap="round"
        strokeDasharray={pathLength}
        strokeDashoffset={dashOffset}
        opacity={0.2}
      />
    </svg>
  );
};

export default UnderlineSwoosh;
