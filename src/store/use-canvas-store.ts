import { create } from "zustand";

type States = {
  mode: EditingMode;
  canvasRef: HTMLCanvasElement | null;
  name: string;
  template: CanvasShape[];
  selectedBox: CanvasShape | null;
  isDragging: boolean;
  isResizing: boolean;
  dragOffset: { x: number; y: number };
  canvasDimensions: { width: number; height: number };
};

type Actions = {
  resetStore: () => void;
  setMode: (mode: EditingMode) => void;
  setName: (name: string) => void;
  setTemplate: (template: CanvasShape[]) => void;
  setCanvasRef: (canvasRef: HTMLCanvasElement | null) => void;
  setSelectedBox: (selectedBox: CanvasShape | null) => void;
  setIsDragging: (isDragging: boolean) => void;
  setIsResizing: (isResizing: boolean) => void;
  setDragOffset: (dragOffset: { x: number; y: number }) => void;
  setCanvasDimensions: (canvasDimensions: {
    width: number;
    height: number;
  }) => void;
};

const initialStates: States = {
  mode: "EDITOR",
  canvasRef: null,
  name: "",
  template: [],
  selectedBox: null,
  isDragging: false,
  isResizing: false,
  dragOffset: { x: 0, y: 0 },
  canvasDimensions: { width: 800, height: 600 },
};

export const useCanvasStore = create<States & Actions>((set) => ({
  ...initialStates,
  resetStore() {
    set(initialStates);
  },
  setMode(mode) {
    set({ mode });
  },
  setCanvasRef(canvasRef) {
    set({ canvasRef });
  },
  setName(name) {
    set({ name });
  },
  setTemplate(template) {
    set({ template });
  },
  setSelectedBox(selectedBox) {
    set({ selectedBox });
  },
  setIsDragging(isDragging) {
    set({ isDragging });
  },
  setIsResizing(isResizing) {
    set({ isResizing });
  },
  setDragOffset(dragOffset) {
    set({ dragOffset });
  },
  setCanvasDimensions(canvasDimensions) {
    set({ canvasDimensions });
  },
}));
