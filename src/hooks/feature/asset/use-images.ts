import { SentoClient } from "@/lib/sento-client";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";

export const useImages = () => {
  const searchParams = useSearchParams();
  const search = searchParams.get("search");
  const collectionId = searchParams.get("collectionId");
  const searchType = searchParams.get("searchType");

  return useQuery({
    queryKey: ["collections", "images", { search, collectionId, searchType }],
    queryFn: async () => {
      const { data } = await SentoClient.get<ClientRes<ImageAsset[]>>(
        "/assets/images",
        {
          params: { search, collectionId, searchType },
        }
      );
      return data;
    },
  });
};
