import { useEffect } from "react";
import { toLocalCoords, wrapText } from ".";
import { useCanvasStore } from "@/store/use-canvas-store";

export const useDrawTemplate = () => {
  const mode = useCanvasStore((state) => state.mode);
  const canvasRef = useCanvasStore((state) => state.canvasRef);
  const canvasDimensions = useCanvasStore((state) => state.canvasDimensions);
  const template = useCanvasStore((state) => state.template);
  const selectedBox = useCanvasStore((state) => state.selectedBox);
  const isDragging = useCanvasStore((state) => state.isDragging);
  const isResizing = useCanvasStore((state) => state.isResizing);
  const dragOffset = useCanvasStore((state) => state.dragOffset);
  const setTemplate = useCanvasStore((state) => state.setTemplate);
  const setSelectedBox = useCanvasStore((state) => state.setSelectedBox);
  const setIsDragging = useCanvasStore((state) => state.setIsDragging);
  const setDragOffset = useCanvasStore((state) => state.setDragOffset);
  const setIsResizing = useCanvasStore((state) => state.setIsResizing);

  const resizeHandleSize = 8;

  function drawTextFit(box: Shape, text: string) {
    let fontSize = 30;
    const padding = 5;
    const maxWidth = box.width - padding * 2;
    const maxHeight = box.height - padding * 2;
    const canvas = canvasRef;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const fontFam = box.fontId ?? "sans-serif";
    ctx.textBaseline = "top";

    // Kurangi fontSize sampai semua baris cukup lebar dan tinggi
    while (fontSize > 5) {
      ctx.font = `${fontSize}px ${fontFam}`;
      const lines = wrapText(text, maxWidth, ctx);
      const totalHeight = lines.length * fontSize;

      if (totalHeight <= maxHeight) {
        break;
      }
      fontSize--;
    }

    ctx.font = `${fontSize}px ${fontFam}`;
    const lines = wrapText(text, maxWidth, ctx);
    let startY = padding;

    switch (box.align) {
      case "center":
        ctx.textAlign = "center";
        break;
      case "right":
        ctx.textAlign = "right";
        break;
      default:
        ctx.textAlign = "left";
        break;
    }

    lines.forEach((line) => {
      if (startY + fontSize > maxHeight + padding) return; // Jangan gambar jika melebihi box
      let x;
      if (box.align === "center") {
        x = box.width / 2;
      } else if (box.align === "right") {
        x = box.width - padding;
      } else {
        x = padding;
      }
      ctx.fillText(line, x, startY);
      startY += fontSize;
    });
  }

  function drawResizeHandle(box: Shape) {
    const ctx = canvasRef?.getContext("2d");
    if (!ctx) return;
    ctx.fillStyle = "black";
    ctx.fillRect(
      box.x + box.width - resizeHandleSize,
      box.y + box.height - resizeHandleSize,
      resizeHandleSize,
      resizeHandleSize
    );
  }

  const drawTemplate = () => {
    const canvas = canvasRef;
    const ctx = canvas?.getContext("2d");
    if (!ctx || !canvas) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    template.forEach((box) => {
      ctx.save();
      ctx.translate(box.x + box.width / 2, box.y + box.height / 2);
      ctx.rotate(((box.rotation || 0) * Math.PI) / 180);
      ctx.translate(-box.width / 2, -box.height / 2);
      ctx.strokeStyle = box === selectedBox ? "red" : "blue";
      ctx.fillStyle = box.fill || "transparent";
      // ctx.fillRect(0, 0, box.width, box.height);
      switch (box.type) {
        case "text":
          ctx.strokeRect(0, 0, box.width, box.height);
          const text = box.value ? box.value : box.key;
          ctx.fillStyle = box.fill || "black";
          drawTextFit(box, text);
          break;
        case "rectangle":
          ctx.strokeRect(0, 0, box.width, box.height);
          ctx.fillRect(0, 0, box.width, box.height);
          if (box.imageUrl) handleImageRender(box, ctx);
          break;
        case "circle":
          ctx.beginPath();
          ctx.ellipse(
            box.width / 2,
            box.height / 2,
            box.width / 2,
            box.height / 2,
            0,
            0,
            Math.PI * 2
          );
          ctx.stroke();
          ctx.fill();
          if (box.image) {
            ctx.save();
            ctx.clip();
            const image = document.getElementById(
              `image-${box.key}`
            ) as HTMLImageElement;
            if (image) ctx.drawImage(image, 0, 0, box.width, box.height);
            ctx.restore();
          }
          break;
        case "triangle":
          ctx.beginPath();
          ctx.moveTo(box.width / 2, 0);
          ctx.lineTo(0, box.height);
          ctx.lineTo(box.width, box.height);
          ctx.closePath();
          ctx.stroke();
          ctx.fill();
          if (box.image) {
            ctx.save();
            ctx.clip();
            ctx.beginPath();
            ctx.moveTo(box.width / 2, 0);
            ctx.lineTo(0, box.height);
            ctx.lineTo(box.width, box.height);
            ctx.closePath();
            ctx.clip();
            const image = document.getElementById(
              `image-${box.key}`
            ) as HTMLImageElement;
            if (image) ctx.drawImage(image, 0, 0, box.width, box.height);
            ctx.restore();
          }
          break;
        default:
          ctx.strokeRect(0, 0, box.width, box.height);
      }
      ctx.restore();
    });

    if (selectedBox) {
      drawResizeHandle(selectedBox);
    }
  };

  const getMousePos = (evt: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = canvasRef?.getBoundingClientRect();
    return (
      rect && {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top,
      }
    );
  };

  const findBoxAt = (x: number, y: number) => {
    for (let i = template.length - 1; i >= 0; i--) {
      const box = template[i];
      const local = toLocalCoords(box, x, y);
      if (
        local.x >= 0 &&
        local.y >= 0 &&
        local.x <= box.width &&
        local.y <= box.height
      ) {
        return box;
      }
    }
    return null;
  };

  const overResizeHandle = (box: Shape, x: number, y: number) => {
    return (
      x >= box.width - resizeHandleSize && y >= box.height - resizeHandleSize
    );
  };

  const handleImageRender = (
    box: CanvasShape,
    ctx: CanvasRenderingContext2D
  ) => {
    const img = document.getElementById(`image-${box.key}`) as HTMLImageElement;
    if (img.complete) {
      ctx.drawImage(img, 0, 0, box.width, box.height);
    } else {
      img.onload = () => {
        ctx.drawImage(img, box.x, box.y, box.width, box.height);
      };
    }
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (mode === "CREATOR") return;
    const { x, y } = getMousePos(e)!;
    const clickedBox = findBoxAt(x, y);
    if (clickedBox) {
      setSelectedBox(clickedBox);
      const local = toLocalCoords(clickedBox, x, y);
      if (overResizeHandle(clickedBox, local.x, local.y)) {
        setIsResizing(true);
      } else {
        setIsDragging(true);
        setDragOffset({ x: local.x, y: local.y });
      }
    } else {
      setSelectedBox(null);
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!selectedBox) return;
    const { x, y } = getMousePos(e)!;
    const box = selectedBox;
    if (isDragging) {
      box.x = x - dragOffset.x;
      box.y = y - dragOffset.y;
    } else if (isResizing) {
      const local = toLocalCoords(box, x, y);
      box.width = Math.max(30, local.x);
      box.height = Math.max(20, local.y);
    }
    setTemplate(template.map((b) => (b === selectedBox ? box : b)));
    setSelectedBox(box);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setIsResizing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLCanvasElement>) => {
    if (!selectedBox) return;

    if (e.key === "Delete") {
      const newTemplate = template.filter((b) => b !== selectedBox);
      setSelectedBox(null);
      setTemplate(newTemplate);
      drawTemplate();
    }
    // else if (e.key.toLowerCase() === "r") {
    //   selectedBox.rotation = (selectedBox.rotation + 90) % 360;
    //   drawTemplate();
    // } else if (e.key === "1") {
    //   selectedBox.align = "left";
    //   drawTemplate();
    // } else if (e.key === "2") {
    //   selectedBox.align = "center";
    //   drawTemplate();
    // } else if (e.key === "3") {
    //   selectedBox.align = "right";
    //   drawTemplate();
    // }
  };

  useEffect(() => {
    drawTemplate();
  }, [template, selectedBox, canvasDimensions]);

  return {
    drawTemplate,
    handleMouseDown,
    handleMouseUp,
    handleMouseMove,
    handleKeyDown,
  };
};
