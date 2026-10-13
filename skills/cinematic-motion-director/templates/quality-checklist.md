# Quality Checklist

Run on review stills (`scripts/review-frames.mjs`) and on the full render. Fix, re-render
the affected frames, repeat. Report honestly which items were checked.

## Direction
- [ ] The video has one visual metaphor and every scene belongs to it
- [ ] Palette, type and shapes follow the direction file; no off-system colors or fonts
- [ ] Transitions follow the transition grammar; no random transition per cut
- [ ] Effect budget respected (≤ 1 signature effect per scene; overshoot on ≤ 1 element per beat)
- [ ] It does not look like a slideshow, a stock template or a corporate deck

## Story & rhythm
- [ ] Hook works in the first 1–2 s, even as a still
- [ ] Each scene has one job and one hero move
- [ ] Intensity curve has peaks AND pauses; the CTA is calm and long enough
- [ ] Duration matches the real audio; nothing was compressed to fit an arbitrary length
- [ ] Visual accents hit the voice/music beats (± 2 frames)

## Motion craft
- [ ] No linear motion except intentional mechanical movement
- [ ] Entrances decelerate, exits accelerate, travels ease in-out
- [ ] Staggers/overlaps feel organic (2–4 f offsets), nothing stops all at once
- [ ] Every move is followed by a readable hold
- [ ] Camera never moves fast while dense text is on screen
- [ ] Fast moves have motion blur or are short enough not to strobe

## Typography & layout
- [ ] Line breaks by meaning; one emphasis treatment per line
- [ ] Sizes ≥ 44 px body / 30 px labels on a 1080-wide canvas
- [ ] Text contrast ≥ 4.5:1 over everything behind it
- [ ] Read time ≥ 0.4 s + 0.3 s × words after fully visible
- [ ] Everything aligned to the grid; margins consistent
- [ ] Critical content inside the platform safe zone (check with `SafeZoneGuide`)
- [ ] No clipped descenders, no text touching frame edges, no collisions mid-animation

## Technical
- [ ] Deterministic: no Math.random/Date/CSS animations/`useFrame`; re-render is identical
- [ ] Fonts loaded via `loadFont`; no fallback font visible in any frame
- [ ] Media premounted; no pop-in on the first frame of a sequence
- [ ] Every scene paints its background (transitions don't leak the other scene)
- [ ] No hold frame shows an unfinished animation (scramble, count, stagger still running)
- [ ] Remotion packages + zod on matching versions; render has no warnings worth fixing
- [ ] Final file plays, has audio (if any), right size/fps/duration

## Delivery
- [ ] Final render path, source path, and how to edit text/timing/colors
- [ ] What was rendered and checked is stated; what was not is stated too
