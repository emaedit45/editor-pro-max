import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";

const TweetCard: React.FC<{
  handle?: string;
  text?: string;
  likes?: number;
  retweets?: number;
  delay?: number;
}> = ({ handle = "@floowvideo", text = "This is amazing! 🚀", likes = 1240, retweets = 328, delay = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const delayFrames = Math.round(delay * fps);
  const s = spring({ frame: frame - delayFrames, fps, config: { damping: 14, stiffness: 100 } });
  const scale = interpolate(s, [0, 1], [0.8, 1]);
  const opacity = interpolate(s, [0, 1], [0, 1]);
  const heartScale = spring({ frame: frame - delayFrames - 15, fps, config: { damping: 14, stiffness: 100 } });

  return (
    <div style={{ opacity, transform: `scale(${scale})`, background: "#fff", borderRadius: 16, padding: 24, width: 420, fontFamily: "Arial, sans-serif", boxShadow: "0 4px 24px rgba(0,0,0,0.12)" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
        <div style={{ width: 48, height: 48, borderRadius: "50%", background: "linear-gradient(135deg, #6429cd, #ff6b35)" }} />
        <div>
          <div style={{ fontWeight: 700, fontSize: 16 }}>FloowVideo</div>
          <div style={{ color: "#657786", fontSize: 14 }}>{handle}</div>
        </div>
      </div>
      <div style={{ fontSize: 18, lineHeight: 1.4, marginBottom: 16 }}>{text}</div>
      <div style={{ display: "flex", gap: 32, color: "#657786", fontSize: 14 }}>
        <span style={{ transform: `scale(${interpolate(heartScale, [0, 1], [1, 1.3])})`, display: "inline-block" }}>
          ♥ {likes.toLocaleString()}
        </span>
        <span>🔁 {retweets.toLocaleString()}</span>
      </div>
    </div>
  );
};

export default TweetCard;
