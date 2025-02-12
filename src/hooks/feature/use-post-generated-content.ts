import { SentoClient } from "@/lib/sento-client";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { toast } from "sonner";
import { z } from "zod";

export const usePostGeneratedContent = () => {
  return useMutation({
    mutationFn: async (payload: PostGeneratedContentBody) => {
      const files = await Promise.all(
        payload.files.map(async (file) => {
          const path = `${payload.storyId}/${file.name}`;
          const { data } = await SentoClient.get<{ data: string }>(
            "/storage/upload",
            {
              params: { path },
            }
          );
          console.log(data.data);
          await axios.put(data.data, file);
          return path;
        })
      );

      const { data } = await SentoClient.post(
        `/stories/${payload.storyId}/content-distribution`,
        { storyId: payload.storyId, files }
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
