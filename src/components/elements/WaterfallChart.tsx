import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";

interface WaterfallStep {
  label: string;
  value: number;
}

interface WaterfallChartProps {
  steps: WaterfallStep[];
  positiveColor?: string;
  negativeColor?: string;
  delay?: number;
}

export const WaterfallChart: React.FC<WaterfallChartProps> = ({
  steps,
  positiveColor = "#6429cd",
  negativeColor = "#ff6b35",
  delay = 0,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const delayFrames = Math.round(delay * fps);
  const cfg = { damping: 14, stiffness: 100 };
  const width = 500, height = 300;
  const pad = { top: 30, right: 20, bottom: 50, left: 60 };
  const chartW = width - pad.left - pad.right;
  const chartH = height - pad.top - pad.bottom;

  // Compute running totals
  let running = 0;
  const cumulative = steps.map((s) => { const start = running; running += s.value; return { start, end: running, ...s }; });
  const allVals = cumulative.flatMap((c) => [c.start, c.end]);
  const minV = Math.min(0, ...allVals), maxV = Math.max(...allVals);
  const range = maxV - minV || 1;
  const toY = (v: number) => pad.top + chartH * (1 - (v - minV) / range);
  const barW = chartW / steps.length - 8;

  return (
    <div style={{ width, height, position: "relative" }}>
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
        <line x1={pad.left} y1={toY(0)} x2={pad.left + chartW} y2={toY(0)} stroke="rgba(255,255,255,0.2)" strokeWidth={1} />
        {cumulative.map((step, i) => {
          const progress = spring({ frame: Math.max(0, frame - delayFrames - i * 6), fps, config: cfg, durationInFrames: 45 });
          const x = pad.left + i * (chartW / steps.length) + 4;
          const y1 = toY(step.start), y2 = toY(step.end);
          const barH = Math.abs(y2 - y1) * progress;
          const color = step.value >= 0 ? positiveColor : negativeColor;
          const labelOp = interpolate(progress, [0.5, 1], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

          return (
            <g key={i}>
              <rect x={x} y={step.value >= 0 ? y2 + (y1 - y2) * (1 - progress) : y1} width={barW} height={barH} rx={3} fill={color} opacity={0.9} />
              {i < cumulative.length - 1 && (
                <line x1={x + barW} y1={toY(step.end)} x2={x + barW + 8} y2={toY(step.end)} stroke="rgba(255,255,255,0.2)" strokeWidth={1} strokeDasharray="3 2" opacity={progress} />
              )}
              <text x={x + barW / 2} y={pad.top + chartH + 25} textAnchor="middle" fill="rgba(255,255,255,0.7)" fontSize={12} fontFamily="Inter, system-ui, sans-serif" opacity={labelOp}>
                {step.label}
              </text>
              <text x={x + barW / 2} y={Math.min(y1, y2) - 8} textAnchor="middle" fill="#fff" fontSize={13} fontWeight={700} fontFamily="Inter, system-ui, sans-serif" opacity={labelOp}>
                {step.value > 0 ? "+" : ""}{Math.round(step.value * progress)}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};

export default WaterfallChart;
