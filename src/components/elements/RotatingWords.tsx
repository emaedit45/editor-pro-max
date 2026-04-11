import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";

export const RotatingWords: React.FC<{
  prefix?: string;
  words?: string[];
  delay?: number;
}> = ({ prefix = "We make it", words = ["simple", "fast", "beautiful", "powerful"], delay = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const delayFrames = Math.round(delay * fps);

  const enter = spring({ frame: frame - delayFrames, fps, config: { damping: 14, stiffness: 100 } });
  const cycleDuration = 30;
  const elapsed = Math.max(0, frame - delayFrames);
  const activeIndex = Math.floor(elapsed / cycleDuration) % words.length;
  const localFrame = elapsed % cycleDuration;

  const wordEnter = spring({ frame: localFrame, fps, config: { damping: 14, stiffness: 100 } });
  const wordExit = localFrame > cycleDuration - 8 ? interpolate(localFrame, [cycleDuration - 8, cycleDuration], [1, 0], { extrapolateRight: "clamp" }) : 1;

  return (
    <div
      style={{
        fontFamily: "Inter, sans-serif",
        fontSize: 40,
        fontWeight: 800,
        color: "#1e1e2e",
        display: "flex",
        gap: 14,
        alignItems: "baseline",
        opacity: interpolate(enter, [0, 0.3], [0, 1]),
      }}
    >
      <span>{prefix}</span>
      <span
        style={{
          color: "#ff6b35",
          display: "inline-block",
          transform: `translateY(${interpolate(wordEnter * wordExit, [0, 1], [20, 0])}px)`,
          opacity: wordEnter * wordExit,
          minWidth: 200,
        }}
      >
        {words[activeIndex]}
      </span>
    </div>
  );
};
