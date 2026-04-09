import React from "react";
import {
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from "remotion";

interface PieSegment {
  label: string;
  value: number;
  color: string;
}

interface PieChartProps {
  segments: PieSegment[];
  size?: number;
  showLabels?: boolean;
  delay?: number;
}

const describeArc = (
  cx: number,
  cy: number,
  r: number,
  startAngle: number,
  endAngle: number
): string => {
  const start = polarToCartesian(cx, cy, r, endAngle);
  const end = polarToCartesian(cx, cy, r, startAngle);
  const largeArc = endAngle - startAngle > 180 ? 1 : 0;
  return [
    "M",
    cx,
    cy,
    "L",
    start.x,
    start.y,
    "A",
    r,
    r,
    0,
    largeArc,
    0,
    end.x,
    end.y,
    "Z",
  ].join(" ");
};

const polarToCartesian = (
  cx: number,
  cy: number,
  r: number,
  angleDeg: number
) => {
  const angleRad = ((angleDeg - 90) * Math.PI) / 180;
  return {
    x: cx + r * Math.cos(angleRad),
    y: cy + r * Math.sin(angleRad),
  };
};

export const PieChart: React.FC<PieChartProps> = ({
  segments,
  size = 300,
  showLabels = true,
  delay = 0,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const delayFrames = Math.round(delay * fps);

  const total = segments.reduce((sum, s) => sum + s.value, 0);
  const cx = size / 2;
  const cy = size / 2;
  const r = size / 2 - 10;

  const scaleIn = spring({
    frame: Math.max(0, frame - delayFrames),
    fps,
    config: { damping: 12, stiffness: 80 },
    durationInFrames: 30,
  });

  let cumulativeAngle = 0;

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
        {/* Drop shadow */}
        <defs>
          <filter id="pie-shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow
              dx="0"
              dy="4"
              stdDeviation="8"
              floodColor="rgba(0,0,0,0.3)"
            />
          </filter>
        </defs>
        <g filter="url(#pie-shadow)">
          {segments.map((segment, i) => {
            const segmentAngle = (segment.value / total) * 360;
            const startAngle = cumulativeAngle;
            cumulativeAngle += segmentAngle;

            const stagger = spring({
              frame: Math.max(0, frame - delayFrames - i * 3),
              fps,
              config: { damping: 14, stiffness: 100 },
              durationInFrames: 60,
            });

            const actualEnd = startAngle + segmentAngle * stagger;

            if (actualEnd - startAngle < 0.1) return null;

            const midAngle = startAngle + segmentAngle / 2;
            const labelPos = polarToCartesian(cx, cy, r * 0.65, midAngle);

            return (
              <g key={i}>
                <path
                  d={describeArc(cx, cy, r, startAngle, actualEnd)}
                  fill={segment.color}
                  stroke="rgba(0,0,0,0.15)"
                  strokeWidth={1.5}
                />
                {showLabels && stagger > 0.7 && (
                  <text
                    x={labelPos.x}
                    y={labelPos.y}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fill="white"
                    fontSize={14}
                    fontFamily="Inter, system-ui, sans-serif"
                    fontWeight={600}
                    style={{
                      opacity: interpolate(stagger, [0.7, 1], [0, 1]),
                      textShadow: "0 1px 3px rgba(0,0,0,0.5)",
                    }}
                  >
                    {segment.label}
                  </text>
                )}
              </g>
            );
          })}
        </g>
      </svg>
    </div>
  );
};

export default PieChart;
