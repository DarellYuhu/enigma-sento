import { SentoClient } from "@/lib/sento-client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import { toast } from "sonner";

export const useCreateProject = () => {
  const { invalidateQueries } = useQueryClient();
  const { data: session } = useSession();
  const { workgroupId } = useParams();

  return useMutation({
    mutationFn: async (payload: { name: string }) => {
      const { data } = await SentoClient.post(
        "/projects",
        { ...payload, workgroupId },
        {
          headers: { Authorization: `Bearer ${session?.user?.token}` },
        }
      );
      return data;
    },
    onSuccess() {
      toast.success("Project created!");
      invalidateQueries({ queryKey: ["projects", workgroupId] });
    },
    onError(err) {
      toast.error(err?.message || "Something went wrong!");
    },
  });
};
