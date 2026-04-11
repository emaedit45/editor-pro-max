import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";

export const CountUpText: React.FC<{
  endValue?: number;
  prefix?: string;
  suffix?: string;
  delay?: number;
}> = ({ endValue = 10000, prefix = "$", suffix = "+", delay = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const delayFrames = Math.round(delay * fps);

  const enter = spring({ frame: frame - delayFrames, fps, config: { damping: 14, stiffness: 100 } });
  const count = spring({ frame: frame - delayFrames, fps, config: { damping: 14, stiffness: 100 } });

  const currentValue = Math.round(interpolate(count, [0, 1], [0, endValue]));
  const formatted = currentValue.toLocaleString();
  const scale = interpolate(enter, [0, 1], [0.7, 1]);

  return (
    <div
      style={{
        fontFamily: "Inter, sans-serif",
        textAlign: "center",
        transform: `scale(${scale})`,
        opacity: interpolate(enter, [0, 0.2], [0, 1]),
      }}
    >
      <div style={{ fontSize: 64, fontWeight: 900, color: "#6429cd", lineHeight: 1 }}>
        {prefix}
        {formatted}
        {suffix}
      </div>
    </div>
  );
};
