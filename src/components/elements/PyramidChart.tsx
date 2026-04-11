import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";

type Props = {
  tiers: { label: string; color: string }[];
  delay?: number;
};

const PyramidChart: React.FC<Props> = ({ tiers, delay = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const delayFrames = Math.round(delay * fps);

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-end", height: "100%", padding: 20 }}>
      {[...tiers].reverse().map((tier, i) => {
        const idx = tiers.length - 1 - i;
        const s = spring({ frame: frame - delayFrames - idx * 8, fps, config: { damping: 14, stiffness: 100 } });
        const width = interpolate(idx, [0, tiers.length - 1], [40, 100]);
        return (
          <div
            key={i}
            style={{
              width: `${width}%`,
              padding: "12px 0",
              background: tier.color,
              color: "#fff",
              textAlign: "center",
              fontSize: 16,
              fontWeight: 700,
              fontFamily: "sans-serif",
              opacity: s,
              transform: `translateY(${interpolate(s, [0, 1], [30, 0])}px)`,
              borderRadius: 4,
              marginBottom: 2,
            }}
          >
            {tier.label}
          </div>
        );
      })}
    </div>
  );
};

export default PyramidChart;
