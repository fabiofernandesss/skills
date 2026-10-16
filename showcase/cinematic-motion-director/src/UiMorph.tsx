import React from "react";
import { AbsoluteFill, Easing, Sequence, staticFile, useCurrentFrame } from "remotion";
import { Audio } from "@remotion/media";
import {
  CAMERA_SPRING,
  Camera,
  Cursor,
  Handoff,
  Layer,
  MorphBox,
  SHAPE_SPRING,
  Typewriter,
  beatPulse,
  ease,
  mix,
  progress,
  springSteps,
  tween,
  type CursorStep,
  type HandoffSpot,
  type MorphState,
} from "../../../skills/cinematic-motion-director/motion-kit";
import beats from "./beats.json";
import { fonts } from "./fonts";

/**
 * Recipe "One shape, never cut" (references/scene-recipes.md §1):
 * one black element becomes prompt → render ring → playing video → button, a cursor causes
 * every change, state changes land on downbeats measured by scripts/beat-map.mjs, and the loop
 * seam sits inside a morph.
 *
 * Built through an independent-critic loop (4/10 → 6.5 → 5.5 → 7 → this pass): one fill color,
 * geometry morphs with a tiny overshoot instead of blur-dissolves, a counter and arc reading
 * one value, a clickable cause for every change, real hover and press, and one orange
 * carrier handed from state to state so the accent never disappears.
 */
const c = { bg: "#EDEAE4", shape: "#111111", text: "#F5F3EF", muted: "#9A958C", label: "#6B665F", line: "#2A2A2A", accent: "#FF4D1C" };
const SHAPE_SHADOW = "0 20px 60px rgba(0,0,0,0.12)";
const fps = 30;
const LEAD = 2; // morphs start 2 frames before the downbeat so the hit lands ON it
const D = beats.downbeats.map((s) => Math.round(s * fps) - LEAD); // -2, 58, 118, 178, 238, …
const HOVER = Math.round(7 * fps) - LEAD; // 208
const PRESS = Math.round(7.5 * fps) - LEAD; // 223
const RING_END = D[2] - 22; // 96: arc complete
const RING_HOP = RING_END + 4; // 100: head detaches, lands as ▶ at 106
export const UI_MORPH_DURATION = 240; // 4 bars at 120 BPM

// The ✦ is visible only while the carrier isn't standing in for it.
const STAR_VISIBLE = (f: number) => f >= D[3] + 10 && f < D[4] - 3;

const Button = () => {
  const frame = useCurrentFrame();
  // ✦ turns 90° on hover and spins on press — the button reacts before it transforms.
  const spin = springSteps(frame, fps, [{ at: -1000, value: 0 }, { at: HOVER, value: 90 }, { at: PRESS, value: 270 }], SHAPE_SPRING);
  return (
    <span style={{ fontFamily: fonts.ui, fontWeight: 600, fontSize: 46, color: c.text, letterSpacing: "-0.02em", whiteSpace: "nowrap", display: "flex", alignItems: "center", gap: 14 }}>
      Gerar vídeo <span style={{ color: c.accent, display: "inline-block", rotate: `${spin}deg`, opacity: STAR_VISIBLE(frame) ? 1 : 0 }}>✦</span>
    </span>
  );
};

const Prompt: React.FC<{ start: number; dotFrom: number; dotUntil: number }> = ({ start, dotFrom, dotUntil }) => {
  const frame = useCurrentFrame();
  return (
    <div style={{ width: 680, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 20 }}>
      <div style={{ position: "relative" }}>
        {/* Placeholder until the first keystroke: the poster frame says what this is. */}
        <span style={{ position: "absolute", left: 0, top: 0, fontFamily: fonts.mono, fontSize: 32, color: "rgba(245,243,239,0.4)", whiteSpace: "nowrap", opacity: frame < start ? 1 : 0 }}>
          Descreva seu vídeo…
        </span>
        <Typewriter text="um reel de 15 s sobre o meu app" start={start} cps={24} caretColor={c.accent} caret={frame < start ? "" : "▍"} style={{ fontFamily: fonts.mono, fontSize: 32, color: c.text, whiteSpace: "nowrap" }} />
      </div>
      <div style={{ flex: "none", width: 72, height: 72, borderRadius: 36, background: c.accent, display: "flex", alignItems: "center", justifyContent: "center", color: c.text, fontSize: 38, opacity: frame >= dotFrom && frame < dotUntil ? 1 : 0 }}>
        ↑
      </div>
    </div>
  );
};

