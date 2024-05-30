import { atomWithStorage } from "jotai/utils";
import { atom } from "jotai";
import { defaultPrompt } from "./consts";

export const promptAtom = atomWithStorage<string>(
  "prompt-atom-9",
  defaultPrompt
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
