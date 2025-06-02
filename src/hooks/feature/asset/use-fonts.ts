import { SentoClient } from "@/lib/sento-client";
import { useQuery } from "@tanstack/react-query";

export const useFonts = () => {
  return useQuery({
    queryKey: ["fonts"],
    queryFn: async () => {
      const { data } = await SentoClient<Data>("/assets/fonts");
      return data;
    },
  });
};

type Data = {
  message: string;
  data: FontAsset[];
};
