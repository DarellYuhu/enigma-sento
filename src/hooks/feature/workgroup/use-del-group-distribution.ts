import { SentoClient } from "@/lib/sento-client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useSession } from "next-auth/react";
import { useParams, useSearchParams } from "next/navigation";
import { toast } from "sonner";

export const useDeleteGroupDistribution = () => {
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();
  const params = useParams();
  const workgroupId = searchParams.get("workgroupId");
  const { data: session } = useSession();

  return useMutation({
    mutationFn: async (id: string) => {
      const wgId = params.workgroupId ?? workgroupId;
      const { data } = await SentoClient.delete(
        `/workgroups/${wgId}/group-distributions/${id}`,
        {
          headers: { Authorization: `Bearer ${session?.user?.token}` },
        }
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [
          "workgroup",
          params.workgroupId ?? workgroupId,
          "group-distribution",
        ],
      });
      toast.success("Group distribution deleted!");
    },
    onError: (err) => {
      if (err instanceof AxiosError)
        return toast.error(err.response?.data.message || err.response?.data);
      toast.error("Something went wrong!");
    },
  });
};
