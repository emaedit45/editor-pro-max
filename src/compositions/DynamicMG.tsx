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

// ─── NEW ELEMENTS (30) ───
import {PieChart} from "../components/elements/PieChart";
import {DonutChart} from "../components/elements/DonutChart";
import {BarChart} from "../components/elements/BarChart";
import {GaugeDial} from "../components/elements/GaugeDial";
import {NumberTicker} from "../components/elements/NumberTicker";
import {StatCard} from "../components/elements/StatCard";
import {ProgressCircle} from "../components/elements/ProgressCircle";
import {BeforeAfter} from "../components/elements/BeforeAfter";
import {VersusLayout} from "../components/elements/VersusLayout";
import {PercentageSplit} from "../components/elements/PercentageSplit";
import {PhoneFrame} from "../components/elements/PhoneFrame";
import {LaptopFrame} from "../components/elements/LaptopFrame";
import {QuoteBlock} from "../components/elements/QuoteBlock";
import {HighlightedText} from "../components/elements/HighlightedText";
import {TextReveal} from "../components/elements/TextReveal";
import {GradientText} from "../components/elements/GradientText";
import {TestimonialCard} from "../components/elements/TestimonialCard";
import {StarRating} from "../components/elements/StarRating";
import {ReviewScore} from "../components/elements/ReviewScore";
import {TimelineVertical} from "../components/elements/TimelineVertical";
import {ProcessSteps} from "../components/elements/ProcessSteps";
import {IconGrid} from "../components/elements/IconGrid";
import {NumberedList} from "../components/elements/NumberedList";
import {AnimatedArrow} from "../components/elements/AnimatedArrow";
import {CircleHighlight} from "../components/elements/CircleHighlight";
import {UnderlineSwoosh} from "../components/elements/UnderlineSwoosh";
import {ConfettiBurst} from "../components/elements/ConfettiBurst";
import {GlowPulse} from "../components/elements/GlowPulse";
import {CountdownTimer} from "../components/elements/CountdownTimer";
import {CursorClick} from "../components/elements/CursorClick";
import {SocialPlatformGrid} from "../components/elements/SocialPlatformGrid";
import {GrowthChart} from "../components/elements/GrowthChart";
import {CalendarCard} from "../components/elements/CalendarCard";

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
  | DividerConfig
  | ExtendedElementConfig;

// Catch-all for the 30 new element types
interface ExtendedElementConfig {
  type: "pieChart" | "donutChart" | "barChart" | "gaugeDial" | "numberTicker" | "statCard" | "progressCircle"
    | "beforeAfter" | "versusLayout" | "percentageSplit" | "phoneFrame" | "laptopFrame"
    | "quoteBlock" | "highlightedText" | "textReveal" | "gradientText" | "testimonialCard" | "starRating" | "reviewScore"
    | "timelineVertical" | "processSteps" | "iconGrid" | "numberedList" | "animatedArrow" | "circleHighlight" | "underlineSwoosh"
    | "confettiBurst" | "glowPulse" | "countdownTimer" | "cursorClick" | "socialPlatforms" | "growthChart" | "calendarCard";
  delay?: number;
  [key: string]: any;
}

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
  if (!bars?.length) return null;
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
  if (!values?.length) return null;
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
  if (!items?.length) return null;
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
  if (!items?.length) return null;
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
  if (!metrics?.length) return null;
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

// ─── ENTRANCE ANIMATION WRAPPER ───

