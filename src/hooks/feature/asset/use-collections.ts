import { SentoClient } from "@/lib/sento-client";
import { useQuery } from "@tanstack/react-query";

export const useCollections = ({ type }: { type?: CollectionType }) => {
  return useQuery({
    queryKey: ["collections", type],
    queryFn: async () => {
      const { data } = await SentoClient.get<Data>("/collections", {
        params: { assetType: type },
      });
      return data;
    },
    enabled: !!type,
  });
};

type Data = {
  message: string;
  data: {
    _id: string;
    __v: number;
    name: string;
    type: string;
    assets: string[];
  }[];
};
