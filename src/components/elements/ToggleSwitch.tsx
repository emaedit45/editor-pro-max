import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";

export const ToggleSwitch: React.FC<{
  label?: string;
  onColor?: string;
  delay?: number;
}> = ({ label = "Enable notifications", onColor = "#6429cd", delay = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const delayFrames = Math.round(delay * fps);

  const toggle = spring({
    frame: frame - delayFrames,
    fps,
    config: { damping: 14, stiffness: 100 },
  });

  const thumbX = interpolate(toggle, [0, 1], [2, 26]);
  const bgColor = interpolate(toggle, [0, 1], [0, 1]);
  const bg = bgColor > 0.5 ? onColor : "#ccc";

  const scale = spring({
    frame: frame - delayFrames + 5,
    fps,
    config: { damping: 14, stiffness: 100 },
  });

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, opacity: interpolate(toggle, [0, 0.1], [0, 1]) }}>
      <div
        style={{
          width: 52,
          height: 28,
          borderRadius: 14,
          backgroundColor: bg,
          position: "relative",
          transition: "background 0.2s",
          transform: `scale(${interpolate(scale, [0, 1], [0.8, 1])})`,
        }}
      >
        <div
          style={{
            width: 24,
            height: 24,
            borderRadius: 12,
            backgroundColor: "#fff",
            position: "absolute",
            top: 2,
            left: thumbX,
            boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
          }}
        />
      </div>
      {label && (
        <span style={{ fontFamily: "Inter, sans-serif", fontSize: 18, color: "#333", fontWeight: 500 }}>
          {label}
        </span>
      )}
    </div>
  );
};
