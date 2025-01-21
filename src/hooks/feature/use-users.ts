import { SentoClient } from "@/lib/sento-client";
import { useQuery } from "@tanstack/react-query";

export const useUsers = () => {
  return useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const { data } = await SentoClient.get<GetUserResponse>("/users");
      return data;
    },
  });
};

export type GetUserResponse = {
  message: string;
  data: {
    id: string;
    username: string;
    displayName: string;
    role: string;
    createdAt: Date;
    updatedAt: Date;
  }[];
};
