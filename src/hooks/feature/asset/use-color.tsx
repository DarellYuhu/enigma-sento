import { SentoClient } from "@/lib/sento-client";
import { useQuery } from "@tanstack/react-query";

export const useColor = (id?: string) => {
  return useQuery({
    queryKey: ["colors", id],
    queryFn: async () => {
      const { data } = await SentoClient.get<ClientRes<ColorAsset>>(
        `/assets/colors/${id}`
      );
      return data;
    },
    enabled: !!id,
  });
};
