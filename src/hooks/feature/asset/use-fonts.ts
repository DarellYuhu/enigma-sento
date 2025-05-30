import { SentoClient } from "@/lib/sento-client";
import { useQuery } from "@tanstack/react-query";

export const useFonts = (fontId?: string[]) => {
  return useQuery({
    queryKey: ["fonts"],
    queryFn: async () => {
      const { data } = await SentoClient<Data>("/assets/fonts");
      return data;
    },
  });
};

export type Font = {
  _id: string;
  name: string;
  path: string;
  url: string;
};

type Data = {
  message: string;
  data: Font[];
};
