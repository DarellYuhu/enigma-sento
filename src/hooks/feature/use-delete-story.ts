import { SentoClient } from "@/lib/sento-client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import { toast } from "sonner";

export const useDeleteStory = () => {
  const { data: session } = useSession();
  const { workgroupId } = useParams();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (storyId: string) => {
      const { data } = await SentoClient.delete("/stories/" + storyId, {
        headers: { Authorization: `Bearer ${session?.user?.token}` },
      });
      return data;
    },
    onSuccess() {
      toast.success("Story deleted!");
      queryClient.invalidateQueries({ queryKey: ["projects", workgroupId] });
    },
    onError(error) {
      if (error instanceof AxiosError)
        return toast.error(
          error.response?.data.message || error.response?.data
        );
      toast.error("Something went wrong!");
    },
  });
};
