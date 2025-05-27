import { SentoClient } from "@/lib/sento-client";
import { useMutation } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

type Payload = {
  name: string;
  template: {
    dimensions: { width: number; height: number };
    shapes: Omit<Shape, "image">[];
  };
};

export const useUpsertLayout = () => {
  const { data: session } = useSession();

  return useMutation({
    mutationFn: async (payload: Payload) => {
      const { data } = await SentoClient.post("/layouts", {
        ...payload,
        creatorId: session?.user?.id,
      });
      return data;
    },
    onSuccess: () => {
      toast.success("Layout saved!");
    },
    onError: () => {
      toast.error("Something went wrong!");
    },
  });
};
