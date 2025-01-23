import { SentoClient } from "@/lib/sento-client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
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
      toast.error(err?.message || "Something went wrong!");
    },
  });
};
