import React from "react";
import {
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from "remotion";

interface Bar {
  label: string;
  value: number;
  color: string;
}

interface BarChartProps {
  bars: Bar[];
  maxValue?: number;
  showValues?: boolean;
  delay?: number;
}

export const BarChart: React.FC<BarChartProps> = ({
  bars,
  maxValue,
  showValues = true,
  delay = 0,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const delayFrames = Math.round(delay * fps);
  const computedMax = maxValue ?? Math.max(...bars.map((b) => b.value));

  const width = 500;
  const height = 300;
  const padding = { top: 30, right: 20, bottom: 50, left: 20 };
  const chartW = width - padding.left - padding.right;
  const chartH = height - padding.top - padding.bottom;
  const barGap = 12;
  const barWidth = (chartW - barGap * (bars.length - 1)) / bars.length;

  const containerScale = spring({
    frame: Math.max(0, frame - delayFrames),
    fps,
    config: { damping: 12, stiffness: 80 },
    durationInFrames: 25,
  });

  return (
    <div
      style={{
        width,
        height,
        position: "relative",
        transform: `scale(${containerScale})`,
        transformOrigin: "center bottom",
      }}
    >
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
        <defs>
          <filter id="bar-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Horizontal grid lines */}
        {[0, 0.25, 0.5, 0.75, 1].map((frac, i) => {
          const y = padding.top + chartH * (1 - frac);
          return (
            <line
              key={i}
              x1={padding.left}
              y1={y}
              x2={padding.left + chartW}
              y2={y}
              stroke="rgba(255,255,255,0.08)"
              strokeWidth={1}
            />
          );
        })}

        {/* Baseline */}
        <line
          x1={padding.left}
          y1={padding.top + chartH}
          x2={padding.left + chartW}
          y2={padding.top + chartH}
          stroke="rgba(255,255,255,0.2)"
          strokeWidth={1.5}
        />

        {bars.map((bar, i) => {
          const barProgress = spring({
            frame: Math.max(0, frame - delayFrames - i * 5),
            fps,
            config: { damping: 14, stiffness: 100 },
            durationInFrames: 50,
          });

          const barH = (bar.value / computedMax) * chartH * barProgress;
          const x = padding.left + i * (barWidth + barGap);
          const y = padding.top + chartH - barH;

          const labelOpacity = interpolate(barProgress, [0.5, 1], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });

          return (
            <g key={i}>
              {/* Bar with rounded top */}
              <rect
                x={x}
                y={y}
                width={barWidth}
                height={barH}
                rx={barWidth > 20 ? 6 : 3}
                ry={barWidth > 20 ? 6 : 3}
                fill={bar.color}
                opacity={0.9}
              />

              {/* Shine overlay */}
              <rect
                x={x}
                y={y}
                width={barWidth * 0.4}
                height={barH}
                rx={barWidth > 20 ? 6 : 3}
                ry={barWidth > 20 ? 6 : 3}
                fill="rgba(255,255,255,0.12)"
              />

              {/* Value above bar */}
              {showValues && (
                <text
                  x={x + barWidth / 2}
                  y={y - 10}
                  textAnchor="middle"
                  fill="white"
                  fontSize={16}
                  fontWeight={700}
                  fontFamily="Inter, system-ui, sans-serif"
                  opacity={labelOpacity}
                >
                  {Math.round(bar.value * barProgress)}
                </text>
              )}

              {/* Label below */}
              <text
                x={x + barWidth / 2}
                y={padding.top + chartH + 28}
                textAnchor="middle"
                fill="rgba(255,255,255,0.7)"
                fontSize={14}
                fontWeight={500}
                fontFamily="Inter, system-ui, sans-serif"
                opacity={labelOpacity}
              >
                {bar.label}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};

export default BarChart;
