import { SentoClient } from "@/lib/sento-client";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export const useDeleteLayout = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: async (id: number) => {
      await SentoClient.delete(`/layouts/${id}`);
    },
    onSuccess: () => {
      toast.success("Layout deleted successfully");
      router.refresh();
    },
    onError: (err) => {
      if (err instanceof AxiosError)
        return toast.error(err.response?.data.message || err.response?.data);
      toast.error("Something went wrong!");
    },
  });
};
