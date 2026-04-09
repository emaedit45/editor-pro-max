import {
  AbsoluteFill,
  Sequence,
  useCurrentFrame,
  interpolate,
  spring,
  useVideoConfig,
} from "remotion";
import {GradientBackground} from "../components/backgrounds/GradientBackground";
import {GridPattern} from "../components/backgrounds/GridPattern";
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

const StatRow: React.FC<{
  value: number;
  prefix?: string;
  suffix?: string;
  label: string;
  color: string;
  delay: number;
  maxBar?: number;
}> = ({value, prefix = "", suffix = "", label, color, delay, maxBar = 100}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const enter = spring({fps, frame: frame - delay, config: {damping: 14, stiffness: 90}});
  const opacity = interpolate(enter, [0, 1], [0, 1]);
  const translateX = interpolate(enter, [0, 1], [-40, 0]);

  const countProgress = interpolate(frame - delay, [0, 35], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const current = Math.round(value * countProgress);
  const formatted = current.toLocaleString("es-CO");
  const barPct = interpolate(enter, [0, 1], [0, maxBar]);

  return (
    <div
      style={{
        opacity,
        transform: `translateX(${translateX}px)`,
        marginBottom: 22,
        width: "100%",
      }}
    >
      <div style={{display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 8}}>
        <span style={{fontSize: 24, color: "rgba(255,255,255,0.5)", fontFamily: "'Inter', sans-serif"}}>
          {label}
        </span>
        <span style={{fontSize: 48, fontWeight: 900, color, fontFamily: "'Inter', sans-serif", letterSpacing: -1}}>
          {prefix}{formatted}{suffix}
        </span>
      </div>
      <div style={{width: "100%", height: 8, background: "rgba(255,255,255,0.06)", borderRadius: 4}}>
        <div
          style={{
            width: `${barPct}%`,
            height: "100%",
            background: `linear-gradient(90deg, ${color}, ${color}80)`,
            borderRadius: 4,
            boxShadow: `0 0 10px ${color}30`,
          }}
        />
      </div>
    </div>
  );
};

const CheckItem: React.FC<{text: string; delay: number; color: string}> = ({text, delay, color}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const enter = spring({fps, frame: frame - delay, config: {damping: 12, stiffness: 100}});

  return (
    <div
      style={{
        opacity: interpolate(enter, [0, 1], [0, 1]),
        transform: `translateX(${interpolate(enter, [0, 1], [-20, 0])}px)`,
        display: "flex",
        alignItems: "center",
        gap: 14,
        marginBottom: 14,
      }}
    >
      <div
        style={{
          width: 30,
          height: 30,
          borderRadius: 8,
          background: `${color}25`,
          border: `2px solid ${color}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 18,
          color,
          fontWeight: 900,
        }}
      >
        ✓
      </div>
      <span style={{fontSize: 26, color: "rgba(255,255,255,0.75)", fontFamily: "'Inter', sans-serif"}}>
        {text}
      </span>
    </div>
  );
};

export interface MG2StatsProps {
  badgeText?: string;
  stats?: Array<{
    value: number;
    prefix?: string;
    suffix?: string;
    label: string;
    color: string;
    maxBar?: number;
  }>;
  checkItems?: Array<{
    text: string;
    color: string;
  }>;
}

const DEFAULT_STATS = [
  {value: 5200, suffix: "+", label: "Pedidos", color: "#8b5cf6", maxBar: 90},
  {value: 1053, prefix: "$", suffix: "M", label: "Ventas netas", color: "#06b6d4", maxBar: 78},
  {value: 35, suffix: "x", label: "ROAS", color: "#39E508", maxBar: 95},
  {value: 557, prefix: "$", suffix: "M", label: "Una sola estrategia", color: "#f59e0b", maxBar: 65},
  {value: 150, suffix: "K+", label: "Clientes potenciales", color: "#f43f5e", maxBar: 82},
];

const DEFAULT_CHECK_ITEMS = [
  {text: "Miles de conversaciones por WhatsApp", color: "#39E508"},
  {text: "Sin agencias. Sin ineficiencias.", color: "#06b6d4"},
  {text: "Con una sola estrategia de IA", color: "#8b5cf6"},
];

export const MotionGraphic2Stats: React.FC<MG2StatsProps> = ({
  badgeText = "RESULTADOS REALES",
  stats = DEFAULT_STATS,
  checkItems = DEFAULT_CHECK_ITEMS,
}) => {
  loadDefaultFonts();
  const frame = useCurrentFrame();

  const bgPulse = interpolate(frame, [0, 150, 300, 450], [0.02, 0.06, 0.02, 0.06], {
    extrapolateRight: "clamp",
  });
  const fadeIn = interpolate(frame, [0, 12], [0, 1], {extrapolateRight: "clamp"});

  return (
    <AbsoluteFill style={{opacity: fadeIn}}>
      <GradientBackground colors={["#0a0a0a", "#0f172a"]} angle={180} />
      <GridPattern type="dots" spacing={50} size={1.5} color={`rgba(139,92,246,${bgPulse})`} animate animateSpeed={0.3} />

      <Sequence from={5}>
        <AbsoluteFill
          style={{
            justifyContent: "flex-start",
            alignItems: "center",
            paddingTop: 160,
            paddingLeft: 45,
            paddingRight: 45,
          }}
        >
          <PillBadge text={badgeText} delay={5} color="#06b6d4" />

          {(() => {
            const enter = spring({fps: 30, frame: frame - 15, config: {damping: 12, stiffness: 80}});
            return (
              <div
                style={{
                  opacity: interpolate(enter, [0, 1], [0, 1]),
                  transform: `translateY(${interpolate(enter, [0, 1], [30, 0])}px)`,
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: 20,
                  padding: "28px 34px",
                  width: 960,
                  backdropFilter: "blur(20px)",
                }}
              >
                <div style={{display: "flex", gap: 8, marginBottom: 20}}>
                  <div style={{width: 12, height: 12, borderRadius: 6, background: "#f43f5e"}} />
                  <div style={{width: 12, height: 12, borderRadius: 6, background: "#f59e0b"}} />
                  <div style={{width: 12, height: 12, borderRadius: 6, background: "#39E508"}} />
                  <span style={{fontSize: 16, color: "rgba(255,255,255,0.3)", fontFamily: "'JetBrains Mono', monospace", marginLeft: 10}}>
                    resultados/dashboard
                  </span>
                </div>

                {stats.map((s, i) => (
                  <StatRow
                    key={i}
                    value={s.value}
                    prefix={s.prefix}
                    suffix={s.suffix}
                    label={s.label}
                    color={s.color}
                    delay={25 + i * 15}
                    maxBar={s.maxBar ?? 80}
                  />
                ))}
              </div>
            );
          })()}
        </AbsoluteFill>
      </Sequence>

      <Sequence from={120}>
        <AbsoluteFill
          style={{
            justifyContent: "flex-start",
            paddingTop: 780,
            paddingLeft: 80,
          }}
        >
          {checkItems.map((item, i) => (
            <CheckItem key={i} text={item.text} delay={120 + i * 15} color={item.color} />
          ))}
        </AbsoluteFill>
      </Sequence>
    </AbsoluteFill>
  );
};
