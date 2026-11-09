# Sound design: effects that sound designed, not synthesized

You cannot hear the film. This page turns sound effects into numbers you can place and check.
Source: **earshot** (github.com/Leonxlnx/earshot, MIT, checked 2026-10-26) — measurements of
7 professional launch films and a private set of licensed pro SFX clips, plus a bank of 252
effects stored as code. Tags: **[measured]** = earshot measured it on the pro films/clips;
**[practice]** = professional practice, not measured.

## 1. Where the effects come from (in this order)

1. **earshot bank** via `scripts/sfx-earshot.py` — designed clicks, laptop/mechanical keys,
   pops, knocks, shutters, dings, whooshes, cut hits, risers. No samples, no models, no torch,
   no network; ~0.5 s per effect on a laptop CPU, every take audited (clicks, cut tails,
   clipping, a rising "synth whip") and re-rolled on a new seed when it fails. Setup once:
   `git clone https://github.com/Leonxlnx/earshot` + `pip install numpy scipy soundfile soxr`.
2. **Real CC0 / public-domain recordings** (e.g. a typing recording) when realism matters more
   than control; trim the cleanest takes, credit them.
3. **`scripts/sfx.py`** (simple synthesized clicks/ticks/booms) only as a fallback when earshot
   is not available.

Never: raw oscillator beeps or filtered-noise whooshes as final sound — they are "the fastest
way to sound amateur" next to pro films [practice]. A single-layer effect is the amateur
signature; a designed one has 2–4 layers that peak together (transient / body / sub / tail for
hits; air / texture / tonal / landing for whooshes) [practice]. The bank's sounds already are.

## 2. Roles, sync and spacing (cues.json → fx.wav)

Write one cue per picture event: `{"t": 4.20, "role": "click"}`; optional `id`, `pitch`,
`dur`, `apex`, `under`. The script aligns each take on its **measured sync point** (onset for
hits, loudest 5 ms for whooshes/risers), never the file start.

| role | default sound | sync | offset vs event [measured] | min gap in a run | dB under voice | use |
|---|---|---|---|---|---|---|
| click | pro_click/mouse | onset | −11 ms | 85 ms | 20 | cuts, cursor press (on the press frame, not the UI reaction) |
| key | typing_key/laptop | onset | +8 ms | 60 ms | 25 | one per typed character |
| tick | pro_hover_tick/ping | onset | 0 | 66 ms | 22 | checkmark, counter step |
| tock | knock/wood | onset | −40 ms | 100 ms | 18 | card/chip landing |
| pop | ui_pop/soft | onset | +4 ms | 114 ms | 18 | bubble, list row arriving |
| land | pro_pop_in/round | onset | +30 ms | 159 ms | 18 | element popping in |
| snap | shutter/dslr | onset | +9 ms | 66 ms | 18 | photo whip, snap zoom |
| ding | notify/mid_tine | onset | 0 | 110 ms | 16 | notification, confirm (tune with `pitch`) |
| whoosh | whoosh_fast/crisp | peak | +37 ms | — | 16 | a fast move into a cut (`dur` = the move) |
| swoosh | whoosh_big/thump | peak | +3 ms | — | 14 | a big transition, rare |
| riser | riser/dark | peak | −23 ms | — | 14 | build into the reveal, once per film |
| hit / drop | cut_hit/punch / kick | onset | 0 | — | 12 | the reveal, 1–2 per film |

Other members: `sfx list --kind click|whoosh|...` in the earshot repo (e.g. `typing_key/thock`,
`knock/plastic`, `shutter/quick`, `mallet/glock`, `drip/drop`, `reverse_swell/cymbal`).
Knobs edit the recipe, never resample: `dur` lands exactly, `apex` puts a whoosh's peak within
5 ms of the target, `pitch` takes a note ("E6") — keep dings and mallets in one key.

Sync tolerance: viewers notice sound 45 ms early or 125 ms late (ITU-R BT.1359); if in doubt let
the sound lead by ≤ 1 frame, never lag 2 frames [practice]. Taps lead the cut, whoosh peaks
land just after it [measured].

