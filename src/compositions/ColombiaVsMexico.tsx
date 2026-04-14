import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
  Easing,
} from "remotion";
import {TransitionSeries, linearTiming} from "@remotion/transitions";
import {fade} from "@remotion/transitions/fade";
import {slide} from "@remotion/transitions/slide";
import {loadDefaultFonts, loadGoogleFont} from "../presets/fonts";
import {SPRINGS} from "../presets/easings";

// ── Cinematic overlays ──
import {GradientBackground} from "../components/backgrounds/GradientBackground";
import {GlowOrbs} from "../components/backgrounds/GlowOrbs";
import {GridPattern} from "../components/backgrounds/GridPattern";
import {FilmGrain} from "../components/overlays/FilmGrain";
import {Vignette} from "../components/overlays/Vignette";
import {ScanLines} from "../components/overlays/ScanLines";
import {ProgressBar} from "../components/overlays/ProgressBar";
import {Watermark} from "../components/overlays/Watermark";

// ── Constants ──
const COL = "#FFCD00";
const MEX = "#00A86B";
const NEON = "#39FF14";
const CYAN = "#06b6d4";
const STAGGER = 5; // frames between elements (Disney principle: follow-through)

// ══════════════════════════════════════════
// MICRO-COMPONENTS (pro-level building blocks)
// ══════════════════════════════════════════

