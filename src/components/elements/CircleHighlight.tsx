import React from "react";
import {
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from "remotion";

interface CircleHighlightProps {
  size?: number;
  color?: string;
  strokeWidth?: number;
  delay?: number;
}

export const CircleHighlight: React.FC<CircleHighlightProps> = ({
  size = 200,
  color = "#ff6b35",
  strokeWidth = 3,
  delay = 0,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const delayFrames = Math.round(delay * fps);
  const adjustedFrame = Math.max(0, frame - delayFrames);

  const cx = size / 2 + strokeWidth;
  const cy = size / 2 + strokeWidth;
  const viewSize = size + strokeWidth * 2;

  // Hand-drawn style: use an elliptical path with slight irregularities
  // Create a wobbly circle using cubic bezier curves
  const r = size / 2;
  const wobble = r * 0.06; // slight hand-drawn imperfection

  const pathD = [
    `M ${cx} ${cy - r + wobble}`,
    `C ${cx + r * 0.55 + wobble} ${cy - r - wobble * 0.5},`,
    `  ${cx + r + wobble * 0.8} ${cy - r * 0.55 + wobble},`,
    `  ${cx + r - wobble * 0.3} ${cy + wobble * 0.5}`,
    `C ${cx + r + wobble * 0.5} ${cy + r * 0.55 - wobble},`,
    `  ${cx + r * 0.55 - wobble} ${cy + r + wobble * 0.7},`,
    `  ${cx + wobble * 0.4} ${cy + r - wobble * 0.2}`,
    `C ${cx - r * 0.55 + wobble * 0.3} ${cy + r + wobble * 0.4},`,
    `  ${cx - r - wobble * 0.6} ${cy + r * 0.55 + wobble},`,
    `  ${cx - r + wobble * 0.5} ${cy - wobble * 0.3}`,
    `C ${cx - r - wobble * 0.4} ${cy - r * 0.55 - wobble * 0.5},`,
    `  ${cx - r * 0.55 - wobble * 0.2} ${cy - r + wobble * 0.6},`,
    `  ${cx} ${cy - r + wobble}`,
  ].join(" ");

  // Approximate circumference
  const circumference = Math.PI * size * 1.02;

  // Draw animation
  const drawProgress = interpolate(adjustedFrame, [0, 28], [0, 1], {
    extrapolateRight: "clamp",
  });
  const dashOffset = circumference * (1 - drawProgress);

  // Glow pulse after drawn
  const glowPulse = spring({
    frame: adjustedFrame - 30,
    fps,
    config: { damping: 14, stiffness: 100 },
  });
  const glowOpacity = interpolate(glowPulse, [0, 1], [0, 0.3]);

  return (
    <div
      style={{
        width: viewSize,
        height: viewSize,
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <svg
        viewBox={`0 0 ${viewSize} ${viewSize}`}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          overflow: "visible",
        }}
      >
        {/* Glow */}
        <path
          d={pathD}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth + 8}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          opacity={glowOpacity}
        />

        {/* Main stroke */}
        <path
          d={pathD}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
        />

        {/* Thinner overlay for hand-drawn texture */}
        <path
          d={pathD}
          fill="none"
          stroke="#ffffff"
          strokeWidth={strokeWidth * 0.3}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          opacity={0.15}
        />
      </svg>
    </div>
  );
};

export default CircleHighlight;
