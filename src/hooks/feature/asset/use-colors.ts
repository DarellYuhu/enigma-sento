import { SentoClient } from "@/lib/sento-client";
import { useQuery } from "@tanstack/react-query";

export const useColors = () => {
  return useQuery({
    queryKey: ["colors"],
    queryFn: async () => {
      const { data } = await SentoClient.get<Data>("/assets/colors");
      return data;
    },
  });
};

type Data = {
  message: string;
  data: { _id: string; primary: string; secondary: string }[];
};
