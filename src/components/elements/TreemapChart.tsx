import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";

interface TreemapItem {
  label: string;
  value: number;
  color: string;
}

interface TreemapChartProps {
  data: TreemapItem[];
  delay?: number;
}

export const TreemapChart: React.FC<TreemapChartProps> = ({ data, delay = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const delayFrames = Math.round(delay * fps);
  const cfg = { damping: 14, stiffness: 100 };
  const width = 500, height = 300;
  const total = data.reduce((s, d) => s + d.value, 0);

  // Simple squarified-ish layout: horizontal slicing
  const rects: { x: number; y: number; w: number; h: number; item: TreemapItem; idx: number }[] = [];
  let x = 0;
  data.forEach((item, idx) => {
    const frac = item.value / total;
    const w = frac * width;
    rects.push({ x, y: 0, w, h: height, item, idx });
    x += w;
  });

  return (
    <div style={{ width, height, position: "relative", borderRadius: 8, overflow: "hidden" }}>
      {rects.map(({ x: rx, y: ry, w, h, item, idx }) => {
        const progress = spring({
          frame: Math.max(0, frame - delayFrames - idx * 6),
          fps, config: cfg, durationInFrames: 45,
        });
        const scale = interpolate(progress, [0, 1], [0, 1], { extrapolateRight: "clamp" });
        const opacity = interpolate(progress, [0.4, 1], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

        return (
          <div key={idx} style={{
            position: "absolute",
            left: rx + 1, top: ry + 1,
            width: w - 2, height: h - 2,
            backgroundColor: item.color,
            borderRadius: 4,
            transform: `scale(${scale})`,
            transformOrigin: "center center",
            display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center",
          }}>
            <span style={{
              color: "#fff", fontSize: 14, fontWeight: 700,
              fontFamily: "Inter, system-ui, sans-serif", opacity,
            }}>
              {item.label}
            </span>
            <span style={{
              color: "rgba(255,255,255,0.7)", fontSize: 12,
              fontFamily: "Inter, system-ui, sans-serif", opacity,
            }}>
              {item.value}
            </span>
          </div>
        );
      })}
    </div>
  );
};

export default TreemapChart;
