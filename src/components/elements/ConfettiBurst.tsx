import React from "react";
import {
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
  AbsoluteFill,
} from "remotion";

interface ConfettiBurstProps {
  colors?: string[];
  particleCount?: number;
  originX?: number;
  originY?: number;
  delay?: number;
}

// Deterministic seeded random based on index
const seededRandom = (seed: number): number => {
  const x = Math.sin(seed * 9301 + 49297) * 49297;
  return x - Math.floor(x);
};

const SHAPES = ["rect", "circle", "triangle"] as const;
type Shape = (typeof SHAPES)[number];

interface Particle {
  angle: number;
  speed: number;
  rotationSpeed: number;
  color: string;
  shape: Shape;
  size: number;
  wobble: number;
  initialRotation: number;
}

const generateParticles = (
  count: number,
  colors: string[]
): Particle[] => {
  return Array.from({ length: count }, (_, i) => {
    const r1 = seededRandom(i * 7 + 1);
    const r2 = seededRandom(i * 7 + 2);
    const r3 = seededRandom(i * 7 + 3);
    const r4 = seededRandom(i * 7 + 4);
    const r5 = seededRandom(i * 7 + 5);
    const r6 = seededRandom(i * 7 + 6);
    const r7 = seededRandom(i * 7 + 7);

    return {
      angle: r1 * Math.PI * 2,
      speed: 3 + r2 * 8,
      rotationSpeed: (r3 - 0.5) * 15,
      color: colors[Math.floor(r4 * colors.length)],
      shape: SHAPES[Math.floor(r5 * SHAPES.length)],
      size: 6 + r6 * 8,
      wobble: r7 * Math.PI * 2,
      initialRotation: r1 * 360,
    };
  });
};

const renderShape = (shape: Shape, size: number, color: string) => {
  if (shape === "circle") {
    return (
      <div
        style={{
          width: size,
          height: size,
          borderRadius: "50%",
          backgroundColor: color,
        }}
      />
    );
  }
  if (shape === "triangle") {
    return (
      <div
        style={{
          width: 0,
          height: 0,
          borderLeft: `${size / 2}px solid transparent`,
          borderRight: `${size / 2}px solid transparent`,
          borderBottom: `${size}px solid ${color}`,
        }}
      />
    );
  }
  // rect
  return (
    <div
      style={{
        width: size,
        height: size * 0.6,
        backgroundColor: color,
        borderRadius: 2,
      }}
    />
  );
};

export const ConfettiBurst: React.FC<ConfettiBurstProps> = ({
  colors = ["#6429cd", "#ff6b35", "#22C55E", "#3b82f6", "#f59e0b"],
  particleCount = 40,
  originX = 50,
  originY = 50,
  delay = 0,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const delayFrames = Math.round(delay * fps);
  const adjustedFrame = frame - delayFrames;

  if (adjustedFrame < 0) return null;

  const particles = generateParticles(particleCount, colors);

  // Burst spring for initial explosion
  const burstProgress = spring({
    frame: adjustedFrame,
    fps,
    config: { damping: 14, stiffness: 100 },
  });

  // Gravity constant (pixels per frame^2)
  const gravity = 0.15;

  // Fade out near end
  const opacity = interpolate(adjustedFrame, [40, 70], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        overflow: "hidden",
        pointerEvents: "none",
      }}
    >
      {particles.map((particle, i) => {
        const t = adjustedFrame;
        const velocityX = Math.cos(particle.angle) * particle.speed;
        const velocityY = Math.sin(particle.angle) * particle.speed;

        const x = velocityX * t * burstProgress;
        const y = velocityY * t * burstProgress + 0.5 * gravity * t * t;

        const wobbleX = Math.sin(t * 0.1 + particle.wobble) * 3;

        const rotation =
          particle.initialRotation + t * particle.rotationSpeed;

        const particleOpacity = interpolate(
          adjustedFrame,
          [0, 5, 50, 70],
          [0, 1, 1, 0],
          { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
        );

        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: `${originX}%`,
              top: `${originY}%`,
              transform: `translate(${x + wobbleX}px, ${y}px) rotate(${rotation}deg)`,
              opacity: particleOpacity * opacity,
              willChange: "transform, opacity",
            }}
          >
            {renderShape(particle.shape, particle.size, particle.color)}
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

export default ConfettiBurst;
