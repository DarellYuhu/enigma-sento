import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AiOutlineColumnHeight, AiOutlineColumnWidth } from "react-icons/ai";
import { useUpsertLayout } from "@/hooks/feature/layout/use-upsert-layout";
import { useCanvasStore } from "@/store/use-canvas-store";
import { FileUploader } from "@/components/ui/file-uploader";
import { TextConfiguration } from "./text-configuration";
import { Circle, Plus, Save, Square, Triangle, Type } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const EditingPanel = ({ id }: { id?: number }) => {
  const { mutate, isPending } = useUpsertLayout();
  const name = useCanvasStore((state) => state.name);
  const template = useCanvasStore((state) => state.template);
  const selectedBox = useCanvasStore((state) => state.selectedBox);
  const canvasDimensions = useCanvasStore((state) => state.canvasDimensions);
  const setName = useCanvasStore((state) => state.setName);
  const setTemplate = useCanvasStore((state) => state.setTemplate);
  const setSelectedBox = useCanvasStore((state) => state.setSelectedBox);
  const resetStore = useCanvasStore((state) => state.resetStore);
  const setCanvasDimensions = useCanvasStore(
    (state) => state.setCanvasDimensions
  );

  function saveTemplate() {
    const payload = {
      template: {
        dimensions: {
          width: canvasDimensions.width,
          height: canvasDimensions.height,
        },
        shapes: structuredClone(template),
      },
      name,
    };
    mutate({ ...payload, id }, { onSuccess: resetStore });
  }

  const handleCreateShape = (type: Shape["type"]) => {
    const newBox: CanvasShape = {
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

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Template Editor</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px]">
          <div className="space-y-4">
            <Input
              placeholder="Layout name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            {/* ========= LAYOUT ========= */}
            <div className="space-y-1">
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
                        width: +e.target.value,
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
                        height: +e.target.value,
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
            <div className="space-y-1">
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

            <Separator className="w-full" />

            {/* ========= ITEM-CONTROL ========= */}
            <div className="space-y-1">
              <TextConfiguration />
            </div>

            {/* ======= IMAGE ======= */}
            <div className="space-y-1">
              {selectedBox && selectedBox?.type !== "text" && (
                <div>
                  <p className="text-sm text-muted-foreground">Image</p>
                  <FileUploader
                    value={
                      selectedBox?.image ? [selectedBox?.image as File] : []
                    }
                    onValueChange={(val) => {
                      if (val && selectedBox) {
                        const image = val[0] ? val[0] : undefined;
                        const newBox = {
                          ...selectedBox,
                          image,
                          imageUrl: image
                            ? URL.createObjectURL(image)
                            : undefined,
                        };
                        const newTemplate = template.map((b) =>
                          b === selectedBox ? newBox : b
                        );
                        setTemplate(newTemplate);
                        setSelectedBox(newBox);
                      }
                    }}
                  />
                </div>
              )}
              <div className="hidden">
                {template
                  .filter((shape) => shape.image)
                  .map((shape, idx) => (
                    <img
                      id={`image-${shape.key}`}
                      src={shape.imageUrl}
                      alt="story_img"
                      key={idx}
                    />
                  ))}
              </div>
            </div>
          </div>
        </ScrollArea>
      </CardContent>

      <CardFooter>
        <Button onClick={saveTemplate} disabled={isPending}>
          <Save />
          Save
        </Button>
      </CardFooter>
    </Card>
  );
};
