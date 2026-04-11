import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";

export const LoadingSpinner: React.FC<{
  variant?: "circle" | "dots";
  color?: string;
  delay?: number;
}> = ({ variant = "circle", color = "#6429cd", delay = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const delayFrames = Math.round(delay * fps);

  const enter = spring({ frame: frame - delayFrames, fps, config: { damping: 14, stiffness: 100 } });
  const rotation = interpolate(frame - delayFrames, [0, 60], [0, 360], { extrapolateRight: "extend" });
  const pct = Math.min(100, Math.floor(interpolate(frame - delayFrames, [0, 90], [0, 100], { extrapolateRight: "clamp", extrapolateLeft: "clamp" })));

  if (variant === "dots") {
    return (
      <div style={{ display: "flex", gap: 10, alignItems: "center", opacity: interpolate(enter, [0, 0.3], [0, 1]) }}>
        {[0, 1, 2].map((i) => {
          const bounce = Math.sin(((frame - delayFrames + i * 8) / fps) * Math.PI * 3);
          return (
            <div
              key={i}
              style={{
                width: 14,
                height: 14,
                borderRadius: 7,
                backgroundColor: i === 1 ? "#ff6b35" : color,
                transform: `translateY(${bounce * -8}px) scale(${interpolate(enter, [0, 1], [0, 1])})`,
              }}
            />
          );
        })}
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12, opacity: interpolate(enter, [0, 0.3], [0, 1]) }}>
      <div
        style={{
          width: 48,
          height: 48,
          borderRadius: 24,
          border: `4px solid ${color}30`,
          borderTopColor: color,
          transform: `rotate(${rotation}deg) scale(${interpolate(enter, [0, 1], [0, 1])})`,
        }}
      />
      <span style={{ fontFamily: "Inter, sans-serif", fontSize: 14, fontWeight: 600, color }}>{pct}%</span>
    </div>
  );
};
