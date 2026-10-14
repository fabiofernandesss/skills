# Director Brief

One-line requests ("make a 15 s showreel, go all out") produce generic videos. Professional
results come from briefs with these six parts. Before building, turn every request into this
brief — fill what you can from the conversation and the project, ask once for the missing
**real inputs**, and mark assumptions.

## 1. Inputs (use only these)
- Product / subject name:
- Promise in one line:
- Real moments: screenshots, footage, quotes, features, numbers (with source)
- Brand: accent hex, fonts, logo file
- Link / CTA:

> Never invent features, numbers, testimonials, logos or claims. If an input is missing,
> use a visible placeholder (`[NÚMERO]`) and tell the user — don't fill it with plausible fiction.

## 2. Direction (one paragraph)
Style, feeling, the single visual metaphor, one typeface (+ mono), one accent, how scenes
connect (e.g. "transitions by object: an element of each scene becomes the next"), curve
personality (e.g. "springs without overshoot"), sound-off readability.

## 3. Prohibitions
Explicit list of what must NOT appear. Examples: particles, glitch, camera shake, neon glow,
gradient buttons, text entering before the previous leaves, stock icons, anything that looks
like a template.

## 4. Format & safe area
`1080×1920 · 30 fps · 15 s` · keep text out of the platform UI bands (see `SAFE_ZONES`) ·
output: Remotion composition + MP4 (or a single self-playing HTML if explicitly asked).

## 5. Timeline with exact on-screen text
```
0.0–1.5 s   hook: "[3–5 words]", word by word
1.5–5.0 s   problem: "[one sentence]" + an object that represents it
5.0–11.0 s  three real moments, 2 s each: "[1]" / "[2]" / "[3]"
11.0–13.5 s result: "[real number or sentence]"
13.5–15.0 s logo + one CTA line + link; hold the last frame
```

## 6. Checks before delivering
- Storyboard sheet with one still per second (`review-frames.mjs --every 1 --sheet`) shown to
  the user **before** the full render; render only after OK (unless running autonomously).
- `rhythm-audit.mjs` on the render: no dead stretches, hook opens in motion, cuts on pauses.
- `quality-checklist.md`.

---

### Ready-to-paste version (PT-BR, for users)

```text
Use a skill cinematic-motion-director. Quero um vídeo de [15] s, 1080x1920, 30 fps, sobre [produto].

1. Insumos reais (não invente nada além disto): nome [ ], promessa [ ], momentos reais [prints/frases/números], cor de acento [#hex], fonte [ ], link [ ].
2. Direção: [sensação em 3 palavras]; uma metáfora visual; uma fonte e um acento; cenas ligadas por objeto (o que termina uma cena começa a próxima); funciona sem som.
3. Proibido: [ex.: partículas, glitch, neon, gradiente em botão, visual de template].
4. Formato: dentro da área segura do [Reels/TikTok]; entrega em MP4 + projeto editável.
5. Linha do tempo com texto exato:
   [0–1,5 s] gancho "[...]"
   [1,5–5 s] problema "[...]"
   [5–11 s] momentos reais "[...]" / "[...]" / "[...]"
   [11–13,5 s] resultado "[...]"
   [13,5–15 s] marca + chamada + link, segurando o quadro final
6. Antes de renderizar: me mostre o storyboard com 1 quadro por segundo numa imagem só e espere meu OK. Depois do render, rode o rhythm-audit e me diga o que ele apontou.
```
