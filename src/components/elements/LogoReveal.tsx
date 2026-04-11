import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";

type Props = {
  text?: string;
  color?: string;
  delay?: number;
};

const LogoReveal: React.FC<Props> = ({ text = "LOGO", color = "#6429cd", delay = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const delayFrames = Math.round(delay * fps);
  const s = spring({ frame: frame - delayFrames, fps, config: { damping: 14, stiffness: 100 } });
  const glowS = spring({ frame: frame - delayFrames - 10, fps, config: { damping: 14, stiffness: 100 } });

  const scale = interpolate(s, [0, 1], [0.2, 1]);
  const glowSize = interpolate(glowS, [0, 1], [0, 40]);
  const glowOpacity = interpolate(glowS, [0, 1], [0, 0.6]);

  return (
    <div style={{
      display: "flex", alignItems: "center", justifyContent: "center",
      width: "100%", height: "100%", fontFamily: "sans-serif",
    }}>
      <div style={{
        fontSize: 72,
        fontWeight: 900,
        color,
        transform: `scale(${scale})`,
        opacity: s,
        textShadow: `0 0 ${glowSize}px ${color}`,
        letterSpacing: 6,
        position: "relative",
      }}>
        {text}
        <div style={{
          position: "absolute", inset: -20,
          borderRadius: 20,
          boxShadow: `0 0 ${glowSize * 2}px ${glowSize}px ${color}`,
          opacity: glowOpacity * 0.3,
        }} />
      </div>
    </div>
  );
};

export default LogoReveal;
