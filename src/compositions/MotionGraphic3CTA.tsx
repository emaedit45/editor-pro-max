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

const CTAButton: React.FC<{text: string; subtext: string; delay: number}> = ({text, subtext, delay}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const enter = spring({fps, frame: frame - delay, config: {damping: 10, stiffness: 80}});
  const pulse = 1 + Math.sin(frame * 0.12) * 0.02 * interpolate(enter, [0, 1], [0, 1]);
  const glowSize = 15 + Math.sin(frame * 0.1) * 8;

  return (
    <div
      style={{
        opacity: interpolate(enter, [0, 1], [0, 1]),
        transform: `scale(${interpolate(enter, [0, 1], [0.6, 1]) * pulse})`,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 16,
        marginTop: 14,
      }}
    >
      <div
        style={{
          background: "linear-gradient(135deg, #f43f5e, #f59e0b)",
          padding: "22px 70px",
          borderRadius: 18,
          boxShadow: `0 0 ${glowSize}px rgba(244,63,94,0.4), 0 0 ${glowSize * 2}px rgba(244,63,94,0.15)`,
        }}
      >
        <span
          style={{
            fontSize: 40,
            fontWeight: 800,
            color: "#ffffff",
            fontFamily: "'Inter', sans-serif",
            letterSpacing: 1,
          }}
        >
          {text} →
        </span>
      </div>
      <span
        style={{
          fontSize: 24,
          color: "rgba(255,255,255,0.45)",
          fontFamily: "'Inter', sans-serif",
        }}
      >
        {subtext}
      </span>
    </div>
  );
};

export interface MG3CTAProps {
  scene1Text?: string;
  scene1Highlight?: string;
  scene2Badge?: string;
  scene2Text?: string;
  scene3Badge?: string;
  scene3Text?: string;
  scene3Highlight?: string;
  ctaButtonText?: string;
  ctaSubtext?: string;
}

export const MotionGraphic3CTA: React.FC<MG3CTAProps> = ({
  scene1Text = "La pregunta {highlight} si funciona.",
  scene1Highlight = "no es",
  scene2Badge = "PIÉNSALO",
  scene2Text = "¿Por qué sigues pagando por algo que puedes delegar a la IA?",
  scene3Badge = "CLASE GRATUITA",
  scene3Text = "Te muestro la {highlight}",
  scene3Highlight = "herramienta de IA",
  ctaButtonText = "Asegura tu lugar",
  ctaSubtext = "Toca el botón ahora mismo.",
}) => {
  loadDefaultFonts();
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const pulse = interpolate(frame % 60, [0, 30, 60], [0.3, 0.7, 0.3]);
  const fadeIn = interpolate(frame, [0, 12], [0, 1], {extrapolateRight: "clamp"});

  const scene1Parts = scene1Text.split("{highlight}");
  const scene3Parts = scene3Text.split("{highlight}");

  return (
    <AbsoluteFill style={{opacity: fadeIn}}>
      <GradientBackground colors={["#1a0a2e", "#0a0a0a", "#0f172a"]} angle={180} animateAngle animateSpeed={0.2} />
      <ParticleField count={20} color={`rgba(139,92,246,${pulse * 0.12})`} speed={0.25} direction="up" />

      {/* ESCENA 1 */}
      <Sequence from={8} durationInFrames={135}>
        <AbsoluteFill
          style={{
            justifyContent: "flex-start",
            alignItems: "center",
            paddingTop: 320,
            paddingLeft: 50,
            paddingRight: 50,
          }}
        >
          {(() => {
            const enter = spring({fps, frame: frame - 15, config: {damping: 14, stiffness: 100}});
            return (
              <div
                style={{
                  opacity: interpolate(enter, [0, 1], [0, 1]),
                  transform: `translateY(${interpolate(enter, [0, 1], [30, 0])}px)`,
                  fontSize: 72,
                  fontWeight: 800,
                  fontFamily: "'Inter', sans-serif",
                  lineHeight: 1.05,
                  color: "#ffffff",
                  textAlign: "center",
                }}
              >
                {scene1Parts[0]}<span style={{color: "#f43f5e"}}>{scene1Highlight}</span>{scene1Parts[1] || ""}
              </div>
            );
          })()}
        </AbsoluteFill>
      </Sequence>

      {/* ESCENA 2 */}
      <Sequence from={130} durationInFrames={190}>
        <AbsoluteFill
          style={{
            justifyContent: "flex-start",
            alignItems: "center",
            paddingTop: 260,
            paddingLeft: 50,
            paddingRight: 50,
          }}
        >
          <PillBadge text={scene2Badge} delay={130} color="#f59e0b" />
          {(() => {
            const enter = spring({fps, frame: frame - 140, config: {damping: 14, stiffness: 100}});
            return (
              <div
                style={{
                  opacity: interpolate(enter, [0, 1], [0, 1]),
                  transform: `translateY(${interpolate(enter, [0, 1], [30, 0])}px)`,
                  fontSize: 64,
                  fontWeight: 800,
                  fontFamily: "'Inter', sans-serif",
                  lineHeight: 1.05,
                  color: "#ffffff",
                  textAlign: "center",
                }}
              >
                {scene2Text}
              </div>
            );
          })()}

          {(() => {
            const lineP = spring({fps, frame: frame - 160, config: {damping: 14, stiffness: 80}});
            return (
              <div
                style={{
                  width: `${lineP * 80}%`,
                  height: 4,
                  background: "linear-gradient(90deg, #8b5cf6, #f43f5e)",
                  borderRadius: 2,
                  marginTop: 24,
                  boxShadow: "0 0 15px rgba(139,92,246,0.4)",
                }}
              />
            );
          })()}
        </AbsoluteFill>
      </Sequence>

      {/* ESCENA 3: CTA */}
      <Sequence from={300} durationInFrames={200}>
        <AbsoluteFill
          style={{
            justifyContent: "flex-start",
            alignItems: "center",
            paddingTop: 270,
            paddingLeft: 50,
            paddingRight: 50,
          }}
        >
          <PillBadge text={scene3Badge} delay={300} color="#39E508" />
          {(() => {
            const enter = spring({fps, frame: frame - 310, config: {damping: 14, stiffness: 100}});
            return (
              <div
                style={{
                  opacity: interpolate(enter, [0, 1], [0, 1]),
                  transform: `translateY(${interpolate(enter, [0, 1], [30, 0])}px)`,
                  fontSize: 64,
                  fontWeight: 800,
                  fontFamily: "'Inter', sans-serif",
                  lineHeight: 1.05,
                  color: "#ffffff",
                  textAlign: "center",
                  marginBottom: 4,
                }}
              >
                {scene3Parts[0]}<span style={{color: "#39E508"}}>{scene3Highlight}</span>{scene3Parts[1] || ""}
              </div>
            );
          })()}

          <CTAButton text={ctaButtonText} subtext={ctaSubtext} delay={330} />
        </AbsoluteFill>
      </Sequence>
    </AbsoluteFill>
  );
};
