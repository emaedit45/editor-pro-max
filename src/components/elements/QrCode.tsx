import React from "react";
import { useCurrentFrame, useVideoConfig, spring } from "remotion";

type Props = {
  size?: number;
  color?: string;
  delay?: number;
};

const QrCode: React.FC<Props> = ({ size = 200, color = "#6429cd", delay = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const delayFrames = Math.round(delay * fps);
  const gridSize = 9;
  const cellSize = size / gridSize;

  // Deterministic pseudo-random pattern
  const cells: boolean[][] = Array.from({ length: gridSize }, (_, r) =>
    Array.from({ length: gridSize }, (_, c) => {
      if (r < 3 && c < 3) return true;
      if (r < 3 && c >= gridSize - 3) return true;
      if (r >= gridSize - 3 && c < 3) return true;
      return (r * 7 + c * 13 + 5) % 3 !== 0;
    })
  );

  return (
    <div style={{ display: "inline-flex", flexDirection: "column", padding: 16, background: "#fff", borderRadius: 12 }}>
      {cells.map((row, r) => (
        <div key={r} style={{ display: "flex" }}>
          {row.map((on, c) => {
            const idx = r * gridSize + c;
            const s = spring({ frame: frame - delayFrames - idx * 0.8, fps, config: { damping: 14, stiffness: 100 } });
            return (
              <div key={c} style={{
                width: cellSize, height: cellSize,
                background: on ? color : "transparent",
                opacity: on ? s : 0,
                transform: `scale(${s})`,
                borderRadius: 1,
              }} />
            );
          })}
        </div>
      ))}
    </div>
  );
};

export default QrCode;
