import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";

export const TooltipPopover: React.FC<{
  text?: string;
  direction?: "top" | "bottom";
  delay?: number;
}> = ({ text = "Click here to continue", direction = "top", delay = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const delayFrames = Math.round(delay * fps);

  const pop = spring({ frame: frame - delayFrames, fps, config: { damping: 14, stiffness: 100 } });
  const isTop = direction === "top";
  const arrowY = isTop ? "100%" : "-8px";
  const originY = isTop ? "bottom" : "top";

  return (
    <div style={{ position: "relative", display: "inline-block" }}>
      <div
        style={{
          backgroundColor: "#1e1e2e",
          color: "#fff",
          padding: "10px 18px",
          borderRadius: 10,
          fontSize: 14,
          fontFamily: "Inter, sans-serif",
          fontWeight: 500,
          whiteSpace: "nowrap",
          boxShadow: "0 8px 24px rgba(0,0,0,0.25)",
          transform: `scale(${interpolate(pop, [0, 1], [0.6, 1])})`,
          transformOrigin: `center ${originY}`,
          opacity: interpolate(pop, [0, 0.3], [0, 1]),
        }}
      >
        {text}
        <div
          style={{
            position: "absolute",
            left: "50%",
            ...(isTop ? { top: arrowY } : { bottom: "100%" }),
            marginLeft: -6,
            width: 0,
            height: 0,
            borderLeft: "6px solid transparent",
            borderRight: "6px solid transparent",
            ...(isTop
              ? { borderTop: "8px solid #1e1e2e" }
              : { borderBottom: "8px solid #1e1e2e" }),
          }}
        />
      </div>
    </div>
  );
};
