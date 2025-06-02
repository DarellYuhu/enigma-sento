import { SentoClient } from "@/lib/sento-client";
import { useQuery } from "@tanstack/react-query";

export const useFont = (id?: string) => {
  return useQuery({
    queryKey: ["fonts", id],
    queryFn: async () => {
      const { data } = await SentoClient<ClientRes<FontAsset>>(
        `/assets/fonts/${id}`
      );
      return data;
    },
    enabled: !!id,
  });
};
