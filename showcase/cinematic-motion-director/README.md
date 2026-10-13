# Showcase — Cinematic Motion Director

Remotion project that proves the skill's motion kit works and renders the README assets.
It imports the kit straight from `../../skills/cinematic-motion-director/motion-kit`
(see `remotion.config.ts` for the one-line webpack resolve that makes this work).

| Composition | What it shows |
|-------------|---------------|
| `Showcase` | 15 s vertical teaser: kinetic type, camera, easing comparison, pipeline, CTA |
| `AdCreative` | Data-driven ad template: zod schema, `calculateMetadata`, 4 formats, safe zones |
| `Banner` | The repository banner (still) |

```bash
npm install
npm run studio        # preview
npm run render        # out/showcase.mp4
npm run gif           # out/showcase.gif (README)
npm run banner        # out/banner.png
npx remotion render AdCreative out/ad.mp4 --props='{"format":"square", ...}'
node ../../skills/cinematic-motion-director/scripts/review-frames.mjs --comp Showcase --count 8
```
