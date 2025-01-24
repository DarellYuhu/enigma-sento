import { SentoClient } from "@/lib/sento-client";
import { useMutation } from "@tanstack/react-query";
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
      toast.error(err?.message || "Something went wrong!");
    },
  });
};
