import React from "react";
import {
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from "remotion";

interface TextRevealProps {
  text: string;
  revealStyle?: "fade" | "slide" | "typewriter" | "blur";
  speed?: number;
  fontSize?: number;
  color?: string;
  fontFamily?: string;
  fontWeight?: number;
  letterSpacing?: string;
  delay?: number;
}

export const TextReveal: React.FC<TextRevealProps> = ({
  text,
  revealStyle = "fade",
  speed = 1,
  fontSize = 52,
  color = "#ffffff",
  fontFamily,
  fontWeight: fw,
  letterSpacing: ls,
  delay = 0,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const delayFrames = Math.round(delay * fps);
  const adjustedFrame = Math.max(0, frame - delayFrames);

  const springConfig = { damping: 14, stiffness: 100 };

  // Split into units based on style
  const isTypewriter = revealStyle === "typewriter";
  const units = isTypewriter ? text.split("") : text.split(/(\s+)/);

  // Frames between each unit appearing
  const framesPerUnit = Math.max(1, Math.round((isTypewriter ? 2 : 5) / speed));

  if (revealStyle === "typewriter") {
    const visibleChars = Math.min(
      units.length,
      Math.floor(adjustedFrame / framesPerUnit)
    );

    // Blinking cursor
    const cursorVisible =
      visibleChars < units.length
        ? Math.floor(adjustedFrame / 15) % 2 === 0
        : false;

    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <span
          style={{
            fontSize,
            fontFamily: fontFamily || "'SF Mono', 'Fira Code', 'Consolas', monospace",
            fontWeight: fw || 500,
            color,
            letterSpacing: ls || "0.02em",
            lineHeight: 1.5,
          }}
        >
          {units.slice(0, visibleChars).join("")}
          <span
            style={{
              display: "inline-block",
              width: 3,
              height: fontSize * 0.85,
              backgroundColor: color,
              marginLeft: 2,
              opacity: cursorVisible ? 1 : 0,
              verticalAlign: "middle",
              borderRadius: 1,
            }}
          />
        </span>
      </div>
    );
  }

  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        justifyContent: "center",
        gap: 0,
        maxWidth: 1000,
      }}
    >
      {units.map((unit, i) => {
        const unitDelay = i * framesPerUnit;
        const unitFrame = Math.max(0, adjustedFrame - unitDelay);

        if (unit.match(/^\s+$/)) {
          return (
            <span
              key={i}
              style={{
                fontSize,
                fontFamily: "'Helvetica Neue', Arial, sans-serif",
                whiteSpace: "pre",
              }}
            >
              {unit}
            </span>
          );
        }

        if (revealStyle === "fade") {
          const fadeProgress = spring({
            frame: unitFrame,
            fps,
            config: springConfig,
          });
          const opacity = interpolate(fadeProgress, [0, 1], [0, 1]);
          const yOffset = interpolate(fadeProgress, [0, 1], [8, 0]);

          return (
            <span
              key={i}
              style={{
                display: "inline-block",
                fontSize,
                fontFamily: fontFamily || "'Helvetica Neue', Arial, sans-serif",
                fontWeight: fw || 600,
                color,
                opacity,
                transform: `translateY(${yOffset}px)`,
                lineHeight: 1.5,
              }}
            >
              {unit}
            </span>
          );
        }

        if (revealStyle === "slide") {
          const slideProgress = spring({
            frame: unitFrame,
            fps,
            config: { damping: 12, stiffness: 120 },
          });
          const opacity = interpolate(slideProgress, [0, 1], [0, 1]);
          const xOffset = interpolate(slideProgress, [0, 1], [30, 0]);

          return (
            <span
              key={i}
              style={{
                display: "inline-block",
                fontSize,
                fontFamily: fontFamily || "'Helvetica Neue', Arial, sans-serif",
                fontWeight: fw || 600,
                color,
                opacity,
                transform: `translateX(${xOffset}px)`,
                lineHeight: 1.5,
              }}
            >
              {unit}
            </span>
          );
        }

        // blur
        if (revealStyle === "blur") {
          const blurProgress = spring({
            frame: unitFrame,
            fps,
            config: springConfig,
          });
          const opacity = interpolate(blurProgress, [0, 1], [0, 1]);
          const blur = interpolate(blurProgress, [0, 1], [12, 0]);
          const scale = interpolate(blurProgress, [0, 1], [1.1, 1]);

          return (
            <span
              key={i}
              style={{
                display: "inline-block",
                fontSize,
                fontFamily: fontFamily || "'Helvetica Neue', Arial, sans-serif",
                fontWeight: fw || 600,
                color,
                opacity,
                filter: `blur(${blur}px)`,
                transform: `scale(${scale})`,
                lineHeight: 1.5,
              }}
            >
              {unit}
            </span>
          );
        }

        return (
          <span key={i} style={{ fontSize, color }}>
            {unit}
          </span>
        );
      })}
    </div>
  );
};

export default TextReveal;
