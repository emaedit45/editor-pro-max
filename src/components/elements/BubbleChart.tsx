import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";

interface Bubble {
  label: string;
  size: number;
  color: string;
}

interface BubbleChartProps {
  bubbles: Bubble[];
  delay?: number;
}

// Simple deterministic layout using golden angle
const goldenAngle = Math.PI * (3 - Math.sqrt(5));

export const BubbleChart: React.FC<BubbleChartProps> = ({ bubbles, delay = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const delayFrames = Math.round(delay * fps);
  const cfg = { damping: 14, stiffness: 100 };
  const width = 500, height = 400;
  const cx = width / 2, cy = height / 2;
  const maxSize = Math.max(...bubbles.map((b) => b.size));

  const positions = bubbles.map((b, i) => {
    const angle = i * goldenAngle;
    const dist = 40 + i * 28;
    const r = 15 + (b.size / maxSize) * 45;
    return {
      x: cx + Math.cos(angle) * dist,
      y: cy + Math.sin(angle) * dist,
      r,
      ...b,
    };
  });

  return (
    <div style={{ width, height, position: "relative" }}>
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
        {positions.map((p, i) => {
          const progress = spring({
            frame: Math.max(0, frame - delayFrames - i * 5),
            fps, config: cfg, durationInFrames: 45,
          });
          const scale = interpolate(progress, [0, 1], [0, 1], { extrapolateRight: "clamp" });
          const labelOp = interpolate(progress, [0.6, 1], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

          return (
            <g key={i} transform={`translate(${p.x},${p.y}) scale(${scale})`}>
              <circle cx={0} cy={0} r={p.r} fill={p.color} opacity={0.85} />
              <circle cx={0} cy={0} r={p.r} fill="rgba(255,255,255,0.1)" />
              <text x={0} y={1} textAnchor="middle" dominantBaseline="middle"
                fill="#fff" fontSize={p.r > 30 ? 12 : 10} fontWeight={600}
                fontFamily="Inter, system-ui, sans-serif" opacity={labelOp}>
                {p.label}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};

export default BubbleChart;
