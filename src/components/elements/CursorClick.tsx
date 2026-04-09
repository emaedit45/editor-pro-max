import React from "react";
import {
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
  AbsoluteFill,
} from "remotion";

interface CursorClickProps {
  startX?: number;
  startY?: number;
  endX?: number;
  endY?: number;
  clickDelay?: number;
  cursorColor?: string;
  rippleColor?: string;
  delay?: number;
}

const CursorSVG: React.FC<{ color: string; size: number }> = ({
  color,
  size,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Drop shadow */}
    <defs>
      <filter id="cursorShadow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="1" dy="2" stdDeviation="1.5" floodColor="rgba(0,0,0,0.35)" />
      </filter>
    </defs>
    {/* Pointer arrow */}
    <path
      d="M5 3L19 12L12 13L15 21L12 22L9 14L5 17V3Z"
      fill={color}
      stroke="white"
      strokeWidth="1.2"
      strokeLinejoin="round"
      filter="url(#cursorShadow)"
    />
  </svg>
);

const ClickRipple: React.FC<{
  x: number;
  y: number;
  color: string;
  frame: number;
  fps: number;
}> = ({ x, y, color, frame, fps }) => {
  const rippleCount = 3;

  return (
    <>
      {Array.from({ length: rippleCount }).map((_, i) => {
        const rippleDelay = i * 4;
        const rippleFrame = Math.max(0, frame - rippleDelay);

        const rippleSpring = spring({
          frame: rippleFrame,
          fps,
          config: { damping: 20, stiffness: 80 },
        });

        const scale = interpolate(rippleSpring, [0, 1], [0, 1 + i * 0.6]);
        const opacity = interpolate(
          rippleSpring,
          [0, 0.3, 1],
          [0, 0.7 - i * 0.15, 0],
          { extrapolateRight: "clamp" }
        );

        const ringSize = 40 + i * 20;

        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x - ringSize / 2,
              top: y - ringSize / 2,
              width: ringSize,
              height: ringSize,
              borderRadius: "50%",
              border: `2px solid ${color}`,
              backgroundColor: i === 0 ? `${color}20` : "transparent",
              transform: `scale(${scale})`,
              opacity,
              boxShadow: i === 0 ? `0 0 20px ${color}40` : "none",
              willChange: "transform, opacity",
            }}
          />
        );
      })}

      {/* Center dot on click */}
      {(() => {
        const dotSpring = spring({
          frame,
          fps,
          config: { damping: 12, stiffness: 200 },
        });

        const dotScale = interpolate(dotSpring, [0, 1], [0, 1]);
        const dotOpacity = interpolate(
          frame,
          [0, 5, 20, 30],
          [0, 1, 1, 0],
          { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
        );

        return (
          <div
            style={{
              position: "absolute",
              left: x - 5,
              top: y - 5,
              width: 10,
              height: 10,
              borderRadius: "50%",
              backgroundColor: color,
              transform: `scale(${dotScale})`,
              opacity: dotOpacity,
              boxShadow: `0 0 12px ${color}`,
              willChange: "transform, opacity",
            }}
          />
        );
      })()}
    </>
  );
};

export const CursorClick: React.FC<CursorClickProps> = ({
  startX = 200,
  startY = 200,
  endX = 600,
  endY = 400,
  clickDelay = 0.8,
  cursorColor = "#6429cd",
  rippleColor = "#ff6b35",
  delay = 0,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const delayFrames = Math.round(delay * fps);
  const adjustedFrame = frame - delayFrames;

  if (adjustedFrame < 0) return null;

  const clickDelayFrames = Math.round(clickDelay * fps);
  const movePhaseEnd = clickDelayFrames;

  // --- MOVE PHASE ---
  // Eased movement with spring
  const moveProgress = spring({
    frame: adjustedFrame,
    fps,
    config: { damping: 14, stiffness: 100 },
    durationInFrames: movePhaseEnd,
  });

  // Bezier-like curve: cursor takes a subtle arc path
  const linearX = interpolate(moveProgress, [0, 1], [startX, endX]);
  const linearY = interpolate(moveProgress, [0, 1], [startY, endY]);

  // Add a subtle arc offset
  const arcOffset = Math.sin(moveProgress * Math.PI) * -40;
  const cursorX = linearX;
  const cursorY = linearY + arcOffset;

  // Cursor tilt during movement (leans into the direction)
  const tilt = interpolate(moveProgress, [0, 0.3, 0.7, 1], [0, -8, -8, 0]);

  // --- CLICK PHASE ---
  const clickFrame = adjustedFrame - movePhaseEnd;
  const isClicking = clickFrame >= 0;

  // Click press animation (cursor pushes down slightly)
  const clickPress = isClicking
    ? spring({
        frame: clickFrame,
        fps,
        config: { damping: 20, stiffness: 300 },
        durationInFrames: 8,
      })
    : 0;

  const clickScale = interpolate(clickPress, [0, 1], [1, 0.85]);

  // Cursor entry fade
  const entryOpacity = interpolate(adjustedFrame, [0, 5], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Trail dots
  const trailDots = 5;

  return (
    <AbsoluteFill
      style={{
        overflow: "hidden",
        pointerEvents: "none",
      }}
    >
      {/* Motion trail */}
      {moveProgress < 1 &&
        Array.from({ length: trailDots }).map((_, i) => {
          const trailDelay = (i + 1) * 2;
          const trailFrame = Math.max(0, adjustedFrame - trailDelay);

          const trailProgress = spring({
            frame: trailFrame,
            fps,
            config: { damping: 14, stiffness: 100 },
            durationInFrames: movePhaseEnd,
          });

          const tx = interpolate(trailProgress, [0, 1], [startX, endX]);
          const ty =
            interpolate(trailProgress, [0, 1], [startY, endY]) +
            Math.sin(trailProgress * Math.PI) * -40;

          const trailOpacity = interpolate(
            i,
            [0, trailDots - 1],
            [0.4, 0.05]
          );

          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: tx - 3,
                top: ty - 3,
                width: 6 - i * 0.8,
                height: 6 - i * 0.8,
                borderRadius: "50%",
                backgroundColor: cursorColor,
                opacity: trailOpacity * entryOpacity * (1 - moveProgress),
                willChange: "opacity",
              }}
            />
          );
        })}

      {/* Click ripples */}
      {isClicking && (
        <ClickRipple
          x={endX}
          y={endY}
          color={rippleColor}
          frame={clickFrame}
          fps={fps}
        />
      )}

      {/* Cursor */}
      <div
        style={{
          position: "absolute",
          left: cursorX,
          top: cursorY,
          transform: `rotate(${tilt}deg) scale(${clickScale})`,
          transformOrigin: "top left",
          opacity: entryOpacity,
          willChange: "transform, opacity",
          filter: `drop-shadow(0 2px 8px rgba(0,0,0,0.25))`,
        }}
      >
        <CursorSVG color={cursorColor} size={32} />
      </div>
    </AbsoluteFill>
  );
};

export default CursorClick;
