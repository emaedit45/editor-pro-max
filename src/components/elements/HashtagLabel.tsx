import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";

type Props = {
  text?: string;
  color?: string;
  delay?: number;
};

const HashtagLabel: React.FC<Props> = ({ text = "trending", color = "#6429cd", delay = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const delayFrames = Math.round(delay * fps);
  const s = spring({ frame: frame - delayFrames, fps, config: { damping: 14, stiffness: 100 } });
  const bounceS = spring({ frame: frame - delayFrames - 6, fps, config: { damping: 14, stiffness: 100 } });

  const scale = interpolate(s, [0, 1], [0.3, 1]);
  const y = interpolate(bounceS, [0, 1], [20, 0]);

  return (
    <div style={{
      display: "flex", alignItems: "center", justifyContent: "center",
      width: "100%", height: "100%", fontFamily: "sans-serif",
    }}>
      <div style={{
        background: color,
        color: "#fff",
        padding: "14px 32px",
        borderRadius: 50,
        fontSize: 28,
        fontWeight: 800,
        opacity: s,
        transform: `scale(${scale}) translateY(${y}px)`,
        boxShadow: `0 6px 24px ${color}66`,
        letterSpacing: 1,
      }}>
        <span style={{ color: "#ff6b35", marginRight: 4 }}>#</span>
        {text}
      </div>
    </div>
  );
};

export default HashtagLabel;
