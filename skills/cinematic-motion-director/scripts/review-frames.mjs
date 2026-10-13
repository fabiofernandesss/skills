#!/usr/bin/env node
/**
 * Render review stills spread across a composition (bundles once, renders N frames).
 * Run from the Remotion project root:
 *
 *   node <skill>/scripts/review-frames.mjs --comp Main
 *   node <skill>/scripts/review-frames.mjs --comp Main --count 12 --scale 0.4
 *   node <skill>/scripts/review-frames.mjs --comp Main --frames 0,45,90,135
 *   node <skill>/scripts/review-frames.mjs --comp Ad --props '{"format":"square"}'
 *
 * Options: --entry (auto: src/index.ts[x] | remotion/index.ts[x]), --out (out/review),
 *          --gl angle (needed for WebGL effects), --format jpeg|png.
 * Then LOOK at every image: framing, safe zones, legibility, collisions, unfinished holds.
 */
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import { parseArgs } from "node:util";

const { values: a } = parseArgs({
  options: {
    comp: { type: "string" },
    entry: { type: "string" },
    count: { type: "string", default: "8" },
    frames: { type: "string" },
    out: { type: "string", default: "out/review" },
    scale: { type: "string", default: "0.5" },
    props: { type: "string", default: "{}" },
    gl: { type: "string" },
    format: { type: "string", default: "jpeg" },
  },
});

if (!a.comp) {
  console.error("Missing --comp <CompositionId>");
  process.exit(1);
}

const root = process.cwd();
const entry =
  a.entry ??
  ["src/index.ts", "src/index.tsx", "remotion/index.ts", "remotion/index.tsx"].find((p) => fs.existsSync(path.join(root, p)));
if (!entry) {
  console.error("Could not find the Remotion entry point. Pass --entry path/to/index.ts");
  process.exit(1);
}

// Resolve Remotion from the PROJECT, not from this script's folder.
const req = createRequire(path.join(root, "package.json"));
const { bundle } = req("@remotion/bundler");
const { selectComposition, renderStill } = req("@remotion/renderer");

const inputProps = JSON.parse(a.props);
const chromiumOptions = a.gl ? { gl: a.gl } : {};

const serveUrl = await bundle({
  entryPoint: path.resolve(root, entry),
  // Lets files outside the project (e.g. a symlinked kit) resolve the project's packages.
  webpackOverride: (c) => ({
    ...c,
    resolve: { ...c.resolve, modules: [path.join(root, "node_modules"), "node_modules"] },
  }),
});
const composition = await selectComposition({ serveUrl, id: a.comp, inputProps, chromiumOptions });

const last = composition.durationInFrames - 1;
const frames = a.frames
  ? a.frames.split(",").map((f) => Math.min(last, Math.max(0, Number(f.trim()))))
  : Array.from({ length: Number(a.count) }, (_, i) => Math.round((last * (i + 0.5)) / Number(a.count)));

fs.mkdirSync(path.resolve(root, a.out), { recursive: true });
console.log(`${a.comp}: ${composition.width}x${composition.height} @ ${composition.fps}fps, ${composition.durationInFrames} frames`);

for (const frame of frames) {
  const output = path.resolve(root, a.out, `${a.comp}-${String(frame).padStart(5, "0")}.${a.format === "png" ? "png" : "jpg"}`);
  await renderStill({
    composition,
    serveUrl,
    frame,
    output,
    inputProps,
    scale: Number(a.scale),
    imageFormat: a.format === "png" ? "png" : "jpeg",
    chromiumOptions,
  });
  console.log(`frame ${frame} (${(frame / composition.fps).toFixed(2)}s) → ${path.relative(root, output)}`);
}
