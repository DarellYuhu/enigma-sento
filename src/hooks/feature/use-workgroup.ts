import { SentoClient } from "@/lib/sento-client";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";

export const useWorkgroup = () => {
  const { data: session } = useSession();
  return useQuery({
    queryKey: ["workgroup"],
    queryFn: async () => {
      const { data } = await SentoClient.get<Workgroup>("/workgroups", {
        headers: { Authorization: `Bearer ${session?.user?.token}` },
      });
      return data;
    },
  });
};

export type Workgroup = {
  message: string;
  data: {
    id: string;
    name: string;
    session: number;
    projectStoryPerUser: number;
    managerId: string;
    createdAt: string;
    updatedAt: string;
  }[];
};
