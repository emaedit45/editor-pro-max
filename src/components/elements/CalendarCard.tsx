import React from "react";
import {
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from "remotion";

interface CalendarCardProps {
  day?: string;
  date?: string;
  time?: string;
  isLive?: boolean;
  label?: string;
  color?: string;
  delay?: number;
}

export const CalendarCard: React.FC<CalendarCardProps> = ({
  day = "SAB",
  date = "12",
  time = "10:00 AM",
  isLive = false,
  label = "",
  color = "#6429cd",
  delay = 0,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const delayFrames = Math.round(delay * fps);
  const springConfig = { damping: 14, stiffness: 100 };

  // Card entrance
  const cardIn = spring({
    frame: Math.max(0, frame - delayFrames),
    fps,
    config: springConfig,
    durationInFrames: 40,
  });

  // Content stagger
  const headerIn = spring({
    frame: Math.max(0, frame - delayFrames - 4),
    fps,
    config: springConfig,
    durationInFrames: 30,
  });

  const dateIn = spring({
    frame: Math.max(0, frame - delayFrames - 10),
    fps,
    config: springConfig,
    durationInFrames: 35,
  });

  const timeIn = spring({
    frame: Math.max(0, frame - delayFrames - 16),
    fps,
    config: springConfig,
    durationInFrames: 30,
  });

  const liveIn = spring({
    frame: Math.max(0, frame - delayFrames - 22),
    fps,
    config: springConfig,
    durationInFrames: 30,
  });

  const cardScale = interpolate(cardIn, [0, 1], [0.8, 1]);
  const cardOpacity = interpolate(cardIn, [0, 0.3, 1], [0, 0.5, 1]);
  const cardY = interpolate(cardIn, [0, 1], [40, 0]);

  // Pulsing red dot for live indicator
  const pulseRaw = Math.sin(frame * 0.12) * 0.5 + 0.5;
  const pulseOpacity = interpolate(pulseRaw, [0, 1], [0.4, 1]);
  const pulseScale = interpolate(pulseRaw, [0, 1], [1, 1.6]);

  return (
    <div
      style={{
        width: 200,
        borderRadius: 22,
        overflow: "hidden",
        transform: `scale(${cardScale}) translateY(${cardY}px)`,
        opacity: cardOpacity,
        background: "rgba(255,255,255,0.07)",
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
        border: "1px solid rgba(255,255,255,0.12)",
        boxShadow: `0 20px 60px rgba(0,0,0,0.35), 0 0 0 1px rgba(255,255,255,0.05) inset, 0 0 50px ${color}10`,
      }}
    >
      {/* Colored header strip */}
      <div
        style={{
          background: `linear-gradient(135deg, ${color}, ${lighten(color, 20)})`,
          padding: "14px 20px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          position: "relative",
          overflow: "hidden",
          opacity: headerIn,
          transform: `translateY(${interpolate(headerIn, [0, 1], [-10, 0])}px)`,
        }}
      >
        {/* Subtle shine on header */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "50%",
            background:
              "linear-gradient(180deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0) 100%)",
          }}
        />
        <span
          style={{
            fontFamily: "'Inter', 'SF Pro Display', sans-serif",
            fontSize: 16,
            fontWeight: 700,
            color: "#ffffff",
            letterSpacing: 3,
            textTransform: "uppercase",
            position: "relative",
            zIndex: 1,
          }}
        >
          {day}
        </span>
      </div>

      {/* Body */}
      <div
        style={{
          padding: "20px 20px 22px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 8,
        }}
      >
        {/* Large date number */}
        <div
          style={{
            fontFamily: "'Inter', 'SF Pro Display', sans-serif",
            fontSize: 72,
            fontWeight: 800,
            color: "#ffffff",
            lineHeight: 1,
            letterSpacing: -2,
            opacity: dateIn,
            transform: `scale(${interpolate(dateIn, [0, 1], [0.5, 1])})`,
          }}
        >
          {date}
        </div>

        {/* Time */}
        <div
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: 15,
            fontWeight: 500,
            color: "rgba(255,255,255,0.55)",
            letterSpacing: 0.5,
            opacity: timeIn,
            transform: `translateY(${interpolate(timeIn, [0, 1], [8, 0])}px)`,
          }}
        >
          {time}
        </div>

        {/* Label if provided */}
        {label ? (
          <div
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: 12,
              fontWeight: 600,
              color: "rgba(255,255,255,0.4)",
              letterSpacing: 1,
              textTransform: "uppercase",
              marginTop: 2,
              opacity: timeIn,
            }}
          >
            {label}
          </div>
        ) : null}

        {/* Live indicator */}
        {isLive ? (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              marginTop: 6,
              background: "rgba(255,59,48,0.12)",
              borderRadius: 20,
              padding: "6px 14px",
              opacity: liveIn,
              transform: `scale(${interpolate(liveIn, [0, 1], [0.7, 1])})`,
            }}
          >
            {/* Pulsing dot */}
            <div
              style={{
                position: "relative",
                width: 10,
                height: 10,
              }}
            >
              {/* Pulse ring */}
              <div
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  width: 10,
                  height: 10,
                  borderRadius: "50%",
                  background: "#FF3B30",
                  transform: `translate(-50%, -50%) scale(${pulseScale})`,
                  opacity: pulseOpacity * 0.3,
                }}
              />
              {/* Solid dot */}
              <div
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: "#FF3B30",
                  transform: "translate(-50%, -50%)",
                  boxShadow: "0 0 8px rgba(255,59,48,0.6)",
                }}
              />
            </div>
            <span
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: 12,
                fontWeight: 700,
                color: "#FF3B30",
                letterSpacing: 1.5,
                textTransform: "uppercase",
              }}
            >
              En Vivo
            </span>
          </div>
        ) : null}
      </div>
    </div>
  );
};

function lighten(hex: string, amount: number): string {
  const num = parseInt(hex.replace("#", ""), 16);
  const r = Math.min(255, ((num >> 16) & 0xff) + amount);
  const g = Math.min(255, ((num >> 8) & 0xff) + amount);
  const b = Math.min(255, (num & 0xff) + amount);
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, "0")}`;
}
