import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";

export const SplitText: React.FC<{
  topText?: string;
  revealText?: string;
  delay?: number;
}> = ({ topText = "Think Different", revealText = "Create Better", delay = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const delayFrames = Math.round(delay * fps);

  const enter = spring({ frame: frame - delayFrames, fps, config: { damping: 14, stiffness: 100 } });
  const split = spring({ frame: frame - delayFrames - 20, fps, config: { damping: 14, stiffness: 100 } });

  const topY = interpolate(split, [0, 1], [0, -30]);
  const revealOpacity = interpolate(split, [0, 1], [0, 1]);
  const revealY = interpolate(split, [0, 1], [20, 0]);

  return (
    <div
      style={{
        fontFamily: "Inter, sans-serif",
        textAlign: "center",
        opacity: interpolate(enter, [0, 0.3], [0, 1]),
        transform: `scale(${interpolate(enter, [0, 1], [0.9, 1])})`,
      }}
    >
      <div
        style={{
          fontSize: 40,
          fontWeight: 800,
          color: "#6429cd",
          transform: `translateY(${topY}px)`,
        }}
      >
        {topText}
      </div>
      <div
        style={{
          fontSize: 36,
          fontWeight: 700,
          color: "#ff6b35",
          opacity: revealOpacity,
          transform: `translateY(${revealY}px)`,
          marginTop: 4,
        }}
      >
        {revealText}
      </div>
    </div>
  );
};
