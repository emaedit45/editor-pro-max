import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";

const DnaHelix: React.FC<{
  color1?: string;
  color2?: string;
  pairs?: number;
  delay?: number;
}> = ({ color1 = "#6429cd", color2 = "#ff6b35", pairs = 10, delay = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const d = Math.round(delay * fps);
  const entryS = spring({ frame: frame - d, fps, config: { damping: 14, stiffness: 100 } });
  const opacity = interpolate(entryS, [0, 1], [0, 1]);
  const w = 200;
  const h = pairs * 35;
  const cx = w / 2;
  const amp = 60;
  const t = (frame - d) * 0.05;

  const elements = Array.from({ length: pairs }, (_, i) => {
    const pairS = spring({ frame: frame - d - i * 3, fps, config: { damping: 14, stiffness: 100 } });
    const y = i * 35 + 20;
    const phase = (i / pairs) * Math.PI * 2 + t;
    const x1 = cx + Math.sin(phase) * amp * pairS;
    const x2 = cx - Math.sin(phase) * amp * pairS;
    const depth1 = Math.cos(phase);
    const depth2 = -depth1;
    const r1 = 5 + depth1 * 2;
    const r2 = 5 + depth2 * 2;

    return (
      <g key={i} opacity={interpolate(pairS, [0, 1], [0, 1])}>
        <line x1={x1} y1={y} x2={x2} y2={y} stroke="#ccc" strokeWidth={1.5} opacity={0.4} />
        {depth1 >= 0 && <circle cx={x1} cy={y} r={r1} fill={color1} />}
        {depth2 >= 0 && <circle cx={x2} cy={y} r={r2} fill={color2} />}
        {depth1 < 0 && <circle cx={x1} cy={y} r={r1} fill={color1} opacity={0.4} />}
        {depth2 < 0 && <circle cx={x2} cy={y} r={r2} fill={color2} opacity={0.4} />}
      </g>
    );
  });

  return (
    <div style={{ opacity, width: w, height: h }}>
      <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>{elements}</svg>
    </div>
  );
};

export default DnaHelix;
