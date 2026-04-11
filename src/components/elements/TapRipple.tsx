import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";

type Props = {
  x?: number;
  y?: number;
  color?: string;
  delay?: number;
};

const TapRipple: React.FC<Props> = ({ x = 150, y = 150, color = "#6429cd", delay = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const delayFrames = Math.round(delay * fps);
  const fingerS = spring({ frame: frame - delayFrames, fps, config: { damping: 14, stiffness: 100 } });

  const ripples = [0, 1, 2];

  return (
    <div style={{ position: "relative", width: 300, height: 300 }}>
      {ripples.map((i) => {
        const rS = spring({ frame: frame - delayFrames - 8 - i * 6, fps, config: { damping: 14, stiffness: 100 } });
        const scale = interpolate(rS, [0, 1], [0, 1 + i * 0.7]);
        const opacity = interpolate(rS, [0, 1], [0.6, 0]);
        return (
          <div key={i} style={{
            position: "absolute",
            left: x - 30, top: y - 30,
            width: 60, height: 60, borderRadius: "50%",
            border: `3px solid ${color}`,
            transform: `scale(${scale})`,
            opacity,
          }} />
        );
      })}
      {/* Finger */}
      <div style={{
        position: "absolute", left: x - 16, top: y - 20,
        fontSize: 32, opacity: fingerS,
        transform: `scale(${interpolate(fingerS, [0, 1], [1.3, 1])})`,
      }}>
        👆
      </div>
      {/* Dot */}
      <div style={{
        position: "absolute", left: x - 5, top: y - 5,
        width: 10, height: 10, borderRadius: "50%",
        background: "#ff6b35", opacity: fingerS,
      }} />
    </div>
  );
};

export default TapRipple;
