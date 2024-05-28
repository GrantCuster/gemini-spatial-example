import { useAtom } from "jotai";
import { activerHoverBoxAtom, responseAtom } from "./atoms";
import { parseBoundingBoxes } from "./utils";
import { canvasHeight, canvasWidth } from "./consts";
import { useEffect, useRef } from "react";

export function BoundingBoxOverlay() {
  const [response] = useAtom(responseAtom);
  const [activeHoverBox, setActiverHoverBox] = useAtom(activerHoverBoxAtom);
  const bbWrapperRef = useRef<HTMLDivElement | null>(null);

  const boxes = parseBoundingBoxes(response);

  // remove duplicates
  const seen = new Set();
  const uniqueBoxes = boxes.filter((box) => {
    const key = box.text + box.numbers.join(",");
    if (seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });

  const formatted: {
    name: string;
    coords: { x: number; y: number; width: number; height: number };
  }[] = uniqueBoxes.map((box) => {
    const coords = box.numbers;
    return {
      name: box.text,
      // convert from ["y_min", "x_min", "y_max", "x_max"];
      // convert from 1000x1000 space to percentage
      coords: {
        x: coords[1] / 1000,
        y: coords[0] / 1000,
        width: coords[3] / 1000 - coords[1] / 1000,
        height: coords[2] / 1000 - coords[0] / 1000,
      },
    };
  });

  useEffect(() => {
    // Not the most efficient way to do this but it works
    const handleMouseMove = (e: MouseEvent) => {
      const x = e.clientX;
      const y = e.clientY;
      const wrapperPosition = bbWrapperRef.current?.getBoundingClientRect();
      if (
        bbWrapperRef.current &&
        wrapperPosition &&
        x > wrapperPosition.left &&
        x < wrapperPosition.right &&
        y > wrapperPosition.top &&
        y < wrapperPosition.bottom
      ) {
        const rawBoxes = document.querySelectorAll(".bb");
        const positions = [...rawBoxes].map((box: Element) => {
          const rect = (box as HTMLElement).getBoundingClientRect();
          return {
            left: rect.left,
            right: rect.right,
            top: rect.top,
            bottom: rect.bottom,
            string: box.getAttribute("data-string"),
          };
        });
        const matches = positions.filter(
          (pos: { left: number; right: number; top: number; bottom: number }) =>
            x > pos.left && x < pos.right && y > pos.top && y < pos.bottom,
        );
        // sort by distance to center
        // @ts-ignore
        matches.sort((a, b) => {
          const aCenter = {
            x: (a.left + a.right) / 2,
            y: (a.top + a.bottom) / 2,
          };
          const bCenter = {
            x: (b.left + b.right) / 2,
            y: (b.top + b.bottom) / 2,
          };
          const aDistance = Math.sqrt(
            (aCenter.x - x) ** 2 + (aCenter.y - y) ** 2,
          );
          const bDistance = Math.sqrt(
            (bCenter.x - x) ** 2 + (bCenter.y - y) ** 2,
          );
          return aDistance - bDistance;
        });
        if (matches.length > 0) {
          const match = matches[0];
          setActiverHoverBox(match.string);
        } else {
          setActiverHoverBox(null);
        }
      }
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [formatted]);

  return (
    <div
      ref={bbWrapperRef}
      className="absolute left-0 top-0"
      style={{
        width: canvasWidth,
        height: canvasHeight,
        pointerEvents: "none",
      }}
    >
      {formatted.map((object, i) => {
        const { coords } = object;
        const box = uniqueBoxes[i];
        const string = box.numbers.join("-");
        return (
          <div
            className="absolute border-2 border-blue-500 bb"
            key={`${object.name}-${string}`}
            data-string={string}
            style={{
              left: coords.x * 100 + "%",
              top: coords.y * 100 + "%",
              width: coords.width * 100 + "%",
              height: coords.height * 100 + "%",
              opacity:
                activeHoverBox === null ? 1 : activeHoverBox === string ? 1 : 0,
              transition: "opacity 0.1s linear",
            }}
          >
            <div className="absolute bg-blue-500 text-xs left-0 bottom-0 font-mono text-white px-1">
              {object.name}
            </div>
          </div>
        );
      })}
    </div>
  );
}
