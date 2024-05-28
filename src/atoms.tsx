import { atomWithStorage } from "jotai/utils";
import { atom } from "jotai";

export const promptAtom = atomWithStorage<string>(
  "prompt-atom-8",
  "Tell me a story about the objects present in the image. When you reference an object put its name and bounding box in the format: [object name](y_min x_min y_max, x_max)."
);
export const responseAtom = atomWithStorage<string>("response-atom-1", "");
export const inkColorAtom = atomWithStorage<string>("ink-color-1", "#000000");
export const isGeneratingAtom = atom(false);
export const canvasRefAtom = atom<{ current: HTMLCanvasElement | null }>({
  current: null,
});
export const visibleTextPromptAtom = atomWithStorage("visible-prompt", true);
export const activeModelAtom = atomWithStorage<"flash" | "pro">("active-model-2", "pro");
export const responseFormatAtom = atomWithStorage<"raw" | "markdown+bb">("response-format-1", "markdown+bb");
export const activerHoverBoxAtom = atom<null | string>(null);
