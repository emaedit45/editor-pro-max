import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";

const defaultColors = ["#6429cd", "#ff6b35", "#6429cd", "#ff6b35"];

const OrbitAnimation: React.FC<{
  orbitCount?: number;
  colors?: string[];
  speed?: number;
  delay?: number;
}> = ({ orbitCount = 4, colors = defaultColors, speed = 1, delay = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const d = Math.round(delay * fps);
  const entryS = spring({ frame: frame - d, fps, config: { damping: 14, stiffness: 100 } });
  const opacity = interpolate(entryS, [0, 1], [0, 1]);
  const size = 250;
  const cx = size / 2;

  const orbiters = Array.from({ length: orbitCount }, (_, i) => {
    const s = spring({ frame: frame - d - i * 5, fps, config: { damping: 14, stiffness: 100 } });
    const radius = 40 + i * 22;
    const angle = (frame - d) * speed * 0.04 + (i * Math.PI * 2) / orbitCount;
    const x = cx + Math.cos(angle) * radius * s;
    const y = cx + Math.sin(angle) * radius * s;
    const dotSize = 10 - i;
    const c = colors[i % colors.length];
    return (
      <g key={i}>
        <circle cx={cx} cy={cx} r={radius * s} fill="none" stroke={c} strokeWidth={1} opacity={0.2} strokeDasharray="4 4" />
        <circle cx={x} cy={y} r={dotSize} fill={c} />
        <circle cx={x} cy={y} r={dotSize + 4} fill={c} opacity={0.2} />
      </g>
    );
  });

  return (
    <div style={{ opacity, width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle cx={cx} cy={cx} r={12 * entryS} fill="#6429cd" />
        <circle cx={cx} cy={cx} r={6 * entryS} fill="#ff6b35" />
        {orbiters}
      </svg>
    </div>
  );
};

export default OrbitAnimation;
