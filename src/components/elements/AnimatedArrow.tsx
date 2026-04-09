import React from "react";
import {
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from "remotion";

interface AnimatedArrowProps {
  startX?: number;
  startY?: number;
  endX?: number;
  endY?: number;
  color?: string;
  strokeWidth?: number;
  curved?: boolean;
  delay?: number;
}

export const AnimatedArrow: React.FC<AnimatedArrowProps> = ({
  startX = 50,
  startY = 200,
  endX = 550,
  endY = 200,
  color = "#ff6b35",
  strokeWidth = 3,
  curved = false,
  delay = 0,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const delayFrames = Math.round(delay * fps);
  const adjustedFrame = Math.max(0, frame - delayFrames);

  // Calculate path
  const midX = (startX + endX) / 2;
  const midY = (startY + endY) / 2;
  const curveOffset = curved ? -80 : 0;

  const pathD = curved
    ? `M ${startX} ${startY} Q ${midX} ${midY + curveOffset} ${endX} ${endY}`
    : `M ${startX} ${startY} L ${endX} ${endY}`;

  // Approximate path length
  const dx = endX - startX;
  const dy = endY - startY;
  const straightLen = Math.sqrt(dx * dx + dy * dy);
  const pathLength = curved ? straightLen * 1.2 : straightLen;

  // Draw animation
  const drawProgress = interpolate(adjustedFrame, [0, 25], [0, 1], {
    extrapolateRight: "clamp",
  });
  const dashOffset = pathLength * (1 - drawProgress);

  // Arrowhead appears at end
  const headProgress = spring({
    frame: adjustedFrame - 20,
    fps,
    config: { damping: 14, stiffness: 100 },
  });
  const headOpacity = interpolate(headProgress, [0, 0.5, 1], [0, 0.8, 1]);
  const headScale = headProgress;

  // Calculate arrowhead angle
  let angle: number;
  if (curved) {
    // Tangent at end of quadratic bezier: derivative at t=1
    const tangentX = endX - midX;
    const tangentY = endY - (midY + curveOffset);
    angle = Math.atan2(tangentY, tangentX);
  } else {
    angle = Math.atan2(dy, dx);
  }
  const angleDeg = (angle * 180) / Math.PI;

  const headSize = strokeWidth * 5;

  // SVG viewBox dimensions
  const padding = 40;
  const minX = Math.min(startX, endX, midX) - padding;
  const minY =
    Math.min(startY, endY, midY + curveOffset) - padding;
  const maxX = Math.max(startX, endX, midX) + padding;
  const maxY =
    Math.max(startY, endY, midY + curveOffset) + padding;
  const viewWidth = maxX - minX;
  const viewHeight = maxY - minY;

  return (
    <svg
      viewBox={`${minX} ${minY} ${viewWidth} ${viewHeight}`}
      style={{
        width: "100%",
        height: "100%",
        overflow: "visible",
      }}
    >
      {/* Glow layer */}
      <path
        d={pathD}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth + 6}
        strokeLinecap="round"
        strokeDasharray={pathLength}
        strokeDashoffset={dashOffset}
        opacity={0.15}
      />

      {/* Main line */}
      <path
        d={pathD}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeDasharray={pathLength}
        strokeDashoffset={dashOffset}
      />

      {/* Arrowhead */}
      <g
        transform={`translate(${endX}, ${endY}) rotate(${angleDeg}) scale(${headScale})`}
        opacity={headOpacity}
      >
        <polygon
          points={`0,0 ${-headSize},${ -headSize / 2.5} ${-headSize},${headSize / 2.5}`}
          fill={color}
        />
      </g>
    </svg>
  );
};

export default AnimatedArrow;
