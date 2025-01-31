import { SentoClient } from "@/lib/sento-client";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";
import { z } from "zod";

export const usePostGeneratedContent = () => {
  return useMutation({
    mutationFn: async (payload: PostGeneratedContentBody) => {
      const formData = new FormData();
      payload.files.forEach((file) => {
        formData.append("files", file);
      });
      formData.append("storyId", payload.storyId);
      const { data } = await SentoClient.post(
        `/stories/${payload.storyId}/content-distribution`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      return data;
    },
    onSuccess() {
      toast.success("Content distribution generated");
    },
    onError(err) {
      if (err instanceof AxiosError)
        return toast.error(err.response?.data.message || err.response?.data);
      toast.error("Something went wrong!");
    },
  });
};

export const postGeneratedContentBody = (length: number) =>
  z.object({
    storyId: z.string().trim().min(1, "Required"),
    files: z.array(z.instanceof(File)).length(length),
  });

export type PostGeneratedContentBody = z.infer<
  ReturnType<typeof postGeneratedContentBody>
>;