const EntranceWrapper: React.FC<{
  entrance?: string;
  position?: { x?: string | number; y?: number };
  frame: number;
  fps: number;
  delayFrames: number;
  children: React.ReactNode;
}> = ({ entrance = "fadeUp", position, frame, fps, delayFrames, children }) => {
  const progress = spring({
    fps,
    frame: Math.max(0, frame - delayFrames),
    config: { damping: 14, stiffness: 100 },
  });

  let opacity = interpolate(progress, [0, 1], [0, 1], { extrapolateRight: "clamp" });
  let translateY = 0;
  let translateX = 0;
  let scale = 1;

  switch (entrance) {
    case "fadeUp":
      translateY = interpolate(progress, [0, 1], [30, 0], { extrapolateRight: "clamp" });
      break;
    case "scale":
      scale = interpolate(progress, [0, 1], [0.8, 1], { extrapolateRight: "clamp" });
      break;
    case "slideLeft":
      translateX = interpolate(progress, [0, 1], [-60, 0], { extrapolateRight: "clamp" });
      break;
    case "slideRight":
      translateX = interpolate(progress, [0, 1], [60, 0], { extrapolateRight: "clamp" });
      break;
    case "slideInFromSides":
      translateX = interpolate(progress, [0, 1], [-40, 0], { extrapolateRight: "clamp" });
      break;
    case "fadeIn":
    default:
      break;
  }

  if (frame < delayFrames) {
    opacity = 0;
  }

  const posStyle: React.CSSProperties = position?.y != null
    ? { position: "absolute" as const, top: position.y, left: 0, right: 0, display: "flex", justifyContent: "center" }
    : {};

  return (
    <div style={{
      ...posStyle,
      opacity,
      transform: `translateY(${translateY}px) translateX(${translateX}px) scale(${scale})`,
      willChange: "transform, opacity",
    }}>
      {children}
    </div>
  );
};

// ─── ELEMENT RENDERER ───

