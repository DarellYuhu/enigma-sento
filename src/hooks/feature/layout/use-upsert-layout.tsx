import { uploadFile } from "@/api/storage/action";
import { getUploadUrl } from "@/api/storage/fetch";
import { SentoClient } from "@/lib/sento-client";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { useFonts } from "../asset/use-fonts";
import { useRouter } from "next/navigation";

type Payload = {
  name: string;
  template: {
    dimensions: { width: number; height: number };
    shapes: CanvasShape[];
  };
};

export const useUpsertLayout = () => {
  const { data: session } = useSession();
  const { data: fonts } = useFonts();
  const router = useRouter();

  return useMutation({
    mutationFn: async (payload: Payload) => {
      await Promise.all(
        payload.template.shapes.map(async ({ image, fontId }, idx) => {
          if (image) {
            const fileName = `${Date.now()}-${image.name}`;
            const path = `/layout/${fileName}`;
            const { data } = await getUploadUrl(path);
            await uploadFile(data.data, image);
            payload.template.shapes[idx].imagePath = path;
            payload.template.shapes[idx].image = undefined;
            payload.template.shapes[idx].imageUrl = undefined;
          }
          if (fontId) {
            const font = fonts?.data[+fontId.split("-")[1]];
            payload.template.shapes[idx].fontId = font?._id;
          }
        })
      );
      const { data } = await SentoClient.post("/layouts", {
        ...payload,
        creatorId: session?.user?.id,
      });
      return data;
    },
    onSuccess: () => {
      router.push("/layout-editor");
      toast.success("Layout saved!");
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        return toast.error(err.response?.data.message || err.response?.data);
      }
      toast.error("Something went wrong!");
    },
  });
};
