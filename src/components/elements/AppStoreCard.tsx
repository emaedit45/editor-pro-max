import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";

type Props = {
  appName?: string;
  rating?: number;
  delay?: number;
};

const AppStoreCard: React.FC<Props> = ({ appName = "My App", rating = 4.5, delay = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const delayFrames = Math.round(delay * fps);
  const s = spring({ frame: frame - delayFrames, fps, config: { damping: 14, stiffness: 100 } });
  const btnS = spring({ frame: frame - delayFrames - 12, fps, config: { damping: 14, stiffness: 100 } });

  const stars = Array.from({ length: 5 }, (_, i) => i < Math.round(rating) ? "\u2605" : "\u2606").join("");

  return (
    <div style={{
      display: "flex", alignItems: "center", justifyContent: "center",
      width: "100%", height: "100%", fontFamily: "sans-serif",
    }}>
      <div style={{
        background: "#1a1a2e", borderRadius: 20, padding: 24,
        width: 280, opacity: s, transform: `scale(${interpolate(s, [0, 1], [0.8, 1])})`,
        display: "flex", alignItems: "center", gap: 16,
        boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
      }}>
        {/* Icon */}
        <div style={{
          width: 64, height: 64, borderRadius: 16,
          background: "linear-gradient(135deg, #6429cd, #ff6b35)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 30, flexShrink: 0,
        }}>
          📱
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ color: "#fff", fontWeight: 700, fontSize: 18 }}>{appName}</div>
          <div style={{ color: "#ff6b35", fontSize: 14, marginTop: 2 }}>{stars} {rating}</div>
          <div style={{
            marginTop: 8, background: "#6429cd", color: "#fff",
            padding: "6px 18px", borderRadius: 20, fontSize: 13,
            fontWeight: 700, display: "inline-block",
            opacity: btnS, transform: `scale(${btnS})`,
          }}>
            INSTALL
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppStoreCard;
