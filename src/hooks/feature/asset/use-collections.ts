import { SentoClient } from "@/lib/sento-client";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";

export const useCollections = ({ type }: { type?: CollectionType }) => {
  const searchParams = useSearchParams();
  const search = searchParams.get("collection_search");
  return useQuery({
    queryKey: ["collections", { type, search }],
    queryFn: async () => {
      const { data } = await SentoClient.get<Data>("/collections", {
        params: { assetType: type, search },
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
