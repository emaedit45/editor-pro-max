import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";

type Props = {
  headers: [string, string];
  rows: { feature: string; col1: boolean; col2: boolean }[];
  delay?: number;
};

const ComparisonTable: React.FC<Props> = ({ headers, rows, delay = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const delayFrames = Math.round(delay * fps);
  const headerS = spring({ frame: frame - delayFrames, fps, config: { damping: 14, stiffness: 100 } });

  const Icon: React.FC<{ val: boolean }> = ({ val }) => (
    <span style={{ fontSize: 20, color: val ? "#22c55e" : "#ef4444" }}>{val ? "\u2713" : "\u2717"}</span>
  );

  const cellStyle: React.CSSProperties = { padding: "10px 16px", borderBottom: "1px solid rgba(255,255,255,0.1)", textAlign: "center" };

  return (
    <div style={{ fontFamily: "sans-serif", color: "#fff" }}>
      <table style={{ borderCollapse: "collapse", width: "100%", opacity: headerS }}>
        <thead>
          <tr style={{ background: "#6429cd" }}>
            <th style={{ ...cellStyle, textAlign: "left" }}>Feature</th>
            <th style={cellStyle}>{headers[0]}</th>
            <th style={cellStyle}>{headers[1]}</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => {
            const s = spring({ frame: frame - delayFrames - 6 - i * 5, fps, config: { damping: 14, stiffness: 100 } });
            return (
              <tr key={i} style={{ background: i % 2 === 0 ? "rgba(100,41,205,0.15)" : "rgba(255,107,53,0.1)", opacity: s, transform: `translateX(${interpolate(s, [0, 1], [20, 0])}px)` }}>
                <td style={{ ...cellStyle, textAlign: "left", fontWeight: 600 }}>{row.feature}</td>
                <td style={cellStyle}><Icon val={row.col1} /></td>
                <td style={cellStyle}><Icon val={row.col2} /></td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default ComparisonTable;
