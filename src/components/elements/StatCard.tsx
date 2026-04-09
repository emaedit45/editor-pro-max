import React from "react";
import {
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from "remotion";

interface StatCardProps {
  value: string;
  label: string;
  delta?: string;
  deltaDirection?: "up" | "down";
  color?: string;
  delay?: number;
}

export const StatCard: React.FC<StatCardProps> = ({
  value,
  label,
  delta,
  deltaDirection = "up",
  color = "#6429cd",
  delay = 0,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const delayFrames = Math.round(delay * fps);

  const slideUp = spring({
    frame: Math.max(0, frame - delayFrames),
    fps,
    config: { damping: 14, stiffness: 100 },
    durationInFrames: 40,
  });

  const contentFade = spring({
    frame: Math.max(0, frame - delayFrames - 8),
    fps,
    config: { damping: 14, stiffness: 100 },
    durationInFrames: 30,
  });

  const deltaFade = spring({
    frame: Math.max(0, frame - delayFrames - 16),
    fps,
    config: { damping: 14, stiffness: 100 },
    durationInFrames: 30,
  });

  const translateY = interpolate(slideUp, [0, 1], [40, 0]);
  const cardOpacity = interpolate(slideUp, [0, 1], [0, 1]);

  const isUp = deltaDirection === "up";
  const deltaColor = isUp ? "#34d399" : "#f87171";

  // Count-up effect for numeric values
  const numericValue = parseFloat(value.replace(/[^0-9.]/g, ""));
  const valuePrefix = value.replace(/[0-9.].*/g, "");
  const isNumeric = !isNaN(numericValue) && value.match(/[0-9]/);

  const countProgress = spring({
    frame: Math.max(0, frame - delayFrames - 5),
    fps,
    config: { damping: 20, stiffness: 60 },
    durationInFrames: 50,
  });

  const displayValue = isNumeric
    ? `${valuePrefix}${Math.round(numericValue * countProgress)}${value.replace(/^[^0-9]*[0-9.]+/, "")}`
    : value;

  return (
    <div
      style={{
        width: 320,
        padding: "32px 36px",
        borderRadius: 20,
        background: `linear-gradient(135deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.04) 100%)`,
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        border: "1px solid rgba(255,255,255,0.15)",
        boxShadow: `0 8px 32px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.1)`,
        transform: `translateY(${translateY}px)`,
        opacity: cardOpacity,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Accent glow */}
      <div
        style={{
          position: "absolute",
          top: -40,
          right: -40,
          width: 120,
          height: 120,
          borderRadius: "50%",
          background: color,
          opacity: 0.15,
          filter: "blur(40px)",
        }}
      />

      {/* Top accent bar */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 36,
          right: 36,
          height: 3,
          borderRadius: "0 0 3px 3px",
          background: `linear-gradient(90deg, ${color}, ${color}88)`,
          opacity: contentFade,
        }}
      />

      {/* Label */}
      <div
        style={{
          fontSize: 16,
          fontWeight: 500,
          color: "rgba(255,255,255,0.6)",
          fontFamily: "Inter, system-ui, sans-serif",
          textTransform: "uppercase",
          letterSpacing: 1.5,
          marginBottom: 12,
          opacity: contentFade,
        }}
      >
        {label}
      </div>

      {/* Big value */}
      <div
        style={{
          fontSize: 56,
          fontWeight: 800,
          color: "white",
          fontFamily: "Inter, system-ui, sans-serif",
          lineHeight: 1,
          opacity: contentFade,
          textShadow: "0 2px 8px rgba(0,0,0,0.2)",
        }}
      >
        {displayValue}
      </div>

      {/* Delta indicator */}
      {delta && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            marginTop: 16,
            opacity: deltaFade,
          }}
        >
          {/* Arrow */}
          <svg
            width={18}
            height={18}
            viewBox="0 0 18 18"
            style={{
              transform: isUp ? "rotate(0deg)" : "rotate(180deg)",
            }}
          >
            <path
              d="M9 3L15 11H3L9 3Z"
              fill={deltaColor}
            />
          </svg>

          <span
            style={{
              fontSize: 18,
              fontWeight: 700,
              color: deltaColor,
              fontFamily: "Inter, system-ui, sans-serif",
            }}
          >
            {delta}
          </span>
        </div>
      )}
    </div>
  );
};

export default StatCard;
