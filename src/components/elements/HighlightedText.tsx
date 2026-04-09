import React from "react";
import {
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from "remotion";

interface HighlightedTextProps {
  text: string;
  highlightWords: string[];
  highlightColor?: string;
  fontSize?: number;
  textColor?: string;
  delay?: number;
}

export const HighlightedText: React.FC<HighlightedTextProps> = ({
  text,
  highlightWords,
  highlightColor = "#ff6b35",
  fontSize = 52,
  textColor = "#ffffff",
  delay = 0,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const delayFrames = Math.round(delay * fps);
  const adjustedFrame = Math.max(0, frame - delayFrames);

  const springConfig = { damping: 14, stiffness: 100 };

  const textFade = spring({
    frame: adjustedFrame,
    fps,
    config: springConfig,
  });

  // Split text into segments: highlighted and non-highlighted
  const escapeRegex = (str: string) =>
    str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const pattern = new RegExp(
    `(${highlightWords.map(escapeRegex).join("|")})`,
    "gi"
  );
  const segments = text.split(pattern);

  let highlightIndex = 0;

  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        justifyContent: "center",
        gap: "0px",
        opacity: textFade,
      }}
    >
      {segments.map((segment, i) => {
        const isHighlight = highlightWords.some(
          (w) => w.toLowerCase() === segment.toLowerCase()
        );

        if (isHighlight) {
          const currentHighlightIndex = highlightIndex;
          highlightIndex++;

          // Stagger each highlight word
          const highlightDelay = 15 + currentHighlightIndex * 10;
          const sweepProgress = spring({
            frame: Math.max(0, adjustedFrame - highlightDelay),
            fps,
            config: { damping: 18, stiffness: 80 },
          });

          const sweepWidth = interpolate(sweepProgress, [0, 1], [0, 100]);

          // Slight pop when highlight completes
          const popScale = spring({
            frame: Math.max(0, adjustedFrame - highlightDelay - 3),
            fps,
            config: { damping: 10, stiffness: 150 },
          });
          const scale = interpolate(popScale, [0, 1], [1, 1.02]);

          return (
            <span
              key={i}
              style={{
                position: "relative",
                display: "inline-block",
                fontSize,
                fontFamily: "'Helvetica Neue', Arial, sans-serif",
                fontWeight: 700,
                color: textColor,
                padding: "2px 8px",
                margin: "0 2px",
                transform: `scale(${scale})`,
                whiteSpace: "pre",
              }}
            >
              {/* Highlight background sweep */}
              <span
                style={{
                  position: "absolute",
                  left: 0,
                  top: "10%",
                  height: "80%",
                  width: `${sweepWidth}%`,
                  background: highlightColor,
                  opacity: 0.85,
                  borderRadius: 4,
                  zIndex: 0,
                  // Slight rotation for hand-drawn feel
                  transform: "rotate(-0.5deg) skewX(-1deg)",
                }}
              />
              <span style={{ position: "relative", zIndex: 1 }}>
                {segment}
              </span>
            </span>
          );
        }

        return (
          <span
            key={i}
            style={{
              fontSize,
              fontFamily: "'Helvetica Neue', Arial, sans-serif",
              fontWeight: 500,
              color: textColor,
              whiteSpace: "pre",
            }}
          >
            {segment}
          </span>
        );
      })}
    </div>
  );
};

export default HighlightedText;
