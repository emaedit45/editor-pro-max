import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";

export const OutlinedText: React.FC<{
  text?: string;
  strokeColor?: string;
  fontSize?: number;
  delay?: number;
}> = ({ text = "OUTLINE", strokeColor = "#6429cd", fontSize = 80, delay = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const delayFrames = Math.round(delay * fps);

  const enter = spring({ frame: frame - delayFrames, fps, config: { damping: 14, stiffness: 100 } });
  const draw = spring({ frame: frame - delayFrames - 10, fps, config: { damping: 14, stiffness: 100 } });

  const dashTotal = 1200;
  const dashOffset = interpolate(draw, [0, 1], [dashTotal, 0]);

  return (
    <div
      style={{
        opacity: interpolate(enter, [0, 0.2], [0, 1]),
        transform: `scale(${interpolate(enter, [0, 1], [0.85, 1])})`,
      }}
    >
      <svg width={text.length * fontSize * 0.65} height={fontSize * 1.3} style={{ overflow: "visible" }}>
        <text
          x="0"
          y={fontSize}
          fontFamily="Inter, sans-serif"
          fontSize={fontSize}
          fontWeight="900"
          fill="none"
          stroke={strokeColor}
          strokeWidth={3}
          strokeDasharray={dashTotal}
          strokeDashoffset={dashOffset}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {text}
        </text>
      </svg>
    </div>
  );
};
