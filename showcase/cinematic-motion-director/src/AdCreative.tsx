import React from "react";
import { z } from "zod";
import { AbsoluteFill, Sequence, useVideoConfig, type CalculateMetadataFunction } from "remotion";
import {
  CountUp,
  FORMATS,
  Grain,
  Highlight,
  MaskReveal,
  SafeZoneGuide,
  WordStagger,
  ease,
  estimateSpeechSeconds,
  progress,
  useSafeArea,
} from "../../../skills/cinematic-motion-director/motion-kit";
import { useCurrentFrame } from "remotion";
import { fonts } from "./fonts";

/**
 * Data-driven ad template. An AI pipeline fills these props (inputProps),
 * the template guarantees the motion quality, safe zones and timing.
 */
export const adSchema = z.object({
  format: z.enum(["vertical", "portrait", "square", "landscape"]),
  hook: z.string().max(60),
  hookEmphasis: z.string(),
  benefit: z.string().max(90),
  proof: z.object({ value: z.number(), suffix: z.string(), label: z.string() }),
  cta: z.string().max(24),
  brand: z.object({ name: z.string(), bg: z.string(), ink: z.string(), accent: z.string() }),
  showGuides: z.boolean(),
});
export type AdProps = z.infer<typeof adSchema>;

const timeline = (p: AdProps, fps: number) => {
  const hook = Math.round(1.8 * fps);
  const benefit = Math.round(Math.max(2, estimateSpeechSeconds(p.benefit, 3.2) + 0.8) * fps);
  const proof = Math.round(2.2 * fps);
  const cta = Math.round(2.4 * fps);
  return { hook, benefit, proof, cta, total: hook + benefit + proof + cta };
};

export const calculateAdMetadata: CalculateMetadataFunction<AdProps> = ({ props }) => {
  const fps = 30;
  const { width, height } = FORMATS[props.format];
  return { fps, width, height, durationInFrames: timeline(props, fps).total };
};

const CtaButton: React.FC<{ label: string; accent: string; bg: string; size: number }> = ({ label, accent, bg, size }) => {
  const frame = useCurrentFrame();
  const t = progress(frame, 6, 16, ease.overshoot);
  return (
    <div
      style={{
        alignSelf: "flex-start",
        padding: `${size * 0.45}px ${size * 0.9}px`,
        borderRadius: 999,
        background: accent,
        color: bg,
        fontFamily: fonts.display,
        fontWeight: 800,
        fontSize: size,
        scale: String(t),
        transformOrigin: "left center",
      }}
    >
      {label} →
    </div>
  );
};

export const AdCreative: React.FC<AdProps> = (p) => {
  const { fps, width } = useVideoConfig();
  const tl = timeline(p, fps);
  const safe = useSafeArea(p.format === "vertical" ? "meta-reels" : "feed");
  const u = width / 1080; // scale type with canvas width
  const { bg, ink, accent } = p.brand;
  const big: React.CSSProperties = { fontFamily: fonts.display, fontWeight: 800, color: ink, lineHeight: 1.0, letterSpacing: "-0.045em" };
  const pad: React.CSSProperties = { paddingTop: safe.top, paddingRight: safe.right, paddingBottom: safe.bottom, paddingLeft: safe.left + 8 * u, justifyContent: "center", gap: 32 * u };
  return (
    <AbsoluteFill style={{ backgroundColor: bg }}>
      <Sequence durationInFrames={tl.hook} premountFor={fps}>
        <AbsoluteFill style={pad}>
          <div style={{ ...big, fontSize: 120 * u }}>
            <WordStagger text={p.hook} mode="mask" stagger={2} duration={12} emphasis={[p.hookEmphasis]} emphasisStyle={{ color: accent }} />
          </div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={tl.hook} durationInFrames={tl.benefit} premountFor={fps}>
        <AbsoluteFill style={pad}>
          <div style={{ ...big, fontSize: 84 * u, fontWeight: 600 }}>
            <WordStagger text={p.benefit} stagger={2} />
          </div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={tl.hook + tl.benefit} durationInFrames={tl.proof} premountFor={fps}>
        <AbsoluteFill style={pad}>
          <div style={{ ...big, fontSize: 230 * u, color: accent }}>
            <CountUp to={p.proof.value} suffix={p.proof.suffix} duration={30} />
          </div>
          <div style={{ fontFamily: fonts.text, fontSize: 44 * u, color: ink }}>
            <MaskReveal start={8}>{p.proof.label}</MaskReveal>
          </div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={tl.hook + tl.benefit + tl.proof} durationInFrames={tl.cta} premountFor={fps}>
        <AbsoluteFill style={pad}>
          <div style={{ ...big, fontSize: 64 * u, fontWeight: 600 }}>
            <Highlight color={accent} start={2} duration={14} style={{ color: ink }}>
              {p.brand.name}
            </Highlight>
          </div>
          <CtaButton label={p.cta} accent={accent} bg={bg} size={52 * u} />
        </AbsoluteFill>
      </Sequence>
      {/* Brand visible from the first second, inside the safe area. */}
      <Sequence durationInFrames={tl.hook + tl.benefit + tl.proof} premountFor={fps}>
        <div style={{ position: "absolute", top: safe.top, left: safe.left + 8 * u, fontFamily: fonts.mono, fontSize: 30 * u, color: ink, opacity: 0.7, letterSpacing: "0.06em", textTransform: "uppercase" }}>
          ● {p.brand.name}
        </div>
      </Sequence>
      <Grain opacity={0.05} />
      {p.showGuides ? <SafeZoneGuide zone={p.format === "vertical" ? "meta-reels" : "feed"} /> : null}
    </AbsoluteFill>
  );
};

export const adDefaults: AdProps = {
  format: "vertical",
  hook: "Seu anúncio parece template?",
  hookEmphasis: "template",
  benefit: "Criativos em motion com direção de arte, gerados por IA em minutos.",
  proof: { value: 12, suffix: "x", label: "mais variações por semana" },
  cta: "Teste grátis",
  brand: { name: "Sua Marca", bg: "#0A0A0B", ink: "#F4F1EA", accent: "#FF4D1C" },
  showGuides: false,
};
