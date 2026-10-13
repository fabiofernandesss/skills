<div align="center">

# 🎬 Cinematic Motion Director

**Um diretor de motion design dentro do seu agente de IA.**
Transforma roteiros, locuções e briefings em vídeos com acabamento de estúdio — escritos em código, renderizados de verdade.

[![Claude Code](https://img.shields.io/badge/Claude_Code-compatível-D97757?style=for-the-badge&labelColor=0A0A0B)](#-instalação)
[![Codex](https://img.shields.io/badge/Codex-compatível-F4F1EA?style=for-the-badge&labelColor=0A0A0B)](#-instalação)
[![Remotion](https://img.shields.io/badge/Remotion-4.0.535-FF4D1C?style=for-the-badge&labelColor=0A0A0B)](https://www.remotion.dev)

<img src="../../assets/cinematic-motion-director/showcase.gif" width="300" alt="Demo renderizada pela skill: tipografia cinética, câmera, curvas de easing e CTA" />

<sub>15 s · 1080×1920 · 30 fps — renderizado 100% em código com o kit desta skill · <a href="../../assets/cinematic-motion-director/showcase.mp4">baixar MP4</a></sub>

</div>

---

## O que ela faz

A maioria das animações geradas por IA parece um slideshow: tudo entra igual, tudo se move na mesma velocidade, um efeito diferente a cada corte.
Esta skill faz o agente trabalhar como um **diretor de arte + motion designer sênior + engenheiro de vídeo**:

- 🧠 **Decide antes de animar** — análise, tempo real da locução, conceito visual, storyboard cena a cena.
- ✍️ **Tipografia cinética com intenção** — quebra de linha por sentido, ênfase única, tempo de leitura garantido.
- 🎥 **Câmera e profundidade** — push-in, dolly, parallax em camadas, handheld sutil; 3D real quando a cena pede.
- 📈 **Curvas de verdade** — easing por intenção (entrada, saída, viagem, whip, overshoot), como no Graph Editor do After Effects.
- 🔀 **Transições que contam história** — match cuts, wipes, máscaras, shaders; cada uma com um motivo.
- 🔊 **Sincronia com voz e trilha** — marcações a partir do áudio real, nunca no olho.
- 📣 **Criativos para anúncios** — templates orientados a dados (zod), safe zones de Reels/TikTok, variações em lote para pipelines com IA.
- 🔍 **Revisa o próprio trabalho** — renderiza quadros, inspeciona, corrige, e só então entrega.

<img src="../../assets/cinematic-motion-director/frames.jpg" alt="Quadros do vídeo demo: hook, contraste de curvas, pipeline, quadro a quadro, CTA" />

## 📦 Instalação

**Link direto desta skill:** `https://github.com/fabiofernandesss/skills/tree/main/skills/cinematic-motion-director`

Qualquer agente (escolhe interativamente):

```bash
npx skills add fabiofernandesss/skills --skill cinematic-motion-director
```

Claude Code (global, todos os projetos):

```bash
npx skills add fabiofernandesss/skills --skill cinematic-motion-director -g -a claude-code
```

Codex (global):

```bash
npx skills add fabiofernandesss/skills --skill cinematic-motion-director -g -a codex
```

Recomendado junto — as skills oficiais do Remotion cuidam dos detalhes de API, esta cuida da direção:

```bash
npx skills add remotion-dev/skills
```

<details>
<summary><b>Instalação manual (sem CLI)</b></summary>

```bash
git clone https://github.com/fabiofernandesss/skills.git
# Claude Code
cp -R skills/skills/cinematic-motion-director ~/.claude/skills/
# Codex
cp -R skills/skills/cinematic-motion-director ~/.agents/skills/
```

Para instalar só em um projeto, copie para `.claude/skills/` ou `.agents/skills/` dentro do repositório.
</details>

## 🚀 Como usar

Peça naturalmente — a skill é ativada pelo contexto. Exemplos:

```text
Transforma esse roteiro num Reel de motion design premium. A locução está em public/voz.mp3.
```

```text
Cria 6 variações de anúncio para o meu app (3 hooks × 9:16 e 1:1), com direção de arte da marca.
```

```text
Essa transição da cena 3 está dura e o texto some rápido demais. Deixa mais cinematográfico.
```

```text
Nosso SaaS já gera vídeos com Remotion a partir de JSON. Melhora o template para parecer feito por estúdio, sem quebrar o contrato de props.
```

O agente vai: analisar → medir o tempo → propor direção de arte e storyboard → construir no Remotion → renderizar quadros e revisar → entregar o vídeo + código editável.

## 📣 Feito para criativos de anúncio

Um único template, vários formatos — o pipeline de IA só preenche os dados, a skill garante o acabamento:

<img src="../../assets/cinematic-motion-director/ad-formats.jpg" alt="O mesmo template de anúncio em 9:16, 4:5 e 1:1 com paletas de marcas diferentes" />

- Contrato de props com **zod** (limites de caracteres, formatos, cores da marca)
- Duração calculada pelo texto (`calculateMetadata`), layout adaptado por proporção
- **Safe zones** de Meta Reels, TikTok e Shorts embutidas
- Renderização em lote com `@remotion/renderer` (ou Lambda)

Exemplo funcional: [`showcase/cinematic-motion-director/src/AdCreative.tsx`](../../showcase/cinematic-motion-director/src/AdCreative.tsx)

## 🗂️ Estrutura

```
cinematic-motion-director/
├── SKILL.md                      # cérebro: fluxo obrigatório, regras, mapa de referências
├── agents/openai.yaml            # metadados para o Codex
├── references/
│   ├── art-direction.md          # conceito, paletas, tipografia, 6 direções iniciais
│   ├── motion-principles.md      # timing, spacing, easing, tipografia, câmera, som
│   ├── effects-catalog.md        # transições e efeitos do Remotion (verificados) + quando usar
│   ├── remotion-implementation.md# setup, fontes, áudio, 3D, render, armadilhas
│   ├── ad-creatives.md           # anúncios, safe zones, variações, pipelines de IA
│   └── reference-library.md      # BUCK, Ordinary Folk, School of Motion… e o que extrair
├── templates/
│   ├── art-direction.md          # ficha de direção de arte
│   ├── storyboard.md             # storyboard cena a cena com tempos
│   └── quality-checklist.md      # checklist antes do render final
├── examples/                     # roteiro → storyboard; pipeline de anúncios
├── motion-kit/                   # presets TypeScript prontos (copiados para o projeto)
└── scripts/review-frames.mjs     # renderiza quadros de revisão espalhados na timeline
```

### Motion kit

| Módulo | Presets |
|--------|---------|
| `text` | `MaskReveal` · `WordStagger` · `CharCascade` · `TrackingIn` · `Scramble` · `Highlight` |
| `camera` | `Camera` + `Layer depth` (push, dolly, roll, parallax, handheld) |
| `shapes` | `DrawLine` · `GridReveal` · `IrisReveal` · `CountUp` |
| `texture` | `Grain` · `Vignette` |
| `easing` | curvas por intenção + `tween()` |
| `formats` | formatos sociais, safe zones, guia visual |
| `sync` | cue points do áudio → frames |

## ✅ O que foi testado

- Kit compilado com TypeScript strict e Remotion **4.0.535**
- Vídeo demo de 15 s renderizado (MP4 + GIF) e revisado quadro a quadro
- Template de anúncio renderizado em 9:16 (com guias de safe zone), 4:5 e 1:1
- Transição com shader (`zoomBlur`) renderizada via CLI sem flags
- `scripts/review-frames.mjs` testado, inclusive com `calculateMetadata` e props

## Requisitos

- Node.js 18+ · um projeto [Remotion](https://www.remotion.dev) (a skill cria um se não existir)
- Uso comercial do Remotion: grátis para pessoas físicas e empresas com até 3 funcionários; acima disso exige [licença de empresa](https://www.remotion.dev/license).

---

<div align="center">
<sub>Parte da coleção <a href="../../README.md"><b>Skills</b></a> por <a href="https://github.com/fabiofernandesss">Fabio Fernandes</a> · MIT</sub>
</div>
