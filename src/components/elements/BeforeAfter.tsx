import React from "react";
import {
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from "remotion";

interface BeforeAfterProps {
  beforeLabel?: string;
  afterLabel?: string;
  beforeItems?: string[];
  afterItems?: string[];
  beforeColor?: string;
  afterColor?: string;
  delay?: number;
}

export const BeforeAfter: React.FC<BeforeAfterProps> = ({
  beforeLabel = "Before",
  afterLabel = "After",
  beforeItems = [],
  afterItems = [],
  beforeColor = "#dc2626",
  afterColor = "#16a34a",
  delay = 0,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const delayFrames = Math.round(delay * fps);
  const adjustedFrame = Math.max(0, frame - delayFrames);

  const springConfig = { damping: 14, stiffness: 100 };

  const containerScale = spring({
    frame: adjustedFrame,
    fps,
    config: springConfig,
  });

  const dividerProgress = spring({
    frame: adjustedFrame - 10,
    fps,
    config: { damping: 18, stiffness: 80 },
  });

  const dividerX = interpolate(dividerProgress, [0, 1], [0, 100]);

  const beforeLabelOpacity = spring({
    frame: adjustedFrame - 15,
    fps,
    config: springConfig,
  });

  const afterLabelOpacity = spring({
    frame: adjustedFrame - 25,
    fps,
    config: springConfig,
  });

  const beforeLabelY = interpolate(beforeLabelOpacity, [0, 1], [20, 0]);
  const afterLabelY = interpolate(afterLabelOpacity, [0, 1], [20, 0]);

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      }}
    >
      <div
        style={{
          width: 700,
          borderRadius: 24,
          overflow: "hidden",
          transform: `scale(${containerScale})`,
          boxShadow: "0 25px 60px rgba(0,0,0,0.4)",
          position: "relative",
        }}
      >
        {/* Before Section */}
        <div
          style={{
            position: "relative",
            padding: "40px 48px",
            background: `linear-gradient(135deg, ${beforeColor}22, ${beforeColor}11)`,
            borderBottom: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <div
            style={{
              opacity: beforeLabelOpacity,
              transform: `translateY(${beforeLabelY}px)`,
            }}
          >
            <div
              style={{
                display: "inline-block",
                padding: "6px 18px",
                borderRadius: 20,
                background: `${beforeColor}33`,
                border: `1px solid ${beforeColor}55`,
                color: beforeColor,
                fontSize: 13,
                fontWeight: 700,
                letterSpacing: 1.5,
                textTransform: "uppercase",
                marginBottom: 16,
              }}
            >
              {beforeLabel}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {beforeItems.map((item, i) => {
                const itemSpring = spring({
                  frame: adjustedFrame - 20 - i * 5,
                  fps,
                  config: springConfig,
                });
                return (
                  <div
                    key={i}
                    style={{
                      opacity: itemSpring,
                      transform: `translateX(${interpolate(itemSpring, [0, 1], [-30, 0])}px)`,
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      color: "rgba(255,255,255,0.8)",
                      fontSize: 16,
                      fontWeight: 500,
                    }}
                  >
                    <span
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        background: beforeColor,
                        flexShrink: 0,
                      }}
                    />
                    {item}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* After Section */}
        <div
          style={{
            position: "relative",
            padding: "40px 48px",
            background: `linear-gradient(135deg, ${afterColor}22, ${afterColor}11)`,
          }}
        >
          <div
            style={{
              opacity: afterLabelOpacity,
              transform: `translateY(${afterLabelY}px)`,
            }}
          >
            <div
              style={{
                display: "inline-block",
                padding: "6px 18px",
                borderRadius: 20,
                background: `${afterColor}33`,
                border: `1px solid ${afterColor}55`,
                color: afterColor,
                fontSize: 13,
                fontWeight: 700,
                letterSpacing: 1.5,
                textTransform: "uppercase",
                marginBottom: 16,
              }}
            >
              {afterLabel}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {afterItems.map((item, i) => {
                const itemSpring = spring({
                  frame: adjustedFrame - 30 - i * 5,
                  fps,
                  config: springConfig,
                });
                return (
                  <div
                    key={i}
                    style={{
                      opacity: itemSpring,
                      transform: `translateX(${interpolate(itemSpring, [0, 1], [-30, 0])}px)`,
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      color: "rgba(255,255,255,0.9)",
                      fontSize: 16,
                      fontWeight: 500,
                    }}
                  >
                    <span
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        background: afterColor,
                        flexShrink: 0,
                      }}
                    />
                    {item}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Animated Divider */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: 0,
            width: `${dividerX}%`,
            height: 3,
            background: `linear-gradient(90deg, ${beforeColor}, ${afterColor})`,
            transform: "translateY(-50%)",
            boxShadow: `0 0 20px ${afterColor}88`,
            zIndex: 2,
          }}
        />
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: `${dividerX}%`,
            transform: "translate(-50%, -50%)",
            width: 14,
            height: 14,
            borderRadius: "50%",
            background: "white",
            boxShadow: `0 0 20px ${afterColor}88, 0 0 40px ${afterColor}44`,
            zIndex: 3,
            opacity: dividerProgress,
          }}
        />

        {/* Glass overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: 24,
            border: "1px solid rgba(255,255,255,0.08)",
            pointerEvents: "none",
          }}
        />
      </div>
    </div>
  );
};
