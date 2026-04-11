import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";

type Props = {
  features: { icon: string; label: string }[];
  columns?: number;
  delay?: number;
};

const FeatureGrid: React.FC<Props> = ({ features, columns = 3, delay = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const delayFrames = Math.round(delay * fps);

  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: `repeat(${columns}, 1fr)`,
      gap: 16,
      padding: 20,
      fontFamily: "sans-serif",
    }}>
      {features.map((feat, i) => {
        const s = spring({ frame: frame - delayFrames - i * 4, fps, config: { damping: 14, stiffness: 100 } });
        return (
          <div key={i} style={{
            background: i % 2 === 0 ? "#6429cd" : "#ff6b35",
            borderRadius: 12,
            padding: 20,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 10,
            opacity: s,
            transform: `scale(${interpolate(s, [0, 1], [0.5, 1])})`,
          }}>
            <div style={{ fontSize: 32 }}>{feat.icon}</div>
            <div style={{ color: "#fff", fontWeight: 600, fontSize: 14, textAlign: "center" }}>{feat.label}</div>
          </div>
        );
      })}
    </div>
  );
};

export default FeatureGrid;
