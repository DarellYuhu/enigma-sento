type Shape = {
  x: number;
  y: number;
  width: number;
  height: number;
  key: string;
  align: "left" | "center" | "right" | "justify";
  rotation: number;
  type: "rectangle" | "triangle" | "circle" | "text";
  image?: File;
  imagePath?: string;
  value?: string;
  fill?: string;
  fontId?: string;
};

// helper for canvas. exlude from actual data
type AddShapeProp = {
  imageUrl?: string;
};

type CanvasShape = Shape & AddShapeProp;

type Template = {
  dimensions: { width: number; height: number };
  shapes: CanvasShape[];
};

type Layout = {
  id: number;
  name: string;
  creatorId: string;
  creator: { displayName: string };
  template: Template;
  createdAt: string;
  updatedAt: string;
};

type EditingMode = "EDITOR" | "CREATOR";
