import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";

export const SearchBar: React.FC<{
  query?: string;
  results?: string[];
  delay?: number;
}> = ({ query = "remotion animation", results = ["Spring animations", "Interpolate values", "Sequence timing"], delay = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const delayFrames = Math.round(delay * fps);

  const enter = spring({ frame: frame - delayFrames, fps, config: { damping: 14, stiffness: 100 } });
  const typedChars = Math.min(query.length, Math.floor(interpolate(frame - delayFrames, [0, query.length * 3], [0, query.length], { extrapolateRight: "clamp" })));
  const typed = query.slice(0, typedChars);
  const showResults = typedChars >= query.length;

  return (
    <div style={{ width: 360, fontFamily: "Inter, sans-serif", transform: `scale(${interpolate(enter, [0, 1], [0.9, 1])})`, opacity: interpolate(enter, [0, 0.3], [0, 1]) }}>
      <div style={{ display: "flex", alignItems: "center", padding: "10px 16px", borderRadius: showResults ? "12px 12px 0 0" : 12, backgroundColor: "#fff", border: "2px solid #6429cd", gap: 8 }}>
        <span style={{ fontSize: 18 }}>🔍</span>
        <span style={{ fontSize: 16, color: "#333", flex: 1 }}>{typed}<span style={{ opacity: frame % 30 < 15 ? 1 : 0, color: "#6429cd" }}>|</span></span>
      </div>
      {showResults && (
        <div style={{ backgroundColor: "#fff", border: "2px solid #6429cd", borderTop: "none", borderRadius: "0 0 12px 12px", overflow: "hidden" }}>
          {results.map((r, i) => {
            const itemSpring = spring({ frame: frame - delayFrames - query.length * 3 - i * 5, fps, config: { damping: 14, stiffness: 100 } });
            return (
              <div key={i} style={{ padding: "10px 16px", fontSize: 14, color: "#555", borderTop: i > 0 ? "1px solid #eee" : "none", opacity: itemSpring, transform: `translateY(${interpolate(itemSpring, [0, 1], [8, 0])}px)` }}>
                {r}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
