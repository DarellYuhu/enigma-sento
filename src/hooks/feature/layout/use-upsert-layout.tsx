import { uploadFile } from "@/api/storage/action";
import { getUploadUrl } from "@/api/storage/fetch";
import { SentoClient } from "@/lib/sento-client";
import { useMutation } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

type Payload = {
  name: string;
  template: {
    dimensions: { width: number; height: number };
    shapes: Shape[];
  };
};

export const useUpsertLayout = () => {
  const { data: session } = useSession();

  return useMutation({
    mutationFn: async (payload: Payload) => {
      await Promise.all(
        payload.template.shapes
          .map(async ({ image }, idx) => {
            if (!image) return null;
            const path = `/layout/${(image as File)?.name}`;
            const { data } = await getUploadUrl(path);
            await uploadFile(data.data, (image as File)!);
            payload.template.shapes[idx].imagePath = path;
            payload.template.shapes[idx].image = undefined;
          })
          .filter(Boolean)
      );
      const { data } = await SentoClient.post("/layouts", {
        ...payload,
        creatorId: session?.user?.id,
      });
      return data;
    },
    onSuccess: () => {
      toast.success("Layout saved!");
    },
    onError: () => {
      toast.error("Something went wrong!");
    },
  });
};
