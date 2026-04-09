import React from "react";
import {
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from "remotion";

interface TimelineEvent {
  date: string;
  title: string;
  description?: string;
}

interface TimelineVerticalProps {
  events: TimelineEvent[];
  lineColor?: string;
  dotColor?: string;
  delay?: number;
}

export const TimelineVertical: React.FC<TimelineVerticalProps> = ({
  events,
  lineColor = "#6429cd",
  dotColor = "#ff6b35",
  delay = 0,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const delayFrames = Math.round(delay * fps);
  const adjustedFrame = Math.max(0, frame - delayFrames);

  const springConfig = { damping: 14, stiffness: 100 };
  const eventSpacing = 120;
  const totalHeight = events.length * eventSpacing;

  const lineProgress = interpolate(adjustedFrame, [0, 30], [0, 1], {
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "100%",
        position: "relative",
        padding: "20px 0",
      }}
    >
      {/* Vertical line */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: 20,
          width: 3,
          height: totalHeight * lineProgress,
          background: `linear-gradient(180deg, ${lineColor}, ${lineColor}88)`,
          transform: "translateX(-50%)",
          borderRadius: 2,
        }}
      />

      {events.map((event, i) => {
        const eventDelay = 10 + i * 12;
        const dotScale = spring({
          frame: adjustedFrame - eventDelay,
          fps,
          config: springConfig,
        });
        const isLeft = i % 2 === 0;
        const cardSlide = spring({
          frame: adjustedFrame - eventDelay - 4,
          fps,
          config: { damping: 16, stiffness: 80 },
        });
        const cardX = interpolate(cardSlide, [0, 1], [isLeft ? -60 : 60, 0]);
        const cardOpacity = interpolate(
          cardSlide,
          [0, 0.4, 1],
          [0, 0.6, 1]
        );

        return (
          <div
            key={i}
            style={{
              display: "flex",
              alignItems: "center",
              width: "100%",
              height: eventSpacing,
              position: "relative",
              justifyContent: "center",
            }}
          >
            {/* Dot */}
            <div
              style={{
                position: "absolute",
                left: "50%",
                transform: `translate(-50%, -50%) scale(${dotScale})`,
                width: 18,
                height: 18,
                borderRadius: "50%",
                background: dotColor,
                boxShadow: `0 0 12px ${dotColor}66`,
                zIndex: 2,
                top: "50%",
              }}
            />

            {/* Card */}
            <div
              style={{
                position: "absolute",
                [isLeft ? "right" : "left"]: "calc(50% + 28px)",
                top: "50%",
                transform: `translateY(-50%) translateX(${cardX}px)`,
                opacity: cardOpacity,
                background: "rgba(255,255,255,0.06)",
                backdropFilter: "blur(8px)",
                border: `1px solid ${lineColor}33`,
                borderRadius: 12,
                padding: "14px 20px",
                maxWidth: 280,
                textAlign: isLeft ? "right" : "left",
              }}
            >
              <div
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  color: dotColor,
                  letterSpacing: 1.2,
                  textTransform: "uppercase",
                  marginBottom: 4,
                  fontFamily: "sans-serif",
                }}
              >
                {event.date}
              </div>
              <div
                style={{
                  fontSize: 18,
                  fontWeight: 700,
                  color: "#ffffff",
                  lineHeight: 1.3,
                  fontFamily: "sans-serif",
                }}
              >
                {event.title}
              </div>
              {event.description && (
                <div
                  style={{
                    fontSize: 13,
                    color: "#ffffffaa",
                    marginTop: 4,
                    lineHeight: 1.4,
                    fontFamily: "sans-serif",
                  }}
                >
                  {event.description}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default TimelineVertical;
