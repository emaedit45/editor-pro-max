import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";

type Props = {
  delay?: number;
};

const DragIndicator: React.FC<Props> = ({ delay = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const delayFrames = Math.round(delay * fps);
  const s = spring({ frame: frame - delayFrames, fps, config: { damping: 14, stiffness: 100 } });
  const pathProgress = interpolate(s, [0, 1], [0, 1]);
  const cursorX = interpolate(pathProgress, [0, 1], [60, 240]);
  const cursorY = interpolate(pathProgress, [0, 1], [80, 220]);

  return (
    <div style={{ position: "relative", width: 300, height: 300, fontFamily: "sans-serif" }}>
      <svg style={{ position: "absolute", inset: 0 }} viewBox="0 0 300 300">
        <path
          d={`M 60 80 C 120 60, 200 160, 240 220`}
          fill="none" stroke="#6429cd" strokeWidth={3}
          strokeDasharray="8,6" opacity={s}
          strokeDashoffset={interpolate(s, [0, 1], [200, 0])}
        />
        {/* Point A */}
        <circle cx={60} cy={80} r={12} fill="#6429cd" opacity={s} />
        <text x={60} y={84} fill="#fff" fontSize={12} fontWeight="700" textAnchor="middle">A</text>
        {/* Point B */}
        <circle cx={240} cy={220} r={12} fill="#ff6b35" opacity={s} />
        <text x={240} y={224} fill="#fff" fontSize={12} fontWeight="700" textAnchor="middle">B</text>
      </svg>
      {/* Cursor */}
      <div style={{
        position: "absolute", left: cursorX - 12, top: cursorY - 12,
        fontSize: 24, opacity: s,
      }}>
        ✋
      </div>
    </div>
  );
};

export default DragIndicator;
