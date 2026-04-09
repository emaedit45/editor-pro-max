import React from "react";
import {
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from "remotion";

interface DonutSegment {
  label: string;
  value: number;
  color: string;
}

interface DonutChartProps {
  segments: DonutSegment[];
  thickness?: number;
  centerLabel?: string;
  centerValue?: string;
  delay?: number;
}

export const DonutChart: React.FC<DonutChartProps> = ({
  segments,
  thickness = 40,
  centerLabel = "",
  centerValue = "",
  delay = 0,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const delayFrames = Math.round(delay * fps);
  const size = 300;
  const cx = size / 2;
  const cy = size / 2;
  const outerR = size / 2 - 10;
  const innerR = outerR - thickness;

  const total = segments.reduce((sum, s) => sum + s.value, 0);

  const scaleIn = spring({
    frame: Math.max(0, frame - delayFrames),
    fps,
    config: { damping: 12, stiffness: 80 },
    durationInFrames: 30,
  });

  const centerOpacity = interpolate(
    spring({
      frame: Math.max(0, frame - delayFrames - 15),
      fps,
      config: { damping: 14, stiffness: 100 },
    }),
    [0, 1],
    [0, 1]
  );

  // Count-up for center value
  const countProgress = spring({
    frame: Math.max(0, frame - delayFrames - 10),
    fps,
    config: { damping: 20, stiffness: 60 },
    durationInFrames: 60,
  });

  const numericCenter = parseFloat(centerValue.replace(/[^0-9.]/g, ""));
  const prefix = centerValue.replace(/[0-9.].*/g, "");
  const suffix = centerValue.replace(/.*[0-9.]/, "");
  const isNumeric = !isNaN(numericCenter);
  const displayValue = isNumeric
    ? `${prefix}${Math.round(numericCenter * countProgress)}${suffix}`
    : centerValue;

  const polarToCartesian = (r: number, angleDeg: number) => {
    const angleRad = ((angleDeg - 90) * Math.PI) / 180;
    return {
      x: cx + r * Math.cos(angleRad),
      y: cy + r * Math.sin(angleRad),
    };
  };

  const describeDonutArc = (
    startAngle: number,
    endAngle: number
  ): string => {
    const outerStart = polarToCartesian(outerR, endAngle);
    const outerEnd = polarToCartesian(outerR, startAngle);
    const innerStart = polarToCartesian(innerR, startAngle);
    const innerEnd = polarToCartesian(innerR, endAngle);
    const largeArc = endAngle - startAngle > 180 ? 1 : 0;

    return [
      "M", outerStart.x, outerStart.y,
      "A", outerR, outerR, 0, largeArc, 0, outerEnd.x, outerEnd.y,
      "L", innerStart.x, innerStart.y,
      "A", innerR, innerR, 0, largeArc, 1, innerEnd.x, innerEnd.y,
      "Z",
    ].join(" ");
  };

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
        <defs>
          <filter id="donut-shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow
              dx="0"
              dy="4"
              stdDeviation="8"
              floodColor="rgba(0,0,0,0.3)"
            />
          </filter>
        </defs>

        {/* Track */}
        <circle
          cx={cx}
          cy={cy}
          r={(outerR + innerR) / 2}
          fill="none"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth={thickness}
        />

        <g filter="url(#donut-shadow)">
          {segments.map((segment, i) => {
            const segmentAngle = (segment.value / total) * 360;
            const startAngle = cumulativeAngle;

            const stagger = spring({
              frame: Math.max(0, frame - delayFrames - i * 4),
              fps,
              config: { damping: 14, stiffness: 100 },
              durationInFrames: 60,
            });

            const actualEnd = startAngle + segmentAngle * stagger;
            cumulativeAngle += segmentAngle;

            if (actualEnd - startAngle < 0.1) return null;

            return (
              <path
                key={i}
                d={describeDonutArc(startAngle, actualEnd)}
                fill={segment.color}
                stroke="rgba(0,0,0,0.1)"
                strokeWidth={1}
              />
            );
          })}
        </g>
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
          opacity: centerOpacity,
        }}
      >
        <div
          style={{
            fontSize: 48,
            fontWeight: 800,
            color: "white",
            fontFamily: "Inter, system-ui, sans-serif",
            lineHeight: 1,
            textShadow: "0 2px 8px rgba(0,0,0,0.3)",
          }}
        >
          {displayValue}
        </div>
        {centerLabel && (
          <div
            style={{
              fontSize: 16,
              fontWeight: 500,
              color: "rgba(255,255,255,0.7)",
              fontFamily: "Inter, system-ui, sans-serif",
              marginTop: 4,
              textTransform: "uppercase",
              letterSpacing: 1.5,
            }}
          >
            {centerLabel}
          </div>
        )}
      </div>
    </div>
  );
};

export default DonutChart;
