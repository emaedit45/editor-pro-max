import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";

type Props = {
  direction?: "in" | "out";
  delay?: number;
};

const PinchZoom: React.FC<Props> = ({ direction = "out", delay = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const delayFrames = Math.round(delay * fps);
  const s = spring({ frame: frame - delayFrames, fps, config: { damping: 14, stiffness: 100 } });

  const spread = direction === "out"
    ? interpolate(s, [0, 1], [10, 60])
    : interpolate(s, [0, 1], [60, 10]);

  const contentScale = direction === "out"
    ? interpolate(s, [0, 1], [0.6, 1.2])
    : interpolate(s, [0, 1], [1.2, 0.6]);

  return (
    <div style={{ position: "relative", width: 300, height: 300, fontFamily: "sans-serif" }}>
      {/* Content square */}
      <div style={{
        position: "absolute", left: "50%", top: "50%",
        width: 100, height: 100, borderRadius: 12,
        background: "linear-gradient(135deg, #6429cd, #ff6b35)",
        transform: `translate(-50%,-50%) scale(${contentScale})`,
        opacity: s,
      }} />
      {/* Finger 1 - top left */}
      <div style={{
        position: "absolute",
        left: 150 - spread - 15, top: 150 - spread - 15,
        fontSize: 28, opacity: s,
        transform: "rotate(-45deg)",
      }}>
        👆
      </div>
      {/* Finger 2 - bottom right */}
      <div style={{
        position: "absolute",
        left: 150 + spread - 15, top: 150 + spread - 15,
        fontSize: 28, opacity: s,
        transform: "rotate(135deg)",
      }}>
        👆
      </div>
      {/* Label */}
      <div style={{
        position: "absolute", bottom: 16, left: "50%", transform: "translateX(-50%)",
        color: "#6429cd", fontWeight: 700, fontSize: 14, opacity: s, whiteSpace: "nowrap",
      }}>
        Pinch {direction === "out" ? "to zoom" : "to shrink"}
      </div>
    </div>
  );
};

export default PinchZoom;
