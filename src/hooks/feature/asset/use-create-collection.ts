import { SentoClient } from "@/lib/sento-client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { z } from "zod";

export const useCreateCollection = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (values: CollectionFormSchema) => {
      const { data } = await SentoClient.post("/collections", values);
      return data;
    },
    onSuccess: (_, { type }) => {
      queryClient.invalidateQueries({ queryKey: ["collections", type] });
      toast.success("Collection created!");
    },
    onError: (err) => {
      if (err instanceof Error) return toast.error(err.message);
      toast.error("Something went wrong!");
    },
  });
};

export const collectionFormSchema = z.object({
  name: z.string().trim().min(1, "Required"),
  type: z.enum([
    "IMAGE",
    "MUSIC",
    "COLOR",
    "FONT",
    "REP-BANNER",
    "REP-IMAGE",
    "REP-VIDEO",
  ]),
  assets: z.array(z.string()).optional(),
});

export type CollectionFormSchema = z.infer<typeof collectionFormSchema>;
