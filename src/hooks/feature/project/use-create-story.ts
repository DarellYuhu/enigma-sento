import { SentoClient } from "@/lib/sento-client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import { z } from "zod";

export const useCreateStory = () => {
  const queryClient = useQueryClient();
  const params = useParams();

  return useMutation({
    mutationFn: async ({ data: sections, ...rest }: CreateStorySchema) => {
      let sectionPayload:
        | (Omit<CreateStorySchema["data"], "images"> & {
            images: { path: string; name: string }[];
          })[]
        | undefined = undefined;
      if (sections) {
        sectionPayload = await Promise.all(
          sections.map(async ({ images, ...sectionProps }, sectionIdx) => ({
            ...sectionProps,
            images: await getImages(images, sectionIdx),
          }))
        );
      }

      const { data } = await SentoClient.post("/stories", {
        ...rest,
        data: sectionPayload,
      });
      return data;
    },
    onSuccess() {
      toast.success("Story created!");
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

const getImages = async (
  images: string | File[],
  sectionIdx: number
): Promise<{ name: string; path: string }[]> => {
  if (typeof images === "string") {
    const { data } = await SentoClient.get<{
      data: { path: string; name: string }[];
    }>("/assets/images", { params: { collectionId: images } });
    return data.data.map((item) => ({
      ...item,
      path: item.path.replace("assets/", ""),
    }));
  }
  return await Promise.all(
    images.map(async (image) => {
      const path = `stories/section-${sectionIdx}/${image.name}`;
      const { data } = await SentoClient.get<{ data: string }>(
        "/storage/upload",
        {
          params: { path },
        }
      );
      await axios.put(data.data, image);
      return { path, name: image.name };
    })
  );
};

export const createStorySchema = z
  .object({
    section: z
      .string()
      .regex(/^[0-9]+$/i, "Section must be a number")
      .transform((value) => parseInt(value, 10))
      .optional(),
    type: z.enum(["USER_GENERATE", "SYSTEM_GENERATE"]),
    projectId: z.string().trim().min(1, "Required"),
    data: z
      .array(
        z.object({
          texts: z.string().transform((value) => value.split("\n")),
          textColor: z.string(),
          textBgColor: z.string(),
          textStroke: z.string(),
          textPosition: z.enum(["random", "middle", "bottom"]),
          imageType: z.enum(["Upload", "Collection"]),
          images: z.union([
            z.string(),
            z
              .array(
                z
                  .instanceof(File)
                  .refine(
                    (file) =>
                      file.type === "image/jpeg" || file.type === "image/png"
                  )
              )
              .min(1),
          ]),
        })
      )
      .optional(),
  })
  .refine((data) => Number(data.section) === data.data?.length, {
    message: "Number of sections must match number of sections",
    path: ["section"],
  });
export type CreateStorySchema = z.infer<typeof createStorySchema>;
