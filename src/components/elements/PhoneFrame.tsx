import React from "react";
import {
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from "remotion";

interface MetricItem {
  value: string;
  label: string;
}

interface ScreenContent {
  title?: string;
  subtitle?: string;
  metrics?: MetricItem[];
}

interface PhoneFrameProps {
  screenContent?: ScreenContent;
  deviceColor?: string;
  delay?: number;
}

export const PhoneFrame: React.FC<PhoneFrameProps> = ({
  screenContent = {},
  deviceColor = "#1a1a2e",
  delay = 0,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const delayFrames = Math.round(delay * fps);
  const adjustedFrame = Math.max(0, frame - delayFrames);

  const springConfig = { damping: 14, stiffness: 100 };

  const phoneScale = spring({
    frame: adjustedFrame,
    fps,
    config: { damping: 12, stiffness: 90 },
  });

  const phoneY = interpolate(phoneScale, [0, 1], [60, 0]);

  const screenOpacity = spring({
    frame: adjustedFrame - 12,
    fps,
    config: springConfig,
  });

  const titleSpring = spring({
    frame: adjustedFrame - 18,
    fps,
    config: springConfig,
  });

  const subtitleSpring = spring({
    frame: adjustedFrame - 24,
    fps,
    config: springConfig,
  });

  const screenGlow = interpolate(
    adjustedFrame % 120,
    [0, 60, 120],
    [0.3, 0.6, 0.3],
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
          transform: `scale(${phoneScale}) translateY(${phoneY}px)`,
          opacity: phoneScale,
        }}
      >
        {/* Phone outer body */}
        <div
          style={{
            width: 300,
            height: 620,
            borderRadius: 48,
            background: `linear-gradient(145deg, ${deviceColor}, #0d0d1a)`,
            padding: 8,
            boxShadow: `
              0 40px 100px rgba(0,0,0,0.6),
              0 0 0 1px rgba(255,255,255,0.08),
              inset 0 1px 0 rgba(255,255,255,0.1),
              0 0 ${60 * screenGlow}px rgba(100,41,205,${0.15 * screenGlow})
            `,
            position: "relative",
          }}
        >
          {/* Side button - volume */}
          <div
            style={{
              position: "absolute",
              left: -3,
              top: 130,
              width: 3,
              height: 32,
              borderRadius: "3px 0 0 3px",
              background: "rgba(255,255,255,0.1)",
            }}
          />
          <div
            style={{
              position: "absolute",
              left: -3,
              top: 175,
              width: 3,
              height: 32,
              borderRadius: "3px 0 0 3px",
              background: "rgba(255,255,255,0.1)",
            }}
          />
          {/* Side button - power */}
          <div
            style={{
              position: "absolute",
              right: -3,
              top: 155,
              width: 3,
              height: 48,
              borderRadius: "0 3px 3px 0",
              background: "rgba(255,255,255,0.1)",
            }}
          />

          {/* Screen area */}
          <div
            style={{
              width: "100%",
              height: "100%",
              borderRadius: 40,
              overflow: "hidden",
              background: "linear-gradient(180deg, #0a0a14, #12122a)",
              position: "relative",
            }}
          >
            {/* Dynamic Island / Notch */}
            <div
              style={{
                position: "absolute",
                top: 12,
                left: "50%",
                transform: "translateX(-50%)",
                width: 120,
                height: 32,
                borderRadius: 20,
                background: "#000",
                zIndex: 10,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
              }}
            >
              <div
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: "50%",
                  background: "#1a1a2e",
                  border: "2px solid #2a2a3e",
                }}
              />
            </div>

            {/* Status bar */}
            <div
              style={{
                position: "absolute",
                top: 14,
                left: 24,
                right: 24,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                opacity: screenOpacity * 0.5,
                zIndex: 5,
              }}
            >
              <span
                style={{ fontSize: 13, fontWeight: 600, color: "white" }}
              >
                9:41
              </span>
              <div style={{ display: "flex", gap: 5, alignItems: "center" }}>
                <div
                  style={{
                    width: 15,
                    height: 10,
                    borderRadius: 2,
                    border: "1.5px solid rgba(255,255,255,0.6)",
                    position: "relative",
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      inset: 2,
                      borderRadius: 1,
                      background: "#4ade80",
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Screen Content */}
            <div
              style={{
                position: "absolute",
                top: 60,
                left: 0,
                right: 0,
                bottom: 0,
                padding: "20px 24px",
                opacity: screenOpacity,
                display: "flex",
                flexDirection: "column",
                gap: 20,
              }}
            >
              {/* Header gradient accent */}
              <div
                style={{
                  width: 50,
                  height: 4,
                  borderRadius: 2,
                  background: "linear-gradient(90deg, #6429cd, #ff6b35)",
                  opacity: titleSpring,
                }}
              />

              {screenContent.title && (
                <div
                  style={{
                    opacity: titleSpring,
                    transform: `translateY(${interpolate(titleSpring, [0, 1], [15, 0])}px)`,
                  }}
                >
                  <div
                    style={{
                      fontSize: 24,
                      fontWeight: 800,
                      color: "white",
                      lineHeight: 1.2,
                      letterSpacing: -0.5,
                    }}
                  >
                    {screenContent.title}
                  </div>
                </div>
              )}

              {screenContent.subtitle && (
                <div
                  style={{
                    opacity: subtitleSpring,
                    transform: `translateY(${interpolate(subtitleSpring, [0, 1], [15, 0])}px)`,
                    fontSize: 14,
                    fontWeight: 500,
                    color: "rgba(255,255,255,0.5)",
                    lineHeight: 1.5,
                  }}
                >
                  {screenContent.subtitle}
                </div>
              )}

              {/* Metrics */}
              {screenContent.metrics && (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 12,
                    marginTop: 8,
                  }}
                >
                  {screenContent.metrics.map((metric, i) => {
                    const metricSpring = spring({
                      frame: adjustedFrame - 28 - i * 6,
                      fps,
                      config: springConfig,
                    });
                    return (
                      <div
                        key={i}
                        style={{
                          opacity: metricSpring,
                          transform: `translateX(${interpolate(metricSpring, [0, 1], [20, 0])}px)`,
                          background: "rgba(255,255,255,0.05)",
                          backdropFilter: "blur(10px)",
                          WebkitBackdropFilter: "blur(10px)",
                          borderRadius: 14,
                          padding: "14px 18px",
                          border: "1px solid rgba(255,255,255,0.06)",
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <span
                          style={{
                            fontSize: 13,
                            fontWeight: 500,
                            color: "rgba(255,255,255,0.55)",
                          }}
                        >
                          {metric.label}
                        </span>
                        <span
                          style={{
                            fontSize: 18,
                            fontWeight: 800,
                            color: "white",
                          }}
                        >
                          {metric.value}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Home indicator */}
            <div
              style={{
                position: "absolute",
                bottom: 8,
                left: "50%",
                transform: "translateX(-50%)",
                width: 120,
                height: 5,
                borderRadius: 3,
                background: "rgba(255,255,255,0.2)",
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
