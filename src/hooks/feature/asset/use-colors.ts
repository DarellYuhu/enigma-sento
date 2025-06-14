import { SentoClient } from "@/lib/sento-client";
import { useQuery } from "@tanstack/react-query";

export const useColors = () => {
  return useQuery({
    queryKey: ["colors"],
    queryFn: async () => {
      const { data } = await SentoClient.get<ClientRes<ColorAsset[]>>(
        "/assets/colors"
      );
      return data;
    },
  });
};
