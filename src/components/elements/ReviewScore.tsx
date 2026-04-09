import React from "react";
import {
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from "remotion";

interface ReviewScoreProps {
  score: number;
  maxScore?: number;
  label?: string;
  reviewCount?: number;
  ringColor?: string;
  size?: number;
  delay?: number;
}

export const ReviewScore: React.FC<ReviewScoreProps> = ({
  score,
  maxScore = 5,
  label = "Overall Rating",
  reviewCount,
  ringColor = "#6429cd",
  size = 200,
  delay = 0,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const delayFrames = Math.round(delay * fps);
  const adjustedFrame = Math.max(0, frame - delayFrames);

  const springConfig = { damping: 14, stiffness: 100 };

  // Container entry
  const entryProgress = spring({
    frame: adjustedFrame,
    fps,
    config: springConfig,
  });

  const entryOpacity = interpolate(entryProgress, [0, 1], [0, 1]);
  const entryScale = interpolate(entryProgress, [0, 1], [0.85, 1]);

  // Ring animation
  const ringProgress = spring({
    frame: Math.max(0, adjustedFrame - 6),
    fps,
    config: { damping: 18, stiffness: 60 },
  });

  // Score number count-up
  const scoreProgress = spring({
    frame: Math.max(0, adjustedFrame - 4),
    fps,
    config: { damping: 20, stiffness: 50 },
  });

  const displayScore = interpolate(scoreProgress, [0, 1], [0, score]);

  // Label fade
  const labelProgress = spring({
    frame: Math.max(0, adjustedFrame - 16),
    fps,
    config: springConfig,
  });
  const labelOpacity = interpolate(labelProgress, [0, 1], [0, 1]);
  const labelY = interpolate(labelProgress, [0, 1], [10, 0]);

  // Review count
  const countProgress = spring({
    frame: Math.max(0, adjustedFrame - 22),
    fps,
    config: springConfig,
  });
  const countOpacity = interpolate(countProgress, [0, 1], [0, 1]);

  // Ring geometry
  const strokeWidth = size * 0.06;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const percentage = score / maxScore;
  const filledLength = circumference * percentage * ringProgress;
  const emptyLength = circumference - filledLength;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        opacity: entryOpacity,
        transform: `scale(${entryScale})`,
      }}
    >
      {/* Circular score */}
      <div
        style={{
          position: "relative",
          width: size,
          height: size,
        }}
      >
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          style={{ transform: "rotate(-90deg)" }}
        >
          {/* Background ring */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="rgba(255, 255, 255, 0.08)"
            strokeWidth={strokeWidth}
          />

          {/* Progress ring */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={ringColor}
            strokeWidth={strokeWidth}
            strokeDasharray={`${filledLength} ${emptyLength}`}
            strokeLinecap="round"
            style={{
              filter: `drop-shadow(0 0 8px ${ringColor}60)`,
            }}
          />

          {/* Glow overlay */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={ringColor}
            strokeWidth={strokeWidth * 0.4}
            strokeDasharray={`${filledLength} ${emptyLength}`}
            strokeLinecap="round"
            opacity={0.4}
            style={{
              filter: `blur(4px)`,
            }}
          />
        </svg>

        {/* Center content */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: size,
            height: size,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {/* Score number */}
          <div
            style={{
              fontSize: size * 0.3,
              fontWeight: 800,
              fontFamily: "'Helvetica Neue', Arial, sans-serif",
              color: "#ffffff",
              letterSpacing: "-0.02em",
              lineHeight: 1,
            }}
          >
            {displayScore.toFixed(1)}
          </div>

          {/* "out of X" */}
          <div
            style={{
              fontSize: size * 0.08,
              fontFamily: "'Helvetica Neue', Arial, sans-serif",
              color: "rgba(255, 255, 255, 0.4)",
              marginTop: 4,
              letterSpacing: "0.05em",
              textTransform: "uppercase" as const,
            }}
          >
            out of {maxScore}
          </div>
        </div>
      </div>

      {/* Label */}
      <div
        style={{
          marginTop: 20,
          fontSize: size * 0.1,
          fontWeight: 600,
          fontFamily: "'Helvetica Neue', Arial, sans-serif",
          color: "#ffffff",
          letterSpacing: "0.04em",
          opacity: labelOpacity,
          transform: `translateY(${labelY}px)`,
        }}
      >
        {label}
      </div>

      {/* Review count */}
      {reviewCount !== undefined && (
        <div
          style={{
            marginTop: 8,
            fontSize: size * 0.075,
            fontFamily: "'Helvetica Neue', Arial, sans-serif",
            color: "rgba(255, 255, 255, 0.45)",
            opacity: countOpacity,
            letterSpacing: "0.02em",
          }}
        >
          Based on {reviewCount.toLocaleString()} reviews
        </div>
      )}

      {/* Glass card behind (decorative) */}
      <div
        style={{
          position: "absolute",
          top: -20,
          left: "50%",
          transform: "translateX(-50%)",
          width: size * 1.3,
          height: size * 1.8,
          background: "rgba(255, 255, 255, 0.04)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          border: "1px solid rgba(255, 255, 255, 0.06)",
          borderRadius: 24,
          zIndex: -1,
        }}
      />
    </div>
  );
};

export default ReviewScore;
