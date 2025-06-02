import { SentoClient } from "@/lib/sento-client";
import { useQuery } from "@tanstack/react-query";

export const useImage = (id?: string) => {
  return useQuery({
    queryKey: ["images", id],
    queryFn: async () => {
      const { data } = await SentoClient.get<ClientRes<ImageAsset>>(
        `/assets/images/${id}`
      );
      return data;
    },
    enabled: !!id,
  });
};
