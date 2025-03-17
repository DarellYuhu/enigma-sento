import { SentoClient } from "@/lib/sento-client";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";

export const useUpdateCollection = () => {
  return useMutation({
    mutationFn: async (payload: Payload) => {
      const { data } = await SentoClient.patch(
        `/collections/${payload.id}`,
        payload.data
      );
      return data;
    },
    onSuccess() {
      toast.success("Collection updated!");
    },
    onError(err) {
      if (err instanceof AxiosError)
        return toast.error(err.response?.data.message || err.response?.data);
      toast.error("Something went wrong!");
    },
  });
};

type Payload = {
  id: string;
  data: {
    name?: string;
    newAssets?: string[];
    deletedAssets?: string[];
  };
};
