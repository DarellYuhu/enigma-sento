import { SentoClient } from "@/lib/sento-client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useAddMusics = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { files: File[] }) => {
      const formData = new FormData();
      payload.files.forEach((file) => {
        formData.append("files", file);
      });
      const { data } = await SentoClient.post("/assets/musics", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return data;
    },
    onSuccess() {
      toast.success("Musics added!");
      queryClient.invalidateQueries({ queryKey: ["musics"] });
    },
    onError(err) {
      if (err instanceof Error) return toast.error(err.message);
      toast.error("Something went wrong!");
    },
  });
};
