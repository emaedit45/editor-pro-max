import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";

const BlobShape: React.FC<{
  color?: string;
  size?: number;
  speed?: number;
  delay?: number;
}> = ({ color = "#6429cd", size = 200, speed = 1, delay = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const d = Math.round(delay * fps);
  const s = spring({ frame: frame - d, fps, config: { damping: 14, stiffness: 100 } });
  const scale = interpolate(s, [0, 1], [0, 1]);
  const opacity = interpolate(s, [0, 1], [0, 1]);
  const t = (frame - d) * speed * 0.03;
  const r = size / 2;

  const points = 6;
  const pathParts: string[] = [];
  for (let i = 0; i <= points; i++) {
    const angle = (i / points) * Math.PI * 2;
    const wobble = r * 0.8 + Math.sin(angle * 3 + t) * r * 0.15 + Math.cos(angle * 2 - t * 0.7) * r * 0.1;
    const x = r + Math.cos(angle) * wobble;
    const y = r + Math.sin(angle) * wobble;
    pathParts.push(i === 0 ? `M${x},${y}` : `L${x},${y}`);
  }

  return (
    <div style={{ opacity, transform: `scale(${scale})`, width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <path d={`${pathParts.join(" ")} Z`} fill={color} opacity={0.85} />
        <path d={`${pathParts.join(" ")} Z`} fill="none" stroke={color} strokeWidth={2} opacity={0.5} />
      </svg>
    </div>
  );
};

export default BlobShape;
