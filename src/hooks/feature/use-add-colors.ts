import { SentoClient } from "@/lib/sento-client";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";

export const useAddColors = () => {
  return useMutation({
    mutationFn: async (payload: File) => {
      const formData = new FormData();
      formData.append("file", payload);
      const { data } = await SentoClient.post("/assets/colors", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return data;
    },
    onSuccess() {
      toast.success("Colors added!");
    },
    onError(err) {
      if (err instanceof AxiosError)
        return toast.error(err.response?.data.message || err.response?.data);
      toast.error("Something went wrong!");
    },
  });
};
