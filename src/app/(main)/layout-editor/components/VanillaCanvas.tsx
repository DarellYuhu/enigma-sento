"use client";

import { useRef, useEffect } from "react";
import { CreativePanel } from "./creative-panel";
import { useDrawTemplate } from "../utils/use-draw-template";
import { useCanvasStore } from "@/store/use-canvas-store";
import { EditingPanel } from "./editing-panel";

export default function VanillaCanvas({
  value,
  mode,
}: {
  value?: Layout;
  mode: "EDITOR" | "CREATOR";
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { handleKeyDown, handleMouseDown, handleMouseMove, handleMouseUp } =
    useDrawTemplate();
  const {
    canvasDimensions,
    setMode,
    setTemplate,
    setSelectedBox,
    setCanvasDimensions,
    setCanvasRef,
  } = useCanvasStore();

  const loadTemplate = (value: Layout) => {
    setTemplate(
      value.template.shapes.map((item) => ({ ...item, image: true }))
    );
    setSelectedBox(null);
    setCanvasDimensions({
      width: value.template.dimensions.width,
      height: value.template.dimensions.height,
    });
  };

  useEffect(() => {
    if (canvasRef) setCanvasRef(canvasRef.current);
  }, [canvasRef]);

  useEffect(() => {
    if (value) {
      loadTemplate(value);
      value.template.shapes.map((item) => {
        if (!item.imageUrl) return;
        const img = new Image();
        img.src = item.imageUrl;
        img.id = `image-${item.key}`;
        img.alt = `image-${item.key}`;
        img.className = "hidden";
        document.body.appendChild(img);
      });
    }
  }, [value]);

  useEffect(() => {
    setMode(mode);
  }, [mode]);

  return (
    <div className="flex flex-row gap-4">
      <canvas
        tabIndex={0}
        ref={canvasRef}
        width={canvasDimensions.width}
        height={canvasDimensions.height}
        className="border rounded-md shadow-md h-full"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onKeyDown={handleKeyDown}
      />
      <div className="space-y-4">
        {mode === "EDITOR" && <EditingPanel />}

        {mode === "CREATOR" && <CreativePanel />}
      </div>
    </div>
  );
}
