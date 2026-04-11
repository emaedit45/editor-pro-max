import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";

const STATUS_COLORS = { success: "#27ae60", warning: "#f39c12", error: "#e74c3c" };

export const StatusBadge: React.FC<{
  text?: string;
  status?: "success" | "warning" | "error";
  delay?: number;
}> = ({ text = "Active", status = "success", delay = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const delayFrames = Math.round(delay * fps);

  const enter = spring({ frame: frame - delayFrames, fps, config: { damping: 14, stiffness: 100 } });
  const color = STATUS_COLORS[status];
  const pulsePhase = Math.sin(((frame - delayFrames) / fps) * Math.PI * 2) * 0.5 + 0.5;

  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        padding: "8px 18px",
        borderRadius: 20,
        backgroundColor: `${color}18`,
        border: `1.5px solid ${color}40`,
        transform: `scale(${interpolate(enter, [0, 1], [0, 1])})`,
        fontFamily: "Inter, sans-serif",
      }}
    >
      <div style={{ position: "relative", width: 10, height: 10 }}>
        <div
          style={{
            width: 10,
            height: 10,
            borderRadius: 5,
            backgroundColor: color,
            position: "absolute",
          }}
        />
        <div
          style={{
            width: 10,
            height: 10,
            borderRadius: 5,
            backgroundColor: color,
            position: "absolute",
            opacity: interpolate(pulsePhase, [0, 1], [0, 0.5]),
            transform: `scale(${interpolate(pulsePhase, [0, 1], [1, 2.2])})`,
          }}
        />
      </div>
      <span style={{ fontSize: 14, fontWeight: 600, color }}>{text}</span>
    </div>
  );
};