const RenderElement: React.FC<{
  element: ElementConfig;
  frame: number;
  fps: number;
}> = ({element, frame, fps}) => {
  const el = element as any;
  // Support delay in frames (number > 1) or seconds (number < 1)
  const rawDelay = el.delay || 0;
  const delay = rawDelay > 10 ? rawDelay / fps : rawDelay; // if > 10, treat as frames
  const delayFrames = rawDelay > 10 ? rawDelay : Math.round(rawDelay * fps);
  const entrance = el.entrance;
  const position = el.position;

  const rendered = (() => {
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
      const children = (element.children || []).map((child, i) => (
        <RenderElement key={i} element={child} frame={frame} fps={fps} />
      ));
      return <GlassCard frame={frame} fps={fps} delay={delay}>{children}</GlassCard>;
    }
    case "browserWindow": {
      const children = (element.children || []).map((child, i) => (
        <RenderElement key={i} element={child} frame={frame} fps={fps} />
      ));
      return <BrowserWindow url={element.url} frame={frame} fps={fps} delay={delay}>{children}</BrowserWindow>;
    }
    // ─── NEW ELEMENTS (30) ───
    case "pieChart":
      return <PieChart segments={(element as any).segments} size={(element as any).size} showLabels={(element as any).showLabels} delay={delay} />;
    case "donutChart":
      return <DonutChart segments={(element as any).segments} thickness={(element as any).thickness} centerLabel={(element as any).centerLabel} centerValue={(element as any).centerValue} delay={delay} />;
    case "barChart":
      return <BarChart bars={(element as any).bars} maxValue={(element as any).maxValue} showValues={(element as any).showValues} delay={delay} />;
    case "gaugeDial":
      return <GaugeDial value={(element as any).value} min={(element as any).min} max={(element as any).max} label={(element as any).label} color={(element as any).color} delay={delay} />;
    case "numberTicker":
      return <NumberTicker from={(element as any).from} to={(element as any).to} prefix={(element as any).prefix} suffix={(element as any).suffix} color={(element as any).color} fontSize={(element as any).fontSize} delay={delay} />;
    case "statCard":
      return <StatCard value={(element as any).value} label={(element as any).label} delta={(element as any).delta} deltaDirection={(element as any).deltaDirection} color={(element as any).color} delay={delay} />;
    case "progressCircle":
      return <ProgressCircle value={(element as any).value} max={(element as any).max} color={(element as any).color} trackColor={(element as any).trackColor} size={(element as any).size} label={(element as any).label} delay={delay} />;
    case "beforeAfter":
      return <BeforeAfter beforeLabel={(element as any).beforeLabel} afterLabel={(element as any).afterLabel} beforeItems={(element as any).beforeItems} afterItems={(element as any).afterItems} beforeColor={(element as any).beforeColor} afterColor={(element as any).afterColor} delay={delay} />;
    case "versusLayout":
      return <VersusLayout left={(element as any).left} right={(element as any).right} delay={delay} />;
    case "percentageSplit":
      return <PercentageSplit leftValue={(element as any).leftValue} rightValue={(element as any).rightValue} leftLabel={(element as any).leftLabel} rightLabel={(element as any).rightLabel} leftColor={(element as any).leftColor} rightColor={(element as any).rightColor} delay={delay} />;
    case "phoneFrame":
      return <PhoneFrame screenContent={(element as any).screenContent} deviceColor={(element as any).deviceColor} delay={delay} />;
    case "laptopFrame":
      return <LaptopFrame screenContent={(element as any).screenContent} url={(element as any).url} delay={delay} />;
    case "quoteBlock":
      return <QuoteBlock text={(element as any).text} author={(element as any).author} fontSize={(element as any).fontSize} quoteMarkColor={(element as any).quoteMarkColor} delay={delay} />;
    case "highlightedText":
      return <HighlightedText text={(element as any).text} highlightWords={(element as any).highlightWords} highlightColor={(element as any).highlightColor} fontSize={(element as any).fontSize} textColor={(element as any).textColor} delay={delay} />;
    case "textReveal":
      return <TextReveal text={(element as any).text} revealStyle={(element as any).revealStyle} speed={(element as any).speed} fontSize={(element as any).fontSize} color={(element as any).color} fontFamily={(element as any).fontFamily} fontWeight={(element as any).fontWeight} letterSpacing={(element as any).letterSpacing} delay={delay} />;
    case "gradientText":
      return <GradientText text={(element as any).text} colors={(element as any).colors} angle={(element as any).angle} fontSize={(element as any).fontSize} fontWeight={(element as any).fontWeight} fontFamily={(element as any).fontFamily} letterSpacing={(element as any).letterSpacing} animated={(element as any).animated} delay={delay} />;
    case "testimonialCard":
      return <TestimonialCard quote={(element as any).quote} author={(element as any).author} role={(element as any).role} rating={(element as any).rating} color={(element as any).color} delay={delay} />;
    case "starRating":
      return <StarRating rating={(element as any).rating} maxStars={(element as any).maxStars} color={(element as any).color} size={(element as any).size} delay={delay} />;
    case "reviewScore":
      return <ReviewScore score={(element as any).score} maxScore={(element as any).maxScore} label={(element as any).label} reviewCount={(element as any).reviewCount} ringColor={(element as any).ringColor} size={(element as any).size} delay={delay} />;
    case "timelineVertical":
      return <TimelineVertical events={(element as any).events} lineColor={(element as any).lineColor} dotColor={(element as any).dotColor} delay={delay} />;
    case "processSteps":
      return <ProcessSteps steps={(element as any).steps} activeStep={(element as any).activeStep} color={(element as any).color} delay={delay} />;
    case "iconGrid":
      return <IconGrid items={(element as any).items} columns={(element as any).columns} iconSize={(element as any).iconSize} color={(element as any).color} delay={delay} />;
    case "numberedList":
      return <NumberedList items={(element as any).items} numberColor={(element as any).numberColor} delay={delay} />;
    case "animatedArrow":
      return <AnimatedArrow startX={(element as any).startX} startY={(element as any).startY} endX={(element as any).endX} endY={(element as any).endY} color={(element as any).color} strokeWidth={(element as any).strokeWidth} curved={(element as any).curved} delay={delay} />;
    case "circleHighlight":
      return <CircleHighlight size={(element as any).size} color={(element as any).color} strokeWidth={(element as any).strokeWidth} delay={delay} />;
    case "underlineSwoosh":
      return <UnderlineSwoosh width={(element as any).width} color={(element as any).color} strokeWidth={(element as any).strokeWidth} style={(element as any).style} delay={delay} />;
    case "confettiBurst":
      return <ConfettiBurst colors={(element as any).colors} particleCount={(element as any).particleCount} originX={(element as any).originX} originY={(element as any).originY} delay={delay} />;
    case "glowPulse":
      return <GlowPulse color={(element as any).color} size={(element as any).size} intensity={(element as any).intensity} pulseSpeed={(element as any).pulseSpeed} delay={delay} />;
    case "countdownTimer":
      return <CountdownTimer from={(element as any).from} to={(element as any).to} style={(element as any).style} color={(element as any).color} size={(element as any).size} label={(element as any).label} delay={delay} />;
    case "cursorClick":
      return <CursorClick startX={(element as any).startX} startY={(element as any).startY} endX={(element as any).endX} endY={(element as any).endY} clickDelay={(element as any).clickDelay} cursorColor={(element as any).cursorColor} rippleColor={(element as any).rippleColor} delay={delay} />;
    case "socialPlatforms":
      return <SocialPlatformGrid platforms={(element as any).platforms} iconSize={(element as any).iconSize} layout={(element as any).layout} delay={delay} />;
    case "growthChart":
      return <GrowthChart data={(element as any).data} color={(element as any).color} label={(element as any).label} labelValue={(element as any).labelValue} delay={delay} />;
    case "calendarCard":
      return <CalendarCard day={(element as any).day} date={(element as any).date} time={(element as any).time} isLive={(element as any).isLive} label={(element as any).label} color={(element as any).color} delay={delay} />;
    default:
      return null;
  }
  })();

  if (!rendered) return null;

  return (
    <EntranceWrapper entrance={entrance} position={position} frame={frame} fps={fps} delayFrames={delayFrames}>
      {rendered}
    </EntranceWrapper>
  );
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
  const allElements = scene.elements || [];
  const regularElements = allElements.filter((e) => e.type !== "notifications");
  const notificationElements = allElements.filter((e) => e.type === "notifications") as NotificationsConfig[];

  // Exit animation
  const exitAnim = (scene as any).exitAnimation;
  let exitOpacity = 1;
  if (exitAnim) {
    const exitStart = exitAnim.startFrame || 130;
    const exitDur = exitAnim.duration || 20;
    exitOpacity = interpolate(frame, [exitStart, exitStart + exitDur], [1, 0], {
      extrapolateLeft: "clamp", extrapolateRight: "clamp",
    });
  }

  // Check if any element has explicit position (absolute positioning mode)
  const hasPositions = regularElements.some((e) => (e as any).position?.y != null);

  return (
    <AbsoluteFill style={{ opacity: exitOpacity }}>
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
          speed={(scene.particles as any).speedFactor || scene.particles.speed || 0.5}
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

      {/* Ambient glow — simplified, no blur for performance */}
      <div style={{
        position: "absolute", top: "15%", left: "50%",
        width: 400, height: 400, borderRadius: "50%",
        background: `radial-gradient(circle, ${(bgColors[1] || bgColors[0])}30 0%, transparent 70%)`,
        transform: `translate(-50%, -50%) scale(${1 + Math.sin(frame * 0.03) * 0.15})`,
        opacity: 0.6,
      }} />

      {/* Content area */}
      {hasPositions ? (
        /* Absolute positioning mode — each element positions itself */
        <div style={{
          position: "absolute", top: 0, left: 0, right: 0,
          height: (scene as any)?.fullFrame ? 1920 : 960,
        }}>
          {regularElements.map((element, i) => (
            <RenderElement key={i} element={element} frame={frame} fps={fps} />
          ))}
        </div>
      ) : (
        /* Flex column mode (legacy) */
        <div style={{
          position: "absolute", top: 0, left: 0, right: 0,
          height: (scene as any)?.fullFrame ? 1920 : 960,
          display: "flex", flexDirection: "column", alignItems: "center",
          justifyContent: "center",
          padding: (scene as any)?.fullFrame ? "80px 44px" : "50px 44px",
          gap: (scene as any)?.fullFrame ? 32 : 28,
        }}>
          {regularElements.map((element, i) => (
            <RenderElement key={i} element={element} frame={frame} fps={fps} />
          ))}
        </div>
      )}

      {/* Notifications */}
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
