import { SentoClient } from "@/lib/sento-client";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";

export const useAddRepurposeVideos = () => {
  return useMutation({
    mutationFn: async ({ files }: { files: File[] }) => {
      const randomNumber = Math.floor(Math.random() * 1000);
      const payload = await Promise.all(
        files.map(async (file) => {
          const path = `repurpose/${randomNumber}/${file.name}`;
          const presignUrl = await SentoClient.get(
            `/storage/upload?path=${path}`
          );
          await fetch(presignUrl.data.data, { method: "PUT", body: file });
          return { path, name: file.name };
        })
      );
      const { data } = await SentoClient.post("/assets/repurpose/videos", {
        data: payload,
      });
      return data;
    },
    onSuccess: () => {
      toast.success("Videos uploaded successfully 😊");
    },
    onError: (error) => {
      if (error instanceof AxiosError)
        return toast.error(
          error.response?.data.message || error.response?.data
        );
      toast.error("Something went wrong!");
    },
  });
};
