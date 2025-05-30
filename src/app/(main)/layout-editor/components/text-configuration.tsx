import { Button } from "@/components/ui/button";
import { ColorPicker } from "@/components/ui/color-picker";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useFonts } from "@/hooks/feature/asset/use-fonts";
import { useCanvasStore } from "@/store/use-canvas-store";
import { AlignCenterIcon, AlignLeftIcon, AlignRightIcon } from "lucide-react";
import { useRef } from "react";
import { useLoadFonts } from "../utils/use-load-fonts";

export const TextConfiguration = () => {
  const { data: fonts } = useFonts();
  const selectContainerRef = useRef<HTMLDivElement>(null);
  const selectedBox = useCanvasStore((state) => state.selectedBox);
  const setTemplate = useCanvasStore((state) => state.setTemplate);
  const setSelectedBox = useCanvasStore((state) => state.setSelectedBox);
  const template = useCanvasStore((state) => state.template);
  const { isFontLoad } = useLoadFonts(fonts?.data);

  if (!selectedBox) return null;
  if (isFontLoad) return <div>Loading fonts...</div>;

  return (
    <>
      <div className="space-y-2">
        {selectedBox && (
          <div className="space-y-1">
            <p className="font-semibold text-sm text-muted-foreground">Key</p>
            <Input
              placeholder="Box key. make it unique!"
              value={selectedBox.key}
              onChange={(e) => {
                if (selectedBox) {
                  const newBox = {
                    ...selectedBox,
                    key: e.target.value.trim(),
                  };
                  setTemplate(
                    template.map((b) => (b === selectedBox ? newBox : b))
                  );
                  setSelectedBox(newBox);
                }
              }}
            />
          </div>
        )}

        {selectedBox?.type === "text" && (
          <>
            <div>
              <p className="text-sm text-muted-foreground">Text</p>
              <Textarea
                rows={6}
                value={selectedBox?.value}
                onChange={(e) => {
                  if (selectedBox) {
                    const newBox = {
                      ...selectedBox,
                      value: e.target.value !== "" ? e.target.value : undefined,
                    };
                    setTemplate(
                      template.map((b) => (b === selectedBox ? newBox : b))
                    );
                    setSelectedBox(newBox);
                  }
                }}
              />
            </div>

            {/* ======= FONT ======= */}
            <div>
              <p className="text-sm text-muted-foreground">Font Family</p>
              <div className="flex">
                <Select
                  value={selectedBox.fontId}
                  onValueChange={(value) => {
                    if (value && selectedBox) {
                      const newBox = {
                        ...selectedBox,
                        fontId: value,
                      };
                      const newTemplate = template.map((b) =>
                        b === selectedBox ? newBox : b
                      );
                      setTemplate(newTemplate);
                      setSelectedBox(newBox);
                    }
                  }}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select font" />
                  </SelectTrigger>
                  <SelectContent
                    side="bottom"
                    style={{ height: 240 }}
                    ref={selectContainerRef}
                  >
                    {fonts?.data.map((font, idx) => (
                      <SelectItem
                        key={idx}
                        value={`font-${idx}`}
                        style={{
                          fontFamily: `font-${idx}`,
                        }}
                      >
                        {font.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button
                  className="ml-2"
                  variant={"outline"}
                  onClick={() => {
                    if (selectedBox) {
                      const newBox = {
                        ...selectedBox,
                        fontId: undefined,
                      };
                      const newTemplate = template.map((b) =>
                        b === selectedBox ? newBox : b
                      );
                      setTemplate(newTemplate);
                      setSelectedBox(newBox);
                    }
                  }}
                >
                  Reset
                </Button>
              </div>
            </div>

            {/* ======= ALIGNMENT ======= */}
            <div>
              <p className="text-sm text-muted-foreground">Alignment</p>
              <ToggleGroup
                className="divide-background inline-flex divide-x"
                type="single"
                value={selectedBox?.align}
                onValueChange={(value) => {
                  if (value && selectedBox) {
                    const newBox = {
                      ...selectedBox,
                      align: value as typeof selectedBox.align,
                    };
                    const newTemplate = template.map((b) =>
                      b === selectedBox ? newBox : b
                    );
                    setTemplate(newTemplate);
                    setSelectedBox(newBox);
                  }
                }}
              >
                <ToggleGroupItem
                  className="bg-primary/80 text-primary-foreground hover:bg-primary hover:text-primary-foreground data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
                  aria-label="Align Left"
                  value="left"
                >
                  <AlignLeftIcon size={16} aria-hidden="true" />
                </ToggleGroupItem>
                <ToggleGroupItem
                  className="bg-primary/80 text-primary-foreground hover:bg-primary hover:text-primary-foreground data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
                  aria-label="Align Center"
                  value="center"
                >
                  <AlignCenterIcon size={16} aria-hidden="true" />
                </ToggleGroupItem>
                <ToggleGroupItem
                  className="bg-primary/80 text-primary-foreground hover:bg-primary hover:text-primary-foreground data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
                  aria-label="Align Right"
                  value="right"
                >
                  <AlignRightIcon size={16} aria-hidden="true" />
                </ToggleGroupItem>
              </ToggleGroup>
            </div>
          </>
        )}

        {/* ======= FILL ======= */}
        <div>
          <p className="text-sm text-muted-foreground">Fill</p>
          <div className="flex">
            <ColorPicker
              value={selectedBox?.fill}
              onChange={(value) => {
                if (value && selectedBox) {
                  const newBox = {
                    ...selectedBox,
                    fill: value,
                  };
                  const newTemplate = template.map((b) =>
                    b === selectedBox ? newBox : b
                  );
                  setTemplate(newTemplate);
                  setSelectedBox(newBox);
                }
              }}
            />
            <Button
              className="ml-2"
              variant={"outline"}
              onClick={() => {
                if (selectedBox) {
                  const newBox = {
                    ...selectedBox,
                    fill: undefined,
                  };
                  const newTemplate = template.map((b) =>
                    b === selectedBox ? newBox : b
                  );
                  setTemplate(newTemplate);
                  setSelectedBox(newBox);
                }
              }}
            >
              Reset
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};
