import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Font } from "@/hooks/feature/asset/use-fonts";
import { useLoadFonts } from "../utils/use-load-fonts";
import { useQuery } from "@tanstack/react-query";
import { SentoClient } from "@/lib/sento-client";
import { FileUploader } from "@/components/ui/file-uploader";
import { useCollections } from "@/hooks/feature/asset/use-collections";
import { shuffle } from "lodash";
import { useEffect, useState } from "react";
import { useImage } from "@/hooks/feature/asset/use-image";
import { createImgTag } from "../utils";
import { useCanvasStore } from "@/store/use-canvas-store";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const CreativePanel = ({ value }: { value: Layout }) => {
  const fontId = value.template.shapes
    .map((shape) => shape.fontId)
    .filter(Boolean);
  const { data: fonts } = useQuery({
    queryKey: ["fonts", { fontId }],
    queryFn: async () => {
      const { data } = await SentoClient<{ data: Font[] }>("/assets/fonts", {
        params: { fontId },
      });
      return data;
    },
    enabled: !!fontId && fontId.length > 0,
  });

  useLoadFonts(fonts?.data);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Creative</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {value.template.shapes.map((shape, idx) => (
          <div key={idx} className="border p-2 rounded-md space-y-4">
            <p className="text-sm text-muted-foreground font-semibold">
              {shape.key}
            </p>
            <div className="space-y-2">
              {shape.type === "text" && !shape.value && <FileUploader />}
              {/* {shape.type === "text" && !shape.fill && <ColorDialogSelection />} */}
              {shape.type !== "text" && !shape.imageUrl && !shape.fill && (
                <ImageSelection shape={shape} />
              )}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

const ImageSelection = ({ shape }: { shape: CanvasShape }) => {
  const template = useCanvasStore((state) => state.template);
  const setTemplate = useCanvasStore((state) => state.setTemplate);
  const [selectedId, setSelectedId] = useState<string>();
  const { data: collections } = useCollections({ type: "IMAGE" });
  const { data: image } = useImage(selectedId);

  const handleValueChange = (val: string) => {
    const collection = collections?.data.find((c) => c._id === val);
    const selected = shuffle(collection?.assets)[0];
    setSelectedId(selected);
  };

  useEffect(() => {
    if (image) {
      createImgTag(shape.key, image.data.url);
      const newShapes = template.map((shape) =>
        shape.key === shape.key ? { ...shape, imageUrl: image.data.url } : shape
      );
      setTemplate(newShapes);
    }
  }, [image]);

  return (
    <Select onValueChange={handleValueChange}>
      <SelectTrigger>
        <SelectValue placeholder="Select an image collection" />
      </SelectTrigger>
      <SelectContent>
        {collections?.data.map((collection, idx) => (
          <SelectItem key={idx} value={collection._id}>
            {collection.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

// const ColorSelection = () => {
//   const { data: colors } = useColors();
//   return (
//     <Dialog>
//       <DialogTrigger>Open</DialogTrigger>
//       <DialogContent>
//         <DialogHeader>
//           <DialogTitle>Select a color </DialogTitle>
//           <DialogDescription>
//             This action cannot be undone. This will permanently delete your
//             account and remove your data from our servers.
//           </DialogDescription>
//         </DialogHeader>
//       </DialogContent>
//     </Dialog>
//   );
// };
