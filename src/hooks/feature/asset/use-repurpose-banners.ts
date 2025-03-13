import { SentoClient } from "@/lib/sento-client";
import { useQuery } from "@tanstack/react-query";

export const useRepurposeBanners = () => {
  return useQuery({
    queryKey: ["repurpose", "banners"],
    queryFn: async () => {
      const { data } = await SentoClient.get<Data>("/assets/repurpose/banners");
      return data;
    },
  });
};

type Data = {
  message: string;
  data: {
    _id: string;
    name: string;
    path: string;
    type: string;
    width: number;
    height: number;
    size: number;
    __v: 0;
    createdAt: string;
    updatedAt: string;
    url: string;
  }[];
};
