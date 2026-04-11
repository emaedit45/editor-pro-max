import React from "react";
import {
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from "remotion";

interface GrowthChartProps {
  data?: number[];
  color?: string;
  label?: string;
  labelValue?: string;
  delay?: number;
}

export const GrowthChart: React.FC<GrowthChartProps> = ({
  data = [10, 25, 40, 55, 75, 90, 100],
  color = "#6429cd",
  label = "Growth",
  labelValue = "+127%",
  delay = 0,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const delayFrames = Math.round(delay * fps);
  const springConfig = { damping: 14, stiffness: 100 };

  // Card entrance
  const cardIn = spring({
    frame: Math.max(0, frame - delayFrames),
    fps,
    config: springConfig,
    durationInFrames: 40,
  });

  // Line draw progress
  const lineProgress = spring({
    frame: Math.max(0, frame - delayFrames - 10),
    fps,
    config: { damping: 20, stiffness: 60 },
    durationInFrames: 60,
  });

  // Header content fade
  const headerFade = spring({
    frame: Math.max(0, frame - delayFrames - 5),
    fps,
    config: springConfig,
    durationInFrames: 30,
  });

  const cardScale = interpolate(cardIn, [0, 1], [0.85, 1]);
  const cardOpacity = interpolate(cardIn, [0, 0.4, 1], [0, 0.6, 1]);

  // Chart dimensions
  const chartWidth = 340;
  const chartHeight = 160;
  const paddingX = 20;
  const paddingY = 15;
  const plotW = chartWidth - paddingX * 2;
  const plotH = chartHeight - paddingY * 2;

  const maxVal = Math.max(...data);
  const minVal = Math.min(...data);
  const range = maxVal - minVal || 1;

  // Calculate normalized points
  const points = data.map((val, i) => ({
    x: paddingX + (i / (data.length - 1)) * plotW,
    y: paddingY + plotH - ((val - minVal) / range) * plotH,
  }));

  // Build smooth bezier path
  const pathD = buildSmoothPath(points);

  // Area path (for gradient fill)
  const areaD = `${pathD} L ${points[points.length - 1].x} ${chartHeight - paddingY} L ${points[0].x} ${chartHeight - paddingY} Z`;

  // Approximate total path length for stroke-dasharray animation
  const totalLength = 1200;

  const gradientId = `growthGrad-${color.replace("#", "")}`;
  const areaGradientId = `areaGrad-${color.replace("#", "")}`;

  return (
    <div
      style={{
        width: 380,
        background: "rgba(255,255,255,0.06)",
        backdropFilter: "blur(20px)",
        borderRadius: 20,
        border: "1px solid rgba(255,255,255,0.1)",
        padding: 20,
        transform: `scale(${cardScale})`,
        opacity: cardOpacity,
        boxShadow: `0 20px 60px rgba(0,0,0,0.3), 0 0 40px ${color}15`,
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: 16,
          opacity: headerFade,
          transform: `translateY(${interpolate(headerFade, [0, 1], [10, 0])}px)`,
        }}
      >
        <div>
          <div
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: 13,
              fontWeight: 500,
              color: "rgba(255,255,255,0.5)",
              letterSpacing: 0.8,
              textTransform: "uppercase",
              marginBottom: 4,
            }}
          >
            {label}
          </div>
          <div
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: 32,
              fontWeight: 700,
              color: "#ffffff",
              letterSpacing: -1,
            }}
          >
            {labelValue}
          </div>
        </div>
        {/* Trend indicator */}
        <div
          style={{
            background: `${color}20`,
            borderRadius: 10,
            padding: "6px 12px",
            display: "flex",
            alignItems: "center",
            gap: 4,
          }}
        >
          <span style={{ fontSize: 14, color }}>&#9650;</span>
          <span
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: 13,
              fontWeight: 600,
              color,
            }}
          >
            {labelValue}
          </span>
        </div>
      </div>

      {/* Chart SVG */}
      <svg
        width={chartWidth}
        height={chartHeight}
        viewBox={`0 0 ${chartWidth} ${chartHeight}`}
        style={{ width: "100%", height: "auto" }}
      >
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor={color} stopOpacity={0.6} />
            <stop offset="100%" stopColor={color} stopOpacity={1} />
          </linearGradient>
          <linearGradient id={areaGradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.3} />
            <stop offset="100%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>

        {/* Horizontal grid lines */}
        {[0.25, 0.5, 0.75].map((frac) => (
          <line
            key={frac}
            x1={paddingX}
            y1={paddingY + plotH * (1 - frac)}
            x2={paddingX + plotW}
            y2={paddingY + plotH * (1 - frac)}
            stroke="rgba(255,255,255,0.06)"
            strokeWidth={1}
          />
        ))}

        {/* Area fill */}
        <path
          d={areaD}
          fill={`url(#${areaGradientId})`}
          opacity={lineProgress * 0.8}
        />

        {/* Animated line */}
        <path
          d={pathD}
          fill="none"
          stroke={`url(#${gradientId})`}
          strokeWidth={3}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray={totalLength}
          strokeDashoffset={totalLength * (1 - lineProgress)}
        />

        {/* Data point dots */}
        {points.map((pt, i) => {
          const pointProgress = interpolate(
            lineProgress,
            [
              Math.max(0, i / (points.length - 1) - 0.05),
              i / (points.length - 1) + 0.05,
            ],
            [0, 1],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
          );

          const dotScale = spring({
            frame: Math.max(0, frame - delayFrames - 10 - i * 4),
            fps,
            config: { damping: 10, stiffness: 150 },
            durationInFrames: 20,
          });

          return (
            <g key={i}>
              {/* Glow */}
              <circle
                cx={pt.x}
                cy={pt.y}
                r={8 * dotScale}
                fill={color}
                opacity={0.2 * pointProgress}
              />
              {/* Outer ring */}
              <circle
                cx={pt.x}
                cy={pt.y}
                r={5 * dotScale}
                fill="none"
                stroke={color}
                strokeWidth={2}
                opacity={pointProgress}
              />
              {/* Inner dot */}
              <circle
                cx={pt.x}
                cy={pt.y}
                r={3 * dotScale}
                fill="#ffffff"
                opacity={pointProgress}
              />
            </g>
          );
        })}
      </svg>
    </div>
  );
};

function buildSmoothPath(points: { x: number; y: number }[]): string {
  if (points.length < 2) return "";

  let d = `M ${points[0].x} ${points[0].y}`;

  for (let i = 0; i < points.length - 1; i++) {
    const curr = points[i];
    const next = points[i + 1];
    const prev = points[i - 1] || curr;
    const afterNext = points[i + 2] || next;

    const tension = 0.3;

    const cp1x = curr.x + (next.x - prev.x) * tension;
    const cp1y = curr.y + (next.y - prev.y) * tension;
    const cp2x = next.x - (afterNext.x - curr.x) * tension;
    const cp2y = next.y - (afterNext.y - curr.y) * tension;

    d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${next.x} ${next.y}`;
  }

  return d;
}
