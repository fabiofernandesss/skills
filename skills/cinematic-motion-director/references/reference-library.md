# Reference Library

Where the rules in this skill come from, and what each source contributes. Use references
to extract **principles** — composition, rhythm, materiality, movement — never to copy a
frame, a style frame or a studio's signature move.

Link check: 2026-10-13 (✓ = responded; ⚠ = blocks automated requests, open in a browser).

## Studios and repertoire

| Source | Principles extracted |
|--------|----------------------|
| **BUCK** — Comfy Brand Refresh ✓ https://www.buck.co/work/comfy-brand-refresh · portfolio ✓ https://www.buck.co/work | Motion as a *system*: type, 3D objects, lines and shapes share one logic, so any new piece looks related. → `Direction` object, shape vocabulary, transition grammar in `art-direction.md`. |
| **Ordinary Folk** ✓ https://www.ordinaryfolk.co/work | Turning abstract ideas into concrete visual metaphors; rhythm and composition at the service of narrative; transitions that carry meaning. → "visual metaphor" step, match cuts, intensity curve. |
| **Motionographer** ✓ https://motionographer.com/ | Contemporary repertoire: discovering studios, styles and directions. → use to widen options during the Concept step, not to pick a style to clone. |
| **Art of the Title** ✓ https://www.artofthetitle.com/ | Title sequence craft (Saul Bass lineage onward): typography as the protagonist, graphic match cuts, economy of means. → kinetic typography and match-cut rules. |

## Craft and physics of motion

| Source | Principles extracted |
|--------|----------------------|
| **School of Motion** — Intro to the Graph Editor ✓ https://schoolofmotion.com/blog/intro-to-the-graph-editor-in-after-effects | Timing vs spacing, value/speed graphs, ease-in/out, anticipation and overshoot as curve shapes. → `motion-principles.md` §1–3, the ghost-dot spacing demo in the showcase. |
| **Adobe After Effects** — Keyframe interpolation ⚠ https://helpx.adobe.com/after-effects/desktop/animate-in-after-effects/animation-keyframes/keyframe-interpolation.html · Motion blur ⚠ https://helpx.adobe.com/after-effects/using/motion-blur.html | Linear vs Bezier vs hold interpolation, spatial vs temporal interpolation, shutter angle. → kit `ease` table (Bezier values), hold frames, motion-blur guidance. |
| **The Illusion of Life** (Frank Thomas & Ollie Johnston, 1981) — the 12 principles of animation | Anticipation, follow-through, overlapping action, arcs, secondary action, timing, exaggeration. → `motion-principles.md` §3. |
| **easings.net** ✓ https://easings.net/ | Visual reference for standard easing families and their cubic-bezier values. |
| **Josef Müller-Brockmann — Grid Systems in Graphic Design** | Grid-based layout, alignment, typographic hierarchy. → grid rules in `art-direction.md`, `GridReveal`. |

## Technical (code-driven video)

| Source | Contribution |
|--------|--------------|
| Remotion — The fundamentals ✓ https://www.remotion.dev/docs/the-fundamentals | Video = function of frame; compositions, sequences, determinism. |
| Remotion — Transitions ✓ https://www.remotion.dev/docs/transitioning | `TransitionSeries`, timings, overlays, rules. Presentation list verified from the 4.0.535 package exports. |
| Remotion — Effects ✓ https://www.remotion.dev/docs/effects | `@remotion/effects`, supported components, WebGL requirement. |
| Remotion — Easing ✓ https://www.remotion.dev/docs/easing | `Easing.bezier`, `Easing.spring`. |
| Remotion — Motion blur ✓ https://www.remotion.dev/docs/motion-blur | `HtmlInCanvasMotionBlur`, `CameraMotionBlur`, `Trail`. |
| Remotion — Three ✓ https://www.remotion.dev/docs/three | `ThreeCanvas`, frame-driven R3F. |
| Remotion official agent skills ✓ https://github.com/remotion-dev/skills | API-level best practices (inline interpolations, premounting, media components, fonts, rendering). This skill defers to them for API specifics. |
| Agent Skills format ✓ https://agentskills.io | `SKILL.md` format shared by Claude Code, Codex and other agents. |

## Ads

| Source | Contribution |
|--------|--------------|
| TikTok Creative Center ✓ https://ads.tiktok.com/business/creativecenter | Trending formats, top ads, native creative patterns. |
| Meta Ads Guide & Ads Manager safe-zone preview | Placement specs and safe zones. Values in `ad-creatives.md` are conservative compilations; confirm in Ads Manager before launch. |

## How to use this library during a project

1. In the Concept step, browse 2–3 sources relevant to the brief's tone.
2. Write down *principles* you want ("type as protagonist", "everything snaps to a grid",
   "a single warm accent cutting through dark"), not frames.
3. Combine them with the project's own metaphor. If the result could be mistaken for a
   specific studio's piece, push it further away.
