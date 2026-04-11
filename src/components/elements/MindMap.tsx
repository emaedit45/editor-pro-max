import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";

type Props = {
  center?: string;
  branches: { label: string }[];
  delay?: number;
};

const MindMap: React.FC<Props> = ({ center = "Topic", branches, delay = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const delayFrames = Math.round(delay * fps);
  const centerS = spring({ frame: frame - delayFrames, fps, config: { damping: 14, stiffness: 100 } });

  return (
    <div style={{ position: "relative", width: 400, height: 400, fontFamily: "sans-serif" }}>
      <div style={{
        position: "absolute", top: "50%", left: "50%", transform: `translate(-50%,-50%) scale(${centerS})`,
        background: "#6429cd", color: "#fff", padding: "14px 28px", borderRadius: 50, fontWeight: 700, fontSize: 18, whiteSpace: "nowrap",
      }}>
        {center}
      </div>
      {branches.map((b, i) => {
        const angle = (i / branches.length) * Math.PI * 2 - Math.PI / 2;
        const radius = 140;
        const s = spring({ frame: frame - delayFrames - 10 - i * 5, fps, config: { damping: 14, stiffness: 100 } });
        const x = 200 + Math.cos(angle) * radius * s;
        const y = 200 + Math.sin(angle) * radius * s;
        const lineLen = interpolate(s, [0, 1], [0, radius - 40]);
        return (
          <React.Fragment key={i}>
            <div style={{
              position: "absolute", top: 200, left: 200,
              width: lineLen, height: 2, background: "#ff6b35",
              transform: `rotate(${angle}rad)`, transformOrigin: "0 0", opacity: s,
            }} />
            <div style={{
              position: "absolute", left: x - 40, top: y - 16,
              background: "#ff6b35", color: "#fff", padding: "8px 14px", borderRadius: 20,
              fontSize: 13, fontWeight: 600, opacity: s, whiteSpace: "nowrap",
              transform: `scale(${s})`,
            }}>
              {b.label}
            </div>
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default MindMap;
