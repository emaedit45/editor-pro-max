import {Easing} from "remotion";

export const EASINGS = {
  // ── Basic ──
  linear: Easing.linear,
  easeIn: Easing.ease,
  easeInOut: Easing.inOut(Easing.ease),
  easeOut: Easing.out(Easing.ease),

  // ── Bounce / Elastic ──
  bounceIn: Easing.bounce,
  bounceOut: Easing.out(Easing.bounce),
  elastic: Easing.elastic(1),
  backIn: Easing.back(1.5),
  backOut: Easing.out(Easing.back(1.5)),

  // ── Standard curves ──
  sharp: Easing.bezier(0.4, 0, 0.2, 1),
  smooth: Easing.bezier(0.25, 0.1, 0.25, 1),
  snappy: Easing.bezier(0.68, -0.55, 0.265, 1.55),

  // ── Premium / Apple-style (from research) ──
  /** Apple-like: fast start, ultra-smooth deceleration */
  premiumOut: Easing.bezier(0.19, 1.0, 0.22, 1.0),
  /** Dramatic in-out for on-screen movement */
  premiumInOut: Easing.bezier(0.76, 0, 0.24, 1.0),
  /** Playful overshoot then settle */
  overshoot: Easing.bezier(0.34, 1.56, 0.64, 1.0),

  // ── Power curves (After Effects standard) ──
  cubicOut: Easing.out(Easing.cubic),
  cubicInOut: Easing.inOut(Easing.cubic),
  quadOut: Easing.out(Easing.quad),
  expOut: Easing.out(Easing.exp),
  circOut: Easing.out(Easing.circle),
} as const;

export type EasingKey = keyof typeof EASINGS;

/**
 * Professional spring presets (from motion design research).
 * Use with remotion's spring() function: spring({ fps, frame, config: SPRINGS.premium })
 */
export const SPRINGS = {
  /** Apple-like: smooth, no bounce, elegant. Best for premium entrances. */
  premium: {mass: 1, damping: 20, stiffness: 200, overshootClamping: true},
  /** Fast and responsive. Best for UI elements, badges, small items. */
  snappy: {mass: 0.5, damping: 15, stiffness: 300},
  /** Playful with overshoot. Best for attention-grabbing elements. */
  bouncy: {mass: 1, damping: 8, stiffness: 150},
  /** Slow, weighty motion. Best for dramatic reveals, big numbers. */
  heavy: {mass: 2, damping: 20, stiffness: 100},
  /** Gentle entrance. Best for text, subtle elements. */
  gentle: {mass: 1, damping: 14, stiffness: 80},
  /** The default balanced config. General purpose. */
  default: {damping: 14, stiffness: 100},
} as const;

export type SpringKey = keyof typeof SPRINGS;
