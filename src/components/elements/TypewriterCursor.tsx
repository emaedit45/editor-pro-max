import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";

export const TypewriterCursor: React.FC<{
  text?: string;
  speed?: number;
  cursorColor?: string;
  delay?: number;
}> = ({ text = "Build stunning animations with Remotion.", speed = 3, cursorColor = "#6429cd", delay = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const delayFrames = Math.round(delay * fps);

  const enter = spring({ frame: frame - delayFrames, fps, config: { damping: 14, stiffness: 100 } });
  const elapsed = Math.max(0, frame - delayFrames);
  const charsTyped = Math.min(text.length, Math.floor(elapsed / speed));
  const typed = text.slice(0, charsTyped);
  const cursorVisible = frame % 30 < 15;

  return (
    <div
      style={{
        fontFamily: "Inter, sans-serif",
        fontSize: 32,
        fontWeight: 700,
        color: "#1e1e2e",
        opacity: interpolate(enter, [0, 0.2], [0, 1]),
        transform: `translateY(${interpolate(enter, [0, 1], [10, 0])}px)`,
      }}
    >
      {typed}
      <span
        style={{
          display: "inline-block",
          width: 3,
          height: 36,
          backgroundColor: cursorColor,
          marginLeft: 2,
          verticalAlign: "middle",
          opacity: cursorVisible ? 1 : 0,
        }}
      />
    </div>
  );
};
