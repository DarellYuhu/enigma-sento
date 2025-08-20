import { SentoClient } from "@/lib/sento-client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import { z } from "zod";

export const useEditStory = () => {
  const params = useParams();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: UpdateStoryBody) => {
      const { data } = await SentoClient.patch(
        `/stories/${payload.storyId}`,
        payload,
      );
      return data;
    },
    onSuccess() {
      toast.success("Story updated!");
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

export const updateStoryBody = z.object({
  storyId: z.string().trim().min(1, "Required"),
  captions: z.array(z.string()).optional(),
  hashtags: z.string().optional(),
});

export type UpdateStoryBody = z.infer<typeof updateStoryBody>;
