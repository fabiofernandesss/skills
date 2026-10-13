# Motion Kit

Drop-in presets for Remotion. Plain TypeScript/React on top of `remotion` — no extra
packages. Tested with Remotion 4.0.535 (`Easing.spring` and CSS individual transform
properties are required; upgrade older projects with `npx remotion upgrade`).

```bash
cp -R <skill-dir>/motion-kit src/motion
```

```tsx
import {MaskReveal, Camera, Layer, tween, ease} from "./motion";
```

All timing props are **frames**. Write them as seconds × fps: `start={0.4 * fps}`.
Every animation is clamped and deterministic.

## easing.ts
| Export | Use |
|--------|-----|
| `ease.out / outSoft / in / inOut / snap / anticipate / overshoot / spring / bouncy / linear` | Curves named by intent (see `references/motion-principles.md`) |
| `tween(frame, [f0, f1], [v0, v1], easing?)` | Clamped `interpolate` |
| `progress(frame, start, duration, easing?)` | 0→1 over a window |
| `mix(a, b, t)` | Blend two numbers by progress |

## direction.ts
`Direction` type (palette, type, layout, motion) and `signalNoir` starter. Make one per
project; scenes read from it.

## text.tsx
| Component | Purpose | Key props | Limits |
|-----------|---------|-----------|--------|
| `MaskReveal` | Line slides out from behind an edge — premium headline entrance | `from: below/above`, `start`, `duration`, `exitAt` | One line per instance |
| `WordStagger` | Words arrive in sequence, mirrors speech | `text`, `stagger`, `mode: rise/mask`, `blur`, `emphasis[]`, `emphasisStyle` | Plain string input |
| `CharCascade` | Characters flip up in 3D | `text`, `stagger`, `charStyle` | 1–2 words |
| `TrackingIn` | Wide tracking collapses while sharpening — calm title | `fromEm`, `toEm`, `blur` | Single line (nowrap) |
| `Scramble` | Glyph noise decodes into text — code/AI/data beats | `stagger`, `flicker`, `seed`, `lockedStyle` | Use a mono font |
| `Highlight` | Marker bar sweeps behind the key word | `color`, `height` | Wraps across lines |

## camera.tsx
`<Camera x y zoom rotate drift>` + `<Layer depth>`: 2.5D camera. depth 0 = screen-locked,
1 = subject, > 1 = foreground. Drive values with `tween`. `useCamera()` reads the state.
Real 3D → `@remotion/three`.

## shapes.tsx
| Component | Purpose |
|-----------|---------|
| `DrawLine` | Any SVG path draws on (connectors, underlines, routes). `viewBox` for custom coordinates |
| `GridReveal` | Editorial grid draws in; structure scenes; keep opacity low |
| `IrisReveal` | Circle reveal from any point (`cx`, `cy` in %) — shape match cuts |
| `CountUp` | Number rolls to value, tabular figures, locale-aware |

## texture.tsx
`Grain` (deterministic SVG noise, `opacity` 0.04–0.1) and `Vignette`.

## formats.tsx
`FORMATS` (vertical, portrait, square, landscape), `SAFE_ZONES` (meta-reels, tiktok,
yt-shorts, feed), `useSafeArea(zone)` → px insets, `<SafeZoneGuide zone>` overlay for review.

## sync.ts
`cues(fps, {name: seconds})` → frames, `span(cues, a, b)`, `estimateSpeechSeconds(text, wps)`.

## Extending
Follow the same contract: props in frames, `progress`/`tween` for every value, a header
comment with **purpose** and **limits**, no `Math.random()`, no CSS animations.
