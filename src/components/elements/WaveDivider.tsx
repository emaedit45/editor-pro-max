import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";

const WaveDivider: React.FC<{
  color?: string;
  amplitude?: number;
  speed?: number;
  delay?: number;
}> = ({ color = "#6429cd", amplitude = 30, speed = 1, delay = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const d = Math.round(delay * fps);
  const s = spring({ frame: frame - d, fps, config: { damping: 14, stiffness: 100 } });
  const opacity = interpolate(s, [0, 1], [0, 1]);
  const drawProgress = interpolate(s, [0, 1], [0, 500]);
  const phase = (frame - d) * speed * 0.05;
  const w = 500;
  const mid = 50;

  const points: string[] = [];
  for (let x = 0; x <= w; x += 5) {
    const y = mid + Math.sin((x / w) * Math.PI * 3 + phase) * amplitude * s;
    points.push(`${x},${y}`);
  }
  const pathD = `M${points.join(" L")}`;

  return (
    <div style={{ opacity, width: w, height: 100 }}>
      <svg width={w} height={100} viewBox={`0 0 ${w} 100`}>
        <path d={pathD} fill="none" stroke={color} strokeWidth={3} strokeDasharray={500} strokeDashoffset={500 - drawProgress} strokeLinecap="round" />
        <path d={`${pathD} L${w},100 L0,100 Z`} fill={color} fillOpacity={0.1 * s} />
      </svg>
    </div>
  );
};

export default WaveDivider;
