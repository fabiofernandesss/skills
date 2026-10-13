/**
 * Voice/music sync. Write cue points in SECONDS (from the real audio file,
 * captions JSON or a transcript with timestamps) and convert once:
 *
 *   const cue = cues(fps, { hook: 0, problem: 2.35, reveal: 5.1, cta: 11.8 });
 *   <Sequence from={cue.reveal}>...</Sequence>
 *
 * Never guess timings by eye when an audio file exists — measure it.
 */
export const cues = <K extends string>(fps: number, seconds: Record<K, number>): Record<K, number> =>
  Object.fromEntries(Object.entries(seconds).map(([k, s]) => [k, Math.round((s as number) * fps)])) as Record<K, number>;

/** Frames between two cues — the duration of the scene that starts at `from`. */
export const span = <K extends string>(c: Record<K, number>, from: K, to: K): number => Math.max(1, c[to] - c[from]);

/**
 * Speech-rate estimate for scripts without audio yet.
 * PT-BR / EN conversational narration ≈ 2.5–3 words per second; ads read faster (~3.2).
 */
export const estimateSpeechSeconds = (script: string, wordsPerSecond = 2.7): number =>
  Math.round((script.split(/\s+/).filter(Boolean).length / wordsPerSecond) * 10) / 10;
