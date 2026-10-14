# Talking-Head Edits & Captions

For creator videos: a person talking to camera (A-roll) + captions + motion graphics on
top. Different job from a pure motion piece: **the face and the voice are the hero**; motion
supports, never competes. Verified with Remotion 4.0.535.

## 1. Pipeline

```
raw video ─► transcribe (whisper.cpp) ─► Caption[] JSON ─► review/fix text
         └─► detect pauses (silencedetect) ─► cut list
Remotion:   <Video> segments (trimBefore/trimAfter) + punch-ins + captions + motion overlays + SFX
```

### Quick start: official TikTok template

```bash
npx create-video@latest --yes --tiktok my-editor
cd my-editor && npm i
```

Before transcribing a non-English video, edit `whisper-config.mjs` — the default
`medium.en` model only understands English:

```js
export const WHISPER_MODEL = "medium"; // 1.5 GB; "small" (466 MB) to test; never ".en" for PT/ES
export const WHISPER_LANG = "pt";
```

Put the video in `public/`, run `node sub.mjs` (first run downloads whisper.cpp + model),
then `npm run dev`. The JSON next to the video holds the captions.

### Inside an existing project

`npx remotion add @remotion/install-whisper-cpp @remotion/captions` and follow the official
`remotion-captions` skill: `installWhisperCpp()`, `downloadWhisperModel()`, `transcribe()`,
`toCaptions()` → `Caption[]` (`{text, startMs, endMs, timestampMs, confidence}`).
Audio must be 16 kHz WAV: `npx remotion ffmpeg -i in.mp4 -ar 16000 out.wav`.

**Always review the transcript** before rendering: brand names, product names, numbers and
slang are where Whisper fails. Fix the JSON, don't re-time by hand.

## 2. Caption pages and styles

```ts
import {createTikTokStyleCaptions} from "@remotion/captions";
const {pages} = createTikTokStyleCaptions({captions, combineTokensWithinMilliseconds: 800});
// page: {text, startMs, durationMs, tokens: [{text, fromMs, toMs}]}
```

`combineTokensWithinMilliseconds` controls words per page: ~400–800 ms → 1–3 words (punchy),
1200–2000 ms → full phrases (calmer). Highlight the active token by comparing the current
time (`frame / fps * 1000`) with `fromMs/toMs`.

Offer styles as separate compositions over the same video and captions, render a still of
each at the same second, and let the user choose before the full render:

| Style | Look | Best for |
|-------|------|----------|
| **Pill** | 1–3 words, uppercase, active word in accent, dark translucent pill | Energetic reels, ads |
| **Karaoke** | word by word, no background, heavy stroke/shadow for contrast | Fast talkers, music |
| **Box** | 1–2 lines, solid background, sentence case | Educational, calm, accessibility |
| **Editorial** | mixed weights/sizes, key word scaled up, follows the direction's type | Premium/brand content |

Caption rules:
- Size ≥ 56 px (1080 wide), weight 700–900, contrast ≥ 4.5:1 via background or stroke.
- 1–3 words per page for hooks, ≤ 2 lines ever. Break pages on pauses (`breakOnSilenceAfterMilliseconds`).
- Never cover eyes or mouth. Default band for 9:16 with a centered face: y ≈ 1100–1250 px
  (just above the bottom UI zone); move up when the face is low. Check with `SafeZoneGuide`.
- One emphasis treatment (accent color OR scale-up), used only on words that matter.
- Captions appear on the word, not before (±2 frames). Pop-in ≤ 4 frames; no long entrances.

## 3. Editing the A-roll

- **Cut the dead air.** `silencedetect` (see `scripts/lib/media.mjs` → `silences()`) gives
  pauses; keep ~0.1 s of breath on each side. Render each kept segment as
  `<Video src trimBefore trimAfter premountFor>` in a `<Series>`.
- **Hide jump cuts** with punch-ins: alternate scale 1.0 / 1.12–1.18 on consecutive segments
  (hard switch on the cut, not animated), centered on the face.
- **Emphasis zooms:** slow push (1 → 1.06 over the sentence) on key statements; a fast punch
  (6–8 frames, `ease.out`) on the hook word.
- **Pacing:** something should change every 1.5–3 s (cut, punch-in, caption page, overlay).
  `rhythm-audit.mjs` measures this on the render.
- **Loudness:** voice around −14 LUFS integrated for social (`npx remotion ffmpeg … -af loudnorm`).

## 4. Motion on top of a talking head

| Layout | When |
|--------|------|
| **Top scene** — motion card in the upper ~40% (below the top safe band), face below | Explaining a concept while talking; the scene illustrates the sentence |
| **Full-screen insert** — 1–3 s cutaway to a motion scene, back to face | Proof, demo, number, before/after |
| **Lower-third / label** — name, title, source | First appearance, citations |
| **Overlay elements** — arrows, highlights, icons near the face | Light emphasis; never more than one at a time |

Rules:
- The overlay illustrates the exact words being said at that moment — derive timing from
  caption tokens (`fromMs`), not by eye.
- Match the direction (palette, type) so overlays feel designed, not stickered on.
- Inserts: hard cut in on a stressed word, hold ≥ read time, cut back on a pause.
- Keep the face visible ≥ 60% of the runtime in personality-driven content.

## 5. QA additions

- [ ] Transcript reviewed: names, brands, numbers correct
- [ ] Captions inside safe zone, never over eyes/mouth, readable on a phone
- [ ] No jump cut without a punch-in or insert to hide it
- [ ] Overlays sync to the spoken words (±2 frames)
- [ ] `rhythm-audit` shows no dead stretches outside intentional holds
