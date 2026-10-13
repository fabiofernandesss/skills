import { loadFont as loadInterTight } from "@remotion/google-fonts/InterTight";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";
import { loadFont as loadMono } from "@remotion/google-fonts/JetBrainsMono";

// Load only the weights and subsets actually used — every extra weight is render time.
export const fonts = {
  display: loadInterTight("normal", { weights: ["600", "800"], subsets: ["latin"] }).fontFamily,
  text: loadInter("normal", { weights: ["400", "500"], subsets: ["latin"] }).fontFamily,
  mono: loadMono("normal", { weights: ["400", "700"], subsets: ["latin"] }).fontFamily,
};
