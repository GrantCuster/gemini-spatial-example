import { UploadIcon } from "lucide-react";
import { useDrawImageToCanvas } from "./hooks";

export function ImageUploader() {
  const drawImageToCanvas = useDrawImageToCanvas();
  return (
    <label className="relative text-sm flex gap-1 items-center cursor-pointer px-2 py-2 hover:bg-neutral-100">
      <UploadIcon size={13} /> Upload Image
      <input
        type="file"
        accept="image/png, image/jpeg"
        className="absolute opacity-0 w-1 h-1"
        onClick={(e) => {
          e.currentTarget.value = "";
        }}
        onChange={(e) => {
          const files = e.currentTarget.files;
          if (files) {
            const imageData = URL.createObjectURL(files[0]);
            drawImageToCanvas(imageData);
          }
        }}
      />
    </label>
  );
}
