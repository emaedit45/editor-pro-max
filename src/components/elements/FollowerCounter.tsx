import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";

const icons: Record<string, string> = { instagram: "📷", tiktok: "🎵", youtube: "▶️" };
const colors: Record<string, string> = { instagram: "#E1306C", tiktok: "#000", youtube: "#FF0000" };

const FollowerCounter: React.FC<{
  platform?: "instagram" | "tiktok" | "youtube";
  startCount?: number;
  endCount?: number;
  delay?: number;
}> = ({ platform = "instagram", startCount = 9800, endCount = 10000, delay = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const d = Math.round(delay * fps);
  const s = spring({ frame: frame - d, fps, config: { damping: 14, stiffness: 100 } });
  const opacity = interpolate(s, [0, 1], [0, 1]);
  const scale = interpolate(s, [0, 1], [0.8, 1]);
  const progress = interpolate(frame - d, [0, 60], [0, 1], { extrapolateRight: "clamp" });
  const count = Math.round(startCount + (endCount - startCount) * progress);
  const pop = spring({ frame: frame - d - 50, fps, config: { damping: 14, stiffness: 100 } });
  const textScale = count >= endCount ? interpolate(pop, [0, 1], [1, 1.15]) : 1;

  return (
    <div style={{ opacity, transform: `scale(${scale})`, display: "flex", alignItems: "center", gap: 20, background: "#fff", borderRadius: 16, padding: "20px 32px", boxShadow: "0 4px 20px rgba(0,0,0,0.1)", fontFamily: "Arial, sans-serif" }}>
      <div style={{ width: 56, height: 56, borderRadius: 14, background: colors[platform], display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28 }}>
        {icons[platform]}
      </div>
      <div>
        <div style={{ fontSize: 36, fontWeight: 800, color: "#6429cd", transform: `scale(${textScale})`, transformOrigin: "left center" }}>
          {count.toLocaleString()}
        </div>
        <div style={{ fontSize: 14, color: "#999", textTransform: "uppercase", letterSpacing: 1 }}>followers</div>
      </div>
    </div>
  );
};

export default FollowerCounter;
