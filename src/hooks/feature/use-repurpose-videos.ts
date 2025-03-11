import { SentoClient } from "@/lib/sento-client";
import { useQuery } from "@tanstack/react-query";

export const useRepurposeVideos = () => {
  return useQuery({
    queryKey: ["repurpose", "videos"],
    queryFn: async () => {
      const { data } = await SentoClient.get<Data>("/assets/repurpose/videos");
      return data;
    },
  });
};

type Data = {
  message: string;
  data: {
    url: string;
    name: string;
    path: string;
    type: string;
    width: number;
    height: number;
    size: number;
    duration: number;
    _id: string;
    __v: number;
  }[];
};
