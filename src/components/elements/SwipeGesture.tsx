import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";

type Props = {
  direction?: "left" | "right" | "up";
  delay?: number;
};

const SwipeGesture: React.FC<Props> = ({ direction = "right", delay = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const delayFrames = Math.round(delay * fps);
  const s = spring({ frame: frame - delayFrames, fps, config: { damping: 14, stiffness: 100 } });
  const progress = interpolate(s, [0, 1], [0, 180]);

  const dx = direction === "left" ? -progress : direction === "right" ? progress : 0;
  const dy = direction === "up" ? -progress : 0;

  const trailS = spring({ frame: frame - delayFrames - 5, fps, config: { damping: 14, stiffness: 100 } });
  const trailLen = interpolate(trailS, [0, 1], [0, 120]);

  return (
    <div style={{ position: "relative", width: 300, height: 300, fontFamily: "sans-serif" }}>
      {/* Trail line */}
      <svg style={{ position: "absolute", inset: 0 }} viewBox="0 0 300 300">
        <line
          x1={150} y1={150} x2={150 + (direction === "left" ? -trailLen : direction === "right" ? trailLen : 0)}
          y2={150 + (direction === "up" ? -trailLen : 0)}
          stroke="#ff6b35" strokeWidth={3} strokeDasharray="8,4" opacity={trailS}
        />
      </svg>
      {/* Hand */}
      <div style={{
        position: "absolute",
        left: 150 + dx - 24, top: 150 + dy - 24,
        fontSize: 48, opacity: s,
        transform: `rotate(${direction === "left" ? 180 : direction === "up" ? -90 : 0}deg)`,
      }}>
        👆
      </div>
      {/* Label */}
      <div style={{
        position: "absolute", bottom: 20, left: "50%", transform: "translateX(-50%)",
        color: "#6429cd", fontWeight: 700, fontSize: 14, opacity: s,
      }}>
        Swipe {direction}
      </div>
    </div>
  );
};

export default SwipeGesture;
