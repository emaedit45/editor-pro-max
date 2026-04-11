import React from "react";
import { useCurrentFrame, useVideoConfig, spring } from "remotion";

type Props = {
  items?: string[];
  scrollSpeed?: number;
  delay?: number;
};

const ScrollAnimation: React.FC<Props> = ({
  items = ["Item 1", "Item 2", "Item 3", "Item 4", "Item 5"],
  scrollSpeed = 1,
  delay = 0,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const delayFrames = Math.round(delay * fps);
  const entryS = spring({ frame: frame - delayFrames, fps, config: { damping: 14, stiffness: 100 } });
  const scrollY = (frame - delayFrames) * scrollSpeed * 1.5;

  return (
    <div style={{
      width: 300, height: 250, overflow: "hidden", borderRadius: 12,
      border: "2px solid #6429cd", position: "relative", opacity: entryS, fontFamily: "sans-serif",
    }}>
      <div style={{ transform: `translateY(${-scrollY}px)`, padding: 16 }}>
        {items.map((item, i) => (
          <div key={i} style={{
            padding: "14px 18px", marginBottom: 10, borderRadius: 8,
            background: i % 2 === 0 ? "#6429cd" : "#ff6b35",
            color: "#fff", fontWeight: 600, fontSize: 15,
          }}>
            {item}
          </div>
        ))}
      </div>
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: 30,
        background: "linear-gradient(to bottom, rgba(0,0,0,0.6), transparent)",
      }} />
      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0, height: 30,
        background: "linear-gradient(to top, rgba(0,0,0,0.6), transparent)",
      }} />
    </div>
  );
};

export default ScrollAnimation;
