import React from "react";
import {
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from "remotion";

interface StarRatingProps {
  rating: number;
  maxStars?: number;
  color?: string;
  size?: number;
  delay?: number;
}

export const StarRating: React.FC<StarRatingProps> = ({
  rating,
  maxStars = 5,
  color = "#fbbf24",
  size = 48,
  delay = 0,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const delayFrames = Math.round(delay * fps);
  const adjustedFrame = Math.max(0, frame - delayFrames);

  // Container fade
  const containerProgress = spring({
    frame: adjustedFrame,
    fps,
    config: { damping: 14, stiffness: 100 },
  });
  const containerOpacity = interpolate(containerProgress, [0, 1], [0, 1]);

  const renderStar = (index: number) => {
    const starDelay = 6 + index * 5;
    const starFrame = Math.max(0, adjustedFrame - starDelay);

    // Pop-in spring
    const popProgress = spring({
      frame: starFrame,
      fps,
      config: { damping: 10, stiffness: 150 },
    });

    const scale = interpolate(popProgress, [0, 1], [0, 1]);
    const rotation = interpolate(popProgress, [0, 1], [-30, 0]);
    const opacity = interpolate(popProgress, [0, 1], [0, 1]);

    // Determine fill level: full, half, or empty
    const fillLevel = Math.min(1, Math.max(0, rating - index));
    const isFull = fillLevel >= 1;
    const isHalf = fillLevel > 0 && fillLevel < 1;
    const isEmpty = fillLevel <= 0;

    // Star SVG path
    const starPath =
      "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z";

    return (
      <div
        key={index}
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          width: size,
          height: size,
          transform: `scale(${scale}) rotate(${rotation}deg)`,
          opacity,
          marginRight: size * 0.1,
        }}
      >
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          style={{ overflow: "visible" }}
        >
          {/* Empty star background */}
          <path
            d={starPath}
            fill="rgba(255, 255, 255, 0.12)"
            stroke="rgba(255, 255, 255, 0.15)"
            strokeWidth={0.5}
          />

          {/* Filled star (full or half) */}
          {!isEmpty && (
            <>
              <defs>
                <clipPath id={`star-clip-${index}`}>
                  <rect
                    x="0"
                    y="0"
                    width={isHalf ? "50%" : "100%"}
                    height="100%"
                  />
                </clipPath>
              </defs>
              <path
                d={starPath}
                fill={color}
                clipPath={`url(#star-clip-${index})`}
                style={{
                  filter: `drop-shadow(0 0 ${size * 0.15}px ${color}40)`,
                }}
              />
            </>
          )}

          {isFull && (
            <path
              d={starPath}
              fill={color}
              style={{
                filter: `drop-shadow(0 0 ${size * 0.15}px ${color}40)`,
              }}
            />
          )}
        </svg>
      </div>
    );
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        opacity: containerOpacity,
        gap: 4,
      }}
    >
      {Array.from({ length: maxStars }, (_, i) => renderStar(i))}
    </div>
  );
};

export default StarRating;
