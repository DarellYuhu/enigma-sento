import { SentoClient } from "@/lib/sento-client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import { z } from "zod";

export const useUpdateProject = () => {
  const queryClient = useQueryClient();
  const { workgroupId } = useParams();
  const { data: session } = useSession();

  return useMutation({
    mutationFn: async (payload: UpdateProjectSchema & { id: string }) => {
      const { data } = await SentoClient.patch(
        `/projects/${payload.id}`,
        {
          name: payload.name,
        },
        { headers: { Authorization: `Bearer ${session?.user?.token}` } }
      );
      return data;
    },
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ["projects", workgroupId] });
      toast.success("Project updated!");
    },
    onError(err) {
      if (err instanceof AxiosError) {
        return toast.error(err.response?.data.message || err.message);
      }
      return toast.error("Something went wrong!");
    },
  });
};

export const updateProjectSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Required")
    .refine(
      (value) => !/[^a-zA-Z0-9_-]/.test(value),
      "Name can only contain letters, numbers, underscores, and dashes"
    ),
});
export type UpdateProjectSchema = z.infer<typeof updateProjectSchema>;
