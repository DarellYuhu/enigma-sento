import { SentoClient } from "@/lib/sento-client";
import { useMutation } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import { toast } from "sonner";

export const useCreateProject = () => {
  const { data: session } = useSession();
  const { workgroupId } = useParams();

  return useMutation({
    mutationFn: async (payload: { name: string }) => {
      console.log("huhi");
      const { data } = await SentoClient.post(
        "/projects",
        { ...payload, workgroupId },
        {
          headers: { Authorization: `Bearer ${session?.user?.token}` },
        }
      );
      return data;
    },
    onSuccess() {
      toast.success("Project created!");
    },
    onError(err) {
      toast.error(err?.message || "Something went wrong!");
    },
  });
};
