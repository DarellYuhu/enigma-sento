import { SentoClient } from "@/lib/sento-client";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";

export const useImages = () => {
  const searchParams = useSearchParams();
  const search = searchParams.get("search");

  return useQuery({
    queryKey: ["collections", "images", search ?? ""],
    queryFn: async () => {
      const { data } = await SentoClient.get<Data>("/assets/images", {
        params: { search },
      });
      return data;
    },
  });
};

type Data = {
  message: string;
  data: {
    createdAt: Date;
    updatedAt: Date;
    _id: string;
    people: { name: string; _id: string }[];
    url: string;
    name: string;
    path: string;
    type: string;
    width: number;
    height: number;
    size: number;
    description: string;
    tags: string[];
    location: {
      name: string;
      geoJson: {
        type: string;
        coordinates: [number, number];
      };
    };
  }[];
};
