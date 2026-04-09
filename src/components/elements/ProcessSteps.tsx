import React from "react";
import {
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from "remotion";

interface Step {
  title: string;
  description?: string;
}

interface ProcessStepsProps {
  steps: Step[];
  activeStep?: number;
  color?: string;
  delay?: number;
}

export const ProcessSteps: React.FC<ProcessStepsProps> = ({
  steps,
  activeStep,
  color = "#6429cd",
  delay = 0,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const delayFrames = Math.round(delay * fps);
  const adjustedFrame = Math.max(0, frame - delayFrames);

  const springConfig = { damping: 14, stiffness: 100 };
  const totalSteps = steps.length;

  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "center",
        width: "100%",
        padding: "20px 10px",
        gap: 0,
      }}
    >
      {steps.map((step, i) => {
        const stepDelay = i * 15;
        const isActive =
          activeStep !== undefined ? i <= activeStep : true;

        const enterProgress = spring({
          frame: adjustedFrame - stepDelay,
          fps,
          config: springConfig,
        });

        const circleScale = spring({
          frame: adjustedFrame - stepDelay,
          fps,
          config: { damping: 12, stiffness: 120 },
        });

        const lineWidth = interpolate(
          spring({
            frame: adjustedFrame - stepDelay - 6,
            fps,
            config: { damping: 18, stiffness: 80 },
          }),
          [0, 1],
          [0, 100]
        );

        const opacity = interpolate(
          enterProgress,
          [0, 0.3, 1],
          [0, 0.5, 1]
        );
        const translateY = interpolate(enterProgress, [0, 1], [20, 0]);

        const activeColor = isActive ? color : "#555555";
        const activeBg = isActive
          ? color
          : "rgba(255,255,255,0.08)";

        return (
          <React.Fragment key={i}>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                opacity,
                transform: `translateY(${translateY}px)`,
                flex: 1,
                maxWidth: 180,
              }}
            >
              {/* Number circle */}
              <div
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: "50%",
                  background: activeBg,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transform: `scale(${circleScale})`,
                  boxShadow: isActive
                    ? `0 4px 20px ${color}44`
                    : "none",
                  border: isActive
                    ? "none"
                    : "2px solid #555555",
                }}
              >
                <span
                  style={{
                    fontSize: 22,
                    fontWeight: 800,
                    color: isActive ? "#ffffff" : "#888888",
                    fontFamily: "sans-serif",
                  }}
                >
                  {i + 1}
                </span>
              </div>

              {/* Title */}
              <div
                style={{
                  fontSize: 16,
                  fontWeight: 700,
                  color: isActive ? "#ffffff" : "#888888",
                  marginTop: 14,
                  textAlign: "center",
                  lineHeight: 1.3,
                  fontFamily: "sans-serif",
                }}
              >
                {step.title}
              </div>

              {/* Description */}
              {step.description && (
                <div
                  style={{
                    fontSize: 12,
                    color: isActive ? "#ffffffaa" : "#666666",
                    marginTop: 6,
                    textAlign: "center",
                    lineHeight: 1.4,
                    fontFamily: "sans-serif",
                    maxWidth: 150,
                  }}
                >
                  {step.description}
                </div>
              )}
            </div>

            {/* Connector line */}
            {i < totalSteps - 1 && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  height: 52,
                  position: "relative",
                  width: 60,
                  flexShrink: 0,
                }}
              >
                <div
                  style={{
                    height: 3,
                    width: `${lineWidth}%`,
                    background: `linear-gradient(90deg, ${activeColor}, ${
                      activeStep !== undefined && i + 1 <= activeStep
                        ? color
                        : "#555555"
                    })`,
                    borderRadius: 2,
                  }}
                />
              </div>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default ProcessSteps;
