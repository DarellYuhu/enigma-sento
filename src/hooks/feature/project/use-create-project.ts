import { SentoClient } from "@/lib/sento-client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import { toast } from "sonner";

export const useCreateProject = () => {
  const queryClient = useQueryClient();
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
      queryClient.invalidateQueries({ queryKey: ["projects", workgroupId] });
    },
    onError(err) {
      if (err instanceof AxiosError)
        return toast.error(
          err.response?.data.message || err.message || err.response?.data
        );
      toast.error("Something went wrong!");
    },
  });
};
