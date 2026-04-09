import React from "react";
import {
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
  AbsoluteFill,
} from "remotion";

interface CountdownTimerProps {
  from: number;
  to?: number;
  style?: "circular" | "digital";
  color?: string;
  size?: number;
  label?: string;
  delay?: number;
}

const CircularCountdown: React.FC<{
  progress: number;
  currentNumber: number;
  color: string;
  size: number;
  label?: string;
  entryScale: number;
  numberSpring: number;
}> = ({ progress, currentNumber, color, size, label, entryScale, numberSpring }) => {
  const radius = size * 0.4;
  const circumference = 2 * Math.PI * radius;
  const strokeWidth = size * 0.06;
  const center = size / 2;

  // Ring depletion: starts full, empties to 0
  const strokeDashoffset = circumference * progress;

  // Glow intensity based on proximity to next tick
  const tickProximity = progress * 100 - Math.floor(progress * 100);
  const glowIntensity = tickProximity < 0.1 ? (0.1 - tickProximity) * 10 : 0;

  return (
    <div
      style={{
        width: size,
        height: size,
        position: "relative",
        transform: `scale(${entryScale})`,
        willChange: "transform",
      }}
    >
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {/* Background track */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke={`${color}20`}
          strokeWidth={strokeWidth}
        />

        {/* Depleting ring */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          transform={`rotate(-90 ${center} ${center})`}
          style={{
            filter: `drop-shadow(0 0 ${6 + glowIntensity * 15}px ${color})`,
            transition: "filter 0.1s",
          }}
        />

        {/* Tick marks */}
        {Array.from({ length: 12 }).map((_, i) => {
          const angle = (i / 12) * Math.PI * 2 - Math.PI / 2;
          const innerR = radius + strokeWidth * 0.8;
          const outerR = radius + strokeWidth * 1.6;
          return (
            <line
              key={i}
              x1={center + Math.cos(angle) * innerR}
              y1={center + Math.sin(angle) * innerR}
              x2={center + Math.cos(angle) * outerR}
              y2={center + Math.sin(angle) * outerR}
              stroke={`${color}40`}
              strokeWidth={i % 3 === 0 ? 2.5 : 1}
              strokeLinecap="round"
            />
          );
        })}

        {/* Progress dot at the end of the ring */}
        {(() => {
          const angle = -Math.PI / 2 + (1 - progress) * Math.PI * 2;
          const dotX = center + Math.cos(angle) * radius;
          const dotY = center + Math.sin(angle) * radius;
          return (
            <circle
              cx={dotX}
              cy={dotY}
              r={strokeWidth * 0.8}
              fill="white"
              style={{
                filter: `drop-shadow(0 0 4px ${color})`,
              }}
            />
          );
        })()}
      </svg>

      {/* Center number */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <span
          style={{
            fontSize: size * 0.28,
            fontWeight: 800,
            color: "white",
            fontFamily:
              "'SF Pro Display', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
            letterSpacing: "-0.02em",
            transform: `scale(${numberSpring})`,
            textShadow: `0 0 20px ${color}80, 0 2px 10px rgba(0,0,0,0.3)`,
            willChange: "transform",
          }}
        >
          {currentNumber}
        </span>
        {label && (
          <span
            style={{
              fontSize: size * 0.07,
              fontWeight: 600,
              color: `${color}cc`,
              fontFamily:
                "'SF Pro Display', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
              textTransform: "uppercase",
              letterSpacing: "0.15em",
              marginTop: size * 0.02,
            }}
          >
            {label}
          </span>
        )}
      </div>
    </div>
  );
};

const DigitalCountdown: React.FC<{
  currentNumber: number;
  color: string;
  size: number;
  label?: string;
  entryScale: number;
  numberSpring: number;
  progress: number;
}> = ({ currentNumber, color, size, label, entryScale, numberSpring, progress }) => {
  const padded = String(currentNumber).padStart(2, "0");
  const barWidth = size * 0.8;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: size * 0.06,
        transform: `scale(${entryScale})`,
        willChange: "transform",
      }}
    >
      {/* Glassy container */}
      <div
        style={{
          background: "rgba(255,255,255,0.05)",
          backdropFilter: "blur(20px)",
          border: `1px solid ${color}30`,
          borderRadius: size * 0.1,
          padding: `${size * 0.12}px ${size * 0.2}px`,
          boxShadow: `0 0 40px ${color}15, inset 0 1px 0 rgba(255,255,255,0.1)`,
        }}
      >
        <span
          style={{
            fontSize: size * 0.45,
            fontWeight: 900,
            color: "white",
            fontFamily:
              "'SF Mono', 'Fira Code', 'Cascadia Code', 'Consolas', monospace",
            letterSpacing: "0.08em",
            transform: `scale(${numberSpring})`,
            display: "inline-block",
            textShadow: `0 0 30px ${color}, 0 0 60px ${color}40`,
            willChange: "transform",
          }}
        >
          {padded}
        </span>
      </div>

      {/* Progress bar */}
      <div
        style={{
          width: barWidth,
          height: 4,
          borderRadius: 2,
          background: `${color}20`,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${(1 - progress) * 100}%`,
            height: "100%",
            borderRadius: 2,
            background: `linear-gradient(90deg, ${color}, ${color}cc)`,
            boxShadow: `0 0 10px ${color}80`,
          }}
        />
      </div>

      {label && (
        <span
          style={{
            fontSize: size * 0.08,
            fontWeight: 600,
            color: `${color}bb`,
            fontFamily:
              "'SF Pro Display', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
            textTransform: "uppercase",
            letterSpacing: "0.2em",
          }}
        >
          {label}
        </span>
      )}
    </div>
  );
};

export const CountdownTimer: React.FC<CountdownTimerProps> = ({
  from,
  to = 0,
  style: countdownStyle = "circular",
  color = "#6429cd",
  size = 250,
  label,
  delay = 0,
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const delayFrames = Math.round(delay * fps);
  const adjustedFrame = frame - delayFrames;

  if (adjustedFrame < 0) return null;

  const totalRange = from - to;
  const countdownDuration = durationInFrames - delayFrames;

  // Progress: 0 = full, 1 = depleted
  const progress = interpolate(adjustedFrame, [0, countdownDuration], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const currentNumber = Math.max(
    to,
    Math.ceil(from - progress * totalRange)
  );

  // Entry animation
  const entryScale = spring({
    frame: adjustedFrame,
    fps,
    config: { damping: 14, stiffness: 100 },
  });

  // Number change pop: detect when number changes
  const prevNumber = Math.max(
    to,
    Math.ceil(from - interpolate(
      Math.max(0, adjustedFrame - 1),
      [0, countdownDuration],
      [0, 1],
      { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
    ) * totalRange)
  );

  const numberChanged = currentNumber !== prevNumber;
  const framesSinceChange = numberChanged ? 0 : adjustedFrame % Math.ceil(countdownDuration / totalRange);

  const numberSpring = spring({
    frame: framesSinceChange,
    fps,
    config: { damping: 10, stiffness: 200 },
    durationInFrames: 15,
  });

  const numberScale = interpolate(numberSpring, [0, 1], [1.2, 1]);

  return (
    <AbsoluteFill
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {countdownStyle === "circular" ? (
        <CircularCountdown
          progress={progress}
          currentNumber={currentNumber}
          color={color}
          size={size}
          label={label}
          entryScale={entryScale}
          numberSpring={numberScale}
        />
      ) : (
        <DigitalCountdown
          currentNumber={currentNumber}
          color={color}
          size={size}
          label={label}
          entryScale={entryScale}
          numberSpring={numberScale}
          progress={progress}
        />
      )}
    </AbsoluteFill>
  );
};

export default CountdownTimer;
