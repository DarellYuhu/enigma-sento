"use client";

import { useEffect } from "react";
import { CreativePanel } from "./creative-panel";
import { useCanvasStore } from "@/store/use-canvas-store";
import { EditingPanel } from "./editing-panel";
import { CanvasLayout } from "./canvas-layout";
import { useRouter } from "next/navigation";

export default function VanillaCanvas({
  value,
  mode,
  name,
}: {
  value?: Layout;
  name?: string;
  id?: number;
  mode: "EDITOR" | "CREATOR";
}) {
  const router = useRouter();
  const resetStore = useCanvasStore((state) => state.resetStore);
  const setTemplate = useCanvasStore((state) => state.setTemplate);
  const setSelectedBox = useCanvasStore((state) => state.setSelectedBox);
  const setName = useCanvasStore((state) => state.setName);
  const setCanvasDimensions = useCanvasStore(
    (state) => state.setCanvasDimensions
  );

  const loadTemplate = (value: Layout) => {
    setTemplate(value.template.shapes);
    setSelectedBox(null);
    setCanvasDimensions({
      width: value.template.dimensions.width,
      height: value.template.dimensions.height,
    });
  };

  useEffect(() => {
    if (value) {
      value.template.shapes.map((item) => {
        {
          if (item.imageUrl) {
            const oldTag = document.getElementById(`image-${item.key}`);
            if (oldTag) oldTag.remove();
            const img = new Image();
            img.src = item.imageUrl;
            img.id = `image-${item.key}`;
            img.alt = `image-${item.key}`;
            img.className = "hidden";
            document.body.appendChild(img);
          }
        }
      });
      loadTemplate(value);
    }
    if (name) setName(name);
  }, [value, name]);

  useEffect(() => {
    resetStore();
    router.refresh();
  }, []);

  return (
    <div className="flex flex-row gap-4">
      <CanvasLayout mode={mode} />
      <div className="space-y-4 flex-1">
        {mode === "EDITOR" && <EditingPanel id={value?.id} />}

        {mode === "CREATOR" && value && (
          <CreativePanel value={structuredClone(value)} />
        )}
      </div>
    </div>
  );
}
