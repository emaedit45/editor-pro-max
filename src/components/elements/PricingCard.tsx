import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";

type Props = {
  planName?: string;
  price?: string;
  features?: string[];
  delay?: number;
};

const PricingCard: React.FC<Props> = ({
  planName = "Pro",
  price = "$19/mo",
  features = ["Unlimited exports", "HD quality", "Priority support"],
  delay = 0,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const delayFrames = Math.round(delay * fps);
  const s = spring({ frame: frame - delayFrames, fps, config: { damping: 14, stiffness: 100 } });
  const ctaS = spring({ frame: frame - delayFrames - 15, fps, config: { damping: 14, stiffness: 100 } });

  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "100%", height: "100%", fontFamily: "sans-serif" }}>
      <div style={{
        background: "#1a1a2e", borderRadius: 20, padding: 32, width: 260, textAlign: "center",
        opacity: s, transform: `translateY(${interpolate(s, [0, 1], [40, 0])}px)`,
        border: "2px solid #6429cd", boxShadow: "0 8px 32px rgba(100,41,205,0.3)",
      }}>
        <div style={{ color: "#ff6b35", fontWeight: 700, fontSize: 14, textTransform: "uppercase", letterSpacing: 2 }}>{planName}</div>
        <div style={{ color: "#fff", fontSize: 42, fontWeight: 900, margin: "12px 0" }}>{price}</div>
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: 16 }}>
          {features.map((feat, i) => {
            const fS = spring({ frame: frame - delayFrames - 8 - i * 4, fps, config: { damping: 14, stiffness: 100 } });
            return (
              <div key={i} style={{ color: "#ccc", fontSize: 14, padding: "6px 0", opacity: fS, transform: `translateX(${interpolate(fS, [0, 1], [20, 0])}px)` }}>
                <span style={{ color: "#22c55e", marginRight: 8 }}>&#10003;</span>{feat}
              </div>
            );
          })}
        </div>
        <div style={{
          marginTop: 20, background: "linear-gradient(135deg, #6429cd, #ff6b35)",
          color: "#fff", padding: "12px 0", borderRadius: 30, fontWeight: 700, fontSize: 15,
          opacity: ctaS, transform: `scale(${ctaS})`,
        }}>
          Get Started
        </div>
      </div>
    </div>
  );
};

export default PricingCard;
