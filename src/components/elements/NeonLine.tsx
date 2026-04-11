import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";

const NeonLine: React.FC<{
  color?: string;
  glowIntensity?: number;
  delay?: number;
}> = ({ color = "#6429cd", glowIntensity = 15, delay = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const d = Math.round(delay * fps);
  const s = spring({ frame: frame - d, fps, config: { damping: 14, stiffness: 100 } });
  const drawLen = 600;
  const offset = interpolate(s, [0, 1], [drawLen, 0]);
  const opacity = interpolate(s, [0, 1], [0, 1]);
  const pulse = 0.7 + Math.sin((frame - d) * 0.1) * 0.3;
  const glow = glowIntensity * pulse;

  const pathD = "M20,80 C80,10 160,150 240,60 C320,-30 380,120 460,50 C500,20 540,90 580,70";

  return (
    <div style={{ opacity, width: 600, height: 160 }}>
      <svg width={600} height={160} viewBox="0 0 600 160">
        <defs>
          <filter id="neonGlow">
            <feGaussianBlur stdDeviation={glow} result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <path d={pathD} fill="none" stroke={color} strokeWidth={3} strokeDasharray={drawLen} strokeDashoffset={offset} strokeLinecap="round" filter="url(#neonGlow)" />
        <path d={pathD} fill="none" stroke="#fff" strokeWidth={1} strokeDasharray={drawLen} strokeDashoffset={offset} strokeLinecap="round" opacity={0.6} />
      </svg>
    </div>
  );
};

export default NeonLine;
