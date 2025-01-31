import { SentoClient } from "@/lib/sento-client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
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
    onError(err) {
      if (err instanceof AxiosError)
        return toast.error(err.response?.data.message || err.response?.data);
      toast.error("Something went wrong!");
    },
  });
};

export const createWorkgroup = z
  .object({
    name: z.string().trim().min(1, "Required"),
    session: z.preprocess(
      (num) => parseInt(z.string().parse(num), 10),
      z.number().positive()
    ),
    projectStoryPerUser: z.preprocess(
      (num) => parseInt(z.string().parse(num), 10),
      z.number().positive()
    ),
  })
  .refine((data) => data.projectStoryPerUser >= data.session, {
    message: "Project story per user must be greater than or equal to session",
    path: ["projectStoryPerUser"],
  });

export type CreateWorkgroup = z.infer<typeof createWorkgroup>;
