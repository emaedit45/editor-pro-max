import React from "react";
import {
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from "remotion";

interface StatItem {
  value: string;
  label: string;
}

interface VersusPanel {
  label: string;
  stats: StatItem[];
  color?: string;
}

interface VersusLayoutProps {
  left: VersusPanel;
  right: VersusPanel;
  delay?: number;
}

export const VersusLayout: React.FC<VersusLayoutProps> = ({
  left,
  right,
  delay = 0,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const delayFrames = Math.round(delay * fps);
  const adjustedFrame = Math.max(0, frame - delayFrames);

  const springConfig = { damping: 14, stiffness: 100 };

  const leftColor = left.color || "#6429cd";
  const rightColor = right.color || "#ff6b35";

  const leftSlide = spring({
    frame: adjustedFrame,
    fps,
    config: springConfig,
  });

  const rightSlide = spring({
    frame: adjustedFrame - 5,
    fps,
    config: springConfig,
  });

  const vsBadgeScale = spring({
    frame: adjustedFrame - 12,
    fps,
    config: { damping: 10, stiffness: 120 },
  });

  const vsGlow = interpolate(
    adjustedFrame % 60,
    [0, 30, 60],
    [0.4, 1, 0.4],
  );

  const leftX = interpolate(leftSlide, [0, 1], [-120, 0]);
  const rightX = interpolate(rightSlide, [0, 1], [120, 0]);

  const renderPanel = (
    panel: VersusPanel,
    color: string,
    side: "left" | "right",
    slideProgress: number,
    offsetX: number,
  ) => (
    <div
      style={{
        flex: 1,
        padding: "36px 32px",
        opacity: slideProgress,
        transform: `translateX(${offsetX}px)`,
        display: "flex",
        flexDirection: "column",
        alignItems: side === "left" ? "flex-end" : "flex-start",
        gap: 24,
      }}
    >
      <div
        style={{
          fontSize: 22,
          fontWeight: 800,
          color: color,
          letterSpacing: 1,
          textTransform: "uppercase",
          textAlign: side === "left" ? "right" : "left",
          textShadow: `0 0 30px ${color}44`,
        }}
      >
        {panel.label}
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 16,
          alignItems: side === "left" ? "flex-end" : "flex-start",
        }}
      >
        {panel.stats.map((stat, i) => {
          const statSpring = spring({
            frame: adjustedFrame - 18 - i * 6,
            fps,
            config: springConfig,
          });
          const statY = interpolate(statSpring, [0, 1], [25, 0]);
          return (
            <div
              key={i}
              style={{
                opacity: statSpring,
                transform: `translateY(${statY}px)`,
                textAlign: side === "left" ? "right" : "left",
                background: "rgba(255,255,255,0.04)",
                backdropFilter: "blur(10px)",
                WebkitBackdropFilter: "blur(10px)",
                padding: "14px 22px",
                borderRadius: 14,
                border: `1px solid ${color}22`,
                minWidth: 140,
              }}
            >
              <div
                style={{
                  fontSize: 28,
                  fontWeight: 800,
                  color: "white",
                  lineHeight: 1.1,
                }}
              >
                {stat.value}
              </div>
              <div
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  color: "rgba(255,255,255,0.5)",
                  textTransform: "uppercase",
                  letterSpacing: 1,
                  marginTop: 4,
                }}
              >
                {stat.label}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

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
          width: 780,
          borderRadius: 28,
          overflow: "hidden",
          background: "rgba(255,255,255,0.03)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          border: "1px solid rgba(255,255,255,0.08)",
          boxShadow:
            "0 30px 80px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05)",
          display: "flex",
          alignItems: "stretch",
          position: "relative",
        }}
      >
        {renderPanel(left, leftColor, "left", leftSlide, leftX)}

        {/* VS Badge */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: `translate(-50%, -50%) scale(${vsBadgeScale})`,
            zIndex: 10,
          }}
        >
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: "50%",
              background: `linear-gradient(135deg, ${leftColor}, ${rightColor})`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: `0 0 ${40 * vsGlow}px ${leftColor}66, 0 0 ${40 * vsGlow}px ${rightColor}66, 0 8px 32px rgba(0,0,0,0.5)`,
              border: "3px solid rgba(255,255,255,0.2)",
            }}
          >
            <span
              style={{
                fontSize: 22,
                fontWeight: 900,
                color: "white",
                letterSpacing: 2,
                textShadow: "0 2px 8px rgba(0,0,0,0.4)",
              }}
            >
              VS
            </span>
          </div>
        </div>

        {/* Center divider line */}
        <div
          style={{
            width: 1,
            background: `linear-gradient(180deg, transparent, ${leftColor}44, ${rightColor}44, transparent)`,
            flexShrink: 0,
          }}
        />

        {renderPanel(right, rightColor, "right", rightSlide, rightX)}
      </div>
    </div>
  );
};
