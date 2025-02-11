import { SentoClient } from "@/lib/sento-client";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";

export const useDownloadContent = () =>
  useMutation({
    mutationFn: async ({
      groupDistributionId,
      projectIds,
    }: {
      groupDistributionId: string;
      projectIds: string[];
    }) => {
      const { data, status } = await SentoClient.post<{ data: string }>(
        `/group-distributions/${groupDistributionId}/contents`,
        { projectIds }
      );
      if (status === 404) return toast.error("Content not found!");
      const a = document.createElement("a");
      a.href = data.data;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    },
    onSuccess() {
      toast.success("Content downloaded!");
    },
    onError(err) {
      if (err instanceof AxiosError)
        return toast.error(err.response?.data.message || err.response?.data);
      toast.error("Something went wrong!");
    },
  });
