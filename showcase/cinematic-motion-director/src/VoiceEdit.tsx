import React from "react";
import { staticFile, type CalculateMetadataFunction } from "remotion";
import { EditTimeline, planTimeline, resolveEditAssets, type EditPlan, type VoiceMap } from "../../../skills/cinematic-motion-director/motion-kit/edit";
import { signalNoir } from "../../../skills/cinematic-motion-director/motion-kit";
import { fonts } from "./fonts";

/**
 * Voiceover-driven edit (references/voiceover-and-footage.md): ElevenLabs-style narration +
 * voice map + footage from footage.mjs, assembled from public/test/edit.json.
 */
type Props = { planPath: string; plan?: EditPlan; voice?: VoiceMap };

export const calculateVoiceEditMetadata: CalculateMetadataFunction<Props> = async ({ props }) => {
  const raw: EditPlan = await (await fetch(staticFile(props.planPath))).json();
  const { plan, voice } = await resolveEditAssets(raw);
  return { durationInFrames: Math.ceil(planTimeline(plan).duration * 30), props: { ...props, plan, voice } };
};

export const VoiceEdit: React.FC<Props> = ({ plan, voice }) => {
  if (!plan || !voice) return null;
  const styled: EditPlan = {
    ...plan,
    palette: { bg: signalNoir.palette.bg, ink: signalNoir.palette.ink, accent: signalNoir.palette.accent, muted: signalNoir.palette.muted },
    fonts: { display: fonts.display, text: fonts.text, mono: fonts.mono },
  };
  return <EditTimeline plan={styled} voice={voice} />;
};
