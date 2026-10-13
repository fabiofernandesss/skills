import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { linearTiming, springTiming, TransitionSeries } from "@remotion/transitions";
import { slide } from "@remotion/transitions/slide";
import { wipe } from "@remotion/transitions/wipe";
import { fade } from "@remotion/transitions/fade";
import {
  Camera,
  CharCascade,
  DrawLine,
  GridReveal,
  Grain,
  Highlight,
  Layer,
  MaskReveal,
  Scramble,
  TrackingIn,
  Vignette,
  WordStagger,
  ease,
  progress,
  signalNoir,
  tween,
  type Direction,
} from "../../../skills/cinematic-motion-director/motion-kit";
import { fonts } from "./fonts";

// One direction object drives every scene. Re-direct the whole video here.
const d: Direction = {
  ...signalNoir,
  type: { ...signalNoir.type, display: fonts.display, text: fonts.text, mono: fonts.mono },
};
const { palette: c, layout } = d;

const label: React.CSSProperties = {
  fontFamily: d.type.mono,
  fontSize: d.type.scale[4],
  color: c.muted,
  letterSpacing: "0.04em",
  textTransform: "uppercase",
};

const display = (size: number, weight = 800): React.CSSProperties => ({
  fontFamily: d.type.display,
  fontSize: size,
  fontWeight: weight,
  lineHeight: 1.02,
  letterSpacing: `${d.type.displayTracking}em`,
  color: c.ink,
});

/* ── 1. HOOK ─ curiosity: monumental type, slow push, the claim gets struck through ── */
const Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const strike = progress(frame, 52, 14, ease.inOut);
  return (
    <Camera zoom={tween(frame, [0, durationInFrames], [1, 1.08], ease.inOut)} drift={3}>
      <Layer depth={0.3}>
        <GridReveal color={c.ink} columns={layout.columns} margin={layout.margin} opacity={0.08} />
      </Layer>
      <Layer>
        <AbsoluteFill style={{ padding: layout.margin, justifyContent: "center", gap: 36 }}>
          <div style={label}>
            <Scramble text="// cinematic-motion-director" start={2} seed="hook" />
          </div>
          <div style={display(104, 600)}>
            {/* Break lines by meaning, never by width. */}
            <WordStagger text="E se este vídeo" start={8} stagger={3} />
            <br />
            <WordStagger text="foi feito" start={17} stagger={3} />
          </div>
          <div style={display(150)}>
            <MaskReveal start={26}>sem abrir o</MaskReveal>
            <MaskReveal start={32}>
              <span style={{ position: "relative", color: c.accent }}>
                After Effects?
                <span
                  style={{
                    position: "absolute",
                    left: -8,
                    right: -8,
                    top: "54%",
                    height: 12,
                    background: c.ink,
                    transformOrigin: "left",
                    scale: `${strike} 1`,
                  }}
                />
              </span>
            </MaskReveal>
          </div>
        </AbsoluteFill>
      </Layer>
    </Camera>
  );
};

/* ── 2. CONTRAST ─ same move, two curves. Ghost dots show spacing like a graph editor ── */
const Track: React.FC<{ title: string; note: string; easing: (t: number) => number; accent: string }> = ({
  title,
  note,
  easing,
  accent,
}) => {
  const frame = useCurrentFrame();
  const { width } = useVideoConfig();
  const [from, to] = [layout.margin, width - layout.margin - 110];
  const start = 18;
  const len = 30;
  const xAt = (f: number) => tween(f, [start, start + len], [from, to], easing);
  const ghosts = Array.from({ length: len / 2 + 1 }, (_, i) => start + i * 2).filter((f) => f <= frame);
  return (
    <div style={{ position: "relative", height: 520, padding: `0 ${layout.margin}px` }}>
      <div style={{ ...label, color: accent }}>{title}</div>
      <div style={{ ...display(72, 600), marginTop: 16 }}>{note}</div>
      <div style={{ position: "absolute", top: 330, left: layout.margin, right: layout.margin, height: 2, background: c.surface }} />
      {ghosts.map((f) => (
        <div
          key={f}
          style={{ position: "absolute", top: 400, left: xAt(f) + 47, width: 16, height: 16, borderRadius: 8, background: accent, opacity: 0.55 }}
        />
      ))}
      <div style={{ position: "absolute", top: 275, left: xAt(frame), width: 110, height: 110, borderRadius: 55, background: accent }} />
    </div>
  );
};

const Contrast: React.FC = () => (
  <AbsoluteFill style={{ justifyContent: "center", gap: 120 }}>
    <Track title="Linear · PowerPoint 2009" note="Mesmo movimento." easing={ease.linear} accent={c.muted} />
    <Track title="Ease out + overshoot · direção" note="Outra curva." easing={ease.overshoot} accent={c.accent} />
  </AbsoluteFill>
);

