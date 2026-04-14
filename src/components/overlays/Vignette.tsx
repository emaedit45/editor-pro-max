import React from "react";
import {AbsoluteFill} from "remotion";

export interface VignetteProps {
  /** How dark the edges get: 0.3 subtle, 0.5 medium, 0.8 dramatic */
  intensity?: number;
  /** How far the vignette extends inward: 0-100. Lower = more coverage */
  spread?: number;
  /** Vignette color. Default black for cinema, can use dark colors for tinting */
  color?: string;
}

/**
 * Cinematic vignette overlay. Darkens edges to focus attention on center.
 * Standard in virtually all professional video production.
 */
export const Vignette: React.FC<VignetteProps> = ({
  intensity = 0.5,
  spread = 40,
  color = "0,0,0",
}) => {
  return (
    <AbsoluteFill
      style={{
        pointerEvents: "none",
        background: `radial-gradient(ellipse at center, transparent ${spread}%, rgba(${color},${intensity}) 100%)`,
        zIndex: 998,
      }}
    />
  );
};
