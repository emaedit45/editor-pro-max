import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";

const shapes: Record<string, (x: number, y: number, s: number) => string> = {
  triangle: (x, y, s) => `M${x},${y - s} L${x - s},${y + s} L${x + s},${y + s} Z`,
  hexagon: (x, y, s) => Array.from({ length: 6 }, (_, i) => {
    const a = (i * 60 - 30) * Math.PI / 180;
    return `${x + Math.cos(a) * s},${y + Math.sin(a) * s}`;
  }).reduce((d, p, i) => d + (i === 0 ? `M${p}` : `L${p}`), "") + " Z",
  diamond: (x, y, s) => `M${x},${y - s} L${x + s},${y} L${x},${y + s} L${x - s},${y} Z`,
};

const GeometricPattern: React.FC<{
  shape?: "triangle" | "hexagon" | "diamond";
  color?: string;
  delay?: number;
}> = ({ shape = "hexagon", color = "#6429cd", delay = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const d = Math.round(delay * fps);
  const cols = 6;
  const rows = 4;
  const gap = 50;
  const w = cols * gap;
  const h = rows * gap;

  const tiles = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const idx = r * cols + c;
      const tileS = spring({ frame: frame - d - idx * 2, fps, config: { damping: 14, stiffness: 100 } });
      const opacity = interpolate(tileS, [0, 1], [0, 0.8]);
      const scale = interpolate(tileS, [0, 1], [0, 1]);
      const x = c * gap + gap / 2 + (r % 2 === 0 ? 0 : gap / 2);
      const y = r * gap + gap / 2;
      tiles.push(
        <g key={idx} opacity={opacity} transform={`translate(${x},${y}) scale(${scale}) translate(${-x},${-y})`}>
          <path d={shapes[shape](x, y, gap * 0.35)} fill={idx % 3 === 0 ? "#ff6b35" : color} />
        </g>
      );
    }
  }

  return (
    <svg width={w + gap} height={h + gap} viewBox={`0 0 ${w + gap} ${h + gap}`}>{tiles}</svg>
  );
};

export default GeometricPattern;
