import {
  AbsoluteFill,
  Sequence,
  useCurrentFrame,
  interpolate,
  spring,
  useVideoConfig,
} from "remotion";
import {GradientBackground} from "../components/backgrounds/GradientBackground";
import {ParticleField} from "../components/backgrounds/ParticleField";
import {loadDefaultFonts} from "../presets/fonts";

const PillBadge: React.FC<{text: string; delay: number; color?: string}> = ({
  text,
  delay,
  color = "#8b5cf6",
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const enter = spring({fps, frame: frame - delay, config: {damping: 14, stiffness: 120}});

  return (
    <div
      style={{
        opacity: interpolate(enter, [0, 1], [0, 1]),
        transform: `scale(${interpolate(enter, [0, 1], [0.8, 1])})`,
        display: "inline-flex",
        alignItems: "center",
        gap: 10,
        background: `${color}20`,
        border: `1.5px solid ${color}60`,
        borderRadius: 30,
        padding: "12px 28px",
        marginBottom: 16,
      }}
    >
      <div style={{width: 10, height: 10, borderRadius: 5, background: color}} />
      <span
        style={{
          fontSize: 22,
          fontWeight: 700,
          color,
          fontFamily: "'JetBrains Mono', monospace",
          letterSpacing: 2,
          textTransform: "uppercase",
        }}
      >
        {text}
      </span>
    </div>
  );
};

const ComparisonCard: React.FC<{
  delay: number;
  bar1Label?: string;
  bar1Value?: number;
  bar1Color?: string;
  bar2Label?: string;
  bar2Value?: number;
  bar2Color?: string;
}> = ({
  delay,
  bar1Label = "Equipo de marketing",
  bar1Value = 85,
  bar1Color = "#f43f5e",
  bar2Label = "Inteligencia Artificial",
  bar2Value = 15,
  bar2Color = "#39E508",
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const enter = spring({fps, frame: frame - delay, config: {damping: 12, stiffness: 80}});
  const opacity = interpolate(enter, [0, 1], [0, 1]);
  const translateY = interpolate(enter, [0, 1], [40, 0]);

  const barProgress1 = interpolate(frame - delay, [10, 50], [0, bar1Value], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const barProgress2 = interpolate(frame - delay, [20, 50], [0, bar2Value], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        opacity,
        transform: `translateY(${translateY}px)`,
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: 20,
        padding: "32px 36px",
        width: 940,
        backdropFilter: "blur(20px)",
      }}
    >
      <div style={{display: "flex", gap: 8, marginBottom: 24}}>
        <div style={{width: 12, height: 12, borderRadius: 6, background: bar1Color}} />
        <div style={{width: 12, height: 12, borderRadius: 6, background: "#f59e0b"}} />
        <div style={{width: 12, height: 12, borderRadius: 6, background: bar2Color}} />
      </div>

      <div style={{marginBottom: 22}}>
        <div style={{display: "flex", justifyContent: "space-between", marginBottom: 10}}>
          <span style={{fontSize: 24, color: "rgba(255,255,255,0.6)", fontFamily: "'Inter', sans-serif"}}>
            {bar1Label}
          </span>
          <span style={{fontSize: 24, color: bar1Color, fontFamily: "'Inter', sans-serif", fontWeight: 700}}>
            {Math.round(barProgress1)}% del presupuesto
          </span>
        </div>
        <div style={{width: "100%", height: 10, background: "rgba(255,255,255,0.06)", borderRadius: 5}}>
          <div style={{width: `${barProgress1}%`, height: "100%", background: `linear-gradient(90deg, ${bar1Color}, #f59e0b)`, borderRadius: 5}} />
        </div>
      </div>

      <div>
        <div style={{display: "flex", justifyContent: "space-between", marginBottom: 10}}>
          <span style={{fontSize: 24, color: "rgba(255,255,255,0.6)", fontFamily: "'Inter', sans-serif"}}>
            {bar2Label}
          </span>
          <span style={{fontSize: 24, color: bar2Color, fontFamily: "'Inter', sans-serif", fontWeight: 700}}>
            {Math.round(barProgress2)}% del presupuesto
          </span>
        </div>
        <div style={{width: "100%", height: 10, background: "rgba(255,255,255,0.06)", borderRadius: 5}}>
          <div style={{width: `${barProgress2}%`, height: "100%", background: `linear-gradient(90deg, ${bar2Color}, #06b6d4)`, borderRadius: 5}} />
        </div>
      </div>
    </div>
  );
};

export interface MG1HookProps {
  badgeText?: string;
  questionText?: string;
  highlightText?: string;
  bar1Label?: string;
  bar1Value?: number;
  bar1Color?: string;
  bar2Label?: string;
  bar2Value?: number;
  bar2Color?: string;
  scene2Badge?: string;
  scene2Prefix?: string;
  speedNumber?: number;
  speedUnit?: string;
  speedSubtitle?: string;
}

export const MotionGraphic1Hook: React.FC<MG1HookProps> = ({
  badgeText = "MARKETING vs IA",
  questionText = "¿Por qué sigues pagando {highlight} para hacer anuncios?",
  highlightText = "equipos caros",
  bar1Label = "Equipo de marketing",
  bar1Value = 85,
  bar1Color = "#f43f5e",
  bar2Label = "Inteligencia Artificial",
  bar2Value = 15,
  bar2Color = "#39E508",
  scene2Badge = "VELOCIDAD IA",
  scene2Prefix = "Una IA puede hacerlo en",
  speedNumber = 52,
  speedUnit = "seg",
  speedSubtitle = "con mejores resultados.",
}) => {
  loadDefaultFonts();
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const fadeIn = interpolate(frame, [0, 12], [0, 1], {extrapolateRight: "clamp"});

  const questionParts = questionText.split("{highlight}");

  return (
    <AbsoluteFill style={{opacity: fadeIn}}>
      <GradientBackground colors={["#0a0a0a", "#1a0a2e", "#0a0a0a"]} angle={160} animateAngle animateSpeed={0.3} />
      <ParticleField count={15} color="rgba(139,92,246,0.1)" speed={0.15} />

      {/* ESCENA 1: Pregunta hook */}
      <Sequence from={5} durationInFrames={130}>
        <AbsoluteFill
          style={{
            justifyContent: "flex-start",
            alignItems: "center",
            paddingTop: 220,
            paddingLeft: 50,
            paddingRight: 50,
          }}
        >
          <PillBadge text={badgeText} delay={5} />
          <div style={{textAlign: "center", marginTop: 10}}>
            {(() => {
              const enter = spring({fps, frame: frame - 15, config: {damping: 14, stiffness: 100}});
              return (
                <div
                  style={{
                    opacity: interpolate(enter, [0, 1], [0, 1]),
                    transform: `translateY(${interpolate(enter, [0, 1], [30, 0])}px)`,
                    fontSize: 76,
                    fontWeight: 800,
                    fontFamily: "'Inter', sans-serif",
                    lineHeight: 1.05,
                    color: "#ffffff",
                  }}
                >
                  {questionParts[0]}
                  <span style={{color: bar1Color}}>{highlightText}</span>
                  {questionParts[1] || ""}
                </div>
              );
            })()}
          </div>
          <div style={{marginTop: 20}}>
            <ComparisonCard
              delay={40}
              bar1Label={bar1Label}
              bar1Value={bar1Value}
              bar1Color={bar1Color}
              bar2Label={bar2Label}
              bar2Value={bar2Value}
              bar2Color={bar2Color}
            />
          </div>
        </AbsoluteFill>
      </Sequence>

      {/* ESCENA 2: Número animado */}
      <Sequence from={120} durationInFrames={150}>
        <AbsoluteFill
          style={{
            justifyContent: "flex-start",
            alignItems: "center",
            paddingTop: 260,
            paddingLeft: 50,
            paddingRight: 50,
          }}
        >
          <PillBadge text={scene2Badge} delay={120} color="#39E508" />
          {(() => {
            const enter = spring({fps, frame: frame - 130, config: {damping: 14, stiffness: 100}});
            return (
              <div
                style={{
                  opacity: interpolate(enter, [0, 1], [0, 1]),
                  transform: `translateY(${interpolate(enter, [0, 1], [30, 0])}px)`,
                  fontSize: 56,
                  fontWeight: 500,
                  fontFamily: "'Inter', sans-serif",
                  lineHeight: 1.1,
                  color: "rgba(255,255,255,0.7)",
                  textAlign: "center",
                  marginTop: 6,
                }}
              >
                {scene2Prefix}
              </div>
            );
          })()}
          {(() => {
            const enter = spring({fps, frame: frame - 140, config: {damping: 10, stiffness: 80}});
            const count = Math.min(speedNumber, Math.round(interpolate(frame - 140, [0, 30], [0, speedNumber], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            })));
            return (
              <div
                style={{
                  opacity: interpolate(enter, [0, 1], [0, 1]),
                  transform: `scale(${interpolate(enter, [0, 1], [0.5, 1])})`,
                  fontSize: 140,
                  fontWeight: 900,
                  fontFamily: "'Inter', sans-serif",
                  lineHeight: 1,
                  marginTop: 0,
                  background: "linear-gradient(135deg, #8b5cf6, #06b6d4)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  textShadow: "none",
                  filter: "drop-shadow(0 0 30px rgba(139,92,246,0.4))",
                }}
              >
                {count} {speedUnit}
              </div>
            );
          })()}
          {(() => {
            const enter = spring({fps, frame: frame - 155, config: {damping: 14, stiffness: 100}});
            return (
              <div
                style={{
                  opacity: interpolate(enter, [0, 1], [0, 1]),
                  transform: `translateY(${interpolate(enter, [0, 1], [20, 0])}px)`,
                  fontSize: 46,
                  fontWeight: 600,
                  fontFamily: "'Inter', sans-serif",
                  lineHeight: 1.1,
                  color: "#39E508",
                  marginTop: 4,
                  textShadow: "0 0 15px rgba(57,229,8,0.3)",
                }}
              >
                {speedSubtitle}
              </div>
            );
          })()}
        </AbsoluteFill>
      </Sequence>
    </AbsoluteFill>
  );
};
