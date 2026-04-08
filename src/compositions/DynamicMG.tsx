import {
  AbsoluteFill,
  Sequence,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from "remotion";
import {GradientBackground} from "../components/backgrounds/GradientBackground";
import {ParticleField} from "../components/backgrounds/ParticleField";
import {GridPattern} from "../components/backgrounds/GridPattern";
import {loadDefaultFonts} from "../presets/fonts";

// ─── TYPES ───

interface SceneConfig {
  duration: number; // seconds
  background?: {
    type?: "gradient" | "radial";
    colors?: string[];
    angle?: number;
  };
  particles?: {
    count?: number;
    color?: string;
    direction?: "up" | "down" | "left" | "right";
    speed?: number;
  };
  grid?: {
    type?: "dots" | "lines" | "crosses";
    color?: string;
    spacing?: number;
  };
  elements: ElementConfig[];
}

type ElementConfig =
  | BadgeConfig
  | TitleConfig
  | SubtitleConfig
  | CounterConfig
  | ProgressBarsConfig
  | ChecklistConfig
  | NotificationsConfig
  | CtaButtonConfig
  | BrowserWindowConfig
  | GlassCardConfig
  | ChartConfig
  | MetricRowConfig
  | DividerConfig;

interface BadgeConfig {
  type: "badge";
  text: string;
  color?: string;
  dotColor?: string;
  delay?: number;
}

interface TitleConfig {
  type: "title";
  text: string;
  fontSize?: number;
  highlight?: string;
  highlightColor?: string;
  gradient?: string[];
  delay?: number;
}

interface SubtitleConfig {
  type: "subtitle";
  text: string;
  fontSize?: number;
  color?: string;
  delay?: number;
}

interface CounterConfig {
  type: "counter";
  value: number;
  prefix?: string;
  suffix?: string;
  label?: string;
  color?: string;
  fontSize?: number;
  delay?: number;
}

interface ProgressBarsConfig {
  type: "progressBars";
  bars: Array<{
    label: string;
    value: number;
    color: string;
  }>;
  delay?: number;
}

interface ChecklistConfig {
  type: "checklist";
  items: Array<{
    text: string;
    color?: string;
  }>;
  delay?: number;
}

interface NotificationsConfig {
  type: "notifications";
  items: Array<{
    text: string;
    icon?: string;
    color?: string;
  }>;
  delay?: number;
}

interface CtaButtonConfig {
  type: "ctaButton";
  text: string;
  subtitle?: string;
  gradient?: string[];
  delay?: number;
}

interface BrowserWindowConfig {
  type: "browserWindow";
  url?: string;
  children: ElementConfig[];
  delay?: number;
}

interface GlassCardConfig {
  type: "glassCard";
  children: ElementConfig[];
  delay?: number;
}

interface ChartConfig {
  type: "chart";
  values: number[];
  color?: string;
  label?: string;
  labelValue?: string;
  delay?: number;
}

interface MetricRowConfig {
  type: "metricRow";
  metrics: Array<{
    value: string;
    label: string;
  }>;
  delay?: number;
}

interface DividerConfig {
  type: "divider";
  color?: string;
  delay?: number;
}

export interface DynamicMGProps {
  scenes?: SceneConfig[];
}

// ─── HELPER ───

const toFrames = (seconds: number, fps: number) => Math.round(seconds * fps);

// ─── SUB-COMPONENTS ───

const PillBadge: React.FC<{
  text: string;
  color?: string;
  dotColor?: string;
  frame: number;
  fps: number;
  delay: number;
}> = ({text, color = "#ffffff", dotColor, frame, fps, delay}) => {
  const progress = spring({fps, frame: frame - toFrames(delay, fps), config: {damping: 14, stiffness: 100}});
  const opacity = interpolate(progress, [0, 1], [0, 1]);
  const scale = interpolate(progress, [0, 1], [0.8, 1]);
  return (
    <div style={{
      opacity, transform: `scale(${scale})`,
      display: "inline-flex", alignItems: "center", gap: 8,
      padding: "10px 20px", borderRadius: 50,
      background: "rgba(255,255,255,0.06)",
      border: "1px solid rgba(255,255,255,0.12)",
      backdropFilter: "blur(8px)",
      boxShadow: "0 4px 16px rgba(0,0,0,0.2)",
      alignSelf: "center",
    }}>
      <div style={{
        width: 10, height: 10, borderRadius: "50%",
        background: dotColor || color,
        boxShadow: `0 0 10px ${dotColor || color}`,
      }} />
      <span style={{
        fontSize: 22, fontWeight: 600, color,
        letterSpacing: 3, textTransform: "uppercase",
        fontFamily: "'Inter', sans-serif",
      }}>{text}</span>
    </div>
  );
};

const AnimatedCounter: React.FC<{
  value: number;
  prefix?: string;
  suffix?: string;
  label?: string;
  color?: string;
  fontSize?: number;
  frame: number;
  fps: number;
  delay: number;
}> = ({value, prefix = "", suffix = "", label, color = "#8b5cf6", fontSize = 80, frame, fps, delay}) => {
  const delayF = toFrames(delay, fps);
  const countProgress = interpolate(frame - delayF, [0, 40], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  const displayValue = Math.round(value * countProgress);
  const enterProgress = spring({fps, frame: frame - delayF, config: {damping: 14, stiffness: 100}});
  const opacity = interpolate(enterProgress, [0, 1], [0, 1]);

  const scale = interpolate(enterProgress, [0, 1], [0.7, 1]);
  const glowIntensity = 25 + Math.sin((frame - delayF) * 0.08) * 10;

  return (
    <div style={{opacity, transform: `scale(${scale})`, display: "flex", alignItems: "baseline", gap: 10, justifyContent: "center"}}>
      <span style={{
        fontSize, fontWeight: 900,
        fontFamily: "'Inter', sans-serif",
        background: `linear-gradient(135deg, ${color}, ${color}cc)`,
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        filter: `drop-shadow(0 0 ${glowIntensity}px ${color}80)`,
      }}>
        {prefix}{displayValue.toLocaleString("es-CO")}{suffix}
      </span>
      {label && (
        <span style={{fontSize: 30, color: "rgba(255,255,255,0.6)", fontFamily: "'Inter', sans-serif", fontWeight: 500}}>
          {label}
        </span>
      )}
    </div>
  );
};

const ProgressBarGroup: React.FC<{
  bars: Array<{label: string; value: number; color: string}>;
  frame: number;
  fps: number;
  delay: number;
}> = ({bars, frame, fps, delay}) => {
  return (
    <div style={{display: "flex", flexDirection: "column", gap: 14, width: "100%"}}>
      {bars.map((bar, i) => {
        const barDelay = toFrames(delay, fps) + i * 12;
        const progress = spring({fps, frame: frame - barDelay, config: {damping: 16, stiffness: 80}});
        const barWidth = interpolate(progress, [0, 1], [0, bar.value]);
        const opacity = interpolate(progress, [0, 0.3], [0, 1], {extrapolateRight: "clamp"});
        return (
          <div key={i} style={{opacity}}>
            <div style={{display: "flex", justifyContent: "space-between", marginBottom: 6}}>
              <span style={{fontSize: 24, color: "rgba(255,255,255,0.8)", fontFamily: "'Inter', sans-serif", fontWeight: 500}}>
                {bar.label}
              </span>
              <span style={{fontSize: 24, color: bar.color, fontFamily: "'Inter', sans-serif", fontWeight: 700}}>
                {Math.round(barWidth)}%
              </span>
            </div>
            <div style={{height: 8, borderRadius: 4, background: "rgba(255,255,255,0.06)", overflow: "hidden"}}>
              <div style={{
                height: "100%", borderRadius: 4,
                width: `${barWidth}%`,
                background: `linear-gradient(90deg, ${bar.color}cc, ${bar.color})`,
                boxShadow: `0 0 20px ${bar.color}60, 0 0 6px ${bar.color}40`,
                transition: "none",
              }} />
            </div>
          </div>
        );
      })}
    </div>
  );
};

const LineChart: React.FC<{
  values: number[];
  color?: string;
  label?: string;
  labelValue?: string;
  frame: number;
  fps: number;
  delay: number;
}> = ({values, color = "#3b82f6", label, labelValue, frame, fps, delay}) => {
  const delayF = toFrames(delay, fps);
  const drawProgress = interpolate(frame - delayF, [0, 50], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  const opacity = interpolate(frame - delayF, [0, 10], [0, 1], {extrapolateLeft: "clamp", extrapolateRight: "clamp"});

  const w = 500, h = 80, padding = 10;
  const maxVal = Math.max(...values);
  const minVal = Math.min(...values);
  const range = maxVal - minVal || 1;
  const points = values.map((v, i) => {
    const x = padding + (i / (values.length - 1)) * (w - padding * 2);
    const y = h - padding - ((v - minVal) / range) * (h - padding * 2);
    return `${x},${y}`;
  }).join(" ");

  const totalLength = (values.length - 1) * 80;

  return (
    <div style={{opacity, width: "100%"}}>
      {(label || labelValue) && (
        <div style={{display: "flex", justifyContent: "space-between", marginBottom: 8}}>
          {label && <span style={{fontSize: 20, color: "rgba(255,255,255,0.5)", fontFamily: "'Inter', sans-serif", letterSpacing: 2, textTransform: "uppercase", fontWeight: 600}}>{label}</span>}
          {labelValue && <span style={{fontSize: 26, color, fontFamily: "'Inter', sans-serif", fontWeight: 700}}>{labelValue}</span>}
        </div>
      )}
      <svg viewBox={`0 0 ${w} ${h}`} style={{width: "100%", height: 80}}>
        <defs>
          <linearGradient id="chartFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.3" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>
        <polyline
          points={points}
          fill="none"
          stroke={color}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray={totalLength}
          strokeDashoffset={totalLength * (1 - drawProgress)}
        />
      </svg>
    </div>
  );
};

const ChecklistGroup: React.FC<{
  items: Array<{text: string; color?: string}>;
  frame: number;
  fps: number;
  delay: number;
}> = ({items, frame, fps, delay}) => {
  return (
    <div style={{display: "flex", flexDirection: "column", gap: 14}}>
      {items.map((item, i) => {
        const itemDelay = toFrames(delay, fps) + i * 15;
        const progress = spring({fps, frame: frame - itemDelay, config: {damping: 12, stiffness: 100}});
        const opacity = interpolate(progress, [0, 1], [0, 1]);
        const translateX = interpolate(progress, [0, 1], [-30, 0]);
        const checkColor = item.color || "#3b82f6";
        return (
          <div key={i} style={{
            opacity, transform: `translateX(${translateX}px)`,
            display: "flex", alignItems: "center", gap: 12,
          }}>
            <div style={{
              width: 26, height: 26, borderRadius: 8,
              background: `${checkColor}20`, border: `1.5px solid ${checkColor}`,
              display: "flex", alignItems: "center", justifyContent: "center",
              flexShrink: 0,
              boxShadow: `0 0 12px ${checkColor}30`,
            }}>
              <span style={{color: checkColor, fontSize: 18, fontWeight: 800}}>✓</span>
            </div>
            <span style={{
              fontSize: 26, color: "#ffffff", fontWeight: 600,
              fontFamily: "'Inter', sans-serif",
            }}>{item.text}</span>
          </div>
        );
      })}
    </div>
  );
};

const NotificationStack: React.FC<{
  items: Array<{text: string; icon?: string; color?: string}>;
  frame: number;
  fps: number;
  delay: number;
}> = ({items, frame, fps, delay}) => {
  return (
    <div style={{
      position: "absolute", top: 720, right: 40,
      display: "flex", flexDirection: "column", gap: 10, alignItems: "flex-end",
    }}>
      {items.map((item, i) => {
        const itemDelay = toFrames(delay, fps) + i * 20;
        const progress = spring({fps, frame: frame - itemDelay, config: {damping: 14, stiffness: 100}});
        const opacity = interpolate(progress, [0, 1], [0, 1]);
        const translateX = interpolate(progress, [0, 1], [100, 0]);
        const iconColor = item.color || "#22c55e";
        return (
          <div key={i} style={{
            opacity, transform: `translateX(${translateX}px)`,
            display: "flex", alignItems: "center", gap: 8,
            padding: "10px 16px", borderRadius: 50,
            background: "rgba(255,255,255,0.07)",
            border: "1px solid rgba(255,255,255,0.12)",
            backdropFilter: "blur(10px)",
          }}>
            <div style={{
              width: 20, height: 20, borderRadius: "50%",
              background: iconColor, display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <span style={{fontSize: 14, color: "#fff"}}>✓</span>
            </div>
            <span style={{fontSize: 22, color: "#ffffff", fontWeight: 500, fontFamily: "'Inter', sans-serif", whiteSpace: "nowrap"}}>
              {item.text}
            </span>
          </div>
        );
      })}
    </div>
  );
};

const CTAButton: React.FC<{
  text: string;
  subtitle?: string;
  gradient?: string[];
  frame: number;
  fps: number;
  delay: number;
}> = ({text, subtitle, gradient = ["#ef4444", "#f59e0b"], frame, fps, delay}) => {
  const delayF = toFrames(delay, fps);
  const progress = spring({fps, frame: frame - delayF, config: {damping: 14, stiffness: 100}});
  const opacity = interpolate(progress, [0, 1], [0, 1]);
  const scale = interpolate(progress, [0, 1], [0.8, 1]);
  const pulse = 1 + Math.sin((frame - delayF) * 0.12) * 0.02;
  const glowSize = 15 + Math.sin((frame - delayF) * 0.1) * 8;

  return (
    <div style={{opacity, display: "flex", flexDirection: "column", alignItems: "center", gap: 12}}>
      <button style={{
        transform: `scale(${scale * pulse})`,
        padding: "20px 56px", borderRadius: 50, border: "none",
        background: `linear-gradient(135deg, ${gradient[0]}, ${gradient[1] || gradient[0]})`,
        color: "#ffffff", fontSize: 32, fontWeight: 700,
        fontFamily: "'Inter', sans-serif", cursor: "pointer",
        boxShadow: `0 0 ${glowSize}px ${gradient[0]}80, 0 8px 32px ${gradient[0]}40`,
        display: "flex", alignItems: "center", gap: 12,
        letterSpacing: 0.5,
      }}>
        {text} <span style={{fontSize: 28}}>→</span>
      </button>
      {subtitle && (
        <span style={{fontSize: 22, color: "rgba(255,255,255,0.5)", fontFamily: "'Inter', sans-serif"}}>
          {subtitle}
        </span>
      )}
    </div>
  );
};

const MetricRowComp: React.FC<{
  metrics: Array<{value: string; label: string}>;
  frame: number;
  fps: number;
  delay: number;
}> = ({metrics, frame, fps, delay}) => {
  return (
    <div style={{display: "flex", gap: 12, justifyContent: "center", width: "100%"}}>
      {metrics.map((m, i) => {
        const itemDelay = toFrames(delay, fps) + i * 10;
        const progress = spring({fps, frame: frame - itemDelay, config: {damping: 14, stiffness: 100}});
        const opacity = interpolate(progress, [0, 1], [0, 1]);
        const scale = interpolate(progress, [0, 1], [0.8, 1]);
        return (
          <div key={i} style={{
            opacity, transform: `scale(${scale})`,
            flex: 1, padding: "14px 8px", borderRadius: 12,
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.1)",
            textAlign: "center",
          }}>
            <div style={{fontSize: 36, fontWeight: 800, color: "#ffffff", fontFamily: "'Inter', sans-serif"}}>{m.value}</div>
            <div style={{fontSize: 16, color: "rgba(255,255,255,0.5)", fontFamily: "'Inter', sans-serif", letterSpacing: 1.5, textTransform: "uppercase", marginTop: 6}}>{m.label}</div>
          </div>
        );
      })}
    </div>
  );
};

// ─── CONTAINER COMPONENTS ───

const GlassCard: React.FC<{
  children: React.ReactNode;
  frame: number;
  fps: number;
  delay: number;
}> = ({children, frame, fps, delay}) => {
  const delayF = toFrames(delay, fps);
  const progress = spring({fps, frame: frame - delayF, config: {damping: 12, stiffness: 80}});
  const opacity = interpolate(progress, [0, 1], [0, 1]);
  const translateY = interpolate(progress, [0, 1], [60, 0]);
  const scale = interpolate(progress, [0, 1], [0.95, 1]);
  const glowPulse = 0.06 + Math.sin((frame - delayF) * 0.06) * 0.02;
  return (
    <div style={{
      opacity, transform: `translateY(${translateY}px) scale(${scale})`,
      padding: "28px 24px", borderRadius: 20,
      background: `rgba(255,255,255,${glowPulse})`,
      border: "1px solid rgba(255,255,255,0.12)",
      backdropFilter: "blur(16px)",
      boxShadow: "0 12px 48px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.06)",
      display: "flex", flexDirection: "column", gap: 18,
      width: "100%",
    }}>
      {children}
    </div>
  );
};

const BrowserWindow: React.FC<{
  url?: string;
  children: React.ReactNode;
  frame: number;
  fps: number;
  delay: number;
}> = ({url = "app.example.com", children, frame, fps, delay}) => {
  const delayF = toFrames(delay, fps);
  const progress = spring({fps, frame: frame - delayF, config: {damping: 12, stiffness: 90}});
  const opacity = interpolate(progress, [0, 1], [0, 1]);
  const scale = interpolate(progress, [0, 1], [0.85, 1]);
  const translateY = interpolate(progress, [0, 1], [50, 0]);
  // Subtle status indicator blink
  const statusDot = 0.4 + Math.sin((frame - delayF) * 0.15) * 0.3;
  return (
    <div style={{
      opacity, transform: `scale(${scale}) translateY(${translateY}px)`,
      borderRadius: 20, overflow: "hidden",
      background: "rgba(15,15,25,0.95)",
      border: "1px solid rgba(255,255,255,0.1)",
      boxShadow: "0 20px 60px rgba(0,0,0,0.6), 0 0 40px rgba(100,100,255,0.05)",
      width: "100%",
    }}>
      <div style={{
        display: "flex", alignItems: "center", gap: 8,
        padding: "14px 18px",
        background: "rgba(255,255,255,0.03)",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
      }}>
        <div style={{display: "flex", gap: 9}}>
          <div style={{width: 14, height: 14, borderRadius: "50%", background: "#ff5f56", boxShadow: "0 0 8px #ff5f5640"}} />
          <div style={{width: 14, height: 14, borderRadius: "50%", background: "#ffbd2e", boxShadow: "0 0 8px #ffbd2e40"}} />
          <div style={{width: 14, height: 14, borderRadius: "50%", background: "#27ca40", boxShadow: "0 0 8px #27ca4040"}} />
        </div>
        <span style={{
          fontSize: 18, color: "rgba(255,255,255,0.35)",
          fontFamily: "'JetBrains Mono', monospace", marginLeft: 14,
        }}>{url}</span>
        <div style={{marginLeft: "auto", display: "flex", alignItems: "center", gap: 6}}>
          <div style={{width: 6, height: 6, borderRadius: "50%", background: "#22c55e", opacity: statusDot, boxShadow: "0 0 8px #22c55e"}} />
        </div>
      </div>
      <div style={{padding: "24px 20px", display: "flex", flexDirection: "column", gap: 16}}>
        {children}
      </div>
    </div>
  );
};

// ─── TITLE WITH HIGHLIGHT ───

const TitleText: React.FC<{
  text: string;
  fontSize?: number;
  highlight?: string;
  highlightColor?: string;
  gradient?: string[];
  frame: number;
  fps: number;
  delay: number;
}> = ({text, fontSize = 48, highlight, highlightColor = "#f43f5e", gradient, frame, fps, delay}) => {
  const delayF = toFrames(delay, fps);
  const progress = spring({fps, frame: frame - delayF, config: {damping: 12, stiffness: 90}});
  const opacity = interpolate(progress, [0, 1], [0, 1]);
  const translateY = interpolate(progress, [0, 1], [40, 0]);
  const scale = interpolate(progress, [0, 1], [0.9, 1]);

  const gradientStyle = gradient && gradient.length >= 2 ? {
    background: `linear-gradient(135deg, ${gradient.join(", ")})`,
    WebkitBackgroundClip: "text" as const,
    WebkitTextFillColor: "transparent",
  } : {};

  if (highlight && text.includes(highlight)) {
    const parts = text.split(highlight);
    return (
      <div style={{
        opacity, transform: `translateY(${translateY}px) scale(${scale})`,
        fontSize, fontWeight: 800, color: "#ffffff",
        fontFamily: "'Inter', sans-serif", textAlign: "center",
        lineHeight: 1.15, textShadow: "0 4px 30px rgba(0,0,0,0.4)",
        ...gradientStyle,
      }}>
        {parts[0]}
        <span style={{
          color: highlightColor,
          ...(gradient ? {} : {filter: `drop-shadow(0 0 12px ${highlightColor}50)`}),
          WebkitTextFillColor: highlightColor,
        }}>{highlight}</span>
        {parts[1]}
      </div>
    );
  }

  return (
    <div style={{
      opacity, transform: `translateY(${translateY}px)`,
      fontSize, fontWeight: 800, color: "#ffffff",
      fontFamily: "'Inter', sans-serif", textAlign: "center",
      lineHeight: 1.15, ...gradientStyle,
    }}>
      {text}
    </div>
  );
};

const SubtitleText: React.FC<{
  text: string;
  fontSize?: number;
  color?: string;
  frame: number;
  fps: number;
  delay: number;
}> = ({text, fontSize = 28, color = "rgba(255,255,255,0.6)", frame, fps, delay}) => {
  const progress = spring({fps, frame: frame - toFrames(delay, fps), config: {damping: 14, stiffness: 100}});
  const opacity = interpolate(progress, [0, 1], [0, 1]);
  return (
    <div style={{
      opacity, fontSize, color, fontWeight: 400,
      fontFamily: "'Inter', sans-serif", textAlign: "center",
      lineHeight: 1.4,
    }}>
      {text}
    </div>
  );
};

const Divider: React.FC<{
  color?: string;
  frame: number;
  fps: number;
  delay: number;
}> = ({color = "rgba(255,255,255,0.1)", frame, fps, delay}) => {
  const progress = spring({fps, frame: frame - toFrames(delay, fps), config: {damping: 16, stiffness: 80}});
  const width = interpolate(progress, [0, 1], [0, 80]);
  return (
    <div style={{
      height: 1, width: `${width}%`, alignSelf: "center",
      background: color,
    }} />
  );
};

// ─── ELEMENT RENDERER ───

const RenderElement: React.FC<{
  element: ElementConfig;
  frame: number;
  fps: number;
}> = ({element, frame, fps}) => {
  const delay = (element as any).delay || 0;

  switch (element.type) {
    case "badge":
      return <PillBadge text={element.text} color={element.color} dotColor={element.dotColor} frame={frame} fps={fps} delay={delay} />;
    case "title":
      return <TitleText text={element.text} fontSize={element.fontSize} highlight={element.highlight} highlightColor={element.highlightColor} gradient={element.gradient} frame={frame} fps={fps} delay={delay} />;
    case "subtitle":
      return <SubtitleText text={element.text} fontSize={element.fontSize} color={element.color} frame={frame} fps={fps} delay={delay} />;
    case "counter":
      return <AnimatedCounter value={element.value} prefix={element.prefix} suffix={element.suffix} label={element.label} color={element.color} fontSize={element.fontSize} frame={frame} fps={fps} delay={delay} />;
    case "progressBars":
      return <ProgressBarGroup bars={element.bars} frame={frame} fps={fps} delay={delay} />;
    case "checklist":
      return <ChecklistGroup items={element.items} frame={frame} fps={fps} delay={delay} />;
    case "notifications":
      return <NotificationStack items={element.items} frame={frame} fps={fps} delay={delay} />;
    case "ctaButton":
      return <CTAButton text={element.text} subtitle={element.subtitle} gradient={element.gradient} frame={frame} fps={fps} delay={delay} />;
    case "chart":
      return <LineChart values={element.values} color={element.color} label={element.label} labelValue={element.labelValue} frame={frame} fps={fps} delay={delay} />;
    case "metricRow":
      return <MetricRowComp metrics={element.metrics} frame={frame} fps={fps} delay={delay} />;
    case "divider":
      return <Divider color={element.color} frame={frame} fps={fps} delay={delay} />;
    case "glassCard": {
      const children = element.children.map((child, i) => (
        <RenderElement key={i} element={child} frame={frame} fps={fps} />
      ));
      return <GlassCard frame={frame} fps={fps} delay={delay}>{children}</GlassCard>;
    }
    case "browserWindow": {
      const children = element.children.map((child, i) => (
        <RenderElement key={i} element={child} frame={frame} fps={fps} />
      ));
      return <BrowserWindow url={element.url} frame={frame} fps={fps} delay={delay}>{children}</BrowserWindow>;
    }
    default:
      return null;
  }
};

// ─── SCENE RENDERER ───

const SceneRenderer: React.FC<{
  scene: SceneConfig;
}> = ({scene}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const bgColors = scene.background?.colors || ["#0a0a0a", "#1a1a3e"];
  const bgType = scene.background?.type || "gradient";
  const bgAngle = scene.background?.angle || 135;

  // Separate notifications from regular elements (notifications are absolute positioned)
  const regularElements = scene.elements.filter((e) => e.type !== "notifications");
  const notificationElements = scene.elements.filter((e) => e.type === "notifications") as NotificationsConfig[];

  return (
    <AbsoluteFill>
      {/* Background layers */}
      <GradientBackground
        colors={bgColors}
        angle={bgAngle}
        type={bgType === "radial" ? "radial" : "linear"}
      />
      {scene.particles && (
        <ParticleField
          count={scene.particles.count || 40}
          color={scene.particles.color || "rgba(255,255,255,0.3)"}
          speed={scene.particles.speed || 0.5}
          direction={scene.particles.direction || "up"}
        />
      )}
      {scene.grid && (
        <GridPattern
          type={scene.grid.type || "dots"}
          color={scene.grid.color || "rgba(255,255,255,0.08)"}
          spacing={scene.grid.spacing || 40}
          animate
          animateSpeed={0.3}
        />
      )}

      {/* Ambient glow */}
      <div style={{
        position: "absolute", top: "15%", left: "50%",
        width: 400, height: 400, borderRadius: "50%",
        background: `radial-gradient(circle, ${(bgColors[1] || bgColors[0])}40 0%, transparent 70%)`,
        transform: `translate(-50%, -50%) scale(${1 + Math.sin(frame * 0.03) * 0.15})`,
        filter: "blur(60px)",
      }} />

      {/* Content area — 960px (upper half) by default, 1920px (full frame) if fullFrame prop */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0,
        height: (scenes?.[0] as any)?.fullFrame ? 1920 : 960,
        display: "flex", flexDirection: "column", alignItems: "center",
        justifyContent: "center",
        padding: (scenes?.[0] as any)?.fullFrame ? "80px 44px" : "50px 44px",
        gap: (scenes?.[0] as any)?.fullFrame ? 32 : 28,
      }}>
        {regularElements.map((element, i) => (
          <RenderElement key={i} element={element} frame={frame} fps={fps} />
        ))}
      </div>

      {/* Notifications (positioned within upper half) */}
      {notificationElements.map((n, i) => (
        <NotificationStack
          key={`notif-${i}`}
          items={n.items}
          frame={frame}
          fps={fps}
          delay={(n as any).delay || 0}
        />
      ))}
    </AbsoluteFill>
  );
};

// ─── MAIN COMPOSITION ───

const DEFAULT_SCENES: SceneConfig[] = [
  {
    duration: 5,
    background: {colors: ["#0a0a0a", "#1a1a3e"]},
    particles: {count: 40, direction: "up"},
    elements: [
      {type: "badge", text: "DEMO", delay: 0.2},
      {type: "title", text: "Dynamic MG", fontSize: 56, delay: 0.5},
    ],
  },
];

export const DynamicMG: React.FC<DynamicMGProps> = ({scenes = DEFAULT_SCENES}) => {
  loadDefaultFonts();

  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  // Global fade in
  const fadeIn = interpolate(frame, [0, 10], [0, 1], {extrapolateRight: "clamp"});

  // Calculate scene start frames
  let cumulativeFrames = 0;
  const sceneTimings = scenes.map((scene) => {
    const start = cumulativeFrames;
    const duration = toFrames(scene.duration, fps);
    cumulativeFrames += duration;
    return {start, duration};
  });

  return (
    <AbsoluteFill style={{opacity: fadeIn, backgroundColor: "#050510"}}>
      {scenes.map((scene, i) => (
        <Sequence key={i} from={sceneTimings[i].start} durationInFrames={sceneTimings[i].duration}>
          <SceneRenderer scene={scene} />
        </Sequence>
      ))}
      {/* Vignette overlay */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
        background: "radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.6) 100%)",
        pointerEvents: "none",
      }} />
    </AbsoluteFill>
  );
};
