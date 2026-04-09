import React from "react";
import {
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from "remotion";

interface GaugeDialProps {
  value: number;
  min?: number;
  max?: number;
  label?: string;
  color?: string;
  delay?: number;
}

export const GaugeDial: React.FC<GaugeDialProps> = ({
  value,
  min = 0,
  max = 100,
  label = "",
  color = "#6429cd",
  delay = 0,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const delayFrames = Math.round(delay * fps);
  const size = 300;
  const cx = size / 2;
  const cy = size / 2 + 20;
  const outerR = 120;
  const trackWidth = 18;
  const innerR = outerR - trackWidth;

  const normalized = Math.min(1, Math.max(0, (value - min) / (max - min)));

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

  const animatedNorm = normalized * progress;

  // Arc from -180deg to 0deg (semicircle, left to right)
  const startAngleDeg = -180;
  const endAngleDeg = 0;
  const sweepDeg = (endAngleDeg - startAngleDeg) * animatedNorm;

  const toRad = (deg: number) => (deg * Math.PI) / 180;

  const describeArc = (r: number, startDeg: number, sweepDegs: number) => {
    if (sweepDegs < 0.1) return "";
    const startRad = toRad(startDeg);
    const endRad = toRad(startDeg + sweepDegs);
    const x1 = cx + r * Math.cos(startRad);
    const y1 = cy + r * Math.sin(startRad);
    const x2 = cx + r * Math.cos(endRad);
    const y2 = cy + r * Math.sin(endRad);
    const largeArc = sweepDegs > 180 ? 1 : 0;
    return `M ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2}`;
  };

  // Needle angle
  const needleAngleDeg = startAngleDeg + 180 * animatedNorm;
  const needleRad = toRad(needleAngleDeg);
  const needleLen = outerR - 8;
  const needleX = cx + needleLen * Math.cos(needleRad);
  const needleY = cy + needleLen * Math.sin(needleRad);

  const labelOpacity = interpolate(progress, [0.5, 1], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const displayValue = Math.round(min + (max - min) * animatedNorm);

  return (
    <div
      style={{
        width: size,
        height: size * 0.65,
        position: "relative",
        transform: `scale(${scaleIn})`,
        overflow: "hidden",
      }}
    >
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <defs>
          <linearGradient id="gauge-grad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={color} stopOpacity={0.4} />
            <stop offset="100%" stopColor={color} stopOpacity={1} />
          </linearGradient>
          <filter id="gauge-glow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Track background */}
        <path
          d={describeArc((outerR + innerR) / 2, -180, 180)}
          fill="none"
          stroke="rgba(255,255,255,0.1)"
          strokeWidth={trackWidth}
          strokeLinecap="round"
        />

        {/* Active arc */}
        {sweepDeg > 0.1 && (
          <path
            d={describeArc((outerR + innerR) / 2, -180, sweepDeg)}
            fill="none"
            stroke="url(#gauge-grad)"
            strokeWidth={trackWidth}
            strokeLinecap="round"
            filter="url(#gauge-glow)"
          />
        )}

        {/* Tick marks */}
        {Array.from({ length: 11 }).map((_, i) => {
          const angle = toRad(-180 + (180 * i) / 10);
          const tickOuter = outerR + 8;
          const tickInner = outerR + 2;
          return (
            <line
              key={i}
              x1={cx + tickInner * Math.cos(angle)}
              y1={cy + tickInner * Math.sin(angle)}
              x2={cx + tickOuter * Math.cos(angle)}
              y2={cy + tickOuter * Math.sin(angle)}
              stroke="rgba(255,255,255,0.25)"
              strokeWidth={i % 5 === 0 ? 2 : 1}
              strokeLinecap="round"
            />
          );
        })}

        {/* Needle */}
        <line
          x1={cx}
          y1={cy}
          x2={needleX}
          y2={needleY}
          stroke="white"
          strokeWidth={3}
          strokeLinecap="round"
          filter="url(#gauge-glow)"
        />

        {/* Center dot */}
        <circle cx={cx} cy={cy} r={8} fill="white" />
        <circle cx={cx} cy={cy} r={4} fill={color} />

        {/* Min / Max labels */}
        <text
          x={cx - outerR - 5}
          y={cy + 22}
          textAnchor="middle"
          fill="rgba(255,255,255,0.5)"
          fontSize={13}
          fontFamily="Inter, system-ui, sans-serif"
          fontWeight={500}
        >
          {min}
        </text>
        <text
          x={cx + outerR + 5}
          y={cy + 22}
          textAnchor="middle"
          fill="rgba(255,255,255,0.5)"
          fontSize={13}
          fontFamily="Inter, system-ui, sans-serif"
          fontWeight={500}
        >
          {max}
        </text>
      </svg>

      {/* Value + Label overlay */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          width: size,
          textAlign: "center",
          opacity: labelOpacity,
        }}
      >
        <div
          style={{
            fontSize: 52,
            fontWeight: 800,
            color: "white",
            fontFamily: "Inter, system-ui, sans-serif",
            lineHeight: 1,
            textShadow: "0 2px 10px rgba(0,0,0,0.3)",
          }}
        >
          {displayValue}
        </div>
        {label && (
          <div
            style={{
              fontSize: 16,
              fontWeight: 500,
              color: "rgba(255,255,255,0.65)",
              fontFamily: "Inter, system-ui, sans-serif",
              marginTop: 4,
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

export default GaugeDial;