/* ── 3. PIPELINE ─ the mechanism: a line travels, each stage lands as it arrives ── */
const STAGES = ["Pedido", "Código", "Render", "Vídeo"];
const Pipeline: React.FC = () => {
  const frame = useCurrentFrame();
  const { height } = useVideoConfig();
  const top = 360;
  const gap = 340;
  const x = layout.margin + 28;
  const lineStart = 6;
  const lineLen = 66;
  const reach = (i: number) => lineStart + (lineLen * i) / (STAGES.length - 1);
  return (
    <Camera y={tween(frame, [0, 100], [-40, 60], ease.inOut)} zoom={1.02}>
      <Layer depth={0.4}>
        <AbsoluteFill style={{ padding: layout.margin, paddingTop: 150 }}>
          <div style={label}>Como funciona</div>
        </AbsoluteFill>
      </Layer>
      <Layer>
        <DrawLine
          d={`M ${x} ${top} L ${x} ${top + gap * (STAGES.length - 1)}`}
          start={lineStart}
          duration={lineLen}
          easing={ease.linear}
          stroke={c.accent}
          strokeWidth={4}
          viewBox={`0 0 1080 ${height}`}
        />
        {STAGES.map((stage, i) => {
          const t = progress(frame, reach(i) - 2, 14, ease.overshoot);
          return (
            <div key={stage} style={{ position: "absolute", left: x - 28, top: top + gap * i - 28, display: "flex", alignItems: "center", gap: 56 }}>
              <div style={{ width: 56, height: 56, borderRadius: 28, background: c.accent, scale: String(t) }} />
              <div>
                <div style={{ ...label, opacity: t }}>0{i + 1}</div>
                <div style={display(120)}>
                  {stage === "Código" ? (
                    <Scramble text="Código" start={reach(i)} seed="code" style={{ fontFamily: d.type.mono, fontWeight: 700, letterSpacing: "-0.04em" }} lockedStyle={{ color: c.accent2 }} />
                  ) : (
                    <MaskReveal start={reach(i)} duration={16}>
                      {stage}
                    </MaskReveal>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </Layer>
    </Camera>
  );
};

/* ── 4. FRAME BY FRAME ─ technical texture: a film strip at constant speed (linear on purpose) ── */
const Frames: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const cell = 220;
  return (
    <AbsoluteFill style={{ justifyContent: "center", padding: layout.margin, gap: 56 }}>
      <div style={{ ...display(170), textTransform: "uppercase" }}>
        <CharCascade text="quadro" start={2} />
        <br />
        <CharCascade text="a quadro" start={10} charStyle={{ color: c.accent }} />
      </div>
      <div style={{ position: "relative", height: cell, marginLeft: -layout.margin, marginRight: -layout.margin, overflow: "hidden" }}>
        <div style={{ display: "flex", gap: 16, translate: `${-frame * 9}px 0` }}>
          {Array.from({ length: 16 }, (_, i) => (
            <div
              key={i}
              style={{ flex: "none", width: cell * 0.5625 * 1.4, height: cell, borderRadius: 14, background: i % 4 === 1 ? c.accent : c.surface, display: "flex", alignItems: "flex-end", padding: 14, ...label, color: i % 4 === 1 ? c.bg : c.muted }}
            >
              {String(i * 8).padStart(4, "0")}
            </div>
          ))}
        </div>
      </div>
      <div style={{ ...label, color: c.ink }}>
        frame {String(frame).padStart(4, "0")} · {fps} fps · 1080×1920
      </div>
    </AbsoluteFill>
  );
};

/* ── 5. CTA ─ quiet, legible, long enough to read. One word carries the action ── */
const Cta: React.FC = () => (
  <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", gap: 28, textAlign: "center" }}>
    <div style={display(96, 600)}>
      <WordStagger text="Comenta" start={4} />
    </div>
    <div style={display(210)}>
      <Highlight color={c.accent} start={26} duration={16} height="0.36em">
        <TrackingIn start={8} duration={26}>
          MOTION
        </TrackingIn>
      </Highlight>
    </div>
    <div style={{ ...label, marginTop: 40 }}>
      <WordStagger text="github.com/fabiofernandesss/skills" start={40} blur={0} lift={16} />
    </div>
  </AbsoluteFill>
);

// Every scene paints its own background, otherwise slides/wipes reveal the
// previous scene through the incoming one.
const Scene: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <AbsoluteFill style={{ backgroundColor: c.bg }}>{children}</AbsoluteFill>
);

export const SHOWCASE_DURATION = 100 + 100 + 110 + 80 + 110 - 20 - 14 - 12;

export const Showcase: React.FC<{ grain: boolean }> = ({ grain }) => {
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ backgroundColor: c.bg }}>
      <TransitionSeries>
        <TransitionSeries.Sequence durationInFrames={100} premountFor={fps}>
          <Scene>
            <Hook />
          </Scene>
        </TransitionSeries.Sequence>
        {/* Hard cut on purpose: the "2009" contrast should feel like a jolt. */}
        <TransitionSeries.Sequence durationInFrames={100} premountFor={fps}>
          <Scene>
            <Contrast />
          </Scene>
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={slide({ direction: "from-bottom" })}
          timing={springTiming({ config: { damping: 200 }, durationInFrames: 20 })}
        />
        <TransitionSeries.Sequence durationInFrames={110} premountFor={fps}>
          <Scene>
            <Pipeline />
          </Scene>
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={wipe({ direction: "from-left" })}
          timing={linearTiming({ durationInFrames: 14, easing: ease.snap })}
        />
        <TransitionSeries.Sequence durationInFrames={80} premountFor={fps}>
          <Scene>
            <Frames />
          </Scene>
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: 12 })} />
        <TransitionSeries.Sequence durationInFrames={110} premountFor={fps}>
          <Scene>
            <Cta />
          </Scene>
        </TransitionSeries.Sequence>
      </TransitionSeries>
      <Vignette strength={0.5} />
      {grain ? <Grain opacity={0.06} /> : null}
    </AbsoluteFill>
  );
};
