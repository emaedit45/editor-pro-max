import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";

const PulseRing: React.FC<{
  color?: string;
  ringCount?: number;
  speed?: number;
  delay?: number;
}> = ({ color = "#6429cd", ringCount = 4, speed = 1, delay = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const d = Math.round(delay * fps);
  const entryS = spring({ frame: frame - d, fps, config: { damping: 14, stiffness: 100 } });
  const opacity = interpolate(entryS, [0, 1], [0, 1]);
  const size = 300;
  const cx = size / 2;

  const rings = Array.from({ length: ringCount }, (_, i) => {
    const offset = i * Math.round(20 / speed);
    const s = spring({ frame: frame - d - offset, fps, config: { damping: 14, stiffness: 100 } });
    const radius = interpolate(s, [0, 1], [10, cx - 10]);
    const ringOpacity = interpolate(s, [0, 0.3, 1], [0, 0.8, 0.1]);
    const strokeW = interpolate(s, [0, 1], [4, 1.5]);
    return (
      <circle key={i} cx={cx} cy={cx} r={radius} fill="none" stroke={i % 2 === 0 ? color : "#ff6b35"} strokeWidth={strokeW} opacity={ringOpacity} />
    );
  });

  return (
    <div style={{ opacity, width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle cx={cx} cy={cx} r={8 * entryS} fill={color} />
        {rings}
      </svg>
    </div>
  );
};

export default PulseRing;
