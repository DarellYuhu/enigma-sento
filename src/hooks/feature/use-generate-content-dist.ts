import { SentoClient } from "@/lib/sento-client";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";

export const useGenerateContentDist = () => {
  return useMutation({
    mutationFn: async (projectId: string) => {
      const { data } = await SentoClient.post(
        `/project/${projectId}/content-distribution`
      );
      return data;
    },
    onSuccess() {
      toast.success("Content distribution generated!");
    },
    onError(err) {
      if (err instanceof AxiosError)
        return toast.error(err.response?.data.message || err.response?.data);
      toast.error("Something went wrong!");
    },
  });
};
