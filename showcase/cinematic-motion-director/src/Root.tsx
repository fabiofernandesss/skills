import React from "react";
import { Composition, Still } from "remotion";
import { Showcase, SHOWCASE_DURATION } from "./Showcase";
import { Banner } from "./Banner";
import { UiMorph, UI_MORPH_DURATION } from "./UiMorph";
import { FakeSource, FAKE_SOURCE_DURATION } from "./FakeSource";
import { VoiceEdit, calculateVoiceEditMetadata } from "./VoiceEdit";
import { AdCreative, adDefaults, adSchema, calculateAdMetadata } from "./AdCreative";

export const Root: React.FC = () => (
  <>
    <Composition
      id="Showcase"
      component={Showcase}
      durationInFrames={SHOWCASE_DURATION}
      fps={30}
      width={1080}
      height={1920}
      defaultProps={{ grain: true }}
    />
    <Composition
      id="AdCreative"
      component={AdCreative}
      schema={adSchema}
      defaultProps={adDefaults}
      calculateMetadata={calculateAdMetadata}
      durationInFrames={300}
      fps={30}
      width={1080}
      height={1920}
    />
    <Composition id="UiMorph" component={UiMorph} durationInFrames={UI_MORPH_DURATION} fps={30} width={1080} height={1080} />
    <Composition id="FakeSource" component={FakeSource} durationInFrames={FAKE_SOURCE_DURATION} fps={30} width={1280} height={720} />
    <Composition
      id="VoiceEdit"
      component={VoiceEdit}
      calculateMetadata={calculateVoiceEditMetadata}
      defaultProps={{ planPath: "test/edit.json" }}
      durationInFrames={300}
      fps={30}
      width={1080}
      height={1920}
    />
    <Composition id="Banner" component={Banner} durationInFrames={60} fps={30} width={1600} height={560} />
  </>
);
