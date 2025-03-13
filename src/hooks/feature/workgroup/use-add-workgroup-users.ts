import { SentoClient } from "@/lib/sento-client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";

export const useAddWorkgroupUsers = () => {
  const queryClient = useQueryClient();
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const workgroupId = searchParams.get("workgroupId");

  return useMutation({
    mutationFn: async (payload: { users: string[] }) => {
      const { data } = await SentoClient.post(
        `/workgroups/${workgroupId}/users`,
        payload,
        {
          headers: { Authorization: `Bearer ${session?.user?.token}` },
        }
      );
      return data;
    },
    onSuccess() {
      toast.success("User added!");
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