/** PillBadge: tech label with dot indicator */
const PillBadge: React.FC<{text: string; delay?: number; color?: string}> = ({
  text,
  delay = 0,
  color = NEON,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const enter = spring({fps, frame: frame - delay, config: SPRINGS.snappy});

  return (
    <div
      style={{
        // Apple-style: scale from 0.95, not 0
        opacity: interpolate(enter, [0, 1], [0, 1]),
        transform: `scale(${interpolate(enter, [0, 1], [0.95, 1])})`,
        display: "inline-flex",
        alignItems: "center",
        gap: 10,
        background: `${color}14`,
        border: `1.5px solid ${color}40`,
        borderRadius: 30,
        padding: "10px 26px",
      }}
    >
      <div style={{width: 8, height: 8, borderRadius: 4, background: color, boxShadow: `0 0 10px ${color}`}} />
      <span
        style={{
          fontSize: 18,
          fontWeight: 700,
          color,
          fontFamily: "'JetBrains Mono', monospace",
          letterSpacing: 3,
          textTransform: "uppercase",
        }}
      >
        {text}
      </span>
    </div>
  );
};

/** GlassCard: frosted glass container with window dots */
const GlassCard: React.FC<{
  delay?: number;
  children: React.ReactNode;
  dotLabel?: string;
}> = ({delay = 0, children, dotLabel}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const enter = spring({fps, frame: frame - delay, config: SPRINGS.premium});

  return (
    <div
      style={{
        opacity: interpolate(enter, [0, 1], [0, 1]),
        // Anticipation: slight downward before rising
        transform: `translateY(${interpolate(enter, [0, 1], [30, 0])}px) scale(${interpolate(enter, [0, 1], [0.97, 1])})`,
        background: "rgba(255,255,255,0.035)",
        border: "1px solid rgba(255,255,255,0.07)",
        borderRadius: 20,
        padding: "24px 28px",
        width: "100%",
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
        boxShadow: "0 24px 64px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.04)",
      }}
    >
      {/* Window dots */}
      <div style={{display: "flex", gap: 7, marginBottom: 18, alignItems: "center"}}>
        <div style={{width: 10, height: 10, borderRadius: 5, background: "#f43f5e"}} />
        <div style={{width: 10, height: 10, borderRadius: 5, background: "#f59e0b"}} />
        <div style={{width: 10, height: 10, borderRadius: 5, background: NEON}} />
        {dotLabel && (
          <span style={{fontSize: 13, color: "rgba(255,255,255,0.2)", fontFamily: "'JetBrains Mono', monospace", marginLeft: 8}}>
            {dotLabel}
          </span>
        )}
      </div>
      {children}
    </div>
  );
};

/** Animated stat bar with dual sides */
const DualBar: React.FC<{
  label: string;
  leftVal: number;
  rightVal: number;
  leftColor: string;
  rightColor: string;
  delay?: number;
  suffix?: string;
}> = ({label, leftVal, rightVal, leftColor, rightColor, delay = 0, suffix = "%"}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const enter = spring({fps, frame: frame - delay, config: SPRINGS.gentle});
  const maxVal = Math.max(leftVal, rightVal);

  const countL = Math.round(interpolate(frame - delay, [0, 30], [0, leftVal], {extrapolateLeft: "clamp", extrapolateRight: "clamp"}));
  const countR = Math.round(interpolate(frame - delay, [5, 35], [0, rightVal], {extrapolateLeft: "clamp", extrapolateRight: "clamp"}));
  const barL = interpolate(enter, [0, 1], [0, (leftVal / maxVal) * 100]);
  const barR = interpolate(enter, [0, 1], [0, (rightVal / maxVal) * 100]);

  return (
    <div
      style={{
        opacity: interpolate(enter, [0, 1], [0, 1]),
        transform: `translateX(${interpolate(enter, [0, 1], [-20, 0])}px)`,
        marginBottom: 14,
        width: "100%",
      }}
    >
      <div style={{fontSize: 13, fontWeight: 700, color: "rgba(255,255,255,0.35)", letterSpacing: 3, textTransform: "uppercase", marginBottom: 6, textAlign: "center", fontFamily: "'JetBrains Mono', monospace"}}>
        {label}
      </div>
      <div style={{display: "flex", gap: 6, alignItems: "center"}}>
        <div style={{flex: 1}}>
          <div style={{display: "flex", justifyContent: "space-between", marginBottom: 3}}>
            <span style={{fontSize: 12, color: leftColor, fontWeight: 700, fontFamily: "'JetBrains Mono', monospace"}}>COL</span>
            <span style={{fontSize: 26, fontWeight: 900, color: leftColor, fontFamily: "'Inter', sans-serif", letterSpacing: -1}}>{countL}{suffix}</span>
          </div>
          <div style={{width: "100%", height: 6, background: "rgba(255,255,255,0.05)", borderRadius: 3, overflow: "hidden"}}>
            <div style={{width: `${barL}%`, height: "100%", background: `linear-gradient(90deg, ${leftColor}30, ${leftColor})`, borderRadius: 3, boxShadow: `0 0 10px ${leftColor}25`}} />
          </div>
        </div>
        <div style={{width: 1, height: 40, background: "linear-gradient(180deg, transparent, rgba(255,255,255,0.1), transparent)", flexShrink: 0}} />
        <div style={{flex: 1}}>
          <div style={{display: "flex", justifyContent: "space-between", marginBottom: 3}}>
            <span style={{fontSize: 26, fontWeight: 900, color: rightColor, fontFamily: "'Inter', sans-serif", letterSpacing: -1}}>{countR}{suffix}</span>
            <span style={{fontSize: 12, color: rightColor, fontWeight: 700, fontFamily: "'JetBrains Mono', monospace"}}>MEX</span>
          </div>
          <div style={{width: "100%", height: 6, background: "rgba(255,255,255,0.05)", borderRadius: 3, overflow: "hidden", display: "flex", justifyContent: "flex-end"}}>
            <div style={{width: `${barR}%`, height: "100%", background: `linear-gradient(90deg, ${rightColor}, ${rightColor}30)`, borderRadius: 3, boxShadow: `0 0 10px ${rightColor}25`}} />
          </div>
        </div>
      </div>
    </div>
  );
};

/** Trait list for one country */
const TraitColumn: React.FC<{
  flag: string;
  name: string;
  traits: string[];
  color: string;
  delay?: number;
  side: "left" | "right";
}> = ({flag, name, traits, color, delay = 0, side}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const enter = spring({fps, frame: frame - delay, config: SPRINGS.premium});
  const slideX = interpolate(enter, [0, 1], [side === "left" ? -40 : 40, 0]);

  return (
    <div
      style={{
        flex: 1,
        opacity: interpolate(enter, [0, 1], [0, 1]),
        transform: `translateX(${slideX}px)`,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 10,
      }}
    >
      <div style={{fontSize: 48, lineHeight: 1, transform: `scale(${interpolate(enter, [0, 1], [0.95, 1])})`}}>{flag}</div>
      <div style={{fontSize: 16, fontWeight: 800, color, letterSpacing: 4, textTransform: "uppercase", textShadow: `0 0 15px ${color}33`}}>
        {name}
      </div>
      <div style={{display: "flex", flexDirection: "column", gap: 6, width: "100%"}}>
        {traits.map((trait, i) => {
          // Stagger: each trait enters STAGGER frames after previous (follow-through principle)
          const traitEnter = spring({fps, frame: frame - delay - 8 - i * STAGGER, config: SPRINGS.snappy});
          return (
            <div
              key={i}
              style={{
                opacity: interpolate(traitEnter, [0, 1], [0, 1]),
                transform: `translateY(${interpolate(traitEnter, [0, 1], [10, 0])}px) scale(${interpolate(traitEnter, [0, 1], [0.97, 1])})`,
                background: `${color}0C`,
                border: `1px solid ${color}20`,
                borderRadius: 10,
                padding: "8px 12px",
                fontSize: 15,
                fontWeight: 700,
                color: "rgba(255,255,255,0.85)",
                fontFamily: "'Inter', sans-serif",
                textAlign: "center",
              }}
            >
              {trait}
            </div>
          );
        })}
      </div>
    </div>
  );
};

/** Check item with animated checkmark */
const CheckItem: React.FC<{text: string; delay?: number; color: string}> = ({text, delay = 0, color}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const enter = spring({fps, frame: frame - delay, config: SPRINGS.snappy});

  return (
    <div
      style={{
        opacity: interpolate(enter, [0, 1], [0, 1]),
        transform: `translateX(${interpolate(enter, [0, 1], [-15, 0])}px) scale(${interpolate(enter, [0, 1], [0.96, 1])})`,
        display: "flex",
        alignItems: "center",
        gap: 12,
        marginBottom: 10,
      }}
    >
      <div
        style={{
          width: 28,
          height: 28,
          borderRadius: 7,
          background: `${color}18`,
          border: `2px solid ${color}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 16,
          color,
          fontWeight: 900,
          boxShadow: `0 0 8px ${color}25`,
        }}
      >
        ✓
      </div>
      <span style={{fontSize: 22, color: "rgba(255,255,255,0.75)", fontFamily: "'Inter', sans-serif", fontWeight: 600}}>{text}</span>
    </div>
  );
};

// ══════════════════════════════════════════
// SCENES
// ══════════════════════════════════════════

/** Scene 1: Hook cinematico */
const SceneHook: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  // Fade the entire scene in (not instant)
  const sceneIn = interpolate(frame, [0, 15], [0, 1], {extrapolateRight: "clamp", easing: Easing.out(Easing.cubic)});

  return (
    <AbsoluteFill style={{opacity: sceneIn}}>
      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "flex-start",
          paddingTop: 180,
          paddingLeft: 50,
          paddingRight: 50,
        }}
      >
        <PillBadge text="Comparativa" delay={8} />

        {/* Main headline with gradient text */}
        {(() => {
          const enter = spring({fps, frame: frame - 14, config: SPRINGS.premium});
          return (
            <div
              style={{
                opacity: interpolate(enter, [0, 1], [0, 1]),
                transform: `translateY(${interpolate(enter, [0, 1], [25, 0])}px) scale(${interpolate(enter, [0, 1], [0.96, 1])})`,
                textAlign: "center",
                marginTop: 28,
              }}
            >
              <div style={{fontSize: 72, fontWeight: 900, lineHeight: 1, color: "#fff", letterSpacing: -2}}>
                Empresario
              </div>
              <div
                style={{
                  fontSize: 78,
                  fontWeight: 900,
                  lineHeight: 1.05,
                  background: `linear-gradient(135deg, ${COL}, ${NEON}, ${MEX})`,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  filter: `drop-shadow(0 0 25px ${NEON}30)`,
                  letterSpacing: -2,
                  marginTop: 2,
                }}
              >
                Colombiano
              </div>
              <div style={{fontSize: 72, fontWeight: 900, lineHeight: 1.05, color: "#fff", letterSpacing: -2, marginTop: 2}}>
                vs Mexicano
              </div>
            </div>
          );
        })()}

        {/* Flags + VS badge */}
        <div style={{display: "flex", alignItems: "center", gap: 24, marginTop: 40}}>
          {[{emoji: "🇨🇴", d: 28}, {emoji: "VS", d: 33, isVS: true}, {emoji: "🇲🇽", d: 38}].map((item, i) => {
            const e = spring({fps, frame: frame - item.d, config: item.isVS ? SPRINGS.bouncy : SPRINGS.snappy});
            if (item.isVS) {
              const glow = interpolate(frame % 60, [0, 30, 60], [0.5, 1, 0.5]);
              return (
                <div key={i} style={{transform: `scale(${interpolate(e, [0, 1], [0, 1])})`, opacity: interpolate(e, [0, 1], [0, 1])}}>
                  <div
                    style={{
                      width: 80,
                      height: 80,
                      borderRadius: "50%",
                      background: `linear-gradient(135deg, ${COL}, ${NEON}, ${MEX})`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      boxShadow: `0 0 ${45 * glow}px ${NEON}35, 0 10px 35px rgba(0,0,0,0.5)`,
                      border: "3px solid rgba(255,255,255,0.15)",
                    }}
                  >
                    <span style={{fontSize: 24, fontWeight: 900, color: "#000", letterSpacing: 3}}>VS</span>
                  </div>
                </div>
              );
            }
            return (
              <div key={i} style={{fontSize: 72, transform: `scale(${interpolate(e, [0, 1], [0.95, 1])})`, opacity: interpolate(e, [0, 1], [0, 1])}}>
                {item.emoji}
              </div>
            );
          })}
        </div>

        {/* Subtitle (secondary action: fades in slower, lighter weight) */}
        {(() => {
          const enter = spring({fps, frame: frame - 45, config: SPRINGS.gentle});
          return (
            <div
              style={{
                opacity: interpolate(enter, [0, 1], [0, 0.45]),
                transform: `translateY(${interpolate(enter, [0, 1], [15, 0])}px)`,
                fontSize: 26,
                fontWeight: 500,
                color: "rgba(255,255,255,0.45)",
                marginTop: 35,
                textAlign: "center",
                letterSpacing: 1,
              }}
            >
              {"¿Quién la tiene más clara?"}
            </div>
          );
        })()}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/** Scene 2: Mentalidad side-by-side */
const SceneMentalidad: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const sceneIn = interpolate(frame, [0, 12], [0, 1], {extrapolateRight: "clamp", easing: Easing.out(Easing.cubic)});

  return (
    <AbsoluteFill style={{opacity: sceneIn}}>
      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "flex-start",
          paddingTop: 110,
          paddingLeft: 32,
          paddingRight: 32,
        }}
      >
        <PillBadge text="Mentalidad" delay={5} color={CYAN} />

        {(() => {
          const enter = spring({fps, frame: frame - 10, config: SPRINGS.premium});
          return (
            <div
              style={{
                opacity: interpolate(enter, [0, 1], [0, 1]),
                transform: `translateY(${interpolate(enter, [0, 1], [20, 0])}px)`,
                fontSize: 48,
                fontWeight: 900,
                color: "#fff",
                textAlign: "center",
                marginTop: 8,
                marginBottom: 14,
                letterSpacing: -1,
              }}
            >
              {"¿Cómo piensan?"}
            </div>
          );
        })()}

        <GlassCard delay={14} dotLabel="mentalidad/vs">
          <div style={{display: "flex", gap: 14}}>
            <TraitColumn
              flag="🇨🇴"
              name="Colombia"
              color={COL}
              delay={18}
              side="left"
              traits={[
                "\"Echao pa' lante\"",
                "Recursivo x naturaleza",
                "El rebusque es arte",
                "Tinto + negocio",
              ]}
            />

            <div style={{width: 1, background: `linear-gradient(180deg, transparent, ${NEON}20, transparent)`, flexShrink: 0, margin: "15px 0"}} />

            <TraitColumn
              flag="🇲🇽"
              name="Mexico"
              color={MEX}
              delay={23}
              side="right"
              traits={[
                "\"A huevo que sí\"",
                "Chingón sin excusas",
                "La movida o la movida",
                "Tacos + networking",
              ]}
            />
          </div>
        </GlassCard>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/** Scene 3: Estadísticas con barras duales */
const SceneStats: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const sceneIn = interpolate(frame, [0, 12], [0, 1], {extrapolateRight: "clamp", easing: Easing.out(Easing.cubic)});

  return (
    <AbsoluteFill style={{opacity: sceneIn}}>
      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "flex-start",
          paddingTop: 100,
          paddingLeft: 36,
          paddingRight: 36,
        }}
      >
        <PillBadge text="En numeros" delay={5} color="#f59e0b" />

        {(() => {
          const enter = spring({fps, frame: frame - 10, config: SPRINGS.premium});
          return (
            <div
              style={{
                opacity: interpolate(enter, [0, 1], [0, 1]),
                transform: `translateY(${interpolate(enter, [0, 1], [20, 0])}px)`,
                fontSize: 46,
                fontWeight: 900,
                color: "#fff",
                textAlign: "center",
                marginTop: 8,
                marginBottom: 12,
                letterSpacing: -1,
              }}
            >
              Resultados reales
            </div>
          );
        })()}

        <GlassCard delay={14} dotLabel="stats/dashboard">
          {/* Headers */}
          <div style={{display: "flex", justifyContent: "space-between", marginBottom: 12, padding: "0 6px"}}>
            <div style={{display: "flex", alignItems: "center", gap: 6}}>
              <span style={{fontSize: 24}}>🇨🇴</span>
              <span style={{fontSize: 16, fontWeight: 800, color: COL, fontFamily: "'JetBrains Mono', monospace", letterSpacing: 2}}>COL</span>
            </div>
            <div style={{display: "flex", alignItems: "center", gap: 6}}>
              <span style={{fontSize: 16, fontWeight: 800, color: MEX, fontFamily: "'JetBrains Mono', monospace", letterSpacing: 2}}>MEX</span>
              <span style={{fontSize: 24}}>🇲🇽</span>
            </div>
          </div>

          <DualBar label="Emprendimiento" leftVal={62} rightVal={72} leftColor={COL} rightColor={MEX} delay={20} />
          <DualBar label="E-Commerce" leftVal={55} rightVal={68} leftColor={COL} rightColor={MEX} delay={20 + STAGGER} />
          <DualBar label="Startups Tech" leftVal={42} rightVal={56} leftColor={COL} rightColor={MEX} delay={20 + STAGGER * 2} />
          <DualBar label="Hustle Mode" leftVal={95} rightVal={93} leftColor={COL} rightColor={MEX} delay={20 + STAGGER * 3} suffix="/100" />
          <DualBar label="Creatividad" leftVal={91} rightVal={87} leftColor={COL} rightColor={MEX} delay={20 + STAGGER * 4} suffix="/100" />
        </GlassCard>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/** Scene 4: Conclusion + Big number */
const SceneConclusion: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const sceneIn = interpolate(frame, [0, 12], [0, 1], {extrapolateRight: "clamp", easing: Easing.out(Easing.cubic)});

  // Animated counter
  const countStart = 12;
  const count = Math.round(interpolate(frame - countStart, [0, 40], [0, 660], {extrapolateLeft: "clamp", extrapolateRight: "clamp"}));

  return (
    <AbsoluteFill style={{opacity: sceneIn}}>
      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "flex-start",
          paddingTop: 140,
          paddingLeft: 50,
          paddingRight: 50,
        }}
      >
        <PillBadge text="La verdad" delay={5} />

        {/* Big gradient number */}
        {(() => {
          const enter = spring({fps, frame: frame - 10, config: SPRINGS.heavy});
          return (
            <div
              style={{
                opacity: interpolate(enter, [0, 1], [0, 1]),
                transform: `scale(${interpolate(enter, [0, 1], [0.7, 1])})`,
                textAlign: "center",
                marginTop: 16,
              }}
            >
              <div
                style={{
                  fontSize: 110,
                  fontWeight: 900,
                  fontFamily: "'Inter', sans-serif",
                  lineHeight: 1,
                  background: `linear-gradient(135deg, ${NEON}, ${CYAN})`,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  filter: `drop-shadow(0 0 30px ${NEON}35)`,
                  letterSpacing: -4,
                }}
              >
                {count.toLocaleString("es")}M+
              </div>
              <div style={{fontSize: 20, fontWeight: 600, color: "rgba(255,255,255,0.4)", marginTop: 4, letterSpacing: 4, textTransform: "uppercase"}}>
                PIB combinado USD
              </div>
            </div>
          );
        })()}

        {/* Gradient text statement */}
        {(() => {
          const enter = spring({fps, frame: frame - 30, config: SPRINGS.premium});
          return (
            <div
              style={{
                opacity: interpolate(enter, [0, 1], [0, 1]),
                transform: `translateY(${interpolate(enter, [0, 1], [20, 0])}px) scale(${interpolate(enter, [0, 1], [0.97, 1])})`,
                textAlign: "center",
                marginTop: 24,
              }}
            >
              <div
                style={{
                  fontSize: 58,
                  fontWeight: 900,
                  lineHeight: 1.1,
                  background: `linear-gradient(135deg, ${COL}, ${NEON}, ${MEX})`,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  filter: `drop-shadow(0 0 20px ${NEON}28)`,
                  letterSpacing: -2,
                  whiteSpace: "pre-line",
                }}
              >
                {"Latinos\nImparables"}
              </div>
              <div style={{fontSize: 24, fontWeight: 500, color: "rgba(255,255,255,0.4)", marginTop: 14, lineHeight: 1.4, whiteSpace: "pre-line"}}>
                {"No importa el pais,\nel empresario latino no se rinde"}
              </div>
            </div>
          );
        })()}

        {/* Check items with stagger */}
        <div style={{marginTop: 24, alignSelf: "flex-start", paddingLeft: 40}}>
          <CheckItem text="Misma hambre de crecer" delay={45} color={COL} />
          <CheckItem text="Misma mentalidad guerrera" delay={45 + STAGGER * 2} color={NEON} />
          <CheckItem text="Latinos haciendo historia" delay={45 + STAGGER * 4} color={MEX} />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/** Scene 5: CTA */
const SceneCTA: React.FC = () => {
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
          gap: 24,
          padding: "0 60px",
        }}
      >
        {/* Flags row */}
        <div style={{display: "flex", alignItems: "center", gap: 18}}>
          {[{e: "🇨🇴", d: 3}, {e: "🤝", d: 6, sz: 40}, {e: "🇲🇽", d: 9}].map((item, i) => {
            const enter = spring({fps, frame: frame - item.d, config: SPRINGS.snappy});
            return (
              <div key={i} style={{fontSize: item.sz || 58, transform: `scale(${interpolate(enter, [0, 1], [0.95, 1])})`, opacity: interpolate(enter, [0, 1], [0, 1])}}>
                {item.e}
              </div>
            );
          })}
        </div>

        {/* CTA button with glow pulse */}
        {(() => {
          const enter = spring({fps, frame: frame - 10, config: SPRINGS.premium});
          const glow = interpolate(frame % 50, [0, 25, 50], [0.5, 1, 0.5]);
          return (
            <div
              style={{
                opacity: interpolate(enter, [0, 1], [0, 1]),
                transform: `translateY(${interpolate(enter, [0, 1], [20, 0])}px) scale(${interpolate(enter, [0, 1], [0.96, 1])})`,
              }}
            >
              <div
                style={{
                  background: `${NEON}10`,
                  border: `2px solid ${NEON}35`,
                  borderRadius: 14,
                  padding: "18px 44px",
                  textAlign: "center",
                  boxShadow: `0 0 ${25 * glow}px ${NEON}18`,
                }}
              >
                <div style={{fontSize: 30, fontWeight: 900, color: NEON, letterSpacing: 5, textTransform: "uppercase", textShadow: `0 0 15px ${NEON}35`}}>
                  Comenta tu pais
                </div>
                <div style={{fontSize: 16, fontWeight: 500, color: "rgba(255,255,255,0.35)", marginTop: 5, letterSpacing: 2}}>
                  {"¿Cuál es más berriondo?"}
                </div>
              </div>
            </div>
          );
        })()}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ══════════════════════════════════════════
// MAIN COMPOSITION (with TransitionSeries)
// ══════════════════════════════════════════
export const ColombiaVsMexico: React.FC = () => {
  loadDefaultFonts();
  loadGoogleFont("Poppins");

  const frame = useCurrentFrame();

  // Subtle background dot pulse (secondary action)
  const bgPulse = interpolate(frame % 300, [0, 150, 300], [0.03, 0.07, 0.03]);

  return (
    <AbsoluteFill style={{fontFamily: "'Inter', sans-serif", overflow: "hidden"}}>

      {/* ── BACKGROUND STACK (bottom to top) ── */}
      <GradientBackground
        colors={["#020d06", "#0a2e14", "#051a0c", "#020d06"]}
        angle={160}
        animateAngle
        animateSpeed={0.2}
      />
      <GlowOrbs
        colors={[
          `rgba(57,255,20,0.15)`,    // Neon green
          `rgba(6,182,212,0.12)`,     // Cyan
          `rgba(255,205,0,0.08)`,     // Gold (Colombia)
        ]}
        count={3}
        size={400}
        blur={100}
        speed={0.3}
      />
      <GridPattern
        type="dots"
        spacing={50}
        size={1.2}
        color={`rgba(57,255,20,${bgPulse})`}
        animate
        animateSpeed={0.2}
      />

      {/* Decorative side lines (staging: frame the content) */}
      <AbsoluteFill style={{pointerEvents: "none"}}>
        <div style={{position: "absolute", left: 28, top: 0, width: 1, height: "100%", background: `linear-gradient(180deg, transparent, ${NEON}10, transparent)`}} />
        <div style={{position: "absolute", right: 28, top: 0, width: 1, height: "100%", background: `linear-gradient(180deg, transparent, ${NEON}10, transparent)`}} />
      </AbsoluteFill>

      {/* ── SCENES with TransitionSeries (crossfade between scenes) ── */}
      <TransitionSeries>
        <TransitionSeries.Sequence durationInFrames={130}>
          <SceneHook />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({durationInFrames: 20})}
        />

        <TransitionSeries.Sequence durationInFrames={145}>
          <SceneMentalidad />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={slide({direction: "from-right"})}
          timing={linearTiming({durationInFrames: 18})}
        />

        <TransitionSeries.Sequence durationInFrames={170}>
          <SceneStats />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({durationInFrames: 20})}
        />

        <TransitionSeries.Sequence durationInFrames={130}>
          <SceneConclusion />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({durationInFrames: 15})}
        />

        <TransitionSeries.Sequence durationInFrames={75}>
          <SceneCTA />
        </TransitionSeries.Sequence>
      </TransitionSeries>

      {/* ── CINEMATIC OVERLAY STACK (top layers, always visible) ── */}
      <ScanLines opacity={0.03} spacing={3} animated speed={0.3} />
      <Vignette intensity={0.55} spread={35} />
      <FilmGrain opacity={0.055} baseFrequency={0.65} numOctaves={3} animated />
      <ProgressBar color={NEON} height={3} position="bottom" />
      <Watermark text="@soyenriquerocha" corner="bottomRight" opacity={0.3} fontSize={14} />
    </AbsoluteFill>
  );
};
