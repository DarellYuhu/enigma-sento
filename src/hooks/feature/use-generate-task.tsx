import { SentoClient } from "@/lib/sento-client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";

export const useGenerateTask = () => {
  const { invalidateQueries } = useQueryClient();
  const params = useSearchParams();
  const id = params.get("workgroupId");

  return useMutation({
    mutationFn: async () => {
      const { data } = await SentoClient.get(
        `/workgroup/${id}/generate-distribution`
      );
      return data;
    },
    onSuccess() {
      toast.success("Task generated!");
      invalidateQueries({
        queryKey: ["workgroup", id, "group-distribution"],
      });
    },
    onError(err) {
      if (err instanceof AxiosError)
        return toast.error(err.response?.data.message || err.response?.data);
      toast.error("Something went wrong!");
    },
  });
};
