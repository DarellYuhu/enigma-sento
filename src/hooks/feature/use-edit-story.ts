import { SentoClient } from "@/lib/sento-client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import { z } from "zod";

export const useEditStory = () => {
  const params = useParams();
  const { invalidateQueries } = useQueryClient();

  return useMutation({
    mutationFn: async (payload: UpdateStoryBody) => {
      const { data } = await SentoClient.patch(
        `/stories/${payload.storyId}`,
        payload
      );
      return data;
    },
    onSuccess() {
      toast.success("Story updated!");
      invalidateQueries({ queryKey: ["projects", params.workgroupId] });
    },
    onError(err) {
      toast.error(err?.message || "Something went wrong!");
    },
  });
};

export const updateStoryBody = z.object({
  storyId: z.string().trim().min(1, "Required"),
  captions: z
    .string()
    .transform((value) => value.split("\n"))
    .optional(),
  hashtags: z.string().optional(),
});

export type UpdateStoryBody = z.infer<typeof updateStoryBody>;
