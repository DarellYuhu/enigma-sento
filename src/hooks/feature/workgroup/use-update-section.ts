import { SentoClient } from "@/lib/sento-client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import { z } from "zod";

export const useUpdateSection = () => {
  const queryClient = useQueryClient();
  const params = useParams();
  return useMutation({
    mutationFn: async ({
      storyId,
      sectionId,
      newImages,
      ...payload
    }: Partial<UpdateSectionSchema> & {
      storyId: string;
      sectionId: string;
      deletedImages?: UpdateSectionSchema["images"];
    }) => {
      const normalized = {
        ...payload,
        texts: payload.texts?.split("\n"),
        images: payload.images?.map(({ url: _, ...image }) => image),
        newImages:
          newImages &&
          (await Promise.all(
            newImages.map(async (image) => {
              const random = Math.floor(Math.random() * 1000);
              const path = `stories/section-${random}/${image.name}`;
              const { data } = await SentoClient.get<{ data: string }>(
                "/storage/upload",
                {
                  params: { path },
                }
              );
              await axios.put(data.data, image);
              return { path, name: image.name };
            })
          )),
      };
      const { data } = await SentoClient.patch(
        `/stories/${storyId}/sections/${sectionId}`,
        normalized
      );
      return data;
    },
    onSuccess() {
      toast.success("Section updated!");
      queryClient.invalidateQueries({
        queryKey: ["projects", params.workgroupId],
      });
    },
    onError(err) {
      if (err instanceof AxiosError)
        return toast.error(err.response?.data.message || err.message);
      toast.error("Something went wrong!");
    },
  });
};

export const updateSectionSchema = z
  .object({
    texts: z.string(),
    textColor: z.string(),
    textBgColor: z.string(),
    textStroke: z.string(),
    textPosition: z.enum(["random", "middle", "bottom"]),
    images: z.array(
      z.object({
        _id: z.string().optional(),
        path: z.string(),
        name: z.string(),
        url: z.string(),
      })
    ),
    newImages: z.array(z.instanceof(File)),
  })
  .refine((data) => data.newImages.length > 0 || data.images.length > 0, {
    message: "At least one image is required",
    path: ["images"],
  });
export type UpdateSectionSchema = z.infer<typeof updateSectionSchema>;
