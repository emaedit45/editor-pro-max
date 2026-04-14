import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
  Easing,
  Img,
  staticFile,
  Audio,
} from "remotion";
import {TransitionSeries, linearTiming} from "@remotion/transitions";
import {fade} from "@remotion/transitions/fade";
import {wipe} from "@remotion/transitions/wipe";
import {loadDefaultFonts, loadGoogleFont} from "../presets/fonts";
import {SPRINGS} from "../presets/easings";
import {GradientBackground} from "../components/backgrounds/GradientBackground";
import {GlowOrbs} from "../components/backgrounds/GlowOrbs";
import {ParticleField} from "../components/backgrounds/ParticleField";
import {FilmGrain} from "../components/overlays/FilmGrain";
import {Vignette} from "../components/overlays/Vignette";
import {ScanLines} from "../components/overlays/ScanLines";

// ── Constants ──
const ORANGE = "#FF6B2C";
const PURPLE = "#7C3AED";
const CYAN = "#06B6D4";

// ══════════════════════════════════════════════
// MATRIX / CODE RAIN BACKGROUND
// ══════════════════════════════════════════════
const seeded = (s: number) => {
  const x = Math.sin(s * 9301 + 49297) * 233280;
  return x - Math.floor(x);
};

const CodeRain: React.FC<{opacity?: number}> = ({opacity = 0.12}) => {
  const frame = useCurrentFrame();
  const {width, height} = useVideoConfig();
  const columns = 25;
  const chars = "01アイウエオカキクケコ<>/{}=;:";

  return (
    <AbsoluteFill style={{opacity, fontFamily: "'JetBrains Mono', monospace", fontSize: 14, color: ORANGE, overflow: "hidden"}}>
      {Array.from({length: columns}, (_, col) => {
        const x = (col / columns) * width + seeded(col * 3) * 30;
        const speed = 0.8 + seeded(col * 7) * 1.2;
        const charCount = 12 + Math.floor(seeded(col * 11) * 8);

        return (
          <div key={col} style={{position: "absolute", left: x, top: 0, display: "flex", flexDirection: "column", gap: 2}}>
            {Array.from({length: charCount}, (__, row) => {
              const y = ((frame * speed + row * 22 + seeded(col * 13 + row) * 200) % (height + 400)) - 200;
              const charIndex = Math.floor(seeded(col * 17 + row * 7 + Math.floor(frame / 8)) * chars.length);
              const charOpacity = interpolate(row, [0, 3, charCount - 3, charCount], [0, 1, 1, 0.2], {extrapolateRight: "clamp", extrapolateLeft: "clamp"});

              return (
                <span
                  key={row}
                  style={{
                    position: "absolute",
                    top: y,
                    opacity: charOpacity,
                    color: row === 0 ? "#ffffff" : ORANGE,
                    textShadow: row === 0 ? `0 0 8px ${ORANGE}` : "none",
                  }}
                >
                  {chars[charIndex]}
                </span>
              );
            })}
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

// ══════════════════════════════════════════════
// FLOATING UI MOCKUP WITH PARALLAX
// ══════════════════════════════════════════════
const FloatingMockup: React.FC<{delay?: number}> = ({delay = 0}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const delayF = Math.round(delay * fps);
  const adj = Math.max(0, frame - delayF);

  const enter = spring({fps, frame: adj, config: SPRINGS.premium});

  // Parallax: subtle floating based on frame
  const floatY = Math.sin(adj * 0.04) * 8;
  const floatRotateX = Math.sin(adj * 0.03) * 2;
  const floatRotateY = Math.cos(adj * 0.025) * 1.5;

  return (
    <div
      style={{
        opacity: interpolate(enter, [0, 1], [0, 1]),
        transform: `
          perspective(1200px)
          translateY(${interpolate(enter, [0, 1], [60, 0]) + floatY}px)
          rotateX(${5 + floatRotateX}deg)
          rotateY(${-2 + floatRotateY}deg)
          scale(${interpolate(enter, [0, 1], [0.9, 1])})
        `,
        width: 900,
        borderRadius: 20,
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,255,255,0.08)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        boxShadow: `
          0 40px 100px rgba(0,0,0,0.5),
          0 0 60px ${ORANGE}10,
          inset 0 1px 0 rgba(255,255,255,0.06)
        `,
        overflow: "hidden",
      }}
    >
      {/* Title bar */}
      <div style={{padding: "14px 18px", display: "flex", alignItems: "center", gap: 8, borderBottom: "1px solid rgba(255,255,255,0.06)"}}>
        <div style={{width: 10, height: 10, borderRadius: 5, background: "#f43f5e"}} />
        <div style={{width: 10, height: 10, borderRadius: 5, background: "#f59e0b"}} />
        <div style={{width: 10, height: 10, borderRadius: 5, background: "#22c55e"}} />
        <span style={{fontSize: 12, color: "rgba(255,255,255,0.25)", fontFamily: "'JetBrains Mono', monospace", marginLeft: 10}}>
          app.saleads.ai/editor
        </span>
      </div>

      {/* Mock content */}
      <div style={{padding: "20px 22px", display: "flex", flexDirection: "column", gap: 12}}>
        {/* Top toolbar */}
        <div style={{display: "flex", gap: 8}}>
          {["Proyecto", "Editar", "Exportar", "IA"].map((label, i) => {
            const tabEnter = spring({fps, frame: adj - 15 - i * 4, config: SPRINGS.snappy});
            return (
              <div
                key={i}
                style={{
                  opacity: interpolate(tabEnter, [0, 1], [0, 1]),
                  transform: `translateY(${interpolate(tabEnter, [0, 1], [8, 0])}px)`,
                  padding: "6px 14px",
                  borderRadius: 6,
                  background: i === 3 ? `${ORANGE}20` : "rgba(255,255,255,0.04)",
                  border: `1px solid ${i === 3 ? `${ORANGE}40` : "rgba(255,255,255,0.06)"}`,
                  fontSize: 12,
                  color: i === 3 ? ORANGE : "rgba(255,255,255,0.5)",
                  fontWeight: 600,
                  fontFamily: "'Inter', sans-serif",
                }}
              >
                {label}
              </div>
            );
          })}
        </div>

        {/* Timeline area */}
        <div style={{display: "flex", gap: 12}}>
          {/* Left panel - preview with image */}
          <div style={{
            flex: 2,
            height: 220,
            borderRadius: 12,
            border: "1px solid rgba(255,255,255,0.08)",
            position: "relative",
            overflow: "hidden",
            boxShadow: `0 4px 20px rgba(0,0,0,0.3), inset 0 0 0 1px rgba(255,255,255,0.04)`,
          }}>
            <Img
              src={staticFile("assets/demo-preview.png")}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                objectPosition: "center 30%",
                borderRadius: 12,
              }}
            />
            {/* Playhead overlay */}
            {(() => {
              const playhead = interpolate(adj, [20, 300], [0, 100], {extrapolateRight: "clamp", extrapolateLeft: "clamp"});
              return (
                <div style={{position: "absolute", bottom: 0, left: 0, right: 0, height: 3, background: "rgba(255,255,255,0.1)"}}>
                  <div style={{width: `${playhead}%`, height: "100%", background: `linear-gradient(90deg, ${ORANGE}, ${PURPLE})`, borderRadius: 2}} />
                </div>
              );
            })()}
          </div>

          {/* Right panel - properties */}
          <div style={{flex: 1, display: "flex", flexDirection: "column", gap: 8}}>
            {[
              {label: "Resolución", val: "4K"},
              {label: "IA Model", val: "v3.2"},
              {label: "FPS", val: "60"},
            ].map((prop, i) => {
              const propEnter = spring({fps, frame: adj - 25 - i * 6, config: SPRINGS.snappy});
              return (
                <div
                  key={i}
                  style={{
                    opacity: interpolate(propEnter, [0, 1], [0, 1]),
                    transform: `translateX(${interpolate(propEnter, [0, 1], [15, 0])}px)`,
                    padding: "8px 10px",
                    borderRadius: 8,
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.05)",
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <span style={{fontSize: 11, color: "rgba(255,255,255,0.35)", fontFamily: "'JetBrains Mono', monospace"}}>{prop.label}</span>
                  <span style={{fontSize: 11, color: ORANGE, fontWeight: 700, fontFamily: "'JetBrains Mono', monospace"}}>{prop.val}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Timeline tracks */}
        <div style={{display: "flex", flexDirection: "column", gap: 4}}>
          {[
            {w: 85, c: ORANGE, label: "Video"},
            {w: 60, c: PURPLE, label: "Audio"},
            {w: 40, c: CYAN, label: "Captions"},
          ].map((track, i) => {
            const trackEnter = spring({fps, frame: adj - 35 - i * 5, config: SPRINGS.gentle});
            const trackWidth = interpolate(trackEnter, [0, 1], [0, track.w]);
            return (
              <div key={i} style={{display: "flex", alignItems: "center", gap: 8, opacity: interpolate(trackEnter, [0, 1], [0, 1])}}>
                <span style={{fontSize: 9, color: "rgba(255,255,255,0.3)", fontFamily: "'JetBrains Mono', monospace", width: 55, textAlign: "right"}}>{track.label}</span>
                <div style={{flex: 1, height: 14, borderRadius: 3, background: "rgba(255,255,255,0.03)", overflow: "hidden"}}>
                  <div style={{
                    width: `${trackWidth}%`,
                    height: "100%",
                    borderRadius: 3,
                    background: `linear-gradient(90deg, ${track.c}50, ${track.c}20)`,
                    border: `1px solid ${track.c}30`,
                  }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// ══════════════════════════════════════════════
// ANIMATED STAT COUNTER
// ══════════════════════════════════════════════
const BigCounter: React.FC<{
  prefix?: string;
  value: number;
  suffix: string;
  label: string;
  delay?: number;
  color?: string;
}> = ({prefix = "", value, suffix, label, delay = 0, color = ORANGE}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const delayF = Math.round(delay * fps);
  const adj = Math.max(0, frame - delayF);

  const enter = spring({fps, frame: adj, config: SPRINGS.heavy});
  const count = Math.round(interpolate(adj, [0, 50], [0, value], {extrapolateLeft: "clamp", extrapolateRight: "clamp"}));
  const glow = interpolate(adj % 80, [0, 40, 80], [0.6, 1, 0.6]);

  return (
    <div style={{opacity: interpolate(enter, [0, 1], [0, 1]), transform: `scale(${interpolate(enter, [0, 1], [0.8, 1])})`, textAlign: "center"}}>
      <div
        style={{
          fontSize: 100,
          fontWeight: 900,
          fontFamily: "'Inter', sans-serif",
          lineHeight: 1,
          background: `linear-gradient(135deg, ${color}, ${PURPLE})`,
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          filter: `drop-shadow(0 0 ${30 * glow}px ${color}40)`,
          letterSpacing: -4,
        }}
      >
        {prefix}{count}{suffix}
      </div>
      <div style={{fontSize: 22, fontWeight: 600, color: "rgba(255,255,255,0.4)", marginTop: 6, letterSpacing: 4, textTransform: "uppercase"}}>
        {label}
      </div>
    </div>
  );
};

// ══════════════════════════════════════════════
// WORD-BY-WORD REVEAL
// ══════════════════════════════════════════════
const WordReveal: React.FC<{
  text: string;
  fontSize?: number;
  delay?: number;
  color?: string;
  highlightWords?: string[];
  highlightColor?: string;
}> = ({text, fontSize = 52, delay = 0, color = "#ffffff", highlightWords = [], highlightColor = ORANGE}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const delayF = Math.round(delay * fps);
  const words = text.split(" ");

  return (
    <div style={{display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "6px 10px", maxWidth: 900}}>
      {words.map((word, i) => {
        const wordDelay = delayF + i * 5;
        const enter = spring({fps, frame: frame - wordDelay, config: SPRINGS.snappy});
        const isHighlight = highlightWords.some(hw => word.toLowerCase().includes(hw.toLowerCase()));

        return (
          <span
            key={i}
            style={{
              fontSize,
              fontWeight: 800,
              color: isHighlight ? highlightColor : color,
              fontFamily: "'Inter', sans-serif",
              opacity: interpolate(enter, [0, 1], [0, 1]),
              transform: `translateY(${interpolate(enter, [0, 1], [20, 0])}px) scale(${interpolate(enter, [0, 1], [0.95, 1])})`,
              display: "inline-block",
              textShadow: isHighlight ? `0 0 20px ${highlightColor}40` : "none",
              letterSpacing: -1,
            }}
          >
            {word}
          </span>
        );
      })}
    </div>
  );
};

// ══════════════════════════════════════════════
// CHECK MARKS SEQUENTIAL
// ══════════════════════════════════════════════
const FeatureChecks: React.FC<{delay?: number}> = ({delay = 0}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const delayF = Math.round(delay * fps);

  const features = [
    {text: "Edición automática con IA", color: ORANGE},
    {text: "Subtítulos inteligentes", color: PURPLE},
    {text: "Export 4K en segundos", color: CYAN},
    {text: "Templates premium", color: "#22c55e"},
  ];

  return (
    <div style={{display: "flex", flexDirection: "column", gap: 14, width: "100%", alignItems: "center"}}>
      {features.map((feat, i) => {
        const enter = spring({fps, frame: frame - delayF - i * 10, config: SPRINGS.snappy});
        return (
          <div
            key={i}
            style={{
              opacity: interpolate(enter, [0, 1], [0, 1]),
              transform: `translateY(${interpolate(enter, [0, 1], [15, 0])}px) scale(${interpolate(enter, [0, 1], [0.96, 1])})`,
              display: "flex",
              alignItems: "center",
              gap: 16,
            }}
          >
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 12,
                background: `${feat.color}18`,
                border: `2px solid ${feat.color}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: `0 0 14px ${feat.color}30`,
                flexShrink: 0,
              }}
            >
              <span style={{color: feat.color, fontSize: 28, fontWeight: 900}}>✓</span>
            </div>
            <span style={{fontSize: 36, color: "rgba(255,255,255,0.9)", fontWeight: 700, fontFamily: "'Inter', sans-serif"}}>{feat.text}</span>
          </div>
        );
      })}
    </div>
  );
};

// ══════════════════════════════════════════════
// CTA BUTTON WITH GLOW
// ══════════════════════════════════════════════
const CTAButton: React.FC<{delay?: number}> = ({delay = 0}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const delayF = Math.round(delay * fps);
  const adj = Math.max(0, frame - delayF);

  const enter = spring({fps, frame: adj, config: SPRINGS.premium});
  const pulse = 1 + Math.sin(adj * 0.08) * 0.015;
  const glowSize = 20 + Math.sin(adj * 0.06) * 10;

  return (
    <div style={{opacity: interpolate(enter, [0, 1], [0, 1]), transform: `translateY(${interpolate(enter, [0, 1], [25, 0])}px) scale(${interpolate(enter, [0, 1], [0.95, 1])})`, display: "flex", flexDirection: "column", alignItems: "center", gap: 12}}>
      <div
        style={{
          transform: `scale(${pulse})`,
          padding: "32px 80px",
          borderRadius: 60,
          background: `linear-gradient(135deg, ${ORANGE}, ${PURPLE})`,
          color: "#ffffff",
          fontSize: 52,
          fontWeight: 800,
          fontFamily: "'Inter', sans-serif",
          boxShadow: `0 0 ${glowSize * 2}px ${ORANGE}50, 0 12px 50px ${ORANGE}30`,
          display: "flex",
          alignItems: "center",
          gap: 14,
          letterSpacing: 0.5,
        }}
      >
        Prueba Gratis <span style={{fontSize: 44}}>→</span>
      </div>
      <span style={{fontSize: 24, color: "rgba(255,255,255,0.35)", fontFamily: "'Inter', sans-serif", fontWeight: 500}}>
        Sin tarjeta de crédito
      </span>
    </div>
  );
};


// ══════════════════════════════════════════════
// SCENES
// ══════════════════════════════════════════════

/** SCENE 1: Logo + Glitch + Code Rain (0-3s) */
const SceneIntro: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const sceneIn = interpolate(frame, [0, 10], [0, 1], {extrapolateRight: "clamp", easing: Easing.out(Easing.cubic)});

  return (
    <AbsoluteFill style={{opacity: sceneIn}}>
      <CodeRain opacity={0.08} />

      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 0,
        }}
      >
        {/* Logo image with subtle zoom + progressive reveal */}
        {(() => {
          // Slow fade in over 40 frames
          const opacity = interpolate(frame, [8, 48], [0, 1], {extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic)});
          // Gentle zoom: starts at 1.08 and settles to 1.0
          const scale = interpolate(frame, [8, 60], [1.08, 1.0], {extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic)});
          // Subtle blur that clears
          const blur = interpolate(frame, [8, 35], [6, 0], {extrapolateLeft: "clamp", extrapolateRight: "clamp"});

          return (
            <Img
              src={staticFile("assets/saleads-logo.png")}
              style={{
                width: 800,
                height: "auto",
                opacity,
                transform: `scale(${scale})`,
                filter: `blur(${blur}px) drop-shadow(0 0 20px ${ORANGE}25)`,
                marginBottom: -100,
              }}
            />
          );
        })()}

        {/* Tagline */}
        {(() => {
          const enter = spring({fps, frame: frame - 30, config: SPRINGS.gentle});
          return (
            <div
              style={{
                opacity: interpolate(enter, [0, 1], [0, 0.5]),
                transform: `translateY(${interpolate(enter, [0, 1], [15, 0])}px)`,
                fontSize: 22,
                fontWeight: 500,
                color: "rgba(255,255,255,0.5)",
                fontFamily: "'JetBrains Mono', monospace",
                letterSpacing: 3,
                textTransform: "uppercase",
              }}
            >
              AI-Powered Video Editing
            </div>
          );
        })()}

        {/* Decorative line */}
        {(() => {
          const lineEnter = spring({fps, frame: frame - 40, config: SPRINGS.premium});
          const lineWidth = interpolate(lineEnter, [0, 1], [0, 200]);
          return (
            <div style={{width: lineWidth, height: 2, background: `linear-gradient(90deg, transparent, ${ORANGE}, transparent)`, marginTop: 10}} />
          );
        })()}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/** SCENE 2: Demo visual - Mockup + Stats (3-10s) */
const SceneDemo: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const sceneIn = interpolate(frame, [0, 10], [0, 1], {extrapolateRight: "clamp", easing: Easing.out(Easing.cubic)});

  return (
    <AbsoluteFill style={{opacity: sceneIn}}>
      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          paddingLeft: 30,
          paddingRight: 30,
          gap: 18,
        }}
      >
        {/* Badge */}
        <div style={{
          opacity: interpolate(spring({fps, frame: frame - 5, config: SPRINGS.snappy}), [0, 1], [0, 1]),
          transform: `scale(${interpolate(spring({fps, frame: frame - 5, config: SPRINGS.snappy}), [0, 1], [0.95, 1])})`,
          display: "inline-flex", alignItems: "center", gap: 8,
          padding: "8px 20px", borderRadius: 30,
          background: `${ORANGE}14`, border: `1px solid ${ORANGE}35`,
        }}>
          <div style={{width: 8, height: 8, borderRadius: 4, background: ORANGE, boxShadow: `0 0 8px ${ORANGE}`}} />
          <span style={{fontSize: 15, fontWeight: 700, color: ORANGE, fontFamily: "'JetBrains Mono', monospace", letterSpacing: 3}}>DEMO</span>
        </div>

        {/* Floating mockup */}
        <FloatingMockup delay={0.15} />

        {/* Counter: 10x */}
        <BigCounter value={10} suffix="x" label="más rápido que la edición manual" delay={0.5} />

        {/* Feature checks */}
        <FeatureChecks delay={0.8} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/** SCENE 3: CTA Final (10-15s) */
const SceneCTA: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const sceneIn = interpolate(frame, [0, 10], [0, 1], {extrapolateRight: "clamp", easing: Easing.out(Easing.cubic)});

  // Fade out at end
  const sceneOut = interpolate(frame, [250, 290], [1, 0], {extrapolateLeft: "clamp", extrapolateRight: "clamp"});

  return (
    <AbsoluteFill style={{opacity: sceneIn * sceneOut}}>
      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 30,
          padding: "0 50px",
        }}
      >
        {/* Word reveal */}
        <WordReveal
          text="El futuro de la edición de video"
          fontSize={50}
          delay={0.1}
          highlightWords={["futuro", "edición"]}
          highlightColor={ORANGE}
        />

        {/* CTA button */}
        <CTAButton delay={0.6} />

        {/* Animated arrows pointing down */}
        {(() => {
          const arrows = [0, 1, 2];
          return (
            <div style={{display: "flex", flexDirection: "column", alignItems: "center", gap: 4, marginTop: 10}}>
              {arrows.map((i) => {
                // Each arrow bounces with offset timing
                const bounce = interpolate(
                  (frame + i * 12) % 50,
                  [0, 25, 50],
                  [0, 12, 0],
                );
                const arrowOpacity = interpolate(i, [0, 2], [1, 0.3]);
                const enterDelay = Math.round(0.9 * fps) + i * 8;
                const enter = spring({fps, frame: frame - enterDelay, config: SPRINGS.snappy});

                return (
                  <div
                    key={i}
                    style={{
                      opacity: interpolate(enter, [0, 1], [0, arrowOpacity]),
                      transform: `translateY(${bounce}px) scale(${interpolate(enter, [0, 1], [0.8, 1])})`,
                      fontSize: 48,
                      color: ORANGE,
                      lineHeight: 0.7,
                      filter: `drop-shadow(0 0 8px ${ORANGE}40)`,
                    }}
                  >
                    ▼
                  </div>
                );
              })}
            </div>
          );
        })()}

        {/* Brand footer */}
        {(() => {
          const enter = spring({fps, frame: frame - 70, config: SPRINGS.gentle});
          return (
            <div
              style={{
                opacity: interpolate(enter, [0, 1], [0, 0.4]),
                fontSize: 16,
                color: "rgba(255,255,255,0.4)",
                fontFamily: "'JetBrains Mono', monospace",
                letterSpacing: 4,
                marginTop: 10,
              }}
            >
              saleads.ai
            </div>
          );
        })()}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/** Scene 4: Muchachos - Elmo + Text + Audio */
const SceneMuchachos: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const sceneIn = interpolate(frame, [0, 15], [0, 1], {extrapolateRight: "clamp", easing: Easing.out(Easing.cubic)});

  return (
    <AbsoluteFill style={{opacity: sceneIn}}>
      {/* Audio */}
      <Audio src={staticFile("assets/muchachos.ogg")} volume={1} />

      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "0 50px",
          gap: 0,
        }}
      >
        {/* Top text: "Muchachos!" */}
        {(() => {
          const enter = spring({fps, frame: frame - 5, config: SPRINGS.bouncy});
          return (
            <div
              style={{
                opacity: interpolate(enter, [0, 1], [0, 1]),
                transform: `scale(${interpolate(enter, [0, 1], [0.7, 1])})`,
                fontSize: 72,
                fontWeight: 900,
                color: "#ffffff",
                fontFamily: "'Inter', sans-serif",
                textAlign: "center",
                letterSpacing: -2,
                textShadow: `0 0 30px ${ORANGE}50`,
                marginBottom: 20,
              }}
            >
              {"¡Muchachos!"}
            </div>
          );
        })()}

        {/* Elmo GIF in rounded mask */}
        {(() => {
          const enter = spring({fps, frame: frame - 12, config: SPRINGS.premium});
          // Subtle floating
          const floatY = Math.sin(frame * 0.05) * 5;

          return (
            <div
              style={{
                opacity: interpolate(enter, [0, 1], [0, 1]),
                transform: `translateY(${interpolate(enter, [0, 1], [40, 0]) + floatY}px) scale(${interpolate(enter, [0, 1], [0.9, 1])})`,
                width: 500,
                height: 380,
                borderRadius: 30,
                overflow: "hidden",
                border: "3px solid rgba(255,255,255,0.12)",
                boxShadow: `0 20px 60px rgba(0,0,0,0.5), 0 0 40px ${ORANGE}15`,
              }}
            >
              <Img
                src={staticFile("assets/elmo.gif")}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
            </div>
          );
        })()}

        {/* Bottom text: "En julio nadie va a tocar un editor" */}
        <div style={{marginTop: 28, display: "flex", flexDirection: "column", alignItems: "center", gap: 6}}>
          {/* Line 1 */}
          {(() => {
            const enter = spring({fps, frame: frame - 25, config: SPRINGS.snappy});
            return (
              <div
                style={{
                  opacity: interpolate(enter, [0, 1], [0, 1]),
                  transform: `translateY(${interpolate(enter, [0, 1], [20, 0])}px)`,
                  fontSize: 46,
                  fontWeight: 900,
                  fontFamily: "'Inter', sans-serif",
                  textAlign: "center",
                  letterSpacing: -1,
                }}
              >
                <span style={{color: "rgba(255,255,255,0.9)"}}>En </span>
                <span
                  style={{
                    background: `linear-gradient(135deg, ${ORANGE}, ${PURPLE})`,
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    filter: `drop-shadow(0 0 15px ${ORANGE}40)`,
                  }}
                >
                  julio
                </span>
              </div>
            );
          })()}

          {/* Line 2 */}
          {(() => {
            const enter = spring({fps, frame: frame - 32, config: SPRINGS.snappy});
            return (
              <div
                style={{
                  opacity: interpolate(enter, [0, 1], [0, 1]),
                  transform: `translateY(${interpolate(enter, [0, 1], [20, 0])}px)`,
                  fontSize: 44,
                  fontWeight: 800,
                  color: "rgba(255,255,255,0.85)",
                  fontFamily: "'Inter', sans-serif",
                  textAlign: "center",
                  letterSpacing: -1,
                }}
              >
                nadie va a tocar
              </div>
            );
          })()}

          {/* Line 3 */}
          {(() => {
            const enter = spring({fps, frame: frame - 39, config: SPRINGS.snappy});
            const glow = interpolate(frame % 60, [0, 30, 60], [0.5, 1, 0.5]);
            return (
              <div
                style={{
                  opacity: interpolate(enter, [0, 1], [0, 1]),
                  transform: `translateY(${interpolate(enter, [0, 1], [20, 0])}px) scale(${interpolate(enter, [0, 1], [0.95, 1])})`,
                  fontSize: 52,
                  fontWeight: 900,
                  fontFamily: "'Inter', sans-serif",
                  textAlign: "center",
                  letterSpacing: -1,
                  background: `linear-gradient(135deg, ${ORANGE}, ${PURPLE})`,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  filter: `drop-shadow(0 0 ${20 * glow}px ${ORANGE}35)`,
                }}
              >
                un editor 🎬
              </div>
            );
          })()}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ══════════════════════════════════════════════
// MAIN COMPOSITION
// ══════════════════════════════════════════════
export const SaleADSReel: React.FC = () => {
  loadDefaultFonts();
  loadGoogleFont("Poppins");

  return (
    <AbsoluteFill style={{fontFamily: "'Inter', sans-serif", overflow: "hidden"}}>

      {/* ── BACKGROUND STACK ── */}
      <GradientBackground
        colors={["#0a0a0a", "#1a0a06", "#0d0520", "#0a0a0a"]}
        angle={160}
        animateAngle
        animateSpeed={0.15}
      />
      <GlowOrbs
        colors={[
          "rgba(255,107,44,0.18)",    // Orange
          "rgba(124,58,237,0.15)",     // Purple
          "rgba(6,182,212,0.10)",      // Cyan
        ]}
        count={3}
        size={450}
        blur={120}
        speed={0.25}
      />
      <ParticleField count={15} color="rgba(255,107,44,0.08)" speed={0.15} direction="up" />

      {/* ── SCENES WITH TRANSITIONS ── */}
      <TransitionSeries>
        {/* Intro: 3s = 180 frames at 60fps */}
        <TransitionSeries.Sequence durationInFrames={180}>
          <SceneIntro />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={wipe({direction: "from-right"})}
          timing={linearTiming({durationInFrames: 25})}
        />

        {/* Demo: 5.5s = 330 frames at 60fps */}
        <TransitionSeries.Sequence durationInFrames={330}>
          <SceneDemo />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({durationInFrames: 8})}
        />

        {/* CTA: 5s = 300 frames at 60fps */}
        <TransitionSeries.Sequence durationInFrames={300}>
          <SceneCTA />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({durationInFrames: 15})}
        />

        {/* Muchachos: 4s = 240 frames at 60fps */}
        <TransitionSeries.Sequence durationInFrames={240}>
          <SceneMuchachos />
        </TransitionSeries.Sequence>
      </TransitionSeries>

      {/* ── CINEMATIC OVERLAYS (always on top) ── */}
      <ScanLines opacity={0.025} spacing={3} animated speed={0.2} />
      <Vignette intensity={0.5} spread={30} />
      <FilmGrain opacity={0.045} baseFrequency={0.7} numOctaves={3} animated />
    </AbsoluteFill>
  );
};
