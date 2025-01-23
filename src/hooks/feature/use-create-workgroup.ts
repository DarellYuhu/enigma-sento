import { SentoClient } from "@/lib/sento-client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { z } from "zod";

export const useCreateWorkgroup = () => {
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: CreateWorkgroup) => {
      const { data } = await SentoClient.post("/workgroups", payload, {
        headers: { Authorization: `Bearer ${session?.user?.token}` },
      });
      return data;
    },
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ["workgroup"] });
    },
    onError(error) {
      toast.error(error?.message || "Something went wrong!");
    },
  });
};

export const createWorkgroup = z.object({
  name: z.string().trim().min(1, "Required"),
  session: z.preprocess(
    (num) => parseInt(z.string().parse(num), 10),
    z.number().min(1, "Required")
  ),
  projectStoryPerUser: z.preprocess(
    (num) => parseInt(z.string().parse(num), 10),
    z.number().min(1, "Required")
  ),
});

export type CreateWorkgroup = z.infer<typeof createWorkgroup>;
