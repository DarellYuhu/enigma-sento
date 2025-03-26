import { SentoClient } from "@/lib/sento-client";
import { getNewFileName } from "@/utils/getNewFileName";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { z } from "zod";

export const useCreateProposal = () => {
  const { data: session } = useSession();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateProposalSchema) => {
      const file = getNewFileName(payload.file[0]);
      const path = `proposals/${session?.user?.id}/${file.name}`;
      const { data: storage } = await SentoClient.get<{ data: string }>(
        "/storage/upload",
        { params: { path } }
      );
      await fetch(storage.data, { method: "PUT", body: file });
      const { data } = await SentoClient.post(
        "/proposals",
        {
          title: payload.title,
          fileName: file.name,
          filePath: path,
          workgroupId: payload.workgroupId,
        },
        { headers: { Authorization: `Bearer ${session?.user?.token}` } }
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["proposals"] });
      toast.success("Proposal created!");
    },
    onError: (err) => {
      if (err instanceof AxiosError)
        return toast.error(err.response?.data.message || err.response?.data);
      toast.error("Something went wrong!");
    },
  });
};

export const createProposalSchema = z.object({
  title: z.string().trim().min(1, "Required"),
  workgroupId: z.string().trim().min(1, "Required"),
  file: z.array(z.instanceof(File)).min(1, "Required"),
});

export type CreateProposalSchema = z.infer<typeof createProposalSchema>;
