import React from "react";
import {
  useCurrentFrame,
  useVideoConfig,
  spring,
} from "remotion";

interface ProgressCircleProps {
  value: number;
  max?: number;
  color?: string;
  trackColor?: string;
  size?: number;
  label?: string;
  delay?: number;
}

export const ProgressCircle: React.FC<ProgressCircleProps> = ({
  value,
  max = 100,
  color = "#6429cd",
  trackColor = "rgba(255,255,255,0.1)",
  size = 240,
  label = "",
  delay = 0,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const delayFrames = Math.round(delay * fps);

  const progress = spring({
    frame: Math.max(0, frame - delayFrames),
    fps,
    config: { damping: 14, stiffness: 100 },
    durationInFrames: 60,
  });

  const scaleIn = spring({
    frame: Math.max(0, frame - delayFrames),
    fps,
    config: { damping: 12, stiffness: 80 },
    durationInFrames: 25,
  });

  const contentFade = spring({
    frame: Math.max(0, frame - delayFrames - 10),
    fps,
    config: { damping: 14, stiffness: 100 },
    durationInFrames: 30,
  });

  const normalized = Math.min(1, Math.max(0, value / max));
  const animatedNorm = normalized * progress;

  const strokeWidth = size * 0.08;
  const radius = (size - strokeWidth) / 2 - 4;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference * (1 - animatedNorm);

  const percentage = Math.round(animatedNorm * 100);

  return (
    <div
      style={{
        width: size,
        height: size,
        position: "relative",
        transform: `scale(${scaleIn})`,
      }}
    >
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <defs>
          <linearGradient
            id="progress-grad"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <stop offset="0%" stopColor={color} />
            <stop offset="100%" stopColor="#ff6b35" />
          </linearGradient>
          <filter
            id="progress-glow"
            x="-20%"
            y="-20%"
            width="140%"
            height="140%"
          >
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={trackColor}
          strokeWidth={strokeWidth}
        />

        {/* Progress ring */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="url(#progress-grad)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          filter="url(#progress-glow)"
        />

        {/* End dot */}
        {animatedNorm > 0.01 && (
          <circle
            cx={
              size / 2 +
              radius * Math.cos(2 * Math.PI * animatedNorm - Math.PI / 2)
            }
            cy={
              size / 2 +
              radius * Math.sin(2 * Math.PI * animatedNorm - Math.PI / 2)
            }
            r={strokeWidth * 0.7}
            fill="white"
            opacity={0.9}
          />
        )}
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
          opacity: contentFade,
        }}
      >
        <div
          style={{
            fontSize: size * 0.22,
            fontWeight: 800,
            color: "white",
            fontFamily: "Inter, system-ui, sans-serif",
            lineHeight: 1,
            textShadow: "0 2px 10px rgba(0,0,0,0.3)",
          }}
        >
          {percentage}
          <span
            style={{
              fontSize: size * 0.1,
              fontWeight: 600,
              opacity: 0.7,
            }}
          >
            %
          </span>
        </div>
        {label && (
          <div
            style={{
              fontSize: size * 0.065,
              fontWeight: 500,
              color: "rgba(255,255,255,0.6)",
              fontFamily: "Inter, system-ui, sans-serif",
              marginTop: 6,
              textTransform: "uppercase",
              letterSpacing: 1.5,
            }}
          >
            {label}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProgressCircle;
