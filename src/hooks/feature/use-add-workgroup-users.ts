import { SentoClient } from "@/lib/sento-client";
import { useMutation } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";

export const useAddWorkgroupUsers = () => {
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
    },
    onError(err) {
      toast.error(err?.message || "Something went wrong!");
    },
  });
};
