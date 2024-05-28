import { useAtom } from "jotai";
import { useEffect } from "react";
import { canvasRefAtom } from "./atoms";

export function useSaveCanvasToLocalStorage() {
  const [canvasRefA] = useAtom(canvasRefAtom);
  return function () {
    localStorage.setItem(
      "canvas-1",
      canvasRefA.current!.toDataURL("image/jpeg", 0.8)
    );
  };
}

export function useDrawImageToCanvas() {
  const [canvasRefA] = useAtom(canvasRefAtom);
  const saveCanvasToLocalStorage = useSaveCanvasToLocalStorage();

  return function drawImageToCanvas(imageData: string) {
    const image = new Image();
    image.onload = function () {
      const c = canvasRefA.current!;
      const ctx = c.getContext("2d")!;
      const imgRatio = image.width / image.height;
      let drawWidth = c.width;
      let drawHeight = c.height;
      if (imgRatio > 1) {
        drawHeight = c.height / imgRatio;
      } else {
        drawWidth = c.width * imgRatio;
      }
      ctx.fillStyle = "white";
      ctx.fillRect(0, 0, c.width, c.height);
      ctx.drawImage(
        image,
        0,
        0,
        image.width,
        image.height,
        (c.width - drawWidth) / 2,
        (c.height - drawHeight) / 2,
        drawWidth,
        drawHeight
      );
      saveCanvasToLocalStorage();
    };
    image.src = imageData;
  };
}

export function useHandleDragAndDropImage() {
  const drawImageToCanvas = useDrawImageToCanvas();

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const onDrop = (e: any) => {
      e.preventDefault();
      e.stopPropagation();
      const file = e.dataTransfer.files[0];
      drawImageToCanvas(URL.createObjectURL(file));
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const onDrag = (e: any) => {
      e.stopPropagation();
      e.preventDefault();
      e.dataTransfer.dropEffect = "copy";
    };

    const onPaste = (e: ClipboardEvent) => {
      const clipboardData = e.clipboardData;
      if (clipboardData) {
        for (const item of clipboardData.items) {
          if (item.type.indexOf("image") !== -1) {
            const blob = item.getAsFile();
            const url = URL.createObjectURL(blob!);
            e.preventDefault();
            drawImageToCanvas(url);
            return;
          }
        }
      }
    };

    window.addEventListener("paste", onPaste);
    window.addEventListener("drop", onDrop);
    window.addEventListener("dragover", onDrag);
    return () => {
      window.removeEventListener("paste", onPaste);
      window.removeEventListener("drop", onDrop);
      window.removeEventListener("dragover", onDrag);
    };
  }, [drawImageToCanvas]);
}
