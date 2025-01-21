import { SentoClient } from "@/lib/sento-client";
import { useMutation } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { z } from "zod";

export const useAddGroupDistribution = () => {
  const searchParams = useSearchParams();
  const id = searchParams.get("workgroupId");
  const { data: session } = useSession();

  return useMutation({
    mutationFn: async (payload: CreateGroupDistribution) => {
      const { data } = await SentoClient.post(
        `/workgroup/${id}/group-distribution`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${session?.user?.token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return data;
    },
    onSuccess() {
      toast.success("Group distribution added!");
    },
    onError(err) {
      toast.error(err?.message || "Something went wrong!");
    },
  });
};

export const createGroupDistribution = z.object({
  file: z
    .instanceof(File)
    .refine(
      (file) => file.name.endsWith(".xlsx"),
      "Invalid file type. The file must be an XLSX file."
    ),
});

export type CreateGroupDistribution = z.infer<typeof createGroupDistribution>;
