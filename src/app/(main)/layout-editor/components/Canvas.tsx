// "use client";

// import { Button } from "@/components/ui/button";
// import { ColorPicker } from "@/components/ui/color-picker";
// import Konva from "konva";
// import { Circle as LucideCircle, Square, Triangle, Type } from "lucide-react";
// import { useEffect, useRef, useState } from "react";
// import {
//   Layer,
//   Rect,
//   Stage,
//   Transformer,
//   Circle,
//   RegularPolygon,
//   Text,
// } from "react-konva";
// import { v4 as uuidv4 } from "uuid";
// import useImage from "use-image";
// import { fitTextToBox } from "../utils";
// import { Input } from "@/components/ui/input";

// type ShapeType = "rect" | "circle" | "triangle" | "text" | "image";
// const scaleBackup = 1;

// export function Canvas() {
//   const [dummyImage] = useImage(
//     "https://fastly.picsum.photos/id/237/200/300.jpg?hmac=TmmQSbShHz9CdQm0NkEjx1Dyh_Y984R9LpNrpvH2D_U",
//     "anonymous"
//   );
//   const [dummyImage2] = useImage(
//     "https://fastly.picsum.photos/id/969/200/300.jpg?grayscale&hmac=tJeH80nlcd-FSvljrVcDuolm-Lsv4qkz8xNdB-j_DCw",
//     "anonymous"
//   );
//   const [dummyImage3] = useImage(
//     "https://fastly.picsum.photos/id/969/200/300.jpg?grayscale&hmac=tJeH80nlcd-FSvljrVcDuolm-Lsv4qkz8xNdB-j_DCw",
//     "anonymous"
//   );
//   const transformerRef = useRef<Konva.Transformer | null>(null);
//   const selectionStart = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
//   const shapeRefs = useRef<Map<string, any>>(new Map());
//   const [selectedIds, setSelectedIds] = useState<string[]>([]);
//   const [shapes, setShapes] = useState<
//     (Konva.ShapeConfig | Konva.RegularPolygonConfig)[]
//   >([]);
//   const [selectionBox, setSelectionBox] = useState<{
//     visible: boolean;
//     x: number;
//     y: number;
//     width: number;
//     height: number;
//   }>({ visible: false, x: 0, y: 0, width: 0, height: 0 });

//   const handleMouseDown = (e: Konva.KonvaEventObject<MouseEvent>) => {
//     if (e.target === e.target.getStage()) {
//       const { x, y } = e.target.getStage().getPointerPosition()!;
//       selectionStart.current = { x, y };
//       setSelectionBox({ visible: true, x, y, width: 0, height: 0 });
//     }
//   };

//   const handleMouseMove = (e: Konva.KonvaEventObject<MouseEvent>) => {
//     if (!selectionBox.visible) return;

//     const vector = e.target.getStage()?.getPointerPosition();
//     const sx = selectionStart.current.x;
//     const sy = selectionStart.current.y;

//     setSelectionBox({
//       visible: true,
//       x: Math.min(vector!.x, sx),
//       y: Math.min(vector!.y, sy),
//       width: Math.abs(vector!.x - sx),
//       height: Math.abs(vector!.y - sy),
//     });
//   };

//   const handleMouseUp = () => {
//     if (!selectionBox.visible) return;

//     const box = selectionBox;
//     const selected = shapes.filter((shape) => {
//       const node = shapeRefs.current.get(shape.id!);
//       return Konva.Util.haveIntersection(
//         {
//           x: box.x,
//           y: box.y,
//           width: box.width,
//           height: box.height,
//         },
//         node.getClientRect()
//       );
//     });
//     setSelectedIds(selected.map((s) => s.id!));
//     setSelectionBox({ ...selectionBox, visible: false });
//   };

//   const handleAddShape = (type: ShapeType) => {
//     const scale =
//       dummyImage && Math.max(100 / dummyImage.width, 100 / dummyImage.height);

//     const newShape: (typeof shapes)[0] = {
//       id: uuidv4(),
//       type,
//       draggable: true,
//       x: 100,
//       y: 100,
//       stroke: "black",
//       strokeWidth: 1,
//       fillPatternScale: scale ? { x: scale, y: scale } : undefined,
//     };

//     switch (type) {
//       case "rect":
//         Object.assign(newShape, {
//           fillPatternImage: dummyImage,
//           width: 100,
//           height: 100,
//         });
//         break;
//       case "circle":
//         Object.assign(newShape, {
//           fillPatternImage: dummyImage2,
//           fillPatternOffset: { x: 100, y: 100 },
//           fillPatternRepeat: "no-repeat",
//           radius: 50,
//         });
//         break;
//       case "triangle":
//         Object.assign(newShape, {
//           fillPatternImage: dummyImage3,
//           fillPatternOffset: { x: 100, y: 100 },
//           fillPatternRepeat: "no-repeat",
//           points: [0, 50, 50, 0, 100, 50],
//           sides: 3,
//           radius: 50,
//         });
//         break;
//       case "text":
//         Object.assign(newShape, {
//           text: "Hello Konva",
//         });
//     }

//     setShapes([...shapes, newShape]);
//   };

