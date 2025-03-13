import { SentoClient } from "@/lib/sento-client";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useParams } from "next/navigation";
import { toast } from "sonner";

export const useDownloadContent = () => {
  const params = useParams();
  return useMutation({
    mutationFn: async ({
      groupDistributionId,
      projectIds,
    }: {
      groupDistributionId: string;
      projectIds: string[];
    }) => {
      const { data, status } = await SentoClient.post<{ data: string }>(
        `/workgroups/${params.workgroupId}/group-distributions/${groupDistributionId}/download`,
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
};
