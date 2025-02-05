import { SentoClient } from "@/lib/sento-client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useParams } from "next/navigation";
import { toast } from "sonner";

export const useGenerateContentDist = () => {
  const params = useParams();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (projectId: string) => {
      const { data } = await SentoClient.post(
        `/project/${projectId}/content-distribution`
      );
      return data;
    },
    onSuccess() {
      toast.success("Content distribution generated!");
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
