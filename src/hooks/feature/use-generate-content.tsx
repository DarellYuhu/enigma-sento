import { SentoClient } from "@/lib/sento-client";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";

export const useGenerateContent = () => {
  return useMutation({
    mutationFn: async (storyId: string) => {
      const { data } = await SentoClient.patch(`/stories/${storyId}/contents`);
      return data;
    },
    onSuccess() {
      toast.success("Content generated!");
    },
    onError(err) {
      if (err instanceof AxiosError)
        return toast.error(err.response?.data.message || err.response?.data);
      toast.error("Something went wrong!");
    },
  });
};
