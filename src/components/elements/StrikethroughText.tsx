import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";

export const StrikethroughText: React.FC<{
  originalText?: string;
  newText?: string;
  lineColor?: string;
  delay?: number;
}> = ({ originalText = "Expensive", newText = "Affordable", lineColor = "#ff6b35", delay = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const delayFrames = Math.round(delay * fps);

  const enter = spring({ frame: frame - delayFrames, fps, config: { damping: 14, stiffness: 100 } });
  const strike = spring({ frame: frame - delayFrames - 20, fps, config: { damping: 14, stiffness: 100 } });
  const reveal = spring({ frame: frame - delayFrames - 40, fps, config: { damping: 14, stiffness: 100 } });

  const strikeWidth = interpolate(strike, [0, 1], [0, 100]);

  return (
    <div
      style={{
        fontFamily: "Inter, sans-serif",
        display: "flex",
        alignItems: "center",
        gap: 20,
        opacity: interpolate(enter, [0, 0.3], [0, 1]),
        transform: `translateY(${interpolate(enter, [0, 1], [15, 0])}px)`,
      }}
    >
      <div style={{ position: "relative", display: "inline-block" }}>
        <span
          style={{
            fontSize: 36,
            fontWeight: 700,
            color: interpolate(strike, [0, 1], [0.2, 0.45]).toString().replace(/^0/, "") ? `rgba(30,30,46,${interpolate(strike, [0, 1], [1, 0.4])})` : "#1e1e2e",
          }}
        >
          {originalText}
        </span>
        <div
          style={{
            position: "absolute",
            top: "52%",
            left: 0,
            width: `${strikeWidth}%`,
            height: 4,
            backgroundColor: lineColor,
            borderRadius: 2,
          }}
        />
      </div>
      <span
        style={{
          fontSize: 36,
          fontWeight: 800,
          color: "#6429cd",
          opacity: interpolate(reveal, [0, 1], [0, 1]),
          transform: `translateX(${interpolate(reveal, [0, 1], [-15, 0])}px)`,
        }}
      >
        {newText}
      </span>
    </div>
  );
};
