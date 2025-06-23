import { useCanvasStore } from "@/store/use-canvas-store";
import { useEffect, useRef } from "react";
import { useDrawTemplate } from "../utils/use-draw-template";

export const CanvasLayout = ({ mode }: { mode: "EDITOR" | "CREATOR" }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const setCanvasRef = useCanvasStore((state) => state.setCanvasRef);
  const canvasDimensions = useCanvasStore((state) => state.canvasDimensions);
  const { handleKeyDown, handleMouseDown, handleMouseMove, handleMouseUp } =
    useDrawTemplate(mode);

  useEffect(() => {
    if (canvasRef) {
      setCanvasRef(canvasRef.current);
    }
  }, [canvasRef]);

  return (
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
  );
};
