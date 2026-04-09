import React from "react";
import {
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from "remotion";

interface NumberTickerProps {
  from?: number;
  to: number;
  prefix?: string;
  suffix?: string;
  color?: string;
  fontSize?: number;
  delay?: number;
}

export const NumberTicker: React.FC<NumberTickerProps> = ({
  from = 0,
  to,
  prefix = "",
  suffix = "",
  color = "white",
  fontSize = 72,
  delay = 0,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const delayFrames = Math.round(delay * fps);

  const progress = spring({
    frame: Math.max(0, frame - delayFrames),
    fps,
    config: { damping: 14, stiffness: 100 },
    durationInFrames: 60,
  });

  const scaleIn = spring({
    frame: Math.max(0, frame - delayFrames),
    fps,
    config: { damping: 12, stiffness: 80 },
    durationInFrames: 25,
  });

  const currentValue = Math.round(from + (to - from) * progress);
  const targetStr = String(Math.abs(to));
  const currentStr = String(Math.abs(currentValue)).padStart(
    targetStr.length,
    "0"
  );
  const isNegative = currentValue < 0;

  const digitHeight = fontSize * 1.15;

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transform: `scale(${scaleIn})`,
        gap: 0,
      }}
    >
      {/* Prefix */}
      {prefix && (
        <span
          style={{
            fontSize: fontSize * 0.6,
            fontWeight: 700,
            color,
            fontFamily: "Inter, system-ui, sans-serif",
            opacity: 0.7,
            marginRight: 4,
            textShadow: "0 2px 8px rgba(0,0,0,0.3)",
          }}
        >
          {prefix}
        </span>
      )}

      {/* Negative sign */}
      {isNegative && (
        <span
          style={{
            fontSize,
            fontWeight: 800,
            color,
            fontFamily: "Inter, system-ui, sans-serif",
            textShadow: "0 2px 8px rgba(0,0,0,0.3)",
          }}
        >
          -
        </span>
      )}

      {/* Digits */}
      {currentStr.split("").map((digit, i) => {
        const digitProgress = spring({
          frame: Math.max(0, frame - delayFrames - i * 3),
          fps,
          config: { damping: 14, stiffness: 100 },
          durationInFrames: 50,
        });

        const numericDigit = parseInt(digit, 10);
        const yOffset = interpolate(digitProgress, [0, 1], [digitHeight * 2, 0]);

        return (
          <div
            key={i}
            style={{
              width: fontSize * 0.62,
              height: digitHeight,
              overflow: "hidden",
              position: "relative",
              borderRadius: 6,
              background: "rgba(255,255,255,0.06)",
              marginLeft: i > 0 ? 3 : 0,
            }}
          >
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: digitHeight,
                transform: `translateY(${yOffset}px)`,
              }}
            >
              <span
                style={{
                  fontSize,
                  fontWeight: 800,
                  color,
                  fontFamily: "'Inter', system-ui, sans-serif",
                  fontVariantNumeric: "tabular-nums",
                  lineHeight: 1,
                  textShadow: "0 2px 8px rgba(0,0,0,0.3)",
                }}
              >
                {numericDigit}
              </span>
            </div>

            {/* Shine line */}
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "50%",
                background:
                  "linear-gradient(180deg, rgba(255,255,255,0.08) 0%, transparent 100%)",
                borderRadius: "6px 6px 0 0",
                pointerEvents: "none",
              }}
            />
          </div>
        );
      })}

      {/* Suffix */}
      {suffix && (
        <span
          style={{
            fontSize: fontSize * 0.5,
            fontWeight: 700,
            color,
            fontFamily: "Inter, system-ui, sans-serif",
            opacity: 0.7,
            marginLeft: 6,
            alignSelf: "flex-end",
            paddingBottom: fontSize * 0.1,
            textShadow: "0 2px 8px rgba(0,0,0,0.3)",
          }}
        >
          {suffix}
        </span>
      )}
    </div>
  );
};

export default NumberTicker;
