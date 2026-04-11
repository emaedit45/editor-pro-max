import React from "react";
import {
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from "remotion";

interface GradientTextProps {
  text: string;
  colors?: string[];
  angle?: number;
  fontSize?: number;
  fontWeight?: number;
  fontFamily?: string;
  letterSpacing?: string;
  animated?: boolean;
  delay?: number;
}

export const GradientText: React.FC<GradientTextProps> = ({
  text,
  colors = ["#6429cd", "#ff6b35", "#6429cd"],
  angle = 135,
  fontSize = 72,
  fontWeight = 800,
  fontFamily,
  letterSpacing: ls,
  animated = true,
  delay = 0,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const delayFrames = Math.round(delay * fps);
  const adjustedFrame = Math.max(0, frame - delayFrames);

  const springConfig = { damping: 14, stiffness: 100 };

  // Entry animation
  const entryProgress = spring({
    frame: adjustedFrame,
    fps,
    config: springConfig,
  });

  const opacity = interpolate(entryProgress, [0, 1], [0, 1]);
  const scale = interpolate(entryProgress, [0, 1], [0.9, 1]);
  const yOffset = interpolate(entryProgress, [0, 1], [25, 0]);

  // Animated gradient offset
  const gradientOffset = animated ? (adjustedFrame / fps) * 80 : 0;

  // Build gradient string with extra size for animation
  const colorStops = colors
    .map((c, i) => `${c} ${(i / (colors.length - 1)) * 100}%`)
    .join(", ");

  const gradientSize = animated ? "200% 200%" : "100% 100%";
  const gradientPosition = animated
    ? `${gradientOffset % 200}% 50%`
    : "0% 50%";

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        opacity,
        transform: `translateY(${yOffset}px) scale(${scale})`,
      }}
    >
      <span
        style={{
          fontSize,
          fontWeight,
          fontFamily: fontFamily || "'Helvetica Neue', Arial, sans-serif",
          background: `linear-gradient(${angle}deg, ${colorStops})`,
          backgroundSize: gradientSize,
          backgroundPosition: gradientPosition,
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
          lineHeight: 1.2,
          letterSpacing: ls || "-0.02em",
          textAlign: "center" as const,
          padding: "0 20px",
        }}
      >
        {text}
      </span>
    </div>
  );
};

export default GradientText;
