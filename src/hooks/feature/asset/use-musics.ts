import { SentoClient } from "@/lib/sento-client";
import { useQuery } from "@tanstack/react-query";

export const useMusics = () => {
  return useQuery({
    queryKey: ["musics"],
    queryFn: async () => {
      const { data } = await SentoClient.get<Data>("/assets/musics");
      return data;
    },
  });
};

type Data = {
  message: string;
  data: {
    _id: string;
    title: string;
    path: string;
    type: string;
    size: number;
    duration: number;
    album?: string | null;
    artist?: string | null;
    year?: number | null;
    createdAt?: Date | null;
    addedAt: Date;
  }[];
};
