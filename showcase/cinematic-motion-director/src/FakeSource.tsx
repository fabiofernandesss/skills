import React from "react";
import { AbsoluteFill, Sequence, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Audio } from "@remotion/media";
import { CountUp, WordStagger, ease, progress } from "../../../skills/cinematic-motion-director/motion-kit";
import timing from "../public/test/fonte-timing.json";
import { fonts } from "./fonts";

/**
 * TEST FOOTAGE ONLY — stands in for "a YouTube lesson" so the footage pipeline
 * (import → transcript → moments → clip → edit) can be tested offline. Synthetic voice,
 * synthetic visuals, labelled as an example channel.
 */
export const FAKE_SOURCE_DURATION = Math.ceil(timing.duration * 30);

const Diagram: React.FC<{ i: number }> = ({ i }) => {
  const frame = useCurrentFrame();
  const p = progress(frame, 0, 30, ease.out);
  const sun = <div style={{ position: "absolute", right: 140, top: 120, width: 160, height: 160, borderRadius: 80, background: "#FFC23D", boxShadow: "0 0 80px #FFC23D88", scale: String(p) }} />;
  const cell = (
    <div style={{ position: "absolute", right: 110, top: 300, width: 300, height: 200, display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 6, rotate: "x 40deg", opacity: p }}>
      {Array.from({ length: 24 }, (_, k) => (
        <div key={k} style={{ background: "#2C5BA8", borderRadius: 3 }} />
      ))}
    </div>
  );
  const electrons = Array.from({ length: 8 }, (_, k) => (
    <div key={k} style={{ position: "absolute", right: 120 + ((frame * 6 + k * 45) % 320), top: 360 + Math.sin(frame / 8 + k) * 40, width: 18, height: 18, borderRadius: 9, background: "#7CF0FF" }} />
  ));
  if (i === 0) return sun;
  if (i === 1) return <>{sun}{cell}</>;
  if (i === 2 || i === 3) return <>{cell}{electrons}</>;
  if (i === 4)
    return (
      <div style={{ position: "absolute", right: 140, top: 250, fontFamily: fonts.display, fontWeight: 800, fontSize: 180, color: "#FFC23D" }}>
        <CountUp to={20} suffix="%" duration={40} />
      </div>
    );
  return <div style={{ position: "absolute", right: 200, top: 260, width: 120, height: 220, border: "8px solid #7CF0FF", borderRadius: 18, opacity: p }} />;
};

export const FakeSource: React.FC = () => {
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ background: "linear-gradient(160deg, #0E1A2B, #16263F)", color: "#EAF2FF" }}>
      <Audio src={staticFile("test/fonte-audio.wav")} />
      <div style={{ position: "absolute", left: 60, top: 44, fontFamily: fonts.mono, fontSize: 26, opacity: 0.75 }}>CANAL EXEMPLO · AULA 12 · ENERGIA</div>
      {timing.phrases.map((ph, i) => {
        const from = Math.round(ph.start * fps);
        const next = timing.phrases[i + 1];
        const to = next ? Math.round(next.start * fps) : Math.ceil(timing.duration * fps);
        return (
          <Sequence key={i} from={from} durationInFrames={to - from} premountFor={fps}>
            <AbsoluteFill style={{ padding: "160px 60px", width: 760 }}>
              <div style={{ fontFamily: fonts.display, fontWeight: 700, fontSize: 52, lineHeight: 1.15 }}>
                <WordStagger text={ph.text} stagger={3} />
              </div>
            </AbsoluteFill>
            <Diagram i={i} />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
