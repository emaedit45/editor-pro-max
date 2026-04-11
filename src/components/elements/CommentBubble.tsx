import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";

const CommentBubble: React.FC<{
  text?: string;
  username?: string;
  side?: "left" | "right";
  delay?: number;
}> = ({ text = "This is so cool!", username = "viewer", side = "left", delay = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const d = Math.round(delay * fps);
  const s = spring({ frame: frame - d, fps, config: { damping: 14, stiffness: 100 } });
  const slideX = interpolate(s, [0, 1], [side === "left" ? -100 : 100, 0]);
  const opacity = interpolate(s, [0, 1], [0, 1]);
  const isLeft = side === "left";
  const dotS = spring({ frame: frame - d + 5, fps, config: { damping: 14, stiffness: 100 } });
  const showText = frame - d > 20;

  const dots = !showText && (
    <div style={{ display: "flex", gap: 4 }}>
      {[0, 1, 2].map((i) => {
        const bounce = interpolate(Math.sin((frame - d + i * 5) * 0.3), [-1, 1], [0, -6]);
        return <div key={i} style={{ width: 8, height: 8, borderRadius: "50%", background: "#999", transform: `translateY(${bounce}px)`, opacity: interpolate(dotS, [0, 1], [0, 1]) }} />;
      })}
    </div>
  );

  return (
    <div style={{ opacity, transform: `translateX(${slideX}px)`, display: "flex", flexDirection: isLeft ? "row" : "row-reverse", alignItems: "flex-end", gap: 10, fontFamily: "Arial, sans-serif" }}>
      <div style={{ width: 36, height: 36, borderRadius: "50%", background: isLeft ? "#6429cd" : "#ff6b35", flexShrink: 0 }} />
      <div>
        <div style={{ fontSize: 12, color: "#999", marginBottom: 4, textAlign: isLeft ? "left" : "right" }}>{username}</div>
        <div style={{ background: isLeft ? "#f0f0f0" : "#6429cd", color: isLeft ? "#333" : "#fff", padding: "10px 16px", borderRadius: 18, borderBottomLeftRadius: isLeft ? 4 : 18, borderBottomRightRadius: isLeft ? 18 : 4, fontSize: 15, maxWidth: 280 }}>
          {showText ? text : dots}
        </div>
      </div>
    </div>
  );
};

export default CommentBubble;