## 3. Restraint and density

- **Not a hit on every cut** in music-led films: pro films put no measurable hit on every cut;
  dense music covers them [measured]. Accents go to the reveal, the key UI action, section
  changes [practice].
- **Voice-led Reels without music** (Fabio's default) are the exception: a sparse soundtrack
  needs a soft sound on every cut, so soft clicks on cuts are right — at 20 dB under the voice.
- Salient hits ~1.2–1.7 per second total in pro films [measured]; more effects is not better.
- **One gesture at a time.** A run of UI sounds keeps its gap and ends on one accent (confirm
  ding, land, drop). No second designed effect within 3 frames of the reveal.
- **Riser → stop-down → impact** for the big reveal: 1–4 s riser, everything drops 6–12 dB for
  0.3–0.5 s, the hit on the reveal frame [measured: 4 of 7 films use stop-downs]. Once or twice
  per film.
- Round robin: never the same take twice in a row (the script gives each event a new seed);
  typing with slightly irregular timing; a longer gap before spaces and after punctuation.
- Size matches the object: big = lower, slower, wider; small = higher, faster, tighter.

## 4. Levels, frequency, master

- With a voice: UI foley 20–25 dB under the voice's loud level, whooshes ~16, the reveal hit ~12;
  never a big hit on top of a key word; keep effects out of 1–4 kHz while the voice speaks
  (choose airy/low members or move the cue to a gap) [practice].
- With music: effects ride 3–10 dB over the music bed (the music's level in the second before
  the effect) [measured]; duck music 3–6 dB under voice; dip it before hits instead of ducking
  under every effect.
- UI foley short (< 150 ms; notifications < 500 ms), bright 2–6 kHz, high-passed; one element
  owns the sub at a time; check the mono fold-down — phones are mono [practice].
- **Start at once**: first sound within ~0.13 s (pro median) — no silent cold open. **Land the
  ending** at body level, short fade (median 0.27 s), almost no dead air [measured].
- Master ≈ −14 LUFS integrated, true peak ≤ −1 dBTP (AAC adds up to ~1 dB overshoot); 6 of 7 pro
  films clip after decoding — do not copy that [measured].

## 5. The cheap-SFX checklist (before delivery)

One layer · no movement on moving things · linear riser curves · mud at 200–400 Hz · blurry
attack · too long (tails into the next event) · sub below 25 Hz or a pure-sine sub · harsh
2–5 kHz peaks on UI sounds · clicks/chopped tails · a family at different loudness or pitches
outside the key · the same whoosh on every cut · wrong size for the object · off by a frame ·
width that vanishes in mono · judged in solo only (audition against the voice/music on a phone
speaker).

## 6. Listening with earshot (optional, heavier)

The full earshot (CLAP + AudioSet models, ~1.1 GB, torch CPU) gives an agent "ears":
`earshot critique film.mp4` (scorecard vs the pro films with timestamped FIX FIRST lines),
`timeline` (what sounds when vs the cuts), `sheet -o sheet.png` (annotated picture to read),
`find typing.wav "a single soft key press"` (cut clean takes from a recording),
`realness` (does it read code-synthesized). Install only when the user wants it and the disk
has room; never claim how something sounds without such a reading or a human listen.
It cannot judge taste, emotion or licences.

## 7. Real sounds: Openverse → earshot → Real SFX (checked 2026-11-07)

The edit is built in code and you cannot hear it, so a guessed or synthesized sound is what
gives the AI away. Three free tools close that gap, in this order:

**Openverse — where the sound comes from.** api.openverse.org/v1/audio/, no key, no account
(20 requests/min, 200/day, 20 per page, 240 per search; headers `x-ratelimit-available-anon_*`;
429 when over). Needs a `User-Agent` header (Python's default gets 403).
- Search in **English** ("door slam" 240 hits vs "porta batendo" 2).
- `license=cc0,pdm,by` — list licenses one by one. Not `license_type=commercial,modification`
  (lets CC BY-SA and Sampling+ through). Not `category=sound_effect` for effects (Freesound
  items have no category → 0 results); `category=music` does work for Jamendo tracks.
- `length=shortest` (< 30 s) for effects; `medium,long` for music beds.
- Licences: CC0/PDM free for ads; CC BY allowed **with credit** (the `attribution` field is the
  ready text; keep it in a credits file); avoid BY-SA (whole video inherits it); never BY-NC /
  BY-ND in a business video. Check `foreign_landing_url` — the user is responsible.
- `url` = 128 kbps MP3 preview (fine for short effects); `-hq.ogg` (~192 kbps) is public too; the
  original WAV (`alt_files`) needs a Freesound login.

**earshot — the ear.** `uv tool install "earshot[mcp] @ git+https://github.com/Leonxlnx/earshot"`,
`earshot doctor --fetch` (~1.1 GB, CPU only), `claude mcp add earshot --scope user -e
EARSHOT_THREADS=3 -- earshot mcp` (models stay loaded; CLI reloads 20–40 s per call).
- `rank "<sound description>" *.mp3 --top 5`, `match file "<claim>" --alts …`, `describe`,
  `realness`. **Describe the sound, never its function**, in English, 2–3 ways and keep the best
  reading (176/195 vs 152/195 with one description). strong/plausible = use; weak/no match =
  change the sound or the words.
- No match → the bank (252 code effects, no model): `earshot sfx render whoosh_fast/crisp
  --dur 0.8 --apex 0.32`, then `earshot sfx check`. Or `earshot forge … --refs <downloads>
  --mode real`. Judge forged sounds by measurements + spectrogram + a human ear.

**Real SFX (Clipwing, MIT) — puts each sound on the frame.** `git clone --depth 1
https://github.com/Clipwing/skills.git`, copy `skills/real-sfx` to `~/.claude/skills/`,
`python3 scripts/setup.py init --library main="$HOME/Sons" --uisfx --index`. Needs full FFmpeg
(Homebrew `ffmpeg-full`: drawtext + rubberband).
- Event list is the precise path (`[{"t": 1.2, "type": "pop"}, …]` written by looking at the
  frames; `find_moments.py --fine` + `look.py` only to find candidates — auto drafts miss soft
  motion). `from_cues.py` → `mix.py --plan` (show the user) → `mix.py --voice-safe`.
- It removes an old synthesized layer instead of stacking on it (axis "doubling").
- `critique.py … --listen-out` until every axis ≥ 8 (≥ 3 rounds on a new film); then
  `earshot critique` + `earshot sheet` and read the sheet.

**Launch kit levels** (`earshot kit init --preset launch`, dB over the music in the second
before; offset vs the event): pop +8.5 dB, +4 ms, ≥ 114 ms apart · short whoosh +9 dB, peak
+37 ms after the cut · long whoosh +8.5 dB, +3 ms · hit +7.5 dB on the cut · land +8 dB, +30 ms,
≥ 159 ms · tock +8 dB, −40 ms, ≥ 100 ms · click +6.5 dB, −11 ms, ≥ 85 ms · key +6.5 dB, +8 ms,
≥ 87 ms · tick +3 dB, 0, ≥ 66 ms · riser +8 dB, −23 ms · swell +9.5 dB, peak +42 ms.
Save the chosen sound per role as the brand kit and reuse it in every video.

**Music bed from a real track** (what replaced the synthesized bed): cut to the voice length,
`loudnorm I=-19`, fade in 0.4 s / out 1.2 s, `sidechaincompress` keyed by the voice
(threshold 0.02, ratio 3, attack 30, release 500) → bed ≈ −29 LUFS against a −16 LUFS voice
(~13 dB under; −32 was judged too low by the client); play it at volume 1 in Remotion (no second gain stage).

**Before posting:** every sound CC0/PDM/CC BY checked on its page, none NC · CC BY credits ready
for the description · each chosen effect has an earshot strong/plausible reading · each effect
sits on a screen event · Real SFX axes ≥ 8 or a known reason · voice stays in front, no old
synthesized beep doubled · the user listened to the flagged moments on headphones and on a
phone speaker.

