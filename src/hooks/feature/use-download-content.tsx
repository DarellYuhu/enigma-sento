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
      const response = await SentoClient.post(
        `/group-distributions/${groupDistributionId}/contents`,
        { projectIds },
        {
          responseType: "blob",
        }
      );
      const blob = new Blob([response.data]);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");

      // Extract filename from Content-Disposition if available
      const contentDisposition = response.headers["content-disposition"];
      let fileName = "downloaded-file";
      if (contentDisposition) {
        const match = contentDisposition.match(/filename\*?=([^;]+)/);
        if (match) fileName = match[1].trim().replace(/^["']|["']$/g, "");
      }

      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
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
