"use client";

import { Button } from "@/components/ui/button";
import { ColorPicker } from "@/components/ui/color-picker";
import Konva from "konva";
import {
  Circle as LucideCircle,
  Image as LucideImage,
  Square,
  Triangle,
  Type,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import {
  Layer,
  Rect,
  Stage,
  Transformer,
  Circle,
  Shape,
  RegularPolygon,
} from "react-konva";
import { v4 as uuidv4 } from "uuid";
import useImage from "use-image";

const SHAPE_TYPES = ["rect", "circle", "triangle", "text", "image"] as const;
type ShapeType = (typeof SHAPE_TYPES)[number];

export default function LayoutEditorPage() {
  const [dummyImage] = useImage(
    "https://fastly.picsum.photos/id/237/200/300.jpg?hmac=TmmQSbShHz9CdQm0NkEjx1Dyh_Y984R9LpNrpvH2D_U",
    "anonymous"
  );
  const transformerRef = useRef<Konva.Transformer | null>(null);
  const selectionStart = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const shapeRefs = useRef<Map<string, any>>(new Map());
  const [shapes, setShapes] = useState<Konva.ShapeConfig[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [selectionBox, setSelectionBox] = useState<{
    visible: boolean;
    x: number;
    y: number;
    width: number;
    height: number;
  }>({ visible: false, x: 0, y: 0, width: 0, height: 0 });

  const handleMouseDown = (e: Konva.KonvaEventObject<MouseEvent>) => {
    if (e.target === e.target.getStage()) {
      const { x, y } = e.target.getStage().getPointerPosition()!;
      selectionStart.current = { x, y };
      setSelectionBox({ visible: true, x, y, width: 0, height: 0 });
    }
  };

  const handleMouseMove = (e: any) => {
    if (!selectionBox.visible) return;

    const { x, y } = e.target.getStage().getPointerPosition();
    const sx = selectionStart.current.x;
    const sy = selectionStart.current.y;

    setSelectionBox({
      visible: true,
      x: Math.min(x, sx),
      y: Math.min(y, sy),
      width: Math.abs(x - sx),
      height: Math.abs(y - sy),
    });
  };

  const handleMouseUp = () => {
    if (!selectionBox.visible) return;

    const box = selectionBox;
    const selected = shapes.filter((shape) => {
      const node = shapeRefs.current.get(shape.id!);
      console.log(node);
      return Konva.Util.haveIntersection(
        {
          x: box.x,
          y: box.y,
          width: box.width,
          height: box.height,
        },
        node.getClientRect()
      );
    });
    setSelectedIds(selected.map((s) => s.id!));
    setSelectionBox({ ...selectionBox, visible: false });
  };

  const handleAddShape = (type: ShapeType) => {
    const newShape: Konva.ShapeConfig = {
      id: uuidv4(),
      type,
      draggable: true,
    };
    switch (type) {
      case "rect":
        newShape.fillPatternImage = dummyImage;
        newShape.x = 100;
        newShape.y = 100;
        newShape.width = 100;
        newShape.height = 100;
        newShape.stroke = "black";
        newShape.strokeWidth = 1;
        break;
      case "circle":
        newShape.x = 100;
        newShape.y = 100;
        newShape.radius = 50;
        newShape.fill = "green";
        newShape.stroke = "black";
        newShape.strokeWidth = 1;
        break;
      case "triangle":
        newShape.x = 100;
        newShape.y = 100;
        newShape.points = [0, 50, 50, 0, 100, 50];
        newShape.fill = "red";
        newShape.stroke = "black";
        newShape.strokeWidth = 1;
        break;
    }
    setShapes([...shapes, newShape]);
  };

  useEffect(() => {
    if (transformerRef.current) {
      const nodes = selectedIds
        .map((id) => shapeRefs.current.get(id))
        .filter(Boolean);
      transformerRef.current.nodes(nodes);
      transformerRef.current.getLayer()?.batchDraw();
    }
  }, [selectedIds]);

  return (
    <div className="flex flex-row gap-4">
      <div className="shadow-md rounded-md">
        <Stage
          width={800}
          height={600}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
        >
          <Layer>
            {shapes.map((shape, idx) => {
              switch (shape.type) {
                case "rect":
                  return (
                    <Rect
                      key={shape.id}
                      {...shape}
                      ref={(node) => {
                        if (node) shapeRefs.current.set(shape.id!, node);
                      }}
                    />
                  );
                case "circle":
                  return (
                    <Circle
                      key={shape.id}
                      {...shape}
                      ref={(node) => {
                        if (node) shapeRefs.current.set(shape.id!, node);
                      }}
                    />
                  );
                case "triangle":
                  return (
                    <Shape
                      key={shape.id}
                      {...shape}
                      ref={(node) => {
                        if (node) shapeRefs.current.set(shape.id!, node);
                      }}
                    />
                  );
              }
            })}

            {selectionBox.visible && (
              <Rect
                x={selectionBox.x}
                y={selectionBox.y}
                width={selectionBox.width}
                height={selectionBox.height}
                fill="rgba(0,161,255,0.2)"
                stroke="blue"
                dash={[4, 4]}
              />
            )}
            <Transformer
              ref={transformerRef}
              rotateEnabled={true}
              ignoreStroke={true}
              enabledAnchors={[
                "top-left",
                "top-right",
                "bottom-left",
                "bottom-right",
                "middle-left",
                "middle-right",
                "top-center",
                "bottom-center",
              ]}
              boundBoxFunc={(oldBox, newBox) => {
                return newBox.width < 20 || newBox.height < 20
                  ? oldBox
                  : newBox;
              }}
            />
          </Layer>
        </Stage>
      </div>
      <div className="flex-grow rounded-md p-4 border shadow-sm">
        <p>Controller</p>
        <div>
          <p>Add Shapes</p>
          <Button size={"icon"} onClick={() => handleAddShape("rect")}>
            <Square className="size-10" />
          </Button>
          <Button size={"icon"} onClick={() => handleAddShape("circle")}>
            <LucideCircle className="size-10" />
          </Button>
          <Button size={"icon"} onClick={() => handleAddShape("triangle")}>
            <Triangle className="size-10" />
          </Button>
          <Button size={"icon"}>
            <Type className="size-10" />
          </Button>
          <Button size={"icon"}>
            <LucideImage className="size-10" />
          </Button>
        </div>
        <p>Color Settings</p>
        <table>
          <tbody className="p-4">
            <tr>
              <td>Background</td>
              <td className="px-2">:</td>
              <td>
                <ColorPicker />
              </td>
            </tr>
            <tr>
              <td>Stroke</td>
              <td className="px-2">:</td>
              <td>
                <ColorPicker />
              </td>
            </tr>
          </tbody>
        </table>
        <div></div>
      </div>
    </div>
  );
}
