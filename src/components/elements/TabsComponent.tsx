import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";

export const TabsComponent: React.FC<{
  tabs?: string[];
  activeIndex?: number;
  color?: string;
  delay?: number;
}> = ({ tabs = ["Overview", "Features", "Pricing"], activeIndex = 1, color = "#6429cd", delay = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const delayFrames = Math.round(delay * fps);

  const enter = spring({ frame: frame - delayFrames, fps, config: { damping: 14, stiffness: 100 } });
  const slide = spring({ frame: frame - delayFrames - 15, fps, config: { damping: 14, stiffness: 100 } });

  const tabWidth = 120;
  const underlineX = interpolate(slide, [0, 1], [0, activeIndex * tabWidth]);

  return (
    <div style={{ fontFamily: "Inter, sans-serif", opacity: interpolate(enter, [0, 0.3], [0, 1]), transform: `translateY(${interpolate(enter, [0, 1], [20, 0])}px)` }}>
      <div style={{ display: "flex", position: "relative", borderBottom: "2px solid #e0e0e0" }}>
        {tabs.map((tab, i) => {
          const isActive = i === activeIndex && slide > 0.5;
          return (
            <div
              key={i}
              style={{
                width: tabWidth,
                padding: "12px 0",
                textAlign: "center",
                fontSize: 16,
                fontWeight: isActive ? 700 : 500,
                color: isActive ? color : "#666",
                cursor: "pointer",
              }}
            >
              {tab}
            </div>
          );
        })}
        <div
          style={{
            position: "absolute",
            bottom: -2,
            left: underlineX,
            width: tabWidth,
            height: 3,
            backgroundColor: color,
            borderRadius: 2,
          }}
        />
      </div>
    </div>
  );
};
