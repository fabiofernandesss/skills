# Showcase — Cinematic Motion Director

Remotion project that proves the skill's motion kit works and renders the README assets.
It imports the kit straight from `../../skills/cinematic-motion-director/motion-kit`
(see `remotion.config.ts` for the one-line webpack resolve that makes this work).

| Composition | What it shows |
|-------------|---------------|
| `Showcase` | 15 s vertical teaser: kinetic type, camera, easing comparison, pipeline, CTA |
| `AdCreative` | Data-driven ad template: zod schema, `calculateMetadata`, 4 formats, safe zones |
| `UiMorph` | "One shape, never cut": 8 s seamless loop, cursor-driven morphs on measured downbeats, camera zoom via `springSteps`, audio |
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
no licensed music in this repository.
