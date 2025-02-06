import { SentoClient } from "@/lib/sento-client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import { z } from "zod";

export const useCreateStory = () => {
  const queryClient = useQueryClient();
  const params = useParams();

  return useMutation({
    mutationFn: async ({ data: json, ...rest }: CreateStorySchema) => {
      const normalized = {
        ...rest,
        images: json?.flatMap((item) => item.images),
        data: JSON.stringify(
          json?.map(({ images, ...rest }) => ({
            images: images.map((image) => image.name),
            ...rest,
          }))
        ),
      };
      const formData = new FormData();
      formData.append("data", normalized.data);
      formData.append("projectId", normalized.projectId);
      formData.append("type", normalized.type);
      if (normalized.section)
        formData.append("section", normalized.section.toString());
      if (normalized.images)
        normalized.images.forEach((image) => {
          formData.append(`images`, image);
        });
      const { data } = await SentoClient.post("/stories", formData, {
        headers: { "Content-Type": "multipart/form-data" },
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
        return toast.error(err.response?.data.message || err.response?.data);
      toast.error("Something went wrong!");
    },
  });
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
          textPosition: z.enum(["random", "middle", "bottom"]),
          images: z
            .array(
              z
                .instanceof(File)
                .refine(
                  (file) =>
                    file.type === "image/jpeg" || file.type === "image/png"
                )
            )
            .min(1),
        })
      )
      .optional(),
  })
  .refine((data) => Number(data.section) === data.data?.length, {
    message: "Number of sections must match number of sections",
    path: ["section"],
  });
export type CreateStorySchema = z.infer<typeof createStorySchema>;
