import { SentoClient } from "@/lib/sento-client";
import { getNewFileName } from "@/utils/getNewFileName";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import { toast } from "sonner";

export const useCreateSubmission = () => {
  const params = useParams();
  const { data: session } = useSession();

  return useMutation({
    mutationFn: async (payload: { file: File }) => {
      const file = getNewFileName(payload.file);
      const path = `proposals/${session?.user?.id}/${file.name}`;
      const { data: storage } = await SentoClient.get<{ data: string }>(
        "/storage/upload",
        { params: { path } }
      );
      await fetch(storage.data, { method: "PUT", body: file });
      const { data } = await SentoClient.post(
        `/proposals/${params.id}/submissions`,
        {
          fileName: file.name,
          filePath: path,
        },
        { headers: { Authorization: `Bearer ${session?.user?.token}` } }
      );
      return data;
    },
    onSuccess() {
      toast.success("Submission created!");
    },
    onError(err) {
      if (err instanceof AxiosError)
        return toast.error(err.response?.data.message || err.response?.data);
      toast.error("Something went wrong!");
    },
  });
};
