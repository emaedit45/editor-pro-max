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
  size?: number;
  delay?: number;
}

export const BeforeAfter: React.FC<BeforeAfterProps> = ({
  beforeLabel = "Before",
  afterLabel = "After",
  beforeItems = [],
  afterItems = [],
  beforeColor = "#dc2626",
  afterColor = "#16a34a",
  size = 1,
  delay = 0,
}) => {
  const s = size;
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

  const beforeIn = spring({
    frame: adjustedFrame - 15,
    fps,
    config: springConfig,
  });

  const afterIn = spring({
    frame: adjustedFrame - 25,
    fps,
    config: springConfig,
  });

  const itemFontSize = 16 * s;
  const labelFontSize = 14 * s;
  const dotSize = 8 * s;
  const itemGap = 12 * s;
  const sectionPad = `${28 * s}px ${36 * s}px`;

  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 980,
          borderRadius: 20,
          overflow: "hidden",
          transform: `scale(${containerScale})`,
          boxShadow: "0 25px 60px rgba(0,0,0,0.4)",
          position: "relative",
        }}
      >
        {/* Before Section */}
        <div
          style={{
            padding: sectionPad,
            background: `linear-gradient(135deg, ${beforeColor}18, ${beforeColor}0a)`,
            borderBottom: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <div
            style={{
              opacity: beforeIn,
              transform: `translateY(${interpolate(beforeIn, [0, 1], [20, 0])}px)`,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <div
              style={{
                display: "inline-block",
                padding: `${6 * s}px ${20 * s}px`,
                borderRadius: 24,
                background: `${beforeColor}25`,
                border: `1px solid ${beforeColor}40`,
                color: beforeColor,
                fontSize: labelFontSize,
                fontWeight: 700,
                letterSpacing: 2,
                textTransform: "uppercase",
                marginBottom: 14 * s,
              }}
            >
              {beforeLabel}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: itemGap, alignItems: "center" }}>
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
                      transform: `translateX(${interpolate(itemSpring, [0, 1], [-20, 0])}px)`,
                      display: "flex",
                      alignItems: "center",
                      gap: 10 * s,
                      color: "rgba(255,255,255,0.8)",
                      fontSize: itemFontSize,
                      fontWeight: 500,
                    }}
                  >
                    <span
                      style={{
                        width: dotSize,
                        height: dotSize,
                        borderRadius: "50%",
                        background: beforeColor,
                        flexShrink: 0,
                        boxShadow: `0 0 8px ${beforeColor}50`,
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
            padding: sectionPad,
            background: `linear-gradient(135deg, ${afterColor}18, ${afterColor}0a)`,
          }}
        >
          <div
            style={{
              opacity: afterIn,
              transform: `translateY(${interpolate(afterIn, [0, 1], [20, 0])}px)`,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <div
              style={{
                display: "inline-block",
                padding: `${6 * s}px ${20 * s}px`,
                borderRadius: 24,
                background: `${afterColor}25`,
                border: `1px solid ${afterColor}40`,
                color: afterColor,
                fontSize: labelFontSize,
                fontWeight: 700,
                letterSpacing: 2,
                textTransform: "uppercase",
                marginBottom: 14 * s,
              }}
            >
              {afterLabel}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: itemGap, alignItems: "center" }}>
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
                      transform: `translateX(${interpolate(itemSpring, [0, 1], [-20, 0])}px)`,
                      display: "flex",
                      alignItems: "center",
                      gap: 10 * s,
                      color: "rgba(255,255,255,0.9)",
                      fontSize: itemFontSize,
                      fontWeight: 500,
                    }}
                  >
                    <span
                      style={{
                        width: dotSize,
                        height: dotSize,
                        borderRadius: "50%",
                        background: afterColor,
                        flexShrink: 0,
                        boxShadow: `0 0 8px ${afterColor}50`,
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
            borderRadius: 20,
            border: "1px solid rgba(255,255,255,0.08)",
            pointerEvents: "none",
          }}
        />
      </div>
    </div>
  );
};
