import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";

const COLORS = ["#6429cd", "#ff6b35", "#2d9cdb", "#27ae60", "#e74c3c", "#f39c12"];

export const AvatarStack: React.FC<{
  count?: number;
  maxVisible?: number;
  size?: number;
  delay?: number;
}> = ({ count = 8, maxVisible = 4, size = 48, delay = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const delayFrames = Math.round(delay * fps);
  const overflow = count - maxVisible;

  return (
    <div style={{ display: "flex", alignItems: "center" }}>
      {Array.from({ length: maxVisible }).map((_, i) => {
        const pop = spring({
          frame: frame - delayFrames - i * 5,
          fps,
          config: { damping: 14, stiffness: 100 },
        });
        return (
          <div
            key={i}
            style={{
              width: size,
              height: size,
              borderRadius: size / 2,
              backgroundColor: COLORS[i % COLORS.length],
              border: "3px solid #fff",
              marginLeft: i > 0 ? -size * 0.3 : 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              fontSize: size * 0.4,
              fontWeight: 700,
              fontFamily: "Inter, sans-serif",
              transform: `scale(${interpolate(pop, [0, 1], [0, 1])})`,
              zIndex: maxVisible - i,
              position: "relative",
            }}
          >
            {String.fromCharCode(65 + i)}
          </div>
        );
      })}
      {overflow > 0 && (
        <div
          style={{
            width: size,
            height: size,
            borderRadius: size / 2,
            backgroundColor: "#e0e0e0",
            border: "3px solid #fff",
            marginLeft: -size * 0.3,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: size * 0.32,
            fontWeight: 700,
            color: "#555",
            fontFamily: "Inter, sans-serif",
            transform: `scale(${interpolate(spring({ frame: frame - delayFrames - maxVisible * 5, fps, config: { damping: 14, stiffness: 100 } }), [0, 1], [0, 1])})`,
          }}
        >
          +{overflow}
        </div>
      )}
    </div>
  );
};
