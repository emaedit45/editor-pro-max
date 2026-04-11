import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";

type Props = {
  colors: { hex: string; name: string }[];
  delay?: number;
};

const BrandColorPalette: React.FC<Props> = ({
  colors = [
    { hex: "#6429cd", name: "Purple" },
    { hex: "#ff6b35", name: "Orange" },
  ],
  delay = 0,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const delayFrames = Math.round(delay * fps);

  return (
    <div style={{ display: "flex", gap: 16, padding: 20, fontFamily: "sans-serif", flexWrap: "wrap", justifyContent: "center" }}>
      {colors.map((c, i) => {
        const s = spring({ frame: frame - delayFrames - i * 6, fps, config: { damping: 14, stiffness: 100 } });
        const y = interpolate(s, [0, 1], [-60, 0]);
        return (
          <div key={i} style={{
            opacity: s,
            transform: `translateY(${y}px)`,
            display: "flex", flexDirection: "column", alignItems: "center", gap: 8,
          }}>
            <div style={{
              width: 80, height: 80, borderRadius: 16,
              background: c.hex,
              boxShadow: `0 6px 20px ${c.hex}55`,
            }} />
            <div style={{ color: "#fff", fontWeight: 700, fontSize: 13 }}>{c.name}</div>
            <div style={{
              color: "#aaa", fontSize: 11, fontFamily: "monospace",
              background: "rgba(255,255,255,0.08)", padding: "3px 8px", borderRadius: 4,
            }}>
              {c.hex}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default BrandColorPalette;
