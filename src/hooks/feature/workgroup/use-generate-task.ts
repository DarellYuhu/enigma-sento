import { SentoClient } from "@/lib/sento-client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";

export const useGenerateTask = () => {
  const queryClient = useQueryClient();
  const params = useSearchParams();
  const id = params.get("workgroupId");
  const { data: session } = useSession();

  return useMutation({
    mutationFn: async () => {
      const { data } = await SentoClient.post(
        `/workgroups/${id}/user-tasks`,
        {},
        {
          headers: { Authorization: `Bearer ${session?.user?.token}` },
        }
      );
      return data;
    },
    onSuccess() {
      toast.success("Task generated!");
      queryClient.invalidateQueries({
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