//   const _handleTransform = (node: Konva.Shape) => {
//     const image = node.fillPatternImage();
//     const scale = Math.max(
//       node.width() / image.width,
//       node.height() / image.height
//     );
//     node.fillPatternScale({ x: scale, y: scale });
//   };

//   const handleKeyDown = (e: KeyboardEvent) => {
//     if (
//       (e.key === "Delete" || e.key === "Backspace") &&
//       selectedIds.length > 0
//     ) {
//       setShapes((prev) =>
//         prev.filter((shape) => !selectedIds.includes(shape.id!))
//       );
//       setSelectedIds([]);
//     }
//   };

//   useEffect(() => {
//     if (transformerRef.current) {
//       const nodes = selectedIds
//         .map((id) => shapeRefs.current.get(id))
//         .filter(Boolean);
//       transformerRef.current.nodes(nodes);
//       transformerRef.current.getLayer()?.batchDraw();
//     }

//     addEventListener("keydown", handleKeyDown);

//     return () => removeEventListener("keydown", handleKeyDown);
//   }, [selectedIds]);

//   return (
//     <div className="flex flex-row gap-4">
//       <div className="shadow-md rounded-md border">
//         <Stage
//           width={800}
//           height={600}
//           onMouseDown={handleMouseDown}
//           onMouseMove={handleMouseMove}
//           onMouseUp={handleMouseUp}
//         >
//           <Layer>
//             {shapes.map((shape) => {
//               switch (shape.type) {
//                 case "rect":
//                   return (
//                     <Rect
//                       key={shape.id}
//                       {...shape}
//                       ref={(node) => {
//                         if (node) shapeRefs.current.set(shape.id!, node);
//                       }}
//                     />
//                   );
//                 case "circle":
//                   return (
//                     <Circle
//                       key={shape.id}
//                       {...shape}
//                       ref={(node) => {
//                         if (node) shapeRefs.current.set(shape.id!, node);
//                       }}
//                     />
//                   );
//                 case "triangle":
//                   return (
//                     <RegularPolygon
//                       key={shape.id}
//                       {...shape}
//                       sides={shape.sides}
//                       radius={shape.radius}
//                       ref={(node) => {
//                         if (node) shapeRefs.current.set(shape.id!, node);
//                       }}
//                     />
//                   );
//                 case "text":
//                   const fitted = fitTextToBox(
//                     shape.text,
//                     { height: shape.height!, width: shape.width! },
//                     "left"
//                   );
//                   return (
//                     <Text
//                       key={shape.id}
//                       {...shape}
//                       {...fitted}
//                       ref={(node) => {
//                         if (node) shapeRefs.current.set(shape.id!, node);
//                       }}
//                     />
//                   );
//               }
//             })}

//             {selectionBox.visible && (
//               <Rect
//                 x={selectionBox.x}
//                 y={selectionBox.y}
//                 width={selectionBox.width}
//                 height={selectionBox.height}
//                 fill="rgba(0,161,255,0.2)"
//                 stroke="blue"
//                 dash={[4, 4]}
//               />
//             )}
//             <Transformer
//               ref={transformerRef}
//               rotateEnabled={true}
//               ignoreStroke={true}
//               keepRatio={true}
//               enabledAnchors={[
//                 "top-left",
//                 "top-right",
//                 "bottom-left",
//                 "bottom-right",
//                 "middle-left",
//                 "middle-right",
//                 "top-center",
//                 "bottom-center",
//               ]}
//               boundBoxFunc={(oldBox, newBox) => {
//                 return newBox.width < 20 || newBox.height < 20
//                   ? oldBox
//                   : newBox;
//               }}
//             />
//           </Layer>
//         </Stage>
//       </div>
//       <div className="flex-grow rounded-md p-4 border shadow-sm">
//         <p>Controller</p>
//         <div>
//           <p>Add Shapes</p>
//           <Button size={"icon"} onClick={() => handleAddShape("rect")}>
//             <Square className="size-10" />
//           </Button>
//           <Button size={"icon"} onClick={() => handleAddShape("circle")}>
//             <LucideCircle className="size-10" />
//           </Button>
//           <Button size={"icon"} onClick={() => handleAddShape("triangle")}>
//             <Triangle className="size-10" />
//           </Button>
//           <Button size={"icon"} onClick={() => handleAddShape("text")}>
//             <Type className="size-10" />
//           </Button>
//         </div>
//         <p>Color Settings</p>
//         <table>
//           <tbody className="p-4">
//             <tr>
//               <td>Background</td>
//               <td className="px-2">:</td>
//               <td>
//                 <ColorPicker />
//               </td>
//             </tr>
//             <tr>
//               <td>Stroke</td>
//               <td className="px-2">:</td>
//               <td>
//                 <ColorPicker />
//               </td>
//             </tr>
//           </tbody>
//         </table>
//         <div>
//           <Input
//             onChange={(v) => {
//               (
//                 shapeRefs.current?.get(selectedIds[0]) as Konva.TextConfig
//               )?.text(v.target.value);
//             }}
//           />
//         </div>
//       </div>
//     </div>
//   );
// }
