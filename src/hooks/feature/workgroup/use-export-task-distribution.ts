import { SentoClient } from "@/lib/sento-client";
import { getDownloadableResponse } from "@/utils/getDownloadableResponse";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";

export const useExportTaskDistribution = () => {
  return useMutation({
    mutationFn: async (taskId: string) => {
      const response = await SentoClient.post(
        `/tasks/${taskId}/export`,
        {},
        {
          responseType: "blob",
        }
      );
      getDownloadableResponse(response);
    },
    onSuccess() {
      toast.success("Task distribution exported!");
    },
    onError(err) {
      if (err instanceof AxiosError)
        return toast.error(err.response?.data.message || err.message);
      toast.error("Something went wrong!");
    },
  });
};
