import React, { useEffect, useState } from "react";
import { AbsoluteFill, staticFile } from "remotion";
import { DynamicMG } from "./DynamicMG";

// This component loads B-roll props from broll-props.json (synced by FloowVideo)
// and renders a specific B-roll by index.

export const BrollPreview: React.FC<{ brollIndex?: number }> = ({ brollIndex = 0 }) => {
  const [placements, setPlacements] = useState<any[]>([]);

  useEffect(() => {
    fetch(staticFile("broll-props.json") + "?t=" + Date.now())
      .then((r) => r.json())
      .then((data) => setPlacements(data))
      .catch(() => setPlacements([]));
  }, []);

  const placement = placements[brollIndex];

  if (!placement) {
    return (
      <AbsoluteFill style={{ background: "#0a0a0a", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ color: "#666", fontSize: 32, fontFamily: "Inter, sans-serif", textAlign: "center" }}>
          <p>B-Roll {brollIndex + 1}</p>
          <p style={{ fontSize: 18, marginTop: 10 }}>Sin datos. Ejecuta FloowVideo primero.</p>
        </div>
      </AbsoluteFill>
    );
  }

  return <DynamicMG scenes={placement.props?.scenes || []} />;
};
