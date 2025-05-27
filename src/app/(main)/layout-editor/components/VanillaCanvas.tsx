import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useUpsertLayout } from "@/hooks/feature/layout/use-upsert-layout";
import { Circle, Save, Square, Triangle, Type } from "lucide-react";
import { useRef, useEffect, useState } from "react";
import { AiOutlineColumnHeight, AiOutlineColumnWidth } from "react-icons/ai";

export default function VanillaCanvas() {
  const { mutate, isPending } = useUpsertLayout();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [text, _setText] = useState("");
  const [name, setName] = useState("");
  const [template, setTemplate] = useState<Shape[]>([]);
  const [selectedBox, setSelectedBox] = useState<Shape | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [canvasDimensions, setCanvasDimensions] = useState({
    width: 800,
    height: 600,
  });

  const resizeHandleSize = 8;

  function drawResizeHandle(box: Shape) {
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;
    ctx.fillStyle = "black";
    ctx.fillRect(
      box.x + box.width - resizeHandleSize,
      box.y + box.height - resizeHandleSize,
      resizeHandleSize,
      resizeHandleSize
    );
  }

  function bulkGenerate() {
    const rawText = text.trim();
    const lines = rawText.split("\n");
    let idx = 0;

    function drawNext() {
      if (idx >= lines.length) return;
      const fields = lines[idx].split(",");
      drawTemplate(fields);
      idx++;
      setTimeout(drawNext, 1000);
    }

    drawNext();
  }

  const getMousePos = (evt: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    return (
      rect && {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top,
      }
    );
  };

  function wrapText(
    text: string,
    maxWidth: number,
    ctx: CanvasRenderingContext2D
  ) {
    const words = text.split(" ");
    const lines = [];
    let line = "";

    for (let i = 0; i < words.length; i++) {
      const testLine = line + (line ? " " : "") + words[i];
      const metrics = ctx.measureText(testLine);
      const testWidth = metrics.width;

      if (testWidth > maxWidth && line) {
        lines.push(line);
        line = words[i];
      } else {
        line = testLine;
      }
    }
    if (line) lines.push(line);
    return lines;
  }

  const toLocalCoords = (
    box: {
      width: number;
      height: number;
      x: number;
      y: number;
      rotation: number;
    },
    x: number,
    y: number
  ) => {
    const cx = box.x + box.width / 2;
    const cy = box.y + box.height / 2;
    const angle = (-(box.rotation || 0) * Math.PI) / 180;
    const dx = x - cx;
    const dy = y - cy;
    const rx = dx * Math.cos(angle) - dy * Math.sin(angle);
    const ry = dx * Math.sin(angle) + dy * Math.cos(angle);
    return {
      x: rx + box.width / 2,
      y: ry + box.height / 2,
    };
  };

  function drawTextFit(box: Shape, text: string) {
    let fontSize = 30;
    const padding = 5;
    const maxWidth = box.width - padding * 2;
    const maxHeight = box.height - padding * 2;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.textBaseline = "top";
    ctx.fillStyle = "black";

    // Kurangi fontSize sampai semua baris cukup lebar dan tinggi
    while (fontSize > 5) {
      ctx.font = `${fontSize}px sans-serif`;
      const lines = wrapText(text, maxWidth, ctx);
      const totalHeight = lines.length * fontSize;

      if (totalHeight <= maxHeight) {
        break;
      }
      fontSize--;
    }

    ctx.font = `${fontSize}px sans-serif`;
    const lines = wrapText(text, maxWidth, ctx);
    let startY = padding;

    if (box.align === "center") {
      ctx.textAlign = "center";
    } else if (box.align === "right") {
      ctx.textAlign = "right";
    } else {
      ctx.textAlign = "left";
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

  function saveTemplate() {
    // const serializableTemplate = template.map((box) => ({
    //   ...box,
    //   image: undefined, // Do not save image object
    // }));
    // const json = JSON.stringify(serializableTemplate);
    // const blob = new Blob([json], { type: "application/json" });
    // const a = document.createElement("a");
    // a.href = URL.createObjectURL(blob);
    // a.download = "template.json";
    // a.click();

    mutate({
      template: { dimensions: canvasDimensions, shapes: template },
      name,
    });
  }

  const drawTemplate = (data?: string[]) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!ctx || !canvas) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    template.forEach((box, index) => {
      ctx.save();
      ctx.translate(box.x + box.width / 2, box.y + box.height / 2);
      ctx.rotate(((box.rotation || 0) * Math.PI) / 180);
      ctx.translate(-box.width / 2, -box.height / 2);
      ctx.strokeStyle = box === selectedBox ? "red" : "blue";
      switch (box.type) {
        case "text":
          ctx.strokeRect(0, 0, box.width, box.height);
          const text = data ? data[index] || "" : box.key;
          drawTextFit(box, text);
          break;
        case "rectangle":
          ctx.strokeRect(0, 0, box.width, box.height);
          if (box.image) ctx.drawImage(box.image, 0, 0, box.width, box.height);
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
          if (box.image) {
            ctx.save();
            ctx.clip();
            ctx.drawImage(box.image, 0, 0, box.width, box.height);
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
          if (box.image) {
            ctx.save();
            ctx.clip();
            ctx.beginPath();
            ctx.moveTo(box.width / 2, 0);
            ctx.lineTo(0, box.height);
            ctx.lineTo(box.width, box.height);
            ctx.closePath();
            ctx.clip();
            ctx.drawImage(box.image, 0, 0, box.width, box.height);
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

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
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
    setTemplate((prev) => prev.map((b) => (b === selectedBox ? box : b)));
    setSelectedBox(box);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setIsResizing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLCanvasElement>) => {
    if (!selectedBox) return;

    console.log(e.key);

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
    // } else if (e.key === "c") {
    //   const newBox = {
    //     x: 100,
    //     y: 100,
    //     width: 100,
    //     height: 100,
    //     type: "image-circle",
    //     rotation: 0,
    //   };
    //   template.push(newBox);
    //   selectedBox = newBox;
    //   drawTemplate();
    // } else if (e.key === "t") {
    //   const newBox = {
    //     x: 100,
    //     y: 100,
    //     width: 100,
    //     height: 100,
    //     type: "image-triangle",
    //     rotation: 0,
    //   };
    //   template.push(newBox);
    //   selectedBox = newBox;
    //   drawTemplate();
    // } else if (e.key === "b") {
    //   const newBox = {
    //     x: 100,
    //     y: 100,
    //     width: 100,
    //     height: 80,
    //     type: "image-rect",
    //     rotation: 0,
    //   };
    //   template.push(newBox);
    //   selectedBox = newBox;
    //   drawTemplate();
    // } else if (e.key === "i") {
    //   uploadImageToSelectedBox();
    // }
  };

  const handleCreateShape = (type: Shape["type"]) => {
    const newBox: Shape = {
      x: 0,
      y: 0,
      width: 100,
      height: 100,
      key: `${type}-field${template.length}`,
      align: "left",
      rotation: 0,
      type,
    };
    setTemplate([...template, newBox]);
    setSelectedBox(newBox);
  };

  useEffect(() => {
    drawTemplate();
  }, [template, selectedBox, canvasDimensions]);

  return (
    <>
      <div className="mb-2 space-x-2">
        <button className="border p-2">New Shape</button>
        <button className="border p-2">Upload Gambar</button>
        <button className="border p-2" onClick={saveTemplate}>
          Simpan Template
        </button>
        <button className="border p-2">Muat Template</button>
        <button className="border p-2">Export Gambar</button>
        <button className="border p-2" onClick={bulkGenerate}>
          Bulk Generate
        </button>
      </div>
      <div className="flex flex-row gap-4">
        <canvas
          tabIndex={0}
          ref={canvasRef}
          width={canvasDimensions.width}
          height={canvasDimensions.height}
          className="border rounded-md shadow-md"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onKeyDown={handleKeyDown}
        />
        <Card className="w-full h-fit">
          <CardHeader>
            <CardTitle>Controller</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              placeholder="Layout name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            {/* ========= LAYOUT ========= */}
            <div className="space-y-2">
              <p className="font-semibold text-sm text-muted-foreground">
                Layout
              </p>
              <div className="flex flex-row gap-2">
                <div className="relative">
                  <Input
                    className="peer pe-9"
                    placeholder="Width"
                    type="number"
                    value={canvasDimensions.width}
                    onChange={(e) =>
                      setCanvasDimensions({
                        ...canvasDimensions,
                        width: Number(e.target.value),
                      })
                    }
                  />
                  <div className="text-muted-foreground/80 pointer-events-none absolute inset-y-0 end-0 flex items-center justify-center pe-3 peer-disabled:opacity-50">
                    <AiOutlineColumnWidth size={16} aria-hidden="true" />
                  </div>
                </div>
                <div className="relative">
                  <Input
                    className="peer pe-9"
                    placeholder="Height"
                    type="number"
                    value={canvasDimensions.height}
                    onChange={(e) =>
                      setCanvasDimensions({
                        ...canvasDimensions,
                        height: Number(e.target.value),
                      })
                    }
                  />
                  <div className="text-muted-foreground/80 pointer-events-none absolute inset-y-0 end-0 flex items-center justify-center pe-3 peer-disabled:opacity-50">
                    <AiOutlineColumnHeight size={16} aria-hidden="true" />
                  </div>
                </div>
              </div>
            </div>

            {/* ========= SHAPES ========= */}
            <div className="space-y-2">
              <p className="font-semibold text-sm text-muted-foreground">
                Shapes
              </p>
              <div className="space-x-1">
                <Button
                  size={"icon"}
                  className="size-7"
                  onClick={() => handleCreateShape("text")}
                >
                  <Type />
                </Button>
                <Button
                  size={"icon"}
                  className="size-7"
                  onClick={() => handleCreateShape("rectangle")}
                >
                  <Square />
                </Button>
                <Button
                  size={"icon"}
                  className="size-7"
                  onClick={() => handleCreateShape("circle")}
                >
                  <Circle />
                </Button>
                <Button
                  size={"icon"}
                  className="size-7"
                  onClick={() => handleCreateShape("triangle")}
                >
                  <Triangle />
                </Button>
              </div>
            </div>

            {/* ========= ITEM-CONTROL ========= */}
          </CardContent>
          <CardFooter>
            <Button onClick={saveTemplate} disabled={isPending}>
              <Save />
              Save
            </Button>
          </CardFooter>
        </Card>
      </div>
    </>
  );
}
