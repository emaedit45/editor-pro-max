import React from "react";
import {
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from "remotion";

interface QuoteBlockProps {
  text: string;
  author?: string;
  fontSize?: number;
  quoteMarkColor?: string;
  delay?: number;
}

export const QuoteBlock: React.FC<QuoteBlockProps> = ({
  text,
  author,
  fontSize = 48,
  quoteMarkColor = "#6429cd",
  delay = 0,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const delayFrames = Math.round(delay * fps);
  const adjustedFrame = Math.max(0, frame - delayFrames);

  const springConfig = { damping: 14, stiffness: 100 };

  const fadeIn = spring({
    frame: adjustedFrame,
    fps,
    config: springConfig,
  });

  const slideUp = interpolate(fadeIn, [0, 1], [40, 0]);

  const quoteMarkProgress = spring({
    frame: adjustedFrame,
    fps,
    config: { damping: 12, stiffness: 80 },
    durationInFrames: 30,
  });

  const quoteMarkScale = interpolate(quoteMarkProgress, [0, 1], [0.5, 1]);
  const quoteMarkOpacity = interpolate(quoteMarkProgress, [0, 1], [0, 0.3]);

  const textProgress = spring({
    frame: Math.max(0, adjustedFrame - 8),
    fps,
    config: springConfig,
  });

  const textOpacity = interpolate(textProgress, [0, 1], [0, 1]);
  const textSlide = interpolate(textProgress, [0, 1], [20, 0]);

  const authorProgress = spring({
    frame: Math.max(0, adjustedFrame - 18),
    fps,
    config: springConfig,
  });

  const authorOpacity = interpolate(authorProgress, [0, 1], [0, 1]);
  const authorSlide = interpolate(authorProgress, [0, 1], [15, 0]);

  const lineWidth = interpolate(authorProgress, [0, 1], [0, 60]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        opacity: fadeIn,
        transform: `translateY(${slideUp}px)`,
        position: "relative",
        padding: "40px 60px",
      }}
    >
      {/* Opening quote mark */}
      <div
        style={{
          position: "absolute",
          top: -20,
          left: 20,
          fontSize: fontSize * 3,
          fontFamily: "Georgia, serif",
          color: quoteMarkColor,
          opacity: quoteMarkOpacity,
          transform: `scale(${quoteMarkScale})`,
          lineHeight: 1,
          userSelect: "none",
        }}
      >
        &#10077;
      </div>

      {/* Quote text */}
      <div
        style={{
          fontSize,
          fontFamily: "Georgia, 'Times New Roman', serif",
          fontStyle: "italic",
          color: "#ffffff",
          textAlign: "center",
          lineHeight: 1.5,
          maxWidth: 900,
          opacity: textOpacity,
          transform: `translateY(${textSlide}px)`,
          fontWeight: 400,
          letterSpacing: "0.02em",
          position: "relative",
          zIndex: 1,
        }}
      >
        {text}
      </div>

      {/* Closing quote mark */}
      <div
        style={{
          position: "absolute",
          bottom: -20,
          right: 20,
          fontSize: fontSize * 3,
          fontFamily: "Georgia, serif",
          color: quoteMarkColor,
          opacity: quoteMarkOpacity,
          transform: `scale(${quoteMarkScale})`,
          lineHeight: 1,
          userSelect: "none",
        }}
      >
        &#10078;
      </div>

      {/* Divider line */}
      {author && (
        <div
          style={{
            width: lineWidth,
            height: 2,
            background: `linear-gradient(90deg, transparent, ${quoteMarkColor}, transparent)`,
            marginTop: 30,
            opacity: authorOpacity,
          }}
        />
      )}

      {/* Author */}
      {author && (
        <div
          style={{
            marginTop: 16,
            fontSize: fontSize * 0.4,
            fontFamily: "'Helvetica Neue', Arial, sans-serif",
            color: "rgba(255, 255, 255, 0.7)",
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            opacity: authorOpacity,
            transform: `translateY(${authorSlide}px)`,
          }}
        >
          — {author}
        </div>
      )}
    </div>
  );
};

export default QuoteBlock;
