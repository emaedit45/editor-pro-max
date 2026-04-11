import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";

interface HeatCalendarProps {
  data: { value: number }[];
  colorScale?: string[];
  delay?: number;
}

const defaultScale = ["#161b22", "#0e4429", "#006d32", "#26a641", "#39d353"];

export const HeatCalendar: React.FC<HeatCalendarProps> = ({
  data,
  colorScale = defaultScale,
  delay = 0,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const delayFrames = Math.round(delay * fps);
  const cfg = { damping: 14, stiffness: 100 };

  const cols = 52, rows = 7;
  const cellSize = 14, gap = 3;
  const width = cols * (cellSize + gap) + 40;
  const height = rows * (cellSize + gap) + 20;
  const maxVal = Math.max(...data.map((d) => d.value), 1);

  const getColor = (value: number) => {
    if (value === 0) return colorScale[0];
    const idx = Math.min(
      colorScale.length - 1,
      Math.ceil((value / maxVal) * (colorScale.length - 1))
    );
    return colorScale[idx];
  };

  return (
    <div style={{ width, height, position: "relative" }}>
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
        {/* Day labels */}
        {["M", "W", "F"].map((d, i) => (
          <text key={d} x={12} y={15 + [1, 3, 5][i] * (cellSize + gap)}
            fill="rgba(255,255,255,0.4)" fontSize={10} textAnchor="middle"
            fontFamily="Inter, system-ui, sans-serif">
            {d}
          </text>
        ))}
        {/* Cells */}
        {data.slice(0, cols * rows).map((cell, i) => {
          const col = Math.floor(i / rows);
          const row = i % rows;
          const progress = spring({
            frame: Math.max(0, frame - delayFrames - col * 2),
            fps, config: cfg, durationInFrames: 30,
          });
          const scale = interpolate(progress, [0, 1], [0, 1], { extrapolateRight: "clamp" });
          const x = 28 + col * (cellSize + gap);
          const y = 5 + row * (cellSize + gap);
          const cx = x + cellSize / 2, cy = y + cellSize / 2;

          return (
            <rect key={i} x={cx - (cellSize / 2) * scale} y={cy - (cellSize / 2) * scale}
              width={cellSize * scale} height={cellSize * scale}
              rx={2} ry={2} fill={getColor(cell.value)} />
          );
        })}
      </svg>
    </div>
  );
};

export default HeatCalendar;
