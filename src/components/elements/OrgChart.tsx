import React from "react";
import { useCurrentFrame, useVideoConfig, spring } from "remotion";

type Props = {
  nodes: { name: string; role: string }[];
  delay?: number;
};

const OrgChart: React.FC<Props> = ({ nodes, delay = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const delayFrames = Math.round(delay * fps);
  const root = nodes[0];
  const children = nodes.slice(1);

  const rootS = spring({ frame: frame - delayFrames, fps, config: { damping: 14, stiffness: 100 } });

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", fontFamily: "sans-serif", padding: 20 }}>
      {root && (
        <div style={{ background: "#6429cd", color: "#fff", padding: "12px 24px", borderRadius: 10, fontWeight: 700, fontSize: 18, opacity: rootS, transform: `scale(${rootS})` }}>
          <div>{root.name}</div>
          <div style={{ fontSize: 12, opacity: 0.8 }}>{root.role}</div>
        </div>
      )}
      <div style={{ width: 2, height: 30, background: "#6429cd", opacity: rootS }} />
      <div style={{ display: "flex", gap: 20, flexWrap: "wrap", justifyContent: "center" }}>
        {children.map((node, i) => {
          const s = spring({ frame: frame - delayFrames - 10 - i * 6, fps, config: { damping: 14, stiffness: 100 } });
          return (
            <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <div style={{ width: 2, height: 20, background: "#ff6b35", opacity: s }} />
              <div style={{ background: "#ff6b35", color: "#fff", padding: "10px 18px", borderRadius: 8, opacity: s, transform: `scale(${s})`, textAlign: "center" }}>
                <div style={{ fontWeight: 700, fontSize: 14 }}>{node.name}</div>
                <div style={{ fontSize: 11, opacity: 0.85 }}>{node.role}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default OrgChart;
