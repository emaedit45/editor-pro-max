import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";

type Props = {
  sets: { label: string; color: string }[];
  overlapLabel?: string;
  delay?: number;
};

const VennDiagram: React.FC<Props> = ({ sets, overlapLabel = "", delay = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const delayFrames = Math.round(delay * fps);
  const count = Math.min(sets.length, 3);
  const positions = count === 2
    ? [{ x: 130, y: 160 }, { x: 230, y: 160 }]
    : [{ x: 180, y: 130 }, { x: 130, y: 210 }, { x: 230, y: 210 }];

  const overlapS = spring({ frame: frame - delayFrames - 20, fps, config: { damping: 14, stiffness: 100 } });

  return (
    <div style={{ position: "relative", width: 360, height: 340, fontFamily: "sans-serif" }}>
      {sets.slice(0, count).map((set, i) => {
        const s = spring({ frame: frame - delayFrames - i * 8, fps, config: { damping: 14, stiffness: 100 } });
        const pos = positions[i];
        return (
          <div key={i} style={{
            position: "absolute", left: pos.x - 70, top: pos.y - 70,
            width: 140, height: 140, borderRadius: "50%",
            background: set.color, opacity: interpolate(s, [0, 1], [0, 0.45]),
            transform: `scale(${s})`,
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "#fff", fontWeight: 700, fontSize: 14, textAlign: "center",
          }}>
            {set.label}
          </div>
        );
      })}
      {overlapLabel && (
        <div style={{
          position: "absolute",
          left: "50%", top: count === 2 ? 152 : 185,
          transform: `translate(-50%,-50%) scale(${overlapS})`,
          color: "#fff", fontWeight: 800, fontSize: 13, textShadow: "0 1px 4px rgba(0,0,0,0.5)",
        }}>
          {overlapLabel}
        </div>
      )}
    </div>
  );
};

export default VennDiagram;
