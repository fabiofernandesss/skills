import { Easing, interpolate, type EasingFunction, type InterpolateOptions } from "remotion";

/**
 * Named curves. Pick by INTENT, not by taste:
 * - out:        confident arrival (default for entrances)
 * - outSoft:    gentler arrival for secondary elements
 * - in:         exits that accelerate away (never use for entrances)
 * - inOut:      camera moves, morphs, anything that travels from A to B on screen
 * - snap:       whip pans, hard energy beats; spends almost no time in the middle
 * - anticipate: a small pull-back before the move (back-in)
 * - overshoot:  passes the target and settles (back-out). Use on 1 element per beat, max.
 * - spring:     physical settle with no bounce
 * - bouncy:     playful settle; only for brands that allow it
 */
export const ease = {
  linear: Easing.linear,
  out: Easing.bezier(0.16, 1, 0.3, 1),
  outSoft: Easing.bezier(0.25, 1, 0.5, 1),
  in: Easing.bezier(0.7, 0, 0.84, 0),
  inOut: Easing.bezier(0.65, 0, 0.35, 1),
  snap: Easing.bezier(0.85, 0, 0.15, 1),
  anticipate: Easing.bezier(0.36, 0, 0.66, -0.56),
  overshoot: Easing.bezier(0.34, 1.56, 0.64, 1),
  spring: Easing.spring({ damping: 200 }),
  bouncy: Easing.spring({ damping: 12, stiffness: 120 }),
} satisfies Record<string, EasingFunction>;

export type EaseName = keyof typeof ease;

/**
 * Clamped interpolate over a FRAME range. Every kit component goes through this,
 * so nothing ever extrapolates past its keyframes by accident.
 *
 *   tween(frame, [start, start + 0.6 * fps], [80, 0], ease.out)
 */
export const tween = (
  frame: number,
  range: readonly [number, number],
  output: readonly [number, number],
  easing: EasingFunction = ease.out,
  options: Omit<InterpolateOptions, "easing" | "extrapolateLeft" | "extrapolateRight"> = {},
): number =>
  interpolate(frame, range, output, {
    easing,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    ...options,
  });

/** 0 → 1 progress for a window that starts at `start` and lasts `duration` frames. */
export const progress = (
  frame: number,
  start: number,
  duration: number,
  easing: EasingFunction = ease.out,
): number => tween(frame, [start, start + Math.max(1, duration)], [0, 1], easing);

/** Linear blend helper for values driven by a 0..1 progress. */
export const mix = (a: number, b: number, t: number): number => a + (b - a) * t;
