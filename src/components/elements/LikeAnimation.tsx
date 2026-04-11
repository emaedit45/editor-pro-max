import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";

const LikeAnimation: React.FC<{
  icon?: "heart" | "fire";
  count?: number;
  color?: string;
  delay?: number;
}> = ({ icon = "heart", count = 8, color = "#ff6b35", delay = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const d = Math.round(delay * fps);
  const emoji = icon === "heart" ? "❤️" : "🔥";

  const particles = Array.from({ length: count }, (_, i) => {
    const offset = i * 4;
    const s = spring({ frame: frame - d - offset, fps, config: { damping: 14, stiffness: 100 } });
    const y = interpolate(s, [0, 1], [0, -180 - (i % 3) * 40]);
    const x = interpolate(s, [0, 1], [0, (i - count / 2) * 30]);
    const opacity = interpolate(s, [0, 0.3, 1], [0, 1, 0]);
    const scale = interpolate(s, [0, 0.5, 1], [0.3, 1.2, 0.6]);
    const rotate = (i - count / 2) * 15;
    return (
      <span key={i} style={{ position: "absolute", fontSize: 28, transform: `translate(${x}px, ${y}px) scale(${scale}) rotate(${rotate}deg)`, opacity }}>
        {emoji}
      </span>
    );
  });

  return (
    <div style={{ position: "relative", width: 200, height: 250, display: "flex", alignItems: "flex-end", justifyContent: "center" }}>
      {particles}
      <div style={{ width: 56, height: 56, borderRadius: "50%", background: color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, boxShadow: `0 0 20px ${color}44` }}>
        {emoji}
      </div>
    </div>
  );
};

export default LikeAnimation;
