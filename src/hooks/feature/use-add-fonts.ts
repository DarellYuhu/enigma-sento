import { SentoClient } from "@/lib/sento-client";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { toast } from "sonner";
import { z } from "zod";

export const useAddFonts = () => {
  return useMutation({
    mutationFn: async ({ files }: AddFontSchema) => {
      const payload = await Promise.all(
        files.map(async (file) => {
          const path = `fonts/${file.name}`;
          const { data } = await SentoClient.get<{ data: string }>(
            "/storage/upload",
            {
              params: { path },
            }
          );
          await axios.put(data.data, file);
          return {
            path,
            name: file.name,
          };
        })
      );

      const { data } = await SentoClient.post("/assets/fonts", {
        data: payload,
      });
      return data;
    },
    onSuccess() {
      toast.success("Fonts added!");
    },
    onError(err) {
      if (err instanceof AxiosError)
        return toast.error(err.response?.data.message || err.response?.data);
      toast.error("Something went wrong!");
    },
  });
};

export const addFontSchema = z.object({
  files: z.array(z.instanceof(File)).min(1),
});
export type AddFontSchema = z.infer<typeof addFontSchema>;
