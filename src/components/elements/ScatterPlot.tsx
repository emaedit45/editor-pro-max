import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";

interface Point {
  x: number;
  y: number;
}

interface ScatterPlotProps {
  points: Point[];
  dotColor?: string;
  delay?: number;
}

export const ScatterPlot: React.FC<ScatterPlotProps> = ({
  points,
  dotColor = "#6429cd",
  delay = 0,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const delayFrames = Math.round(delay * fps);
  const cfg = { damping: 14, stiffness: 100 };
  const width = 500, height = 400;
  const pad = { top: 20, right: 20, bottom: 40, left: 50 };
  const chartW = width - pad.left - pad.right;
  const chartH = height - pad.top - pad.bottom;

  const minX = Math.min(...points.map((p) => p.x)), maxX = Math.max(...points.map((p) => p.x));
  const minY = Math.min(...points.map((p) => p.y)), maxY = Math.max(...points.map((p) => p.y));
  const rangeX = maxX - minX || 1, rangeY = maxY - minY || 1;

  const axisProgress = spring({ frame: Math.max(0, frame - delayFrames), fps, config: cfg, durationInFrames: 30 });

  return (
    <div style={{ width, height, position: "relative" }}>
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
        {/* Grid */}
        {[0, 0.25, 0.5, 0.75, 1].map((f, i) => (
          <React.Fragment key={i}>
            <line x1={pad.left} y1={pad.top + chartH * (1 - f)} x2={pad.left + chartW * axisProgress} y2={pad.top + chartH * (1 - f)} stroke="rgba(255,255,255,0.06)" strokeWidth={1} />
            <line x1={pad.left + chartW * f} y1={pad.top + chartH} x2={pad.left + chartW * f} y2={pad.top + chartH * (1 - axisProgress)} stroke="rgba(255,255,255,0.06)" strokeWidth={1} />
          </React.Fragment>
        ))}
        {/* Axes */}
        <line x1={pad.left} y1={pad.top} x2={pad.left} y2={pad.top + chartH} stroke="rgba(255,255,255,0.2)" strokeWidth={1.5} opacity={axisProgress} />
        <line x1={pad.left} y1={pad.top + chartH} x2={pad.left + chartW} y2={pad.top + chartH} stroke="rgba(255,255,255,0.2)" strokeWidth={1.5} opacity={axisProgress} />
        {/* Points */}
        {points.map((pt, i) => {
          const progress = spring({
            frame: Math.max(0, frame - delayFrames - 10 - i * 3),
            fps, config: cfg, durationInFrames: 40,
          });
          const px = pad.left + ((pt.x - minX) / rangeX) * chartW;
          const py = pad.top + chartH * (1 - (pt.y - minY) / rangeY);
          const scale = interpolate(progress, [0, 1], [0, 1], { extrapolateRight: "clamp" });

          return (
            <g key={i} transform={`translate(${px},${py}) scale(${scale})`}>
              <circle cx={0} cy={0} r={6} fill={dotColor} opacity={0.8} />
              <circle cx={0} cy={0} r={6} fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth={1.5} />
            </g>
          );
        })}
      </svg>
    </div>
  );
};

export default ScatterPlot;
