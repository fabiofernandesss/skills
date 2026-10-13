import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { GridReveal, Grain, MaskReveal, Scramble, WordStagger, ease, progress, signalNoir } from "../../../skills/cinematic-motion-director/motion-kit";
import { fonts } from "./fonts";

const c = signalNoir.palette;

// README banner, rendered as a still from the same kit the skill ships.
export const Banner: React.FC = () => {
  const frame = useCurrentFrame();
  const rings = [420, 330, 240, 150];
  return (
    <AbsoluteFill style={{ backgroundColor: c.bg, overflow: "hidden" }}>
      <GridReveal color={c.ink} columns={8} rows={3} margin={64} opacity={0.07} />
      {rings.map((r, i) => (
        <div
          key={r}
          style={{
            position: "absolute",
            right: 210 - r / 2,
            top: 280 - r / 2,
            width: r,
            height: r,
            borderRadius: r,
            border: `2px solid ${i === rings.length - 1 ? c.accent : c.surface}`,
            background: i === rings.length - 1 ? c.accent : "transparent",
            scale: String(progress(frame, 4 + i * 4, 24, ease.overshoot)),
          }}
        />
      ))}
      <AbsoluteFill style={{ padding: "0 96px", justifyContent: "center", gap: 18 }}>
        <div style={{ fontFamily: fonts.mono, fontSize: 26, color: c.muted, letterSpacing: "0.06em", textTransform: "uppercase" }}>
          <Scramble text="agent skills · claude code · codex" start={0} stagger={0.8} seed="banner" />
        </div>
        <div style={{ fontFamily: fonts.display, fontWeight: 800, fontSize: 210, lineHeight: 0.95, letterSpacing: "-0.05em", color: c.ink }}>
          <MaskReveal start={6}>
            Skills<span style={{ color: c.accent }}>.</span>
          </MaskReveal>
        </div>
        <div style={{ fontFamily: fonts.text, fontSize: 32, color: c.ink, opacity: 0.86, maxWidth: 1120 }}>
          <WordStagger text="Skills profissionais para Claude Code e Codex — por Fabio Fernandes." start={14} stagger={1} blur={0} lift={14} />
        </div>
      </AbsoluteFill>
      <Grain opacity={0.05} />
    </AbsoluteFill>
  );
};
