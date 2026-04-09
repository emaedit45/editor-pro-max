import React from "react";
import {
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from "remotion";

interface TestimonialCardProps {
  quote: string;
  author: string;
  role?: string;
  rating?: number;
  color?: string;
  delay?: number;
}

export const TestimonialCard: React.FC<TestimonialCardProps> = ({
  quote,
  author,
  role,
  rating = 5,
  color = "#6429cd",
  delay = 0,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const delayFrames = Math.round(delay * fps);
  const adjustedFrame = Math.max(0, frame - delayFrames);

  const springConfig = { damping: 14, stiffness: 100 };

  // Card entry
  const cardProgress = spring({
    frame: adjustedFrame,
    fps,
    config: springConfig,
  });

  const cardOpacity = interpolate(cardProgress, [0, 1], [0, 1]);
  const cardScale = interpolate(cardProgress, [0, 1], [0.92, 1]);
  const cardY = interpolate(cardProgress, [0, 1], [30, 0]);

  // Quote text
  const quoteProgress = spring({
    frame: Math.max(0, adjustedFrame - 8),
    fps,
    config: springConfig,
  });
  const quoteOpacity = interpolate(quoteProgress, [0, 1], [0, 1]);

  // Author info
  const authorProgress = spring({
    frame: Math.max(0, adjustedFrame - 20),
    fps,
    config: springConfig,
  });
  const authorOpacity = interpolate(authorProgress, [0, 1], [0, 1]);
  const authorX = interpolate(authorProgress, [0, 1], [15, 0]);

  // Get initials
  const initials = author
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  // Render star
  const renderStar = (index: number) => {
    const starDelay = 14 + index * 4;
    const starPop = spring({
      frame: Math.max(0, adjustedFrame - starDelay),
      fps,
      config: { damping: 10, stiffness: 150 },
    });
    const starScale = interpolate(starPop, [0, 1], [0, 1]);
    const starOpacity = interpolate(starPop, [0, 1], [0, 1]);

    const filled = index < Math.floor(rating);
    const halfFilled = !filled && index < rating;

    return (
      <span
        key={index}
        style={{
          display: "inline-block",
          fontSize: 22,
          transform: `scale(${starScale})`,
          opacity: starOpacity,
          color: filled || halfFilled ? "#fbbf24" : "rgba(255,255,255,0.2)",
          marginRight: 3,
        }}
      >
        {filled ? "\u2605" : halfFilled ? "\u2605" : "\u2606"}
      </span>
    );
  };

  return (
    <div
      style={{
        opacity: cardOpacity,
        transform: `translateY(${cardY}px) scale(${cardScale})`,
      }}
    >
      <div
        style={{
          background: "rgba(255, 255, 255, 0.08)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          borderRadius: 20,
          padding: "36px 40px",
          maxWidth: 520,
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Accent glow */}
        <div
          style={{
            position: "absolute",
            top: -40,
            right: -40,
            width: 120,
            height: 120,
            borderRadius: "50%",
            background: color,
            opacity: 0.1,
            filter: "blur(40px)",
          }}
        />

        {/* Quote mark */}
        <div
          style={{
            fontSize: 48,
            fontFamily: "Georgia, serif",
            color,
            opacity: 0.4,
            lineHeight: 1,
            marginBottom: 8,
          }}
        >
          &#10077;
        </div>

        {/* Quote text */}
        <div
          style={{
            fontSize: 20,
            fontFamily: "'Helvetica Neue', Arial, sans-serif",
            color: "rgba(255, 255, 255, 0.9)",
            lineHeight: 1.6,
            fontWeight: 400,
            marginBottom: 20,
            opacity: quoteOpacity,
            fontStyle: "italic",
          }}
        >
          {quote}
        </div>

        {/* Star rating */}
        <div style={{ marginBottom: 20 }}>
          {Array.from({ length: Math.ceil(rating) }, (_, i) => renderStar(i))}
        </div>

        {/* Author row */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            opacity: authorOpacity,
            transform: `translateX(${authorX}px)`,
          }}
        >
          {/* Avatar circle with initials */}
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: "50%",
              background: `linear-gradient(135deg, ${color}, #ff6b35)`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 18,
              fontWeight: 700,
              color: "#ffffff",
              fontFamily: "'Helvetica Neue', Arial, sans-serif",
              flexShrink: 0,
            }}
          >
            {initials}
          </div>

          <div>
            <div
              style={{
                fontSize: 17,
                fontWeight: 600,
                color: "#ffffff",
                fontFamily: "'Helvetica Neue', Arial, sans-serif",
              }}
            >
              {author}
            </div>
            {role && (
              <div
                style={{
                  fontSize: 14,
                  color: "rgba(255, 255, 255, 0.5)",
                  fontFamily: "'Helvetica Neue', Arial, sans-serif",
                  marginTop: 2,
                }}
              >
                {role}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestimonialCard;
