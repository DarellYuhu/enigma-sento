import { SentoClient } from "@/lib/sento-client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useParams } from "next/navigation";
import { toast } from "sonner";

export const useGenerateContent = () => {
  const params = useParams();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      storyId,
      withMusic,
    }: {
      storyId: string;
      withMusic: boolean;
    }) => {
      const { data } = await SentoClient.patch(
        `/stories/${storyId}/contents?withMusic=${withMusic}`
      );
      return data;
    },
    onSuccess() {
      toast.success("Content is being generated!");
      queryClient.invalidateQueries({
        queryKey: ["projects", params.workgroupId],
      });
    },
    onError(err) {
      if (err instanceof AxiosError)
        return toast.error(err.response?.data.message || err.response?.data);
      toast.error("Something went wrong!");
    },
  });
};
