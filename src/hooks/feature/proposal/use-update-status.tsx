import { SentoClient } from "@/lib/sento-client";
import { StatusEnum } from "@/types/enums";
import { getNewFileName } from "@/utils/getNewFileName";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import { toast } from "sonner";

export const useUpdateStatus = () => {
  const { id } = useParams();
  const { data: session } = useSession();

  return useMutation({
    mutationFn: async (payload: Payload) => {
      const updatePayload: UpdatePayload = {
        status: payload.status,
        feedback: {
          message: payload.message,
        },
      };
      if (payload.file) {
        const file = getNewFileName(payload.file);
        const path = `proposals/${session?.user?.id}/${file.name}`;
        const { data: storage } = await SentoClient.get<{ data: string }>(
          "/storage/upload",
          { params: { path } }
        );
        await fetch(storage.data, { method: "PUT", body: file });
        updatePayload.feedback.fileName = file.name;
        updatePayload.feedback.filePath = path;
      }
      const { data } = await SentoClient.patch(
        `/proposals/${id}/submission/${payload.submissionId}/status`,
        updatePayload,
        { headers: { Authorization: `Bearer ${session?.user?.token}` } }
      );
      return data;
    },
    onSuccess() {
      toast.success("Status updated!");
    },
    onError(error) {
      if (error instanceof AxiosError)
        return toast.error(
          error.response?.data.message || error.response?.data
        );
      toast.error("Something went wrong!");
    },
  });
};
type Payload = {
  submissionId: string;
  status: StatusEnum;
  message: string;
  file?: File;
};

type UpdatePayload = {
  status: StatusEnum;
  feedback: {
    message: string;
    fileName?: string;
    filePath?: string;
  };
};
