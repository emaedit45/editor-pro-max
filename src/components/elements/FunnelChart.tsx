import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";

interface FunnelStage {
  label: string;
  value: number;
  color: string;
}

interface FunnelChartProps {
  stages: FunnelStage[];
  showPercentage?: boolean;
  delay?: number;
}

export const FunnelChart: React.FC<FunnelChartProps> = ({
  stages,
  showPercentage = true,
  delay = 0,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const delayFrames = Math.round(delay * fps);
  const cfg = { damping: 14, stiffness: 100 };
  const width = 500, height = 320;
  const maxVal = Math.max(...stages.map((s) => s.value));
  const stageH = height / stages.length;

  return (
    <div style={{ width, height, position: "relative" }}>
      {stages.map((stage, i) => {
        const progress = spring({
          frame: Math.max(0, frame - delayFrames - i * 8),
          fps, config: cfg, durationInFrames: 45,
        });
        const frac = stage.value / maxVal;
        const barW = frac * (width - 80);
        const slideY = interpolate(progress, [0, 1], [-40, 0], { extrapolateRight: "clamp" });
        const opacity = interpolate(progress, [0, 0.5], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        const pct = stages[0].value > 0 ? Math.round((stage.value / stages[0].value) * 100) : 0;

        return (
          <div key={i} style={{
            position: "absolute",
            top: i * stageH,
            left: (width - barW) / 2,
            width: barW,
            height: stageH - 4,
            backgroundColor: stage.color,
            borderRadius: 6,
            opacity,
            transform: `translateY(${slideY}px)`,
            display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
          }}>
            <span style={{
              color: "#fff", fontSize: 14, fontWeight: 700,
              fontFamily: "Inter, system-ui, sans-serif",
            }}>
              {stage.label}
            </span>
            {showPercentage && (
              <span style={{
                color: "rgba(255,255,255,0.7)", fontSize: 12,
                fontFamily: "Inter, system-ui, sans-serif",
              }}>
                {pct}%
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default FunnelChart;
