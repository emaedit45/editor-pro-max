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

interface LaptopFrameProps {
  screenContent?: ScreenContent;
  url?: string;
  delay?: number;
}

export const LaptopFrame: React.FC<LaptopFrameProps> = ({
  screenContent = {},
  url = "floowvideo.com",
  delay = 0,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const delayFrames = Math.round(delay * fps);
  const adjustedFrame = Math.max(0, frame - delayFrames);

  const springConfig = { damping: 14, stiffness: 100 };

  const laptopScale = spring({
    frame: adjustedFrame,
    fps,
    config: { damping: 12, stiffness: 90 },
  });

  const laptopY = interpolate(laptopScale, [0, 1], [50, 0]);

  const screenOn = spring({
    frame: adjustedFrame - 10,
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
    [0.2, 0.5, 0.2],
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
          transform: `scale(${laptopScale}) translateY(${laptopY}px)`,
          opacity: laptopScale,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {/* Screen / Lid */}
        <div
          style={{
            width: 680,
            height: 420,
            borderRadius: "18px 18px 4px 4px",
            background: "linear-gradient(180deg, #1e1e2e, #161624)",
            padding: "16px 16px 8px 16px",
            boxShadow: `
              0 -2px 40px rgba(0,0,0,0.3),
              0 0 0 1px rgba(255,255,255,0.06),
              inset 0 1px 0 rgba(255,255,255,0.08),
              0 0 ${80 * screenGlow}px rgba(100,41,205,${0.1 * screenGlow})
            `,
            position: "relative",
          }}
        >
          {/* Camera notch */}
          <div
            style={{
              position: "absolute",
              top: 6,
              left: "50%",
              transform: "translateX(-50%)",
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: "#0a0a14",
              border: "1.5px solid #2a2a3e",
              zIndex: 10,
            }}
          />

          {/* Screen bezel inner */}
          <div
            style={{
              width: "100%",
              height: "100%",
              borderRadius: "8px 8px 2px 2px",
              overflow: "hidden",
              background: "linear-gradient(180deg, #0c0c1a, #10102a)",
              position: "relative",
            }}
          >
            {/* Browser chrome / toolbar */}
            <div
              style={{
                height: 38,
                background: "rgba(255,255,255,0.04)",
                borderBottom: "1px solid rgba(255,255,255,0.06)",
                display: "flex",
                alignItems: "center",
                padding: "0 14px",
                gap: 10,
                opacity: screenOn,
              }}
            >
              {/* Traffic lights */}
              <div style={{ display: "flex", gap: 6 }}>
                <div
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: "50%",
                    background: "#ff5f57",
                  }}
                />
                <div
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: "50%",
                    background: "#febc2e",
                  }}
                />
                <div
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: "50%",
                    background: "#28c840",
                  }}
                />
              </div>

              {/* URL bar */}
              <div
                style={{
                  flex: 1,
                  height: 24,
                  borderRadius: 6,
                  background: "rgba(255,255,255,0.06)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 6,
                  marginLeft: 20,
                  marginRight: 20,
                }}
              >
                <span
                  style={{
                    fontSize: 10,
                    color: "#4ade80",
                    fontWeight: 600,
                  }}
                >
                  &#x1f512;
                </span>
                <span
                  style={{
                    fontSize: 12,
                    color: "rgba(255,255,255,0.5)",
                    fontWeight: 500,
                    letterSpacing: 0.3,
                  }}
                >
                  {url}
                </span>
              </div>
            </div>

            {/* Page content */}
            <div
              style={{
                padding: "32px 40px",
                opacity: screenOn,
                display: "flex",
                flexDirection: "column",
                gap: 20,
                height: "calc(100% - 38px)",
              }}
            >
              {/* Accent bar */}
              <div
                style={{
                  width: 60,
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
                    transform: `translateY(${interpolate(titleSpring, [0, 1], [12, 0])}px)`,
                  }}
                >
                  <div
                    style={{
                      fontSize: 28,
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
                    transform: `translateY(${interpolate(subtitleSpring, [0, 1], [12, 0])}px)`,
                    fontSize: 15,
                    fontWeight: 500,
                    color: "rgba(255,255,255,0.5)",
                    lineHeight: 1.5,
                    maxWidth: 450,
                  }}
                >
                  {screenContent.subtitle}
                </div>
              )}

              {/* Metrics grid */}
              {screenContent.metrics && (
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 14,
                    marginTop: 8,
                  }}
                >
                  {screenContent.metrics.map((metric, i) => {
                    const metricSpring = spring({
                      frame: adjustedFrame - 28 - i * 5,
                      fps,
                      config: springConfig,
                    });
                    const metricScale = spring({
                      frame: adjustedFrame - 28 - i * 5,
                      fps,
                      config: { damping: 10, stiffness: 120 },
                    });
                    return (
                      <div
                        key={i}
                        style={{
                          opacity: metricSpring,
                          transform: `scale(${metricScale})`,
                          background: "rgba(255,255,255,0.04)",
                          backdropFilter: "blur(10px)",
                          WebkitBackdropFilter: "blur(10px)",
                          borderRadius: 16,
                          padding: "18px 24px",
                          border: "1px solid rgba(255,255,255,0.06)",
                          minWidth: 130,
                          flex: "1 1 auto",
                        }}
                      >
                        <div
                          style={{
                            fontSize: 26,
                            fontWeight: 800,
                            color: "white",
                            lineHeight: 1.1,
                          }}
                        >
                          {metric.value}
                        </div>
                        <div
                          style={{
                            fontSize: 11,
                            fontWeight: 600,
                            color: "rgba(255,255,255,0.4)",
                            textTransform: "uppercase",
                            letterSpacing: 1,
                            marginTop: 6,
                          }}
                        >
                          {metric.label}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Hinge */}
        <div
          style={{
            width: 720,
            height: 8,
            background: "linear-gradient(180deg, #1a1a28, #111120)",
            borderRadius: "0 0 2px 2px",
            boxShadow: "0 1px 0 rgba(255,255,255,0.04)",
          }}
        />

        {/* Keyboard base */}
        <div
          style={{
            width: 760,
            height: 18,
            background: "linear-gradient(180deg, #1e1e2e, #16162a)",
            borderRadius: "0 0 12px 12px",
            boxShadow:
              "0 8px 30px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.04)",
            position: "relative",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {/* Trackpad hint */}
          <div
            style={{
              width: 120,
              height: 4,
              borderRadius: 2,
              background: "rgba(255,255,255,0.06)",
            }}
          />
          {/* Front edge bevel */}
          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: 20,
              right: 20,
              height: 1,
              background:
                "linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent)",
            }}
          />
        </div>

        {/* Shadow underneath */}
        <div
          style={{
            width: 600,
            height: 8,
            borderRadius: "50%",
            background: "rgba(0,0,0,0.3)",
            filter: "blur(8px)",
            marginTop: 4,
          }}
        />
      </div>
    </div>
  );
};
