type Shape = {
  x: number;
  y: number;
  width: number;
  height: number;
  key: string;
  align: "left" | "center" | "right" | "justify";
  rotation: number;
  image?: HTMLImageElement;
  type: "rectangle" | "triangle" | "circle" | "text";
  value?: string;
};
