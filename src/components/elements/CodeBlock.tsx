import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";

const DEFAULT_CODE = `const greet = (name) => {
  console.log(\`Hello, \${name}!\`);
  return { status: "ok" };
};`;

export const CodeBlock: React.FC<{
  code?: string;
  delay?: number;
}> = ({ code = DEFAULT_CODE, delay = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const delayFrames = Math.round(delay * fps);

  const enter = spring({ frame: frame - delayFrames, fps, config: { damping: 14, stiffness: 100 } });
  const lines = code.split("\n");
  const totalChars = code.length;
  const charsTyped = Math.min(totalChars, Math.floor(interpolate(frame - delayFrames, [0, totalChars * 2], [0, totalChars], { extrapolateRight: "clamp", extrapolateLeft: "clamp" })));

  let remaining = charsTyped;
  const visibleLines = lines.map((line) => {
    if (remaining <= 0) return "";
    const visible = line.slice(0, remaining);
    remaining -= line.length + 1;
    return visible;
  });

  return (
    <div
      style={{
        backgroundColor: "#1e1e2e",
        borderRadius: 12,
        padding: 20,
        width: 420,
        fontFamily: "'Fira Code', monospace",
        fontSize: 14,
        opacity: interpolate(enter, [0, 0.3], [0, 1]),
        transform: `scale(${interpolate(enter, [0, 1], [0.95, 1])})`,
        boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
      }}
    >
      <div style={{ display: "flex", gap: 6, marginBottom: 14 }}>
        {["#ff5f57", "#febc2e", "#28c840"].map((c) => (
          <div key={c} style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: c }} />
        ))}
      </div>
      {visibleLines.map((line, i) => (
        <div key={i} style={{ color: i === 0 ? "#ff6b35" : "#cdd6f4", lineHeight: 1.7, minHeight: 20, whiteSpace: "pre" }}>
          <span style={{ color: "#6429cd", marginRight: 12, userSelect: "none" }}>{i + 1}</span>
          {line}
          {i === visibleLines.filter((l) => l).length - 1 && <span style={{ opacity: frame % 30 < 15 ? 1 : 0, color: "#6429cd" }}>▊</span>}
        </div>
      ))}
    </div>
  );
};
