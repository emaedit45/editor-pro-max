import React from "react";
import {
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from "remotion";

interface IconItem {
  icon: string;
  label: string;
}

interface IconGridProps {
  items: IconItem[];
  columns?: number;
  iconSize?: number;
  color?: string;
  delay?: number;
}

export const IconGrid: React.FC<IconGridProps> = ({
  items,
  columns = 3,
  iconSize = 44,
  color = "#6429cd",
  delay = 0,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const delayFrames = Math.round(delay * fps);
  const adjustedFrame = Math.max(0, frame - delayFrames);

  const springConfig = { damping: 14, stiffness: 100 };

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
        gap: 20,
        width: "100%",
        padding: 16,
      }}
    >
      {items.map((item, i) => {
        const row = Math.floor(i / columns);
        const col = i % columns;
        const staggerDelay = row * 8 + col * 5;

        const popScale = spring({
          frame: adjustedFrame - staggerDelay,
          fps,
          config: springConfig,
        });

        const opacity = interpolate(
          popScale,
          [0, 0.3, 1],
          [0, 0.5, 1]
        );

        const translateY = interpolate(popScale, [0, 1], [16, 0]);

        return (
          <div
            key={i}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 10,
              opacity,
              transform: `translateY(${translateY}px) scale(${popScale})`,
            }}
          >
            {/* Icon container */}
            <div
              style={{
                width: iconSize + 28,
                height: iconSize + 28,
                borderRadius: 16,
                background: `linear-gradient(135deg, ${color}22, ${color}11)`,
                border: `1px solid ${color}33`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: iconSize,
                lineHeight: 1,
              }}
            >
              {item.icon}
            </div>

            {/* Label */}
            <div
              style={{
                fontSize: 14,
                fontWeight: 600,
                color: "#ffffff",
                textAlign: "center",
                lineHeight: 1.3,
                fontFamily: "sans-serif",
                maxWidth: 120,
              }}
            >
              {item.label}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default IconGrid;
