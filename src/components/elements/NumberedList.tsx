import React from "react";
import {
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from "remotion";

interface ListItem {
  title: string;
  description?: string;
}

interface NumberedListProps {
  items: ListItem[];
  numberColor?: string;
  delay?: number;
}

export const NumberedList: React.FC<NumberedListProps> = ({
  items,
  numberColor = "#6429cd",
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
        display: "flex",
        flexDirection: "column",
        gap: 6,
        width: "100%",
        padding: "10px 16px",
      }}
    >
      {items.map((item, i) => {
        const itemDelay = i * 12;

        const slideProgress = spring({
          frame: adjustedFrame - itemDelay,
          fps,
          config: springConfig,
        });

        const numberScale = spring({
          frame: adjustedFrame - itemDelay + 3,
          fps,
          config: { damping: 10, stiffness: 140 },
        });

        const translateX = interpolate(slideProgress, [0, 1], [-80, 0]);
        const opacity = interpolate(
          slideProgress,
          [0, 0.3, 1],
          [0, 0.6, 1]
        );

        // Subtle separator line between items
        const showSeparator = i < items.length - 1 && slideProgress > 0.5;

        return (
          <React.Fragment key={i}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 20,
                opacity,
                transform: `translateX(${translateX}px)`,
                padding: "14px 0",
              }}
            >
              {/* Large number */}
              <div
                style={{
                  minWidth: 56,
                  height: 56,
                  borderRadius: 14,
                  background: `linear-gradient(135deg, ${numberColor}, ${numberColor}cc)`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transform: `scale(${numberScale})`,
                  boxShadow: `0 4px 16px ${numberColor}44`,
                }}
              >
                <span
                  style={{
                    fontSize: 26,
                    fontWeight: 900,
                    color: "#ffffff",
                    fontFamily: "sans-serif",
                    lineHeight: 1,
                  }}
                >
                  {i + 1}
                </span>
              </div>

              {/* Text content */}
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    fontSize: 18,
                    fontWeight: 700,
                    color: "#ffffff",
                    lineHeight: 1.3,
                    fontFamily: "sans-serif",
                  }}
                >
                  {item.title}
                </div>
                {item.description && (
                  <div
                    style={{
                      fontSize: 13,
                      color: "#ffffffaa",
                      marginTop: 4,
                      lineHeight: 1.4,
                      fontFamily: "sans-serif",
                    }}
                  >
                    {item.description}
                  </div>
                )}
              </div>
            </div>

            {/* Separator */}
            {showSeparator && (
              <div
                style={{
                  height: 1,
                  background: `linear-gradient(90deg, transparent, ${numberColor}33, transparent)`,
                  marginLeft: 76,
                }}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default NumberedList;
