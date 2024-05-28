import { responseAtom, activerHoverBoxAtom } from "./atoms";
import { useAtom } from "jotai";
import Markdown from "react-markdown";
import { replaceLinkFormat } from "./utils";
import { useEffect, useRef } from "react";

export function MardownResponse() {
  const [, setActiveHoverBox] = useAtom(activerHoverBoxAtom);
  const markdownWrapperRef = useRef<HTMLDivElement | null>(null);
  const [response] = useAtom(responseAtom);

  useEffect(() => {
    function handleMouseOver(event: MouseEvent) {
      // Check if the target of the event is an 'a' element
      const target = event.target as HTMLElement;
      if (target && target.tagName === "A") {
        const targetRef = target.getAttribute("href");
        if (targetRef && targetRef.startsWith("#bb-")) {
          setActiveHoverBox(targetRef.replace("#bb-", ""));
        }
      }
    }
    function handleMouseEnter() {
      setActiveHoverBox("active");
    }
    function handleMouseLeave() {
      setActiveHoverBox(null);
    }
    if (markdownWrapperRef.current) {
      markdownWrapperRef.current.addEventListener("mouseover", handleMouseOver);
      markdownWrapperRef.current.addEventListener(
        "mouseenter",
        handleMouseEnter
      );
      markdownWrapperRef.current.addEventListener(
        "mouseleave",
        handleMouseLeave
      );
    }
    return () => {
      if (markdownWrapperRef.current) {
        markdownWrapperRef.current.removeEventListener(
          "mouseover",
          handleMouseOver
        );
        markdownWrapperRef.current.removeEventListener(
          "mouseenter",
          handleMouseEnter
        );
        markdownWrapperRef.current.removeEventListener(
          "mouseleave",
          handleMouseLeave
        );
      }
    };
  }, [markdownWrapperRef, setActiveHoverBox]);

  return (
    <div ref={markdownWrapperRef}>
      <Markdown className="w-full pb-4 mx-auto prose text-black">
        {replaceLinkFormat(response)}
      </Markdown>
    </div>
  );
}