// Counter and arc read ONE value; at 100% the number becomes a ▶ the cursor can press.
const Ring: React.FC<{ start: number; end: number; arcFrom: number; playFrom: number; playUntil: number }> = ({ start, end, arcFrom, playFrom, playUntil }) => {
  const frame = useCurrentFrame();
  const p = tween(frame, [start, end], [0, 1], Easing.bezier(0.65, 0, 0.35, 1));
  const done = frame >= playFrom;
  const numberOut = progress(frame, end + 1, 4, ease.in); // "100%" leaves before the ▶ arrives
  const r = 112;
  return (
    <div style={{ position: "relative", width: 260, height: 260, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <svg width={260} height={260} style={{ position: "absolute", inset: 0, rotate: "-90deg" }}>
        <circle cx={130} cy={130} r={r} fill="none" stroke={c.line} strokeWidth={14} />
        <circle cx={130} cy={130} r={r} fill="none" stroke={c.accent} strokeWidth={14} strokeLinecap="round" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - p} opacity={frame >= arcFrom ? 1 : 0} />
      </svg>
      {done ? (
        <div style={{ opacity: frame < playUntil ? 1 : 0, width: 0, height: 0, borderTop: "34px solid transparent", borderBottom: "34px solid transparent", borderLeft: `56px solid ${c.accent}`, marginLeft: 14, }} />
      ) : (
        <span style={{ fontFamily: fonts.ui, fontWeight: 600, fontSize: 66, color: c.text, fontVariantNumeric: "tabular-nums", opacity: 1 - numberOut, scale: String(mix(1, 0.9, numberOut)) }}>{Math.round(p * 100)}%</span>
      )}
    </div>
  );
};

// The card's disc path, shared by the card (layout px inside the preview) and the carrier
// (layer px), so the hand-off lands exactly on it.
const CARD = { left: 540 - 345 / 2, previewTop: 262 };
const discAt = (frame: number, start: number) => {
  const t = (frame - start) / fps;
  const d = 200 * (1 + 0.04 * Math.sin(t * Math.PI * 4));
  const left = 72 + Math.sin(t * 2.2) * 60;
  const top = 96 + Math.sin(t * 1.4 + 0.6) * 56; // stays above the words (bottom 116 px of the preview)
  return { left, top, d, x: CARD.left + left + d / 2, y: CARD.previewTop + top + d / 2 };
};

// The payoff plays something: one disc on one continuous path + words on half-beats, then a
// "Gerar outro" chip appears — the cursor's reason to turn the card back into the button.
const Video: React.FC<{ start: number; end: number; chipAt: number; discFrom: number; discUntil: number }> = ({ start, end, chipAt, discFrom, discUntil }) => {
  const frame = useCurrentFrame();
  const t = (frame - start) / fps;
  const wi = Math.max(0, Math.min(2, Math.floor(t / 0.5)));
  const word = ["MOTION", "EM", "CÓDIGO"][wi];
  const local = Math.min(1, (t - wi * 0.5) / 0.5);
  const wordOpacity = t < 0 ? 0 : Math.min(1, local * 4, wi < 2 ? (1 - local) * 6 : 1);
  const chip = progress(frame, chipAt, 8, ease.overshootSoft);
  const disc = discAt(frame, start);
  return (
    <div style={{ width: 345, height: 660, display: "flex", flexDirection: "column", gap: 18, padding: "6px 0" }}>
      <span style={{ fontFamily: fonts.mono, fontSize: 28, color: c.muted, letterSpacing: "0.04em" }}>REEL · 9:16</span>
      <div style={{ position: "relative", flex: 1, borderRadius: 24, background: "#1C1C1C", overflow: "hidden" }}>
        <div style={{ position: "absolute", width: disc.d, height: disc.d, borderRadius: disc.d / 2, background: c.accent, left: disc.left, top: disc.top, opacity: frame >= discFrom && frame < discUntil ? 1 : 0 }} />
        <div style={{ position: "absolute", left: 24, bottom: 34, fontFamily: fonts.ui, fontWeight: 600, fontSize: 64, letterSpacing: "-0.04em", color: c.text, translate: `0 ${mix(30, 0, ease.out(Math.min(1, local * 3)))}px`, opacity: wordOpacity }}>
          {word}
        </div>
      </div>
      <div style={{ height: 8, borderRadius: 4, background: c.line, overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${tween(frame, [start, end], [0, 100], ease.linear)}%`, background: c.accent }} />
      </div>
      <div style={{ position: "relative", height: 56 }}>
        <span style={{ position: "absolute", top: 10, fontFamily: fonts.mono, fontSize: 28, color: c.muted, opacity: 1 - chip }}>15 s · 30 fps</span>
        <span style={{ position: "absolute", top: 0, left: 0, padding: "10px 22px", borderRadius: 28, border: `2px solid ${c.accent}`, color: c.text, fontFamily: fonts.ui, fontWeight: 600, fontSize: 28, whiteSpace: "nowrap", opacity: chip, scale: String(mix(0.8, 1, chip)), transformOrigin: "left center" }}>
          ↻ Gerar outro
        </span>
      </div>
    </div>
  );
};

// Shared-element hand-off (kit `Handoff`): one orange carrier travels from the accent the user
// just clicked to the accent of the next state (send ↑ → ring head → ▶ → disc → ✦ → ↑),
// drawing the source glyph at its start and the target glyph at its end.
const PLAY_NODE = <div style={{ width: 0, height: 0, borderTop: "34px solid transparent", borderBottom: "34px solid transparent", borderLeft: `56px solid ${c.accent}`, marginLeft: 14 }} />;
const STAR_NODE = <span style={{ display: "block", fontFamily: fonts.ui, fontWeight: 600, fontSize: 46, lineHeight: 1, color: c.accent }}>✦</span>;
const ARROW_NODE = <span style={{ display: "block", fontSize: 38, lineHeight: 1, color: c.text }}>↑</span>;
const SEND: HandoffSpot = { x: 844, y: 540, d: 72, node: ARROW_NODE, onDot: true };
const RING_HEAD: HandoffSpot = { x: 540, y: 428, d: 14 };
const PLAY: HandoffSpot = { x: 540, y: 540, d: 40, node: PLAY_NODE };
const STAR: HandoffSpot = { x: 670, y: 540, d: 32, node: STAR_NODE, spin: true }; // measured from a render, not guessed

const Timeline: React.FC = () => {
  const frame = useCurrentFrame();
  const button = { w: 440, h: 120, radius: 60, bg: c.shape, content: <Button /> };
  const hover = { ...button, w: 466, h: 128, radius: 64, bg: "#1C1C1C" }; // hover lifts the fill
  const promptState = (at: number) => ({
    w: 760,
    h: 150,
    radius: 40,
    bg: c.shape,
    content: <Prompt start={at + 12} dotFrom={at + 10} dotUntil={D[1] - 3} />,
  });
  const cardStart = D[2] + 6;
  const states: MorphState[] = [
    { at: -1000, ...hover }, // = the state the loop ends in, so the seam morph is identical
    { at: D[0], ...promptState(D[0]) },
    { at: D[1], w: 320, h: 320, radius: 160, bg: c.shape, content: <Ring start={D[1] + 8} end={RING_END} arcFrom={D[1] + 10} playFrom={RING_HOP + 6} playUntil={D[2] - 3} /> },
    { at: D[2], w: 405, h: 760, radius: 44, bg: c.shape, content: <Video start={cardStart} end={D[3] - 4} chipAt={D[3] - 20} discFrom={D[2] + 10} discUntil={D[3] - 3} /> },
    { at: D[3], ...button },
    { at: HOVER, ...hover },
    { at: UI_MORPH_DURATION - LEAD, ...promptState(UI_MORPH_DURATION - LEAD) },
  ];
  const disc = (f: number): HandoffSpot => {
    const p = discAt(f, cardStart);
    return { x: p.x, y: p.y, d: p.d };
  };
  const hops = [
    { at: D[0], from: STAR, to: SEND },
    { at: D[1], from: SEND, to: RING_HEAD },
    { at: RING_HOP, from: RING_HEAD, to: PLAY, dur: 9 }, // arc head detaches and unfolds into the ▶
    { at: D[2], from: PLAY, to: disc(D[2] + 10) },
    { at: D[3], from: disc(D[3] - 3), to: STAR },
    { at: D[4], from: STAR, to: SEND },
  ];
  // A click 3 frames before every morph; slow approach, short final move onto the target.
  const path: CursorStep[] = [
    { x: 600, y: 560, at: 0 },
    { x: 845, y: 540, at: D[1] - 8 }, // send ↑
    { x: 845, y: 540, at: D[1] - 3, click: true },
    { x: 610, y: 640, at: D[1] + 26 }, // parks below the digits, never on them
    { x: 610, y: 640, at: D[2] - 12 },
    { x: 558, y: 548, at: D[2] - 6, travel: 6 }, // ▶ appeared → 6-frame move onto it
    { x: 558, y: 548, at: D[2] - 3, click: true },
    { x: 640, y: 760, at: D[2] + 30 },
    { x: 490, y: 852, at: D[3] - 8 }, // "Gerar outro" chip (tip just below the label)
    { x: 490, y: 852, at: D[3] - 3, click: true },
    { x: 600, y: 560, at: HOVER },
    { x: 600, y: 560, at: PRESS - 1, click: true },
    { x: 600, y: 560, at: UI_MORPH_DURATION - 1 },
  ];
  const breath = 1 + 0.012 * beatPulse(frame, fps, beats.beats, 0.3);
  // Press you can see at full speed: down to 0.94 in 3 frames, springy release past 1.
  const dip = progress(frame, PRESS, 3, ease.out);
  const release = springSteps(frame, fps, [{ at: -1000, value: 0 }, { at: PRESS + 3, value: 1 }], { damping: 13, stiffness: 260, mass: 1 });
  const pressScale = 1 - 0.06 * dip + 0.06 * release;
  const zoom = springSteps(
    frame,
    fps,
    [
      { at: -1000, value: 1.2 },
      { at: D[0], value: 1 },
      { at: D[1], value: 1.18 },
      { at: D[2], value: 1 },
      { at: D[3], value: 1.2 },
      { at: UI_MORPH_DURATION - LEAD, value: 1 },
    ],
    CAMERA_SPRING,
  );
  return (
    <AbsoluteFill style={{ backgroundColor: c.bg }}>
      <Audio src={staticFile("beat-120.mp3")} />
      <Camera zoom={zoom}>
        <Layer>
          <AbsoluteFill style={{ scale: String(breath * pressScale) }}>
            <MorphBox states={states} style={{ boxShadow: SHAPE_SHADOW }} />
            <Handoff hops={hops} color={c.accent} />
          </AbsoluteFill>
          <Cursor path={path} travel={20} color={c.shape} ring="rgba(17,17,17,0.35)" />
        </Layer>
      </Camera>
      <div style={{ position: "absolute", bottom: 48, width: "100%", textAlign: "center", fontFamily: fonts.mono, fontSize: 28, color: c.label, letterSpacing: "0.08em" }}>
        1 FORMA · {Math.round(beats.bpm)} BPM · LOOP
      </div>
    </AbsoluteFill>
  );
};

/** The loop starts 8 frames in: the poster frame (frame 0) shows the settled prompt with its placeholder. */
const START = 8;
export const UiMorph: React.FC = () => (
  <>
    <Sequence from={-START} durationInFrames={UI_MORPH_DURATION}>
      <Timeline />
    </Sequence>
    <Sequence from={UI_MORPH_DURATION - START} durationInFrames={START}>
      <Timeline />
    </Sequence>
  </>
);
