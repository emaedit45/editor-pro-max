import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";

const YoutubeThumbnail: React.FC<{
  title?: string;
  channel?: string;
  views?: string;
  delay?: number;
}> = ({ title = "How to Edit Videos FAST", channel = "FloowVideo", views = "1.2M views", delay = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const d = Math.round(delay * fps);
  const s = spring({ frame: frame - d, fps, config: { damping: 14, stiffness: 100 } });
  const opacity = interpolate(s, [0, 1], [0, 1]);
  const scale = interpolate(s, [0, 1], [0.9, 1]);
  const playS = spring({ frame: frame - d - 8, fps, config: { damping: 14, stiffness: 100 } });
  const playScale = interpolate(playS, [0, 1], [0, 1]);

  return (
    <div style={{ opacity, transform: `scale(${scale})`, width: 440, fontFamily: "Arial, sans-serif" }}>
      <div style={{ width: "100%", height: 248, borderRadius: 12, background: "linear-gradient(135deg, #6429cd, #ff6b35)", position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ width: 64, height: 64, borderRadius: "50%", background: "rgba(0,0,0,0.7)", display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${playScale})` }}>
          <div style={{ width: 0, height: 0, borderLeft: "22px solid #fff", borderTop: "14px solid transparent", borderBottom: "14px solid transparent", marginLeft: 4 }} />
        </div>
        <div style={{ position: "absolute", bottom: 8, right: 8, background: "#000", color: "#fff", padding: "2px 6px", borderRadius: 4, fontSize: 12 }}>12:34</div>
      </div>
      <div style={{ display: "flex", gap: 12, marginTop: 12 }}>
        <div style={{ width: 36, height: 36, borderRadius: "50%", background: "#ff6b35", flexShrink: 0 }} />
        <div>
          <div style={{ fontWeight: 700, fontSize: 15, lineHeight: 1.3 }}>{title}</div>
          <div style={{ color: "#666", fontSize: 13, marginTop: 4 }}>{channel} · {views}</div>
        </div>
      </div>
    </div>
  );
};

export default YoutubeThumbnail;
