import React from "react";
import { useCurrentFrame, useVideoConfig, spring } from "remotion";

interface AreaChartProps {
  dataPoints: number[];
  color?: string;
  showDots?: boolean;
  delay?: number;
}

export const AreaChart: React.FC<AreaChartProps> = ({
  dataPoints,
  color = "#6429cd",
  showDots = true,
  delay = 0,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const delayFrames = Math.round(delay * fps);
  const cfg = { damping: 14, stiffness: 100 };
  const width = 500, height = 300;
  const pad = { top: 20, right: 20, bottom: 30, left: 20 };
  const chartW = width - pad.left - pad.right;
  const chartH = height - pad.top - pad.bottom;
  const minV = Math.min(...dataPoints), maxV = Math.max(...dataPoints);
  const range = maxV - minV || 1;
  const n = dataPoints.length;

  const drawProgress = spring({ frame: Math.max(0, frame - delayFrames), fps, config: cfg, durationInFrames: 60 });

  const pts = dataPoints.map((v, i) => ({
    x: pad.left + (i / (n - 1)) * chartW,
    y: pad.top + chartH * (1 - (v - minV) / range),
  }));

  // Clip path to reveal left-to-right
  const clipX = pad.left + chartW * drawProgress;

  const linePath = pts.map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`).join(" ");
  const areaPath = linePath + ` L${pts[n - 1].x},${pad.top + chartH} L${pts[0].x},${pad.top + chartH} Z`;
  const gradId = "area-grad";

  return (
    <div style={{ width, height, position: "relative" }}>
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
        <defs>
          <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.4} />
            <stop offset="100%" stopColor={color} stopOpacity={0.02} />
          </linearGradient>
          <clipPath id="area-clip">
            <rect x={0} y={0} width={clipX} height={height} />
          </clipPath>
        </defs>
        {/* Grid lines */}
        {[0, 0.25, 0.5, 0.75, 1].map((f, i) => (
          <line key={i} x1={pad.left} y1={pad.top + chartH * (1 - f)} x2={pad.left + chartW} y2={pad.top + chartH * (1 - f)} stroke="rgba(255,255,255,0.07)" strokeWidth={1} />
        ))}
        <g clipPath="url(#area-clip)">
          <path d={areaPath} fill={`url(#${gradId})`} />
          <path d={linePath} fill="none" stroke={color} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
          {showDots && pts.map((p, i) => (
            <circle key={i} cx={p.x} cy={p.y} r={4} fill={color} stroke="#fff" strokeWidth={2} />
          ))}
        </g>
        {/* Baseline */}
        <line x1={pad.left} y1={pad.top + chartH} x2={pad.left + chartW} y2={pad.top + chartH} stroke="rgba(255,255,255,0.2)" strokeWidth={1} />
      </svg>
    </div>
  );
};

export default AreaChart;
