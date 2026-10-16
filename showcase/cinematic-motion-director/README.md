# Showcase — Cinematic Motion Director

Remotion project that proves the skill's motion kit works and renders the README assets.
It imports the kit straight from `../../skills/cinematic-motion-director/motion-kit`
(see `remotion.config.ts` for the one-line webpack resolve that makes this work).

| Composition | What it shows |
|-------------|---------------|
| `Showcase` | 15 s vertical teaser: kinetic type, camera, easing comparison, pipeline, CTA |
| `AdCreative` | Data-driven ad template: zod schema, `calculateMetadata`, 4 formats, safe zones |
| `UiMorph` | "One shape, never cut": 8 s seamless loop, cursor-driven morphs on measured downbeats, camera zoom via `springSteps`, audio |
| `VoiceEdit` | Voiceover-driven edit from `public/test/edit.json`: narration slices, B-roll, a sound bite with original audio, captions, credits |
| `FakeSource` | TEST footage standing in for "a YouTube lesson" (synthetic voice + visuals) so the footage pipeline can be tested offline |
| `Banner` | The repository banner (still) |

```bash
npm install
npm run studio        # preview
npm run render        # out/showcase.mp4
npm run gif           # out/showcase.gif (README)
npm run banner        # out/banner.png
npx remotion render AdCreative out/ad.mp4 --props='{"format":"square", ...}'
node ../../skills/cinematic-motion-director/scripts/review-frames.mjs --comp Showcase --count 8
node ../../skills/cinematic-motion-director/scripts/beat-map.mjs public/beat-120.mp3 --out src/beats.json
npx remotion render UiMorph out/ui-morph.mp4
node ../../skills/cinematic-motion-director/scripts/rhythm-audit.mjs out/ui-morph.mp4 --loop
```

`public/beat-120.mp3` is a synthetic 120 BPM test track generated in code (kick, hat, bass) —
no licensed music in this repository. `public/test/` holds a synthetic PT-BR voiceover (macOS
TTS) with an ElevenLabs-style alignment JSON, and the narration/subtitles of the test lesson.

Voice edit pipeline (footage lands in `public/broll/`, which is git-ignored):

```bash
npx remotion render FakeSource out/aula-exemplo.mp4
node ../../skills/cinematic-motion-director/scripts/voice-map.mjs public/test/narracao.mp3 --alignment public/test/narracao.alignment.json
node ../../skills/cinematic-motion-director/scripts/footage.mjs import out/aula-exemplo.mp4 --title "Aula 12 Energia Solar" --channel "Canal Exemplo (teste)" --license "Own footage (synthetic test)" --subs public/test/fonte.vtt
node ../../skills/cinematic-motion-director/scripts/footage.mjs moments aula-12-energia-solar "silicio,eletrons"
node ../../skills/cinematic-motion-director/scripts/footage.mjs clip aula-12-energia-solar 3.6 10.8 --name celula-eletrons --match public/test/narracao.mp3
npx remotion render VoiceEdit out/voice-edit.mp4
```
