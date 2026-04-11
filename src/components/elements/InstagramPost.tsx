import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";

const InstagramPost: React.FC<{
  username?: string;
  caption?: string;
  likes?: number;
  delay?: number;
}> = ({ username = "floowvideo", caption = "Creating magic ✨", likes = 4823, delay = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const d = Math.round(delay * fps);
  const s = spring({ frame: frame - d, fps, config: { damping: 14, stiffness: 100 } });
  const opacity = interpolate(s, [0, 1], [0, 1]);
  const scale = interpolate(s, [0, 1], [0.85, 1]);
  const heartS = spring({ frame: frame - d - 10, fps, config: { damping: 14, stiffness: 100 } });
  const heartScale = interpolate(heartS, [0, 1], [0, 1.4]);
  const heartOp = interpolate(heartS, [0, 0.5, 1], [0, 1, 0.7]);

  return (
    <div style={{ opacity, transform: `scale(${scale})`, width: 400, background: "#fff", borderRadius: 12, overflow: "hidden", fontFamily: "Arial, sans-serif", boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 16px" }}>
        <div style={{ width: 32, height: 32, borderRadius: "50%", background: "linear-gradient(135deg, #ff6b35, #6429cd)" }} />
        <span style={{ fontWeight: 700, fontSize: 14 }}>{username}</span>
      </div>
      <div style={{ width: "100%", height: 300, background: "linear-gradient(135deg, #6429cd, #ff6b35)", display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
        <span style={{ fontSize: 80, transform: `scale(${heartScale})`, opacity: heartOp, position: "absolute" }}>❤️</span>
      </div>
      <div style={{ padding: "12px 16px" }}>
        <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 4 }}>{likes.toLocaleString()} likes</div>
        <div style={{ fontSize: 14 }}><b>{username}</b> {caption}</div>
      </div>
    </div>
  );
};

export default InstagramPost;
