import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";

export const SliderControl: React.FC<{
  targetValue?: number;
  max?: number;
  label?: string;
  color?: string;
  delay?: number;
}> = ({ targetValue = 75, max = 100, label = "Volume", color = "#6429cd", delay = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const delayFrames = Math.round(delay * fps);

  const progress = spring({
    frame: frame - delayFrames,
    fps,
    config: { damping: 14, stiffness: 100 },
  });

  const pct = interpolate(progress, [0, 1], [0, targetValue / max]) * 100;
  const displayVal = Math.round(interpolate(progress, [0, 1], [0, targetValue]));

  const enter = spring({ frame: frame - delayFrames, fps, config: { damping: 14, stiffness: 100 } });

  return (
    <div style={{ width: 300, opacity: interpolate(enter, [0, 0.2], [0, 1]), fontFamily: "Inter, sans-serif" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
        <span style={{ fontSize: 16, fontWeight: 600, color: "#333" }}>{label}</span>
        <span style={{ fontSize: 16, fontWeight: 700, color }}>{displayVal}</span>
      </div>
      <div style={{ width: "100%", height: 8, borderRadius: 4, backgroundColor: "#e0e0e0", position: "relative" }}>
        <div style={{ width: `${pct}%`, height: "100%", borderRadius: 4, backgroundColor: color }} />
        <div
          style={{
            width: 20,
            height: 20,
            borderRadius: 10,
            backgroundColor: color,
            position: "absolute",
            top: -6,
            left: `${pct}%`,
            transform: "translateX(-10px)",
            boxShadow: "0 2px 6px rgba(0,0,0,0.25)",
          }}
        />
      </div>
    </div>
  );
};
