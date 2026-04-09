import React from "react";
import {
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
  AbsoluteFill,
} from "remotion";

interface GlowPulseProps {
  color?: string;
  size?: number;
  intensity?: number;
  pulseSpeed?: number;
  delay?: number;
}

export const GlowPulse: React.FC<GlowPulseProps> = ({
  color = "#6429cd",
  size = 300,
  intensity = 0.8,
  pulseSpeed = 1,
  delay = 0,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const delayFrames = Math.round(delay * fps);
  const adjustedFrame = frame - delayFrames;

  if (adjustedFrame < 0) return null;

  // Entry spring animation
  const entryScale = spring({
    frame: adjustedFrame,
    fps,
    config: { damping: 14, stiffness: 100 },
  });

  // Sine-wave breathing scale
  const breathCycle = Math.sin((adjustedFrame / fps) * Math.PI * 2 * pulseSpeed);
  const pulseScale = 1 + breathCycle * 0.15 * intensity;

  // Sine-wave breathing opacity
  const breathOpacity = 0.4 + breathCycle * 0.2 * intensity;

  // Secondary slower pulse for layered effect
  const secondaryCycle = Math.sin(
    (adjustedFrame / fps) * Math.PI * 2 * pulseSpeed * 0.6 + Math.PI * 0.5
  );
  const secondaryScale = 1.3 + secondaryCycle * 0.1 * intensity;
  const secondaryOpacity = 0.2 + secondaryCycle * 0.1 * intensity;

  // Subtle hue shift for premium feel
  const hueRotate = interpolate(
    Math.sin((adjustedFrame / fps) * Math.PI * 0.5),
    [-1, 1],
    [-10, 10]
  );

  const combinedScale = entryScale * pulseScale;
  const combinedSecondaryScale = entryScale * secondaryScale;

  return (
    <AbsoluteFill
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        pointerEvents: "none",
      }}
    >
      {/* Outermost soft halo */}
      <div
        style={{
          position: "absolute",
          width: size * 2,
          height: size * 2,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${color}15 0%, ${color}08 40%, transparent 70%)`,
          transform: `scale(${combinedSecondaryScale})`,
          opacity: secondaryOpacity * entryScale,
          filter: `blur(40px) hue-rotate(${hueRotate}deg)`,
          willChange: "transform, opacity",
        }}
      />

      {/* Middle glow ring */}
      <div
        style={{
          position: "absolute",
          width: size * 1.4,
          height: size * 1.4,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${color}00 30%, ${color}30 60%, ${color}00 80%)`,
          transform: `scale(${combinedScale * 1.05})`,
          opacity: breathOpacity * 0.6 * entryScale,
          filter: `blur(20px) hue-rotate(${hueRotate}deg)`,
          willChange: "transform, opacity",
        }}
      />

      {/* Primary glow */}
      <div
        style={{
          position: "absolute",
          width: size,
          height: size,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${color}90 0%, ${color}40 40%, ${color}10 70%, transparent 100%)`,
          transform: `scale(${combinedScale})`,
          opacity: breathOpacity * entryScale,
          filter: `blur(15px) hue-rotate(${hueRotate}deg)`,
          willChange: "transform, opacity",
        }}
      />

      {/* Bright inner core */}
      <div
        style={{
          position: "absolute",
          width: size * 0.3,
          height: size * 0.3,
          borderRadius: "50%",
          background: `radial-gradient(circle, white 0%, ${color} 60%, transparent 100%)`,
          transform: `scale(${combinedScale})`,
          opacity: (breathOpacity * 0.7 + 0.3) * intensity * entryScale,
          filter: `blur(8px) hue-rotate(${hueRotate}deg)`,
          willChange: "transform, opacity",
        }}
      />
    </AbsoluteFill>
  );
};

export default GlowPulse;
