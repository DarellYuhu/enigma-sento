import { SentoClient } from "@/lib/sento-client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import { toast } from "sonner";

export const useGenerateContentDist = () => {
  const params = useParams();
  const queryClient = useQueryClient();
  const { data: session } = useSession();

  return useMutation({
    mutationFn: async (projectId: string) => {
      const { data } = await SentoClient.post(
        `/projects/${projectId}/content-distributions`,
        {},
        {
          headers: {
            Authorization: `Bearer ${session?.user?.token}`,
          },
        }
      );
      return data;
    },
    onSuccess() {
      toast.success("Content distribution generated!");
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
