import { SentoClient } from "@/lib/sento-client";
import { useQuery } from "@tanstack/react-query";

export const usePeopleCollection = () => {
  return useQuery({
    queryKey: ["collections", "people"],
    async queryFn() {
      const { data } = await SentoClient.get<Data>("/collections/peoples");
      return data;
    },
  });
};

type Data = {
  message: string;
  data: {
    _id: string;
    __v: number;
    name: string;
  }[];
};
