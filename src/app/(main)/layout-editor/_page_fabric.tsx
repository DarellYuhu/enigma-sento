"use client";

import { useEffect, useRef, useState } from "react";
import * as fabric from "fabric";
import { Button } from "@/components/ui/button";
import { Circle, Image, Square, Triangle, Type } from "lucide-react";
import { ColorPicker } from "@/components/ui/color-picker";

const ShapeType = ["rect", "circle", "triangle", "text", "image"] as const;

export default function LayoutEditorPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricRef = useRef<fabric.Canvas | null>(null);
  const selectedObjectRef = useRef<fabric.FabricObject | null>(null);

  const handleCreateShape = async (shapeType: (typeof ShapeType)[number]) => {
    const canvas = fabricRef.current;
    if (!canvas) return;
    const center = canvas.getVpCenter();

    let shape: fabric.FabricObject | null = null;

    switch (shapeType) {
      case "rect":
        shape = new fabric.Rect({
          left: center.x,
          top: center.y,
          width: 100,
          height: 100,
          fill: "blue",
          stroke: "black",
          strokeWidth: 1,
        });
        break;
      case "circle":
        shape = new fabric.Circle({
          left: center.x,
          top: center.y,
          fill: "green",
          stroke: "black",
          strokeWidth: 1,
        });
        break;
      case "triangle":
        shape = new fabric.Triangle({
          left: center.x,
          top: center.y,
          width: 100,
          height: 100,
          fill: "yellow",
          stroke: "black",
          strokeWidth: 1,
        });
        break;
      case "text":
        shape = new fabric.Textbox("test", {
          left: center.x,
          top: center.y,
          width: 100,
          height: 100,
          fill: "yellow",
          stroke: "black",
          strokeWidth: 1,
          fontWeight: "bold",
          fontFamily: "Arial",
        });
        break;
      case "image":
        const circle = new fabric.Circle({
          left: center.x,
          top: center.y,
          width: 100,
          height: 100,
          fill: "green",
          backgroundColor: "gray",
          stroke: "black",
          strokeWidth: 1,
        });
        shape = await fabric.FabricImage.fromURL(
          "https://picsum.photos/200/300?grayscale",
          undefined,
          {
            left: center.x,
            top: center.y,
            width: 100,
            height: 100,
            backgroundColor: "gray",
            stroke: "black",
            strokeWidth: 1,
            centeredScaling: true,
            originX: "center",
            originY: "center",
          }
        );
        // shape = await fabric.FabricImage.fromURL(
        //   "https://picsum.photos/200/300?grayscale",
        //   undefined,
        //   {
        //     left: center.x,
        //     top: center.y,
        //     // width: 100,
        //     // height: 100,
        //     backgroundColor: "gray",
        //     stroke: "black",
        //     strokeWidth: 1,
        //     centeredScaling: true,
        //     origin,
        //   }
        // );
        break;
    }

    if (shape) canvas.add(shape);
  };

  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = new fabric.Canvas(canvasRef.current);
    fabricRef.current = canvas;

    const rect = new fabric.Rect({
      left: 100,
      top: 100,
      width: 100,
      height: 100,
      fill: "red",
      stroke: "black",
      strokeWidth: 2,
    });

    canvas.add(rect);
    canvas.on("mouse:down", () => {
      const activeObject = canvas.getActiveObject();
      if (activeObject) selectedObjectRef.current = activeObject;
    });
    addEventListener("keydown", (e) => {
      if (e.key === "Delete") {
        const activeObject = canvas.getActiveObject();
        if (activeObject) canvas.remove(activeObject);
      }
    });
    return () => {
      canvas.dispose();
    };
  }, []);

  return (
    <div className="flex flex-row gap-4 flex-1">
      <canvas
        ref={canvasRef}
        width={800}
        height={600}
        className="shadow-lg shadow-black/4 rounded-md border"
      />

      <div className="flex-grow rounded-md p-4 border shadow-sm">
        <p>Controller</p>
        <div>
          <p>Add Shapes</p>
          <Button size={"icon"} onClick={() => handleCreateShape("rect")}>
            <Square className="size-10" />
          </Button>
          <Button size={"icon"} onClick={() => handleCreateShape("circle")}>
            <Circle className="size-10" />
          </Button>
          <Button size={"icon"} onClick={() => handleCreateShape("triangle")}>
            <Triangle className="size-10" />
          </Button>
          <Button size={"icon"} onClick={() => handleCreateShape("text")}>
            <Type className="size-10" />
          </Button>
          <Button size={"icon"} onClick={() => handleCreateShape("image")}>
            <Image className="size-10" />
          </Button>
        </div>
        <p>Color Settings</p>
        <table>
          <tbody className="p-4">
            <tr>
              <td>Background</td>
              <td className="px-2">:</td>
              <td>
                <ColorPicker
                  onChange={(value) => {
                    const canvas = fabricRef.current;
                    if (!canvas) return;
                    const activeObject = canvas.getActiveObject();
                    if (activeObject) {
                      activeObject.set("fill", value);
                      canvas.renderAll();
                    }
                  }}
                />
              </td>
            </tr>
            <tr>
              <td>Stroke</td>
              <td className="px-2">:</td>
              <td>
                <ColorPicker
                  onChange={(value) => {
                    const canvas = fabricRef.current;
                    if (!canvas) return;
                    const activeObject = canvas.getActiveObject();
                    if (activeObject) {
                      activeObject.set("stroke", value);
                      canvas.renderAll();
                    }
                  }}
                />
              </td>
            </tr>
          </tbody>
        </table>
        <div></div>
      </div>
    </div>
  );
}
