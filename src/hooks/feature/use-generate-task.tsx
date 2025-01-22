import { SentoClient } from "@/lib/sento-client";
import { useMutation } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";

export const useGenerateTask = () => {
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
    },
    onError(err) {
      toast.error(err?.message || "Something went wrong!");
    },
  });
};
