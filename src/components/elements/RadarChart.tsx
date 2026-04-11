import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";

interface RadarChartProps {
  labels: string[];
  values: number[];
  maxValue?: number;
  color?: string;
  delay?: number;
}

export const RadarChart: React.FC<RadarChartProps> = ({
  labels,
  values,
  maxValue,
  color = "#6429cd",
  delay = 0,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const delayFrames = Math.round(delay * fps);
  const cfg = { damping: 14, stiffness: 100 };
  const max = maxValue ?? Math.max(...values);
  const n = labels.length;
  const cx = 250, cy = 250, r = 180;

  const angleFor = (i: number) => (Math.PI * 2 * i) / n - Math.PI / 2;
  const ptOnAxis = (i: number, frac: number) => ({
    x: cx + Math.cos(angleFor(i)) * r * frac,
    y: cy + Math.sin(angleFor(i)) * r * frac,
  });

  const axisProgress = spring({ frame: Math.max(0, frame - delayFrames), fps, config: cfg, durationInFrames: 40 });
  const fillProgress = spring({ frame: Math.max(0, frame - delayFrames - 15), fps, config: cfg, durationInFrames: 50 });

  const polyPoints = values
    .map((v, i) => {
      const f = (v / max) * fillProgress;
      const p = ptOnAxis(i, f);
      return `${p.x},${p.y}`;
    })
    .join(" ");

  const labelOpacity = interpolate(fillProgress, [0.3, 1], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <div style={{ width: 500, height: 500, position: "relative" }}>
      <svg width={500} height={500} viewBox="0 0 500 500">
        {/* Grid rings */}
        {[0.25, 0.5, 0.75, 1].map((frac, ri) => (
          <polygon
            key={ri}
            points={Array.from({ length: n }, (_, i) => { const p = ptOnAxis(i, frac * axisProgress); return `${p.x},${p.y}`; }).join(" ")}
            fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth={1}
          />
        ))}
        {/* Axes */}
        {Array.from({ length: n }, (_, i) => {
          const end = ptOnAxis(i, axisProgress);
          return <line key={i} x1={cx} y1={cy} x2={end.x} y2={end.y} stroke="rgba(255,255,255,0.15)" strokeWidth={1} />;
        })}
        {/* Data polygon */}
        <polygon points={polyPoints} fill={color} fillOpacity={0.3} stroke={color} strokeWidth={2.5} />
        {/* Dots */}
        {values.map((v, i) => {
          const f = (v / max) * fillProgress;
          const p = ptOnAxis(i, f);
          return <circle key={i} cx={p.x} cy={p.y} r={4} fill={color} opacity={fillProgress} />;
        })}
        {/* Labels */}
        {labels.map((label, i) => {
          const p = ptOnAxis(i, 1.18);
          return (
            <text key={i} x={p.x} y={p.y} textAnchor="middle" dominantBaseline="middle"
              fill="rgba(255,255,255,0.8)" fontSize={13} fontFamily="Inter, system-ui, sans-serif"
              fontWeight={500} opacity={labelOpacity}>
              {label}
            </text>
          );
        })}
      </svg>
    </div>
  );
};

export default RadarChart;
