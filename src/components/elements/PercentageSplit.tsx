import React from "react";
import {
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from "remotion";

interface PercentageSplitProps {
  leftValue: number;
  rightValue: number;
  leftLabel: string;
  rightLabel: string;
  leftColor?: string;
  rightColor?: string;
  delay?: number;
}

export const PercentageSplit: React.FC<PercentageSplitProps> = ({
  leftValue,
  rightValue,
  leftLabel,
  rightLabel,
  leftColor = "#6429cd",
  rightColor = "#ff6b35",
  delay = 0,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const delayFrames = Math.round(delay * fps);
  const adjustedFrame = Math.max(0, frame - delayFrames);

  const springConfig = { damping: 14, stiffness: 100 };

  const total = leftValue + rightValue;
  const leftPercent = (leftValue / total) * 100;
  const rightPercent = (rightValue / total) * 100;

  const containerOpacity = spring({
    frame: adjustedFrame,
    fps,
    config: springConfig,
  });

  const barExpand = spring({
    frame: adjustedFrame - 8,
    fps,
    config: { damping: 16, stiffness: 80 },
  });

  const leftWidth = interpolate(barExpand, [0, 1], [0, leftPercent]);
  const rightWidth = interpolate(barExpand, [0, 1], [0, rightPercent]);

  const leftLabelSpring = spring({
    frame: adjustedFrame - 20,
    fps,
    config: springConfig,
  });

  const rightLabelSpring = spring({
    frame: adjustedFrame - 24,
    fps,
    config: springConfig,
  });

  const leftNumberSpring = spring({
    frame: adjustedFrame - 14,
    fps,
    config: springConfig,
  });

  const rightNumberSpring = spring({
    frame: adjustedFrame - 18,
    fps,
    config: springConfig,
  });

  const displayLeftValue = Math.round(
    interpolate(leftNumberSpring, [0, 1], [0, leftPercent]),
  );
  const displayRightValue = Math.round(
    interpolate(rightNumberSpring, [0, 1], [0, rightPercent]),
  );

  const shimmer = interpolate(adjustedFrame % 90, [0, 45, 90], [0, 1, 0]);

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
          opacity: containerOpacity,
          display: "flex",
          flexDirection: "column",
          gap: 20,
        }}
      >
        {/* Labels row */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
          }}
        >
          <div
            style={{
              opacity: leftLabelSpring,
              transform: `translateY(${interpolate(leftLabelSpring, [0, 1], [15, 0])}px)`,
            }}
          >
            <div
              style={{
                fontSize: 42,
                fontWeight: 900,
                color: leftColor,
                lineHeight: 1,
                textShadow: `0 0 40px ${leftColor}44`,
              }}
            >
              {displayLeftValue}%
            </div>
            <div
              style={{
                fontSize: 15,
                fontWeight: 600,
                color: "rgba(255,255,255,0.7)",
                marginTop: 6,
                letterSpacing: 0.5,
              }}
            >
              {leftLabel}
            </div>
          </div>
          <div
            style={{
              opacity: rightLabelSpring,
              transform: `translateY(${interpolate(rightLabelSpring, [0, 1], [15, 0])}px)`,
              textAlign: "right",
            }}
          >
            <div
              style={{
                fontSize: 42,
                fontWeight: 900,
                color: rightColor,
                lineHeight: 1,
                textShadow: `0 0 40px ${rightColor}44`,
              }}
            >
              {displayRightValue}%
            </div>
            <div
              style={{
                fontSize: 15,
                fontWeight: 600,
                color: "rgba(255,255,255,0.7)",
                marginTop: 6,
                letterSpacing: 0.5,
              }}
            >
              {rightLabel}
            </div>
          </div>
        </div>

        {/* Bar */}
        <div
          style={{
            width: "100%",
            height: 56,
            borderRadius: 28,
            background: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,255,255,0.08)",
            overflow: "hidden",
            display: "flex",
            boxShadow:
              "inset 0 2px 8px rgba(0,0,0,0.3), 0 4px 20px rgba(0,0,0,0.2)",
            position: "relative",
          }}
        >
          {/* Left bar */}
          <div
            style={{
              width: `${leftWidth}%`,
              height: "100%",
              background: `linear-gradient(90deg, ${leftColor}, ${leftColor}cc)`,
              borderRadius: "28px 0 0 28px",
              position: "relative",
              overflow: "hidden",
              transition: "none",
            }}
          >
            {/* Shimmer effect */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: `linear-gradient(90deg, transparent, rgba(255,255,255,${shimmer * 0.15}), transparent)`,
              }}
            />
          </div>

          {/* Right bar */}
          <div
            style={{
              width: `${rightWidth}%`,
              height: "100%",
              background: `linear-gradient(90deg, ${rightColor}cc, ${rightColor})`,
              borderRadius: "0 28px 28px 0",
              position: "relative",
              overflow: "hidden",
              marginLeft: "auto",
              transition: "none",
            }}
          >
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: `linear-gradient(90deg, transparent, rgba(255,255,255,${shimmer * 0.15}), transparent)`,
              }}
            />
          </div>

          {/* Center gap glow */}
          <div
            style={{
              position: "absolute",
              top: 0,
              bottom: 0,
              left: `${leftWidth}%`,
              width: 4,
              transform: "translateX(-50%)",
              background: "rgba(255,255,255,0.3)",
              boxShadow: "0 0 12px rgba(255,255,255,0.2)",
              opacity: barExpand,
            }}
          />
        </div>

        {/* Bottom detail labels */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              opacity: leftLabelSpring,
            }}
          >
            <div
              style={{
                width: 10,
                height: 10,
                borderRadius: "50%",
                background: leftColor,
                boxShadow: `0 0 10px ${leftColor}66`,
              }}
            />
            <span
              style={{
                fontSize: 12,
                fontWeight: 600,
                color: "rgba(255,255,255,0.45)",
                textTransform: "uppercase",
                letterSpacing: 1.2,
              }}
            >
              {leftLabel}
            </span>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              opacity: rightLabelSpring,
            }}
          >
            <span
              style={{
                fontSize: 12,
                fontWeight: 600,
                color: "rgba(255,255,255,0.45)",
                textTransform: "uppercase",
                letterSpacing: 1.2,
              }}
            >
              {rightLabel}
            </span>
            <div
              style={{
                width: 10,
                height: 10,
                borderRadius: "50%",
                background: rightColor,
                boxShadow: `0 0 10px ${rightColor}66`,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
