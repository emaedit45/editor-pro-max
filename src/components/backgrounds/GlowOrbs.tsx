import React from "react";
import {AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate} from "remotion";

interface Orb {
  x: number;
  y: number;
  size: number;
  color: string;
  speedX: number;
  speedY: number;
}

// Deterministic seeded random
const seeded = (seed: number): number => {
  const x = Math.sin(seed * 9301 + 49297) * 233280;
  return x - Math.floor(x);
};

export interface GlowOrbsProps {
  /** Array of colors for the orbs */
  colors?: string[];
  /** Number of orbs */
  count?: number;
  /** Base size of orbs in px (will vary ±40%) */
  size?: number;
  /** Blur amount for the glow effect */
  blur?: number;
  /** Opacity of each orb */
  opacity?: number;
  /** Movement speed multiplier */
  speed?: number;
}

/**
 * Floating gradient orbs with gaussian blur.
 * Creates premium depth-of-field background effect used by Apple, Vercel, Linear.
 * Place BEHIND content layers.
 */
export const GlowOrbs: React.FC<GlowOrbsProps> = ({
  colors = ["rgba(139,92,246,0.35)", "rgba(6,182,212,0.3)", "rgba(244,63,94,0.25)"],
  count = 3,
  size = 350,
  blur = 80,
  opacity = 1,
  speed = 0.4,
}) => {
  const frame = useCurrentFrame();
  const {width, height} = useVideoConfig();

  const orbs = React.useMemo<Orb[]>(() => {
    return Array.from({length: count}, (_, i) => ({
      x: seeded(i * 7 + 1) * width,
      y: seeded(i * 7 + 2) * height,
      size: size * (0.6 + seeded(i * 7 + 3) * 0.8),
      color: colors[i % colors.length],
      speedX: (seeded(i * 7 + 4) - 0.5) * 2,
      speedY: (seeded(i * 7 + 5) - 0.5) * 2,
    }));
  }, [count, width, height, size, colors]);

  return (
    <AbsoluteFill style={{opacity, overflow: "hidden"}}>
      {orbs.map((orb, i) => {
        // Gentle floating motion using sine waves for organic feel
        const moveX = Math.sin(frame * speed * 0.02 * orb.speedX + i * 2) * 60;
        const moveY = Math.cos(frame * speed * 0.015 * orb.speedY + i * 3) * 40;

        // Subtle breathing (scale pulse)
        const breathe = interpolate(
          Math.sin(frame * 0.03 + i * 1.5),
          [-1, 1],
          [0.85, 1.15],
        );

        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: orb.x + moveX,
              top: orb.y + moveY,
              width: orb.size * breathe,
              height: orb.size * breathe,
              borderRadius: "50%",
              background: `radial-gradient(circle, ${orb.color}, transparent 70%)`,
              filter: `blur(${blur}px)`,
              transform: "translate(-50%, -50%)",
              willChange: "transform",
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};
