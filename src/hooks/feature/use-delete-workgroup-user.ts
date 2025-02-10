import { SentoClient } from "@/lib/sento-client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";

export const useDeleteWorkgroupUser = () => {
  const searchParams = useSearchParams();
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  const workgroupId = searchParams.get("workgroupId");
  return useMutation({
    mutationFn: async (userId: string) => {
      const { data } = await SentoClient.delete(
        `/workgroups/${workgroupId}/users/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${session?.user?.token}`,
          },
        }
      );
      return data;
    },
    onSuccess() {
      toast.success("User deleted!");
      queryClient.invalidateQueries({
        queryKey: ["workgroup", workgroupId, "user"],
      });
    },
    onError(err) {
      if (err instanceof AxiosError)
        return toast.error(err.response?.data.message || err.response?.data);
      toast.error("Something went wrong!");
    },
  });
};
